import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

import { instrument, force_root } from './Settings';

import ChordDiagram from './ChordDiagram';

function Roman({degree, type}) {

  const roman = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII' ];
  const types = {
	aug: '+',
	dim: 'o',
  };
  return (
	<span class={styles.roman}>
	  <Show when={type !== 'm'} fallback={roman[degree].toLowerCase()}>
		{roman[degree]}<sup>{types[type]}</sup>
	  </Show>
	</span>
  );
}

function ChordVariations({scale, degree, instrument, force_root}) {
  const [n, setN] = createSignal(0);
  const chord = () => scale().chord(degree);
  const fingerings = () => instrument().chord_fingerings(chord(), { max_fret: 12, max_reach: 3, force_root: force_root() });
  const fingering = () => fingerings()[n()];
  return (
	<div class={styles.chordblock}>
	  <h3><Roman degree={degree} type={chord().type}/>{chord().label}</h3>
	  <div>
		<span>{chord().notes.map(n => NOTES[n]).join(' - ')}</span>
		<ChordDiagram instrument={instrument} fingering={fingering} no_frets={5} />
		<button disabled={n()==0} onClick={() => setN(n()-1)}>❮</button>
		({n()+1}/{fingerings().length})
		<button disabled={n()>=fingerings().length-1} onClick={() => setN(n()+1)}>❯</button>
	  </div>
	</div>
  );
}

function Scales() {

  const [root, setRoot] = createSignal(0);

  const [mode, setMode] = createSignal(MODES['Ionian / Major']);

  const scale = () => mode().transpose(root());
  const fingering = () => instrument().fingering(scale(), 9);

  return (
	<>
	  <fieldset>
		<label>Mode</label>
		<select onChange={e => setMode(MODES[e.currentTarget.value])}>
		  { Object.keys(MODES).map(i => <option>{i}</option>) }
		</select><br/>
		<label>Key</label>
		{ Object.values(NOTES).map((n, i) =>
		  <button classList={{[styles.active]: i==root()}} onClick={() => setRoot(i)}>{n}</button>
		)}
	  </fieldset>
	  <div>
		<h2>Chords</h2>
		<br/>
		<For each={[...Array(scale().notes.length).keys()]}>{ d =>
		  <ChordVariations scale={scale} instrument={instrument} degree={d} force_root={force_root} />
		}</For>
	  </div>
	  <br class={styles.clear}/>
	  <h2>Scale</h2>
	  <div class={styles.scale}>
		<ChordDiagram instrument={instrument} fingering={fingering} no_frets={8}/>
	  </div>
    </>
  );
}

export default Scales;