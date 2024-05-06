/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';
import './style.scss';

registerBlockType( metadata, {
	edit: Edit,
	save: () => {
		return null; // Use a dynamic block, rendered by PHP
	},
} );
