/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Get the ID of the post currently being edited.
 */
export const useCurrentPostId = () =>
	useSelect( ( select ) => select( 'core/editor' ).getCurrentPostId(), [] );

/**
 * Get the post type of the post currently being edited.
 */
export const useCurrentPostType = () =>
	useSelect( ( select ) => select( 'core/editor' ).getCurrentPostType(), [] );

/**
 * Get a single post by ID.
 */
export const usePost = ( postType, id ) => {
	return useSelect(
		( select ) => {
			return select( 'core' ).getEntityRecord(
				'postType',
				postType,
				id
			);
		},
		[ postType, id ]
	);
};

/**
 * Get all posts for a given post type and search query.
 */
export const usePosts = ( postType, query ) => {
    return useSelect(
		( select ) => {
			return (
				select( 'core' ).getEntityRecords(
					'postType',
					postType,
					query
				)
			);
		},
		[ postType, query ]
	);
};
