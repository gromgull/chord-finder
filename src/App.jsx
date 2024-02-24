import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

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



class Instrument {
  constructor(strings) {
	this.strings = strings;
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
  constructor(steps) {
	let n = 0;
	this.notes = [0, ...[...steps].map(s => {
	  n = (n + STEP[s]) % 12;
	  return n;
	})];
  }
}

const MODES = {
  "Ionian": new Scale("WWHWWWH"), // major
  "Dorian": new Scale("WHWWWHW"),
  "Phrygian": new Scale("HWWWHWW"),
  "Lydian": new Scale("WWWHWWH"),
  "Mixolydian": new Scale("WWHWWHW"),
  "Aeolian": new Scale("WHWWHWW"), // natural minor
  "Locrian": new Scale("HWWHWWW"),
}

function Chord({instrument, fingers}) {

  const fret_spacing = 20;
  const nut_margins = 1;

  const w = () => instrument().strings.length*10-10+nut_margins*2;

  return (
	<svg style={{margin: '10px'}}>
	  <g transform={`translate(${50-w()/2} 5)`}>
		<line x1={0} y1={0} x2={w()} y2={0} class={styles.nut}/>

		<For each={[...Array(5)]}>{(_, i) =>
		  <>
			<line x1={nut_margins} x2={w()-nut_margins} y1={fret_spacing*(i()+1)} y2={fret_spacing*(i()+1)} class={styles.fret}/>
			<text class={styles.text} x={-10} y={fret_spacing*(i()+0.5)}>{i()}</text>
		  </>
		}</For>
		<For each={instrument().strings}>{(n, i) =>
			<line x1={nut_margins+i()*10} x2={nut_margins+i()*10} y1={0} y2={100} class={styles.string} />
		}</For>

		<For each={fingers()}>{f =>
		  <circle class={styles.finger+' '+styles['n'+(1+f.color)]} cx={nut_margins+f.string*10} cy={f.fret*fret_spacing-fret_spacing/2} r="5" />
		}</For>
	  </g>
	</svg>
  );
}

const INSTRUMENTS = {
  bass: new Instrument([4, 9, 2, 11]),
  guitar: new Instrument([4, 9, 2, 7, 11, 12]),
  ukulele: new Instrument([7, 12, 16, 21]),
};

function App() {
  const [instrument, setInstrument] = createSignal(INSTRUMENTS.bass);

  const [fingers, setFingers] = createSignal([ new Finger(0, 3, 0), new Finger(3,3,1), new Finger(1,2,2) ]);
  console.log(instrument());
  return (
	<div>
	  <select onChange={e => setInstrument(INSTRUMENTS[e.currentTarget.value])}>
		{ Object.keys(INSTRUMENTS).map(i => <option>{i}</option>) }
	  </select>
	  <Chord instrument={instrument} fingers={fingers}/>
    </div>
  );
}

export default App;
