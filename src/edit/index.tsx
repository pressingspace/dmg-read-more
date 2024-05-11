/**
 * WordPress dependencies
 */
import { sprintf, __, _x } from '@wordpress/i18n';
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
} from '@wordpress/components';
import { debounce } from '@wordpress/compose';
import { useState } from '@wordpress/element';
import { linkOff } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import './editor.scss';
import {
	useCurrentPostId,
	useCurrentPostType,
	usePost,
	usePosts,
} from '../hooks';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function edit( { attributes, setAttributes } ) {
	const { linkedPostId } = attributes;

	const [ search, setSearch ] = useState( '' );

	const currentPostId = useCurrentPostId();
	const currentPostType = useCurrentPostType();

	const linkedPost = usePost( currentPostType, linkedPostId );

	/**
	 * Get up to 10 posts to populate the ComboboxControl options.
	 */
	const posts = usePosts( currentPostType, {
		per_page: 10,
		exclude: currentPostId,
		orderby: 'date',
		order: 'desc',
		search: search,
		status: 'publish', // Consider 'publish,future,draft,pending', see /readme.md
	} );

	/**
	 * @todo
	 * The currently linked post may not be in the search query results.
	 * If it isn't then we need to prepend it, so it appears in the options.
	 */

	/**
	 * Construct the options for the ComboboxControl.
	 */
	const options = ( posts || [] ).map( ( { id, title } ) => ( {
		value: String( id ),
		label: `${ String( title?.rendered ) } (ID: ${ id })`,
	} ) );

	/**
	 * Use the options are the default value for the Combobox
	 */
	const [ filteredOptions, setFilteredOptions ] = useState( options );

	/**
	 * Called when the search control's value changes.
	 *
	 * @param {number} value The selected post.
	 */
	const onSelectPost = ( postId ) => {
		setAttributes( {
			linkedPostId: Number( postId ),
		} );
		return false;
	};

	/**
	 * Handle user input.
	 *
	 * @param {string} value The current value of the input field.
	 */
	const onPostSearch = ( value ) => {
		setSearch( String( value ).toLowerCase() );
	};

	/**
	 * Unlink the selected linked post.
	 */
	const unlinkPost = () => {
		setAttributes( { linkedPostId: 0 } );
	};

	const postControls = (
		<ComboboxControl
			// __experimentalRenderItem={function noRefCheck(){}}
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ __( 'Post', 'dmg-read-more' ) }
			options={ options }
			help="Type to search."
			value={ String( linkedPostId ) }
			onFilterValueChange={ debounce( onPostSearch, 300 ) }
			onChange={ onSelectPost }
		/>
	);

	const inspectorControls = (
		<InspectorControls>
			<PanelBody title={ __( 'Link', 'dmg-read-more' ) }>
				{ postControls }
			</PanelBody>
		</InspectorControls>
	);

	const toolbarControls = (
		<BlockControls>
			<ToolbarGroup>
				{ linkedPost && (
					<ToolbarButton
						icon={ linkOff }
						showTooltip
						label={ __( 'Unlink', 'dmg-read-more' ) }
						onClick={ unlinkPost }
					/>
				) }
			</ToolbarGroup>
		</BlockControls>
	);

	// @todo consider adding Placeholder
	// const placeholder = (
	// 	<Placeholder
	// 		icon={ more }
	// 		label={ __( 'Read More [dmg::media]', 'dmg-read-more' ) }
	// 	>
	// 		{ postControls }
	// 	</Placeholder>
	// );

	const blockProps = useBlockProps( {
		className: 'dmg-read-more',
	} );

	const linkedPostTitle = linkedPost
		? String( linkedPost.title.rendered )
		: '';

	return (
		<>
			{ inspectorControls }
			{ toolbarControls }
			<p { ...blockProps }>
				{ /* translators: %s is replaced with the link to the post */ }
				{ sprintf(
					__( 'Read more: %s', 'dmg-read-more' ),
					linkedPostTitle
				) }
			</p>
		</>
	);
}
