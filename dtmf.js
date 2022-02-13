const tones = {
	'0': () => dialTone( 941, 1336 ),
	'1': () => dialTone( 697, 1209 ),
	'2': () => dialTone( 697, 1336 ),
	'3': () => dialTone( 697, 1477 ),
	'4': () => dialTone( 770, 1209 ),
	'5': () => dialTone( 770, 1336 ),
	'6': () => dialTone( 770, 1477 ),
	'7': () => dialTone( 852, 1209 ),
	'8': () => dialTone( 852, 1336 ),
	'9': () => dialTone( 852, 1477 ),
	'*': () => dialTone( 941, 1209 ),
	'#': () => dialTone( 941, 1477 )
}

// Taken from: https://onlinetonegenerator.com/dtmf.html
// Refactor!
var contextClass = (window.AudioContext ||
	window.webkitAudioContext ||
	window.mozAudioContext ||
	window.oAudioContext ||
	window.msAudioContext);

 if (contextClass) {
	// Web Audio API is available.
	var context = new contextClass();
 }

 var oscillator1, oscillator2;

 var dialTone = function(freq1, freq2){

	// merger = context.createChannelMerger(2);

	oscillator1 = context.createOscillator();
	oscillator1.type = 0;
	oscillator1.frequency.value = freq1;
	gainNode = context.createGain ? context.createGain() : context.createGainNode();
	oscillator1.connect(gainNode,0,0);
	gainNode.connect(context.destination);
	gainNode.gain.value = .1;
	oscillator1.start ? oscillator1.start(0) : oscillator1.noteOn(0)

	// gainNode.connect(merger,0,1);

	oscillator2 = context.createOscillator();
	oscillator2.type = 0;
	oscillator2.frequency.value = freq2;
	gainNode = context.createGain ? context.createGain() : context.createGainNode();
	oscillator2.connect(gainNode);
	gainNode.connect(context.destination);
	// gainNode.connect(merger,0,0);


	gainNode.gain.value = .1;
	oscillator2.start ? oscillator2.start(0) : oscillator2.noteOn(0)

	// merger.connect(context.destination);


 };

 function stop() {
	oscillator1.disconnect();
	oscillator2.disconnect();
 }


function pressButton( aCallback, forMilliseconds ) {
	return new Promise( r => {
		aCallback();
		setTimeout( () => {
			stop();
			r();
		}, forMilliseconds );
	} );
}

async function callNumber( aNumber, pushFor = 500, spaceFor = 100 ) {
	for ( let i = 0; i < aNumber.length; i++ ) {
		 await pressButton( tones[ aNumber[i] ], pushFor );
		 await waitFor( spaceFor );
	}
}

function waitFor( milliseconds ) {
	return new Promise( r => {
		setTimeout( r, milliseconds );
	} )
}

window.onload = function() {
	const byId = id => document.getElementById( id );

	byId( 'accept' ).addEventListener( 'click', () => {
		const phone = byId( 'phone' ).value;
		const pulse = Number.parseInt( byId( 'pulse' ).value );
		const space = Number.parseInt( byId( 'space' ).value );

		callNumber( phone, pulse, space );
	} );

	let dialing = false;

	document.addEventListener( 'keydown', evt => {
		const tone = tones[ evt.key ]
		if ( tone && !dialing ) {
			dialing = true;
			tone();
		}
	} );

	document.addEventListener( 'keyup', evt => {
		dialing = false;
		stop();
	} );
};
