/**
 * WordPress dependencies
 */
import { test, expect } from '@wordpress/e2e-test-utils-playwright';

/**
 * Internal dependencies
 */
import { logIn } from './utils';

test.describe( 'dmg/read-more block', () => {
	test.beforeEach( async ( { admin, page } ) => {
		await logIn( page );
		await admin.createNewPost();
	} );

	/**
	 * Insert an empty dmg/read-more block
	 */
	test( 'should allow the user to insert a dmg/read-more block', async ( {
		editor,
	} ) => {
		await editor.insertBlock( { name: 'dmg/read-more' } );
		expect( await editor.getEditedPostContent() ).toBe(
			'<!-- wp:dmg/read-more /-->'
		);
	} );

	/**
	 * Insert an empty dmg/read-more block using the slash shortcut
	 */
	test( 'can be created by typing "/dmg-read-more"', async ( {
		editor,
		page,
	} ) => {
		await editor.canvas
			.locator( 'role=button[name="Add default block"i]' )
			.click();
		await page.keyboard.type( '/dmg-read-more' );
		await page.keyboard.press( 'Enter' );
		expect( await editor.getEditedPostContent() ).toBe(
			'<!-- wp:dmg/read-more /-->'
		);
	} );

	/**
	 * Insert a dmg/read-more block that links to a post
	 *
	 * @todo Finish this test
	 */
	test.skip( 'should saved a linkedPostId attribute for a dmg/read-more block', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( {
			name: 'dmg/read-more',
			attributes: { linkedPostId: 42, foo: 'bar' },
		} );
		expect( await editor.getEditedPostContent() ).toBe(
			`<!-- wp:dmg/read-more {\"linkedPostId\":42} /-->`
		);
		await editor.publishPost();
		const url = new URL( page.url() );
		const postId = url.searchParams.get( 'post' );
		await page.goto( `/?p=${ postId }`, { waitUntil: 'commit' } );

		/**
		 * @todo assert the .dmg-read-more link exists in frontend for post
		 *
		 * This needs more work. To complete this I would create test posts
		 * either as a fixture or in the beforeAll(). These test posts would
		 * populate the ComboBoxControl and be used to assert that the correct
		 * permalink and title were displayed in the .dmg-read-more link.
		 */
		const links = await page.locator(
			'.entry-content p > a.dmg-read-more'
		);
		expect( links.count() ).toEqual( 1 );
		expect( await links.nth( 1 ).getAttribute( 'href' ) ).toEqual(
			'the-permalink'
		);

		await expect(
			await page.getByText( 'Read more: The linked page title' ).count()
		).toEqual( 1 );
	} );
} );
