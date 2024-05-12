/**
 * @jest-environment jsdom
 */

/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
import React from 'react';

/**
 * Internal dependencies
 */
import Edit from '../edit';

describe( 'Edit', () => {
	/**
	 * A simple example test for our block
	 */
	describe( 'rendering', function () {
		it( 'renders a .dmg-read-more class', () => {
			const { container } = render( <Edit attributes={ {
				linkedPostId: 42,
			} } /> );

			expect(
				container.getElementsByClassName( 'dmg-read-more' ).length
			).toBeGreaterThan( 0 );
		} );
	} );
} );
