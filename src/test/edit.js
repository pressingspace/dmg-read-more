describe( 'Simple test', () => {
	test.each( [
		[ 'Should pass', true ],
		[ 'Should fail', false ],
	] )( '%p, %p', ( format, expected ) => {
		expect( expected ).toBe( true );
	} );
} );
