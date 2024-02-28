import { createSignal, createEffect, createMemo, on } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Chord, Finger, TRIADS, NOTES, INSTRUMENTS } from './mt';

import { instrument, force_root } from './Settings';
import ChordDiagram from './ChordDiagram';

const SEVENS = [
  ['none', null],
  ['6', 9],
  ['7', 10],
  ['maj7', 11],
];

function createChord(root, triad, seven) {
  const notes = triad.notes.map( n => ( n+root ) % 12 );
  if (seven) notes.push((seven+root) % 12);
  return new Chord(notes);
}

function Chords() {
  const [root, setRoot] = createSignal(0);
  const [triad, setTriad] = createSignal(TRIADS[0]);
  const [seven, setSeven] = createSignal(null);

  const [n, setN] = createSignal(0);

  const chord = () => createChord(root(), triad(), seven());

  createEffect( on(chord, () => setN(0)) );

  const fingerings = createMemo(() => instrument().chord_fingerings(chord(), { max_fret: 12, max_reach: 3, force_root: force_root() }));

  return (
	<>
	  <fieldset>
		<label>Root</label>
		{ Object.values(NOTES).map((n, i) =>
		  <button classList={{[styles.active]: i==root()}} onClick={() => setRoot(i)}>{n}</button>
		)}

		<label>Triad</label>
		<select onChange={e => setTriad(TRIADS[e.currentTarget.value])}>
		  { TRIADS.map((t,i) => <option value={i}>{t.name}</option>) }
		</select>

		<label>6/7</label>
		{ SEVENS.map(([label, s]) =>
		  <button classList={{[styles.active]: s==seven()}} onClick={() => setSeven(s)}>{label}</button>
		)}

	  </fieldset>
	  <h2>{chord().label}</h2>
	  <div class={styles.chordblock}>
		<div>
		  <span>{chord().notes.map(n => NOTES[n]).join(' - ')}</span>
		  <ChordDiagram instrument={instrument} fingering={fingering} no_frets={5} />
		  <button disabled={n()==0} onClick={() => setN(n()-1)}>❮</button>
		  ({n()+1}/{fingerings().length})
		  <button disabled={n()>=fingerings().length-1} onClick={() => setN(n()+1)}>❯</button>
		</div>
	  </div>
	  <br class={styles.clear} />
	</>
  );

}

export default Chords;
