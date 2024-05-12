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
	 * Options for the post selector.
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
	const onSelectPost = ( postId: number ) => {
		setAttributes( {
			linkedPostId: postId,
		} );
	};

	/**
	 * Handle user input.
	 *
	 * @param {string} value The current value of the input field.
	 */
	const onSearchPosts = ( value ) => {
		setSearch( String( value ).toLowerCase().trim() );
	};

	const getPostSelector = () => (
		<>
			<ComboboxControl
				// __experimentalRenderItem={function noRefCheck(){}}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
				label={ __( 'Post', 'dmg-read-more' ) }
				options={ getPostOptions() }
				help={ __( 'Type to search.', 'dmg-read-more' ) }
				value={ linkedPostId.toString() }
				onFilterValueChange={ debounce( onSearchPosts, 300 ) }
				onChange={ ( value ) => onSelectPost( Number( value ?? 0 ) ) }
			/>
			{ isSearchedPostsResolving && (
				// @ts-expect-error <Spinner /> is used throughout docs & core code
				<Spinner />
			) }
		</>
	);

	/**
	 * A post selector exists in the inspector controls.
	 */
	const getInspectorControls = () => (
		<InspectorControls key="inspector">
			<PanelBody title={ __( 'Link', 'dmg-read-more' ) }>
				{ getPostSelector() }
			</PanelBody>
		</InspectorControls>
	);

	const getBlockControls = () => (
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon={ linkOff }
					showTooltip
					label={ __( 'Unlink', 'dmg-read-more' ) }
					onClick={ () => onSelectPost( 0 ) }
					disabled={ ! linkedPostId }
					onPointerEnterCapture={ undefined }
					onPointerLeaveCapture={ undefined }
					placeholder={ undefined }
				/>
			</ToolbarGroup>
		</BlockControls>
	);

	/**
	 * A post selector also exists in the placeholder.
	 */
	const getPlaceholder = () => (
		<Placeholder
			className="dmg-read-more-placeholder"
			icon={ link }
			label={ __( 'Read More [dmg::media]', 'dmg-read-more' ) }
			instructions={ __(
				'Insert a “Read More” link to another post.',
				'dmg-read-more'
			) }
		>
			{ getPostSelector() }
		</Placeholder>
	);

	const blockProps = useBlockProps();

    if (! linkedPostId) {
		return (
			<div { ...blockProps }>
				{ getInspectorControls() }
				{ getBlockControls() }
				{ getPlaceholder() }
			</div>
		);
	}

	return (
		<div { ...blockProps }>
			{ getInspectorControls() }
			{ getBlockControls() }
			<p>
				{ __( 'Read more', 'dmg-read-more' ) }:&nbsp;
				{ isLinkedPostResolving ? (
					// @ts-expect-error <Spinner /> is used throughout docs & core code
					<Spinner />
				) : (
					<>
						{ /*·Simulate a link in block editor using a styled span */ }
						<span className="dmg-load-more dmg-load-more-link">
							{ linkedPost?.title?.rendered ?? '' }
						</span>
						{ /*·@todo Add a Notice to show an error if post has been deleted */ }
					</>
				) }
			</p>
		</div>
	);
}
