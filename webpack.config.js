const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	...defaultConfig,
	entry: {
		index: path.resolve( process.cwd(), 'src', 'index.ts' ),
	},
	output: {
		...defaultConfig.output,
		filename: '[name].js',
		path: path.resolve( process.cwd(), 'build' ),
	},
};
