/*

https://en.wikipedia.org/wiki/Pitch_class#Integer_notation
Notes are numbers from 0-12

0 C
1 C# / Db
2 D
3 D# / Eb
4 E
5 F / E#
6 F# / Gb
7 G
8 G# / Ab
9 A
10 A# / Bb
11 B / Cb

*/

const NOTES = {
  0: 'C',
  1: 'C#',
  2: 'D',
  3: 'D#',
  4: 'E',
  5: 'F',
  6: 'F#',
  7: 'G',
  8: 'G#',
  9: 'A',
  10: 'A#',
  11: 'B',
};


class Instrument {
  constructor(strings) {
	this.strings = strings;
  }

  fingering(scale, max_fret) {
	const res = [];

	this.strings.forEach( (s,i) => {
	  for(let j=0; j<max_fret; j++) {
		const n = scale.notes.indexOf((s+j) % 12);
		if (n != -1) {
		  res.push(new Finger(i, j, n % 7, scale.label(scale.notes[n])));
		}
	  }
	});
	return new Fingering(res);
  }


  string_fingerings(chord, options, fingering, res, i) {
	const { max_fret, max_reach, force_root } = options;
	if (i == this.strings.length) {
	  const sounding = fingering.filter(f => f.color!==null);
	  const notes = new Set(sounding.map( f => f.color ));
	  //[...Array(chord.notes.length)].forEach((_,n) => notes.delete(n));
	  if (notes.size == chord.notes.length && ( !force_root || sounding[0].color === 0 ))
		res.push(new Fingering(fingering));
	  return
	}

	const s = this.strings[i];

	// don't play this string
	if ( fingering.every(f => f.color === null) && s != chord.notes[0])
		 this.string_fingerings(chord, options, [...fingering, new Finger(i, 0, null, null)], res, i+1);

	for(let j=0; j<max_fret; j++) {
	  const n = chord.notes.indexOf((s+j) % 12);
	  if (n != -1) {
		const max_dist = Math.max(...fingering.map( f => Math.abs(f.fret-j) ));
		if (max_dist<=max_reach) {
		  this.string_fingerings(chord, options, [...fingering, new Finger(i, j, n, NOTES[chord.notes[n]])], res, i+1);
		}
	  }
	}


  }

  chord_fingerings(chord, options) {

	const res = [];

	this.string_fingerings(chord, options, [], res, 0);

	console.log(res);
	return res;
  }

}

class Finger {
  constructor(string, fret, color, label) {
	this.string = string;
	this.fret = fret;
	this.color = color;
	this.label = label;
  }
}

class Fingering {
  constructor(fingers) {
	this.fingers = fingers;
  }

  get min_fret() {
	return Math.min(...this.fingers.filter(f => f.color !== null).map(f => f.fret));
  }

  get max_fret() {
	return Math.max(...this.fingers.filter(f => f.color !== null).map(f => f.fret));
  }

}

const TRIADS = {
  [[0,4,7]]: '',  // major
  [[0,3,7]]: 'm', // minor
  [[0,4,8]]: 'aug', // augmented
  [[0,3,6]]: 'dim', // diminished
  [[0,2,7]]: 'sus2',
  [[0,5,7]]: 'sus4',
}

function mod12(n) {
  return ((n%12)+12)%12;
}

class Chord {

  // notes in order, first is root

  constructor(notes) {
	this.notes = notes;
  }

  get label() {
	const root = this.notes[0];
	const fingerprint = this.notes.map( n => mod12(n - root));
	return NOTES[root]+TRIADS[fingerprint];
  }

}

const STEP = { W: 2, H: 1 };

class Scale {
  constructor(notes) {
	this.notes = notes;
  }

  static fromSteps(steps) {
	let n = 0;
	steps = [...steps];
	steps.pop();
	return new Scale([0, ...steps.map(s => {
	  n = (n + STEP[s]) % 12;
	  return n;
	})]);
  }

  transpose(n) {
	return new Scale(this.notes.map( s => (s+n) % 12 ));
  }

  label(n) {
	return NOTES[n];
  }

  chord(degree) {
	return new Chord([0,2,4].map(d => this.notes[(degree+d)%this.notes.length]));
  }
}

const MODES = {
  "Ionian": Scale.fromSteps("WWHWWWH"), // major
  "Dorian": Scale.fromSteps("WHWWWHW"),
  "Phrygian": Scale.fromSteps("HWWWHWW"),
  "Lydian": Scale.fromSteps("WWWHWWH"),
  "Mixolydian": Scale.fromSteps("WWHWWHW"),
  "Aeolian": Scale.fromSteps("WHWWHWW"), // natural minor
  "Locrian": Scale.fromSteps("HWWHWWW"),
}


const INSTRUMENTS = {
  bass: new Instrument([4, 9, 2, 7]),
  guitar: new Instrument([4, 9, 2, 7, 11, 4]),
  ukulele: new Instrument([7, 12, 16, 21]),
};

export { Finger, NOTES, MODES, INSTRUMENTS };
