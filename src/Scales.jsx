import { createSignal, createEffect, createMemo, on } from "solid-js";

import styles from './App.module.css';

import { Finger, MODES, NOTES } from './mt';

import { options } from './Settings';

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

function ChordVariations({scale, degree}) {
  const [n, setN] = createSignal(0);
  const chord = () => scale().chord(degree);

  const fingerings = createMemo(() => options().instrument.chord_fingerings(chord(), options()));
  const fingering = () => fingerings()[n()];

  createEffect( on(chord, () => setN(0)) );

  return (
	<div class={styles.chordblock}>
	  <h3><Roman degree={degree} type={chord().type}/>{chord().label}</h3>
	  <div>
		<span>{chord().notes.map(n => NOTES[n]).join(' - ')}</span>
		<ChordDiagram instrument={options().instrument} fingering={fingering} no_frets={5} />
		<div class={styles.controls}>
		  <button disabled={n()==0} onClick={() => setN(n()-1)}>❮</button>
		  ({n()+1}/{fingerings().length})
		  <button disabled={n()>=fingerings().length-1} onClick={() => setN(n()+1)}>❯</button>
		</div>
	  </div>
	</div>
  );
}

function Scales() {

  const [root, setRoot] = createSignal(0);

  const [mode, setMode] = createSignal(MODES['Ionian / Major']);

  const scale = () => mode().transpose(root());
  const fingering = () => options().instrument.fingering(scale(), 9);

  return (
	<>
	  <Portal mount={document.querySelector('header')}>
		<h1 class={styles.onlyPrint}>{NOTES[root()]} {mode().name}</h1>
	  </Portal>

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
	  <h2>Chords</h2>
	  <div class={styles.chords}>
		<For each={[...Array(scale().notes.length).keys()]}>{ d =>
		  <ChordVariations scale={scale} degree={d} />
		}</For>
	  </div>


	  <div class={styles.scale}>
		<h2>Scale</h2>
		<div>
		  <ChordDiagram instrument={options().instrument} fingering={fingering} no_frets={8}/>
		</div>
	  </div>

    </>
  );
}

export default Scales;
