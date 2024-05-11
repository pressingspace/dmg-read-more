/**
 * External dependencies
 */
import { expect } from '@playwright/test';

/**
 * Internal dependencies
 */
import { admin } from '../test-data/data';

const logIn = async ( page, assertSuccess = true ) => {
	await page.context().clearCookies();
	await page.goto( '/wp-admin' );
	await page.waitForSelector( 'form' );
	await page.getByLabel( 'Username or Email Address' ).fill( admin.username );
	await page
		.getByRole( 'textbox', { name: 'Password' } )
		.fill( admin.password );
	await page.getByRole( 'button', { name: 'Log In' } ).click();

	if ( assertSuccess ) {
		await expect( page ).toHaveTitle( /Dashboard/ );
	}
};

/**
 * @todo this REST API login approach is not working yet so we instead use the
 * form-based login method above until this is fixed.
 *
 * @param page
 * @param assertSuccess
 */
const logInUsingRestApi = async ( page, assertSuccess = true ) => {
	await page.context().clearCookies();
	await page.goto( '/wp-admin' );
	await page.waitForSelector( 'form' );
	await page.getByLabel( 'Username or Email Address' ).fill( admin.username );
	await page
		.getByRole( 'textbox', { name: 'Password' } )
		.fill( admin.password );
	await page.getByRole( 'button', { name: 'Log In' } ).click();

	if ( assertSuccess ) {
		await expect( page ).toHaveTitle( /Dashboard/ );
	}
};

export { logIn, logInUsingRestApi };
