import { createSignal, createEffect, createMemo } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Chord, Finger, TRIADS, NOTES } from './mt';

import { options } from './Settings';
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

  const chord = () => createChord(root(), triad(), seven());

  const fingerings = createMemo(() => options().instrument.chord_fingerings(chord(), options()));

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
	  <h2 class={styles.chordLabel}>{chord().label} <span class={styles.chordNotes}>[{chord().notes.map(n => NOTES[n]).join(' - ')}]</span></h2>

	  <Portal mount={document.querySelector('header')}>
		<h1>{chord().label} <span class={styles.chordNotes}>[{chord().notes.map(n => NOTES[n]).join(' - ')}]</span></h1>
	  </Portal>

	  <div class={styles.chords}>
		<Show when={fingerings().length==0}><p>No chords found :(</p></Show>

		<For each={fingerings()}>{ (fingering, n) =>
		  <div class={styles.chordblock}>
			<div>
			  <ChordDiagram instrument={options().instrument} fingering={() => fingering} no_frets={5} />
			  ({n()+1}/{fingerings().length})
			</div>
		  </div>
		}</For>
	  </div>
	</>
  );

}

export default Chords;
