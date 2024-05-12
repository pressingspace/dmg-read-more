/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { type Post, store as coreStore } from '@wordpress/core-data';
import { store as editorStore } from '@wordpress/editor';

import { useEntityRecord, useEntityRecords } from '@wordpress/core-data';

/**
 * Get the ID of the post currently being edited.
 */
export const useCurrentPostContext = () => ( {
	postId: useSelect(
		( select ) => select( editorStore ).getCurrentPostId(),
		[]
	),
	postType: useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	),
} );

/**
 * Get a single post by ID.
 *
 * @param { number } id
 */
export const usePost = (
	id: number
): { record: Post | null; isResolving: boolean } => {
	const { postId, postType } = useCurrentPostContext();

	const { record, isResolving } = useEntityRecord( 'postType', postType, id );

	return {
		// @ts-expect-error
		record,
		isResolving,
	};

	// const { postType, isLoading } = useSelect(
	// 	( select ) => {
	// 		const {
	// 			type: postType,
	// 		} = select( editorStore ).getCurrentPost();

	// 		const { getEntityRecord, hasFinishedResolution } = select( coreStore );

	// 		return {
	// 			record: getEntityRecord( 'postType', postType, id ),
	// 			// isLoading: false,
	// 			// @todo fix isLoading for usePost hook (via hasFinishedResolution)
	// 			isLoading: ! hasFinishedResolution(
	// 				'getEntityRecord',
	// 				'postType',
	// 				postType,
	// 				id
	// 			),
	// 		};
	// 		},
	// 	[ id ]
	// );

	// return {
	// 	record,
	// 	isLoading,
	// };
};

/**
 * Get all posts for a given post type and search query.
 *
 * @param { string } search
 */
export const usePosts = (
	search: string
): { records: Array< Post > | null; isResolving: boolean } => {
	const { postId, postType } = useCurrentPostContext();

	const query = {
		exclude: postId,
		search: !! search ? search : undefined,
		per_page: 10,
		orderby: search ? 'relevance' : 'date',
		// order: 'desc',
		status: 'publish', // Consider 'publish,future,draft,pending', see /readme.md
	};

	const { records, isResolving } = useEntityRecords(
		'postType',
		postType,
		query
	);

	return {
		// @ts-expect-error
		records,
		isResolving,
	};

	// // Retrieve the pages for the "search" term.
	// const { records, isLoading } = useSelect( ( select ) => {
	// 	const {
	// 		id: postId,
	// 		type: postType,
	// 	} = select( editorStore ).getCurrentPost();

	// 	const { useEntityRecords, hasFinishedResolution } = select( coreStore );

	// 	const query = {
	// 		exclude: postId,
	// 		search: !! search ? search : undefined,
	// 		per_page: 10,
	// 		orderby: search ? 'relevance' : 'date',
	// 		// order: 'desc',
	// 		status: 'publish', // Consider 'publish,future,draft,pending', see /readme.md
	// 	};

	// 	return {
	// 		records: getEntityRecords( 'postType', postType, query ),
	// 		isLoading: false,
	// 		// @todo fix isLoading for usePosts hook (via hasFinishedResolution)
	// 		isLoading: ! hasFinishedResolution(
	// 			'getEntityRecords',
	// 			'postType',
	// 			postType,
	// 			query
	// 		),
	// 	};
	// }, [ search ] );

	// return {
	// 	records,
	// 	isLoading,
	// };
};
