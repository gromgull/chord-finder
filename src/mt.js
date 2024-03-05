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
  constructor(name, strings) {
	this.name = name;
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
	const { max_fret, max_reach, force_root, max_fingers } = options;

	if (fingering.no_fingers > (max_fingers || 4)) return;

	if (i == this.strings.length) {
	  const sounding = fingering.sounding;
	  const notes = new Set(sounding.map( f => f.color ));
	  //[...Array(chord.notes.length)].forEach((_,n) => notes.delete(n));
	  if (notes.size == chord.notes.length && ( !force_root || sounding[0].color === 0 ))
		res.push(fingering);
	  return
	}

	const s = this.strings[i];

	const bar = fingering.bar;

	//if ( fingering.every(f => f.color === null) && s != chord.notes[0])
	// TODO: filter skip strings?
	// don't play this string
	if (!bar) {
	  this.string_fingerings(chord, options, fingering.push(new Finger(i, 0, null, null)), res, i+1);
	}

	for(let fret=bar ? bar.fret : 0; fret<max_fret; fret++) {
	  const n = chord.notes.indexOf((s+fret) % 12);
	  if (n != -1) {
		if (fingering.max_reach(fret)<max_reach) {
		  if (!bar && fret>0 && i!=this.strings.length-1) {
			// we could try bar'ing on this string
			this.string_fingerings(chord, options, fingering.push(new Finger(i, fret, n, NOTES[chord.notes[n]], true)), res, i+1);
		  }

		  this.string_fingerings(chord, options, fingering.push(new Finger(i, fret, n, NOTES[chord.notes[n]])), res, i+1);
		}
	  }
	}


  }

  chord_fingerings(chord, options) {

	const res = [];

	this.string_fingerings(chord, options, new Fingering([]), res, 0);

	// filter out places where we just mute strings we could have played
	let filtered = res.filter(fs => !fs.pointless_bar);
	filtered = filtered.filter( fs => !filtered.some( other => fs != other && fs.isSubSetOf(other) ));
	filtered.sort( Fingering.sorter );

	if (options.lefty)
	  filtered = filtered.map( fs => fs.lefty(options.instrument) );

	return filtered;
  }

}

class Finger {
  constructor(string, fret, color, label, bar) {
	this.string = string;
	this.fret = fret;
	this.color = color;
	this.label = label;
	this.bar = bar;
  }

  get mute() {
	return this.color == null;
  }
}

class Fingering {
  constructor(fingers) {
	this.fingers = fingers;
	this.signature = this.fingers.map( f => f.mute ? 'x' : f.fret + (f.bar?'b':'') ).join('|')
  }

  static sorter(a,b) {
	const f = a.min_sounding_fret - b.min_sounding_fret;
	if (f) return f;
	if (!a.bar && b.bar) return -1;
	if (a.bar && !b.bar) return 1;
	if (a.sounding.length > b.sounding.length) return -1;
	if (a.sounding.length < b.sounding.length) return 1;
	return 0;
  }

  get min_sounding_fret() {
	return Math.min(...this.sounding.map(f => f.fret));
  }

  get min_fret() {
	if (!this.fingered.length) return 0;
	return Math.min(...this.fingered.map(f => f.fret));
  }

  get max_fret() {
	return Math.max(...this.sounding.map(f => f.fret));
  }

  get no_fingers() {
	return this.sounding.filter( f => (!this.bar || this.bar.fret != f.fret && this.bar != f) && f.fret ).length;
  }

  get sounding() {
	return this.fingers.filter(f => !f.mute)
  }

  get fingered() {
	return this.sounding.filter( f => f.fret );
  }

  max_reach(fret) {
	return Math.max(...this.fingered.map( f => Math.abs(f.fret-fret) ));
  }

  lefty(instrument) {
	return new Fingering(this.fingers.map( f => new Finger(instrument.strings.length-1-f.string, f.fret, f.color, f.label, f.bar ? 'left' : false)));
  }

  get bar() {
	return this.fingers.flatMap( f => f.bar ? [f] : [])[0];
  }

