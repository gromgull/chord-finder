/*

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

  fingerings(scale, max_fret) {
	const res = [];

	for(let i=0; i<max_fret; i++) {
	  this.strings.forEach( (s,j) => {
		const n = scale.notes.indexOf((s+i) % 12);
		if (n != -1) {
		  res.push(new Finger(j, i, n % 7, scale.label(scale.notes[n])));
		}
	  });
	}
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

const STEP = { W: 2, H: 1 };

class Scale {
  constructor(notes) {
	this.notes = notes;
  }

  static fromSteps(steps) {
	let n = 0;
	return new Scale([0, ...[...steps].map(s => {
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
  bass: new Instrument([4, 9, 2, 11]),
  guitar: new Instrument([4, 9, 2, 7, 11, 12]),
  ukulele: new Instrument([7, 12, 16, 21]),
};

export { Finger, NOTES, MODES, INSTRUMENTS };
