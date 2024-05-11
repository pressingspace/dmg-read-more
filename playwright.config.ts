/**
 * External dependencies
 */
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

export default defineConfig( {
	timeout: 30_000, // 30s
	// outputDir: 'artifacts/test-results',
	globalSetup: require.resolve( './src/test/e2e/config/global-setup' ),
	// globalTeardown: require.resolve( './src/test/e2e/config/global-teardown' ),
	testDir: 'src/test/e2e',
	forbidOnly: !! process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reportSlowTests: null,
	reporter: process.env.CI
		? [ [ 'github' ], [ 'list' ], [ 'html' ] ]
		: 'html',
	maxFailures: process.env.CI ? 1 : 0,
	snapshotPathTemplate:
		'{testDir}/{testFileDir}/__screenshots__/{arg}{testName}{ext}',
	use: {
		baseURL: 'http://localhost:8888',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
		video: 'on-first-retry',
		viewport: { width: 1280, height: 720 },
		actionTimeout: 10_000, // 10s
		navigationTimeout: 10_000, // 10s
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices[ 'Desktop Chrome' ] },
		},
	],
	// Run your local dev server before starting the tests.
	webServer: {
		command: 'npm run start',
		url: 'http://localhost:8888',
		reuseExistingServer: ! process.env.CI,
	},
} );
