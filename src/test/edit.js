describe( 'Simple test', () => {
	test.each( [ [ 'Should pass', true ] ] )(
		'%p, %p',
		( format, expected ) => {
			expect( expected ).toBe( true );
		}
	);
} );
