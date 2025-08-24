import { createSignal, createEffect, createMemo } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Chord, Finger, TRIADS, NOTES, NOTES_FLAT, NOTES_INV, MODES, SEVENS } from './mt';

import { options } from './Settings';
import ChordDiagram from './ChordDiagram';

function createChord(root, triad, seven, flats) {
  const notes = triad.notes.map( n => ( n+root ) % 12 );
  if (seven) notes.push((seven+root) % 12);
  return new Chord(MODES['Major'].createScale('C', flats), notes);
}

function decodeChord(chord) {
  return /(?<root>[A-G](?:♯*|♭*))(?<seven>6|7|maj7)?(?<triad>m|aug|dim|sus2|sus4)?/.exec(chord).groups;
}

function Chords() {

  const params = useParams();
  const navigate = useNavigate();

  const [flats, setFlats] = createSignal(false);

  const [root, setRoot] = createSignal(params.chord ? NOTES_INV[decodeChord(params.chord).root] : 0);
  const [triad, setTriad] = createSignal(TRIADS[params.chord ? decodeChord(params.chord).triad || '' : '']);
  const [seven, setSeven] = createSignal(params.chord ? SEVENS[decodeChord(params.chord).seven] : null);

  console.log(params.chord && decodeChord(params.chord))

  createEffect(() => navigate(`/chords/${chord().label}`));

  const chord = () => createChord(root(), triad(), seven(), flats());

  const fingerings = createMemo(() => options().instrument.chord_fingerings(chord(), options()));

  return (
	<>
	  <fieldset>
        <div class={styles.chordRoots}>
		<label>Root <a onClick={() => setFlats(!flats())}>(toggle flats)</a></label>
		{ Object.values(flats() ? NOTES_FLAT : NOTES).map((n, i) =>
		  <button classList={{[styles.active]: i==root()}} onClick={() => setRoot(i)}>{n}</button>
		)}
        </div>

		<label>Triad</label>
		<select value={triad().symbol} onChange={e => setTriad(TRIADS[e.currentTarget.value])}>
		  { Object.entries(TRIADS).map(([symbol,t]) => <option value={symbol}>{t.name}</option>) }
		</select>

		<label>6/7</label>
		{ Object.entries(SEVENS).toSorted( (a,b) => a[1] - b[1]).map(([label, s]) =>
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
