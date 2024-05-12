/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import {
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Placeholder,
	ComboboxControl,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	Spinner,
} from '@wordpress/components';
import { debounce } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { link, linkOff } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';
import { usePost, usePosts } from '../hooks';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   root0
 * @param {Object}   root0.attributes
 * @param {number}   root0.attributes.linkedPostId
 * @param {Function} root0.setAttributes
 *
 * @return {Element} Element to render.
 */
export default function Edit( {
	attributes: { linkedPostId },
	setAttributes,
} ) {
	const [ search, setSearch ] = useState( '' );

	const { record: linkedPost, isResolving: isLinkedPostResolving } =
		usePost( linkedPostId );
	const { records: searchedPosts, isResolving: isSearchedPostsResolving } =
		usePosts( search );

	/**
	 * Options for the ComboboxControl.
	 */
	const getPostOptions = () => {
		let posts = searchedPosts ?? [];

		// Prefix the linked post if we have one
		if ( linkedPost ) {
			posts = [ linkedPost, ...posts ];
		}

		return posts.map( ( { id, title } ) => ( {
			value: `${ id }`,
			label: `${ title.rendered } (ID: ${ id })`,
		} ) );
	};

	/**
	 * Called when the search control's value changes.
	 *
	 * @param {number} postId The selected post.
	 */
	const onChangePost = ( postId ) => {
		setAttributes( {
			linkedPostId: Number( postId ),
		} );
	};

	/**
	 * Handle user input.
	 *
	 * @param {string} value The current value of the input field.
	 */
	const onSearchPost = ( value ) => {
		setSearch( String( value ).toLowerCase().trim() );
	};

	/**
	 * Unlink the selected linked post.
	 */
	const onUnlinkPost = () => {
		setAttributes( { linkedPostId: 0 } );
	};

	const postControls = (
		<>
			<ComboboxControl
				// __experimentalRenderItem={function noRefCheck(){}}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Post', 'dmg-read-more' ) }
				options={ getPostOptions() }
				help={ __( 'Type to search.', 'dmg-read-more' ) }
				value={ linkedPostId.toString() }
				onFilterValueChange={ debounce( onSearchPost, 300 ) }
				onChange={ onChangePost }
			/>
			{ isSearchedPostsResolving && (
				// @ts-expect-error <Spinner /> is used throughout docs & core code
				<Spinner />
			) }
		</>
	);

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Link', 'dmg-read-more' ) }>
				{ postControls }
			</PanelBody>
		</InspectorControls>
	);

	const toolbarControls = (
		<BlockControls group="block">
			<ToolbarGroup>
				<ToolbarButton
					icon={ linkOff }
					showTooltip
					label={ __( 'Unlink', 'dmg-read-more' ) }
					onClick={ onUnlinkPost }
					onPointerEnterCapture={ undefined }
					onPointerLeaveCapture={ undefined }
					placeholder={ undefined }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	/**
	 * @todo Consider adding secondary postControls into Placeholder
	 */
	const placeholder = (
		<Placeholder
			icon={ link }
			label={ __( 'Read More [dmg::media]', 'dmg-read-more' ) }
		>
			<p>{ __( 'Select a post', 'dmg-read-more' ) }</p>
			{ isLinkedPostResolving && (
				// @ts-expect-error <Spinner /> is used throughout docs & core code
				<Spinner />
			) }
		</Placeholder>
	);

	const blockProps = useBlockProps();

	const isEmpty = linkedPostId === 0;

	return (
		<>
			{ inspectorControls }
			{ isEmpty && placeholder }
			{ ! isEmpty && toolbarControls }
			{ ! isEmpty && (
				<p { ...blockProps }>
					{ __( 'Read more', 'dmg-read-more' ) }:&nbsp;
					{ /*·Simulate a link using a styled span */ }
					<span className="dmg-load-more dmg-load-more-link">
						{ String( linkedPost?.title?.rendered ) }
					</span>
				</p>
			) }
		</>
	);
}