  get pointless_bar() {
	const bar = this.bar;
	if (!bar) return false;
	return !this.fingers.some( f => f.string>bar.string && f.fret == bar.fret);
  }

  push(f) {
	return new Fingering([...this.fingers, f]);
  }

  isSubSetOf(other) {
	const res = this.sounding.every( f => other.sounding.some( o => f.string == o.string && f.fret == o.fret ));
	if (res && this.bar && !other.bar) return false;
	if (res && this.bar && other.bar && this.bar.fret == other.bar.fret && this.bar.string<other.bar.string) return false;
	return res;
  }

}

class Triad {
  constructor(name, notes, symbol) {
	this.name = name;
	this.notes = notes;
	this.symbol = symbol;
  }
}

const TRIADS = [
  new Triad('major', [0,4,7], ''),
  new Triad('minor', [0,3,7], 'm'),
  new Triad('augmented', [0,4,8], 'aug'),
  new Triad('diminished', [0,3,6], 'dim'),
  new Triad('sus2', [0,2,7], 'sus2'),
  new Triad('sus4', [0,5,7], 'sus4'),
];

const SEVENS = [
  ['none', null],
  ['6', 9],
  ['7', 10],
  ['maj7', 11],
];

const SEVENS_LOOKUP = Object.fromEntries( SEVENS.map( s => [s[1], s[0]] ) );

const TRIADS_LOOKUP = Object.fromEntries( TRIADS.map( t => [t.notes, t.symbol] ));

function mod12(n) {
  return ((n%12)+12)%12;
}

class Chord {

  // notes in order, first is root

  constructor(notes) {
	this.notes = notes;
  }

  get root() {
	return this.notes[0];
  }

  get type() {
	const fingerprint = this.notes.map( n => mod12(n - this.root));
	return (fingerprint.length>3?SEVENS_LOOKUP[fingerprint[3]]:'')+TRIADS_LOOKUP[fingerprint.slice(0,3)];
  }

  get label() {
	return NOTES[this.root]+this.type;
  }

}

const STEP = { W: 2, H: 1 };

class Scale {
  constructor(name, notes) {
	this.name = name;
	this.notes = notes;
  }

  static fromSteps(name, steps) {
	let n = 0;
	steps = [...steps];
	steps.pop();
	return new Scale(name, [0, ...steps.map(s => {
	  n = (n + STEP[s]) % 12;
	  return n;
	})]);
  }

  transpose(n) {
	return new Scale(this.name, this.notes.map( s => (s+n) % 12 ));
  }

  label(n) {
	return NOTES[n];
  }

  chord(degree) {
	return new Chord([0,2,4].map(d => this.notes[(degree+d)%this.notes.length]));
  }
}

const MODES = Object.fromEntries([
  Scale.fromSteps("Ionian / Major", "WWHWWWH"), // major
  Scale.fromSteps("Dorian", "WHWWWHW"),
  Scale.fromSteps("Phrygian", "HWWWHWW"),
  Scale.fromSteps("Lydian", "WWWHWWH"),
  Scale.fromSteps("Mixolydian", "WWHWWHW"),
  Scale.fromSteps("Aeolian / Minor", "WHWWHWW"), // natural minor
  Scale.fromSteps("Locrian", "HWWHWWW"),
].map( s => [s.name, s]));


const INSTRUMENTS = Object.fromEntries([
  new Instrument('Guitar', [4, 9, 2, 7, 11, 4]), // EADGBE
  new Instrument('Guitar Open D', [2, 9, 2, 6, 9, 2]), // DADF#AD
  new Instrument('Guitar Open G', [2, 7, 2, 7, 11, 2]), // DGDGBD
  new Instrument('Bass', [4, 9, 2, 7]), // EADG
  new Instrument('Ukulele', [7, 0, 4, 9]), // GCEA
  new Instrument('Banjo', [2, 7, 11, 2]), // DGBD
  new Instrument('Banjo Open C', [0, 7, 0, 4]), // CGCE
].map( i => [i.name, i]));

export { Chord, Finger, Instrument, NOTES, TRIADS, MODES, INSTRUMENTS };
