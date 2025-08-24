import { createSignal, createEffect, createMemo, on } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import styles from './App.module.css';

import { Finger, MODES, NOTES, NOTES_FLAT, NOTES_INV } from './mt';

import { options } from './Settings';

import ChordDiagram from './ChordDiagram';

import Circle from './Circle';

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
		<span>{chord().notes.map(n => scale().label(n)).join(' - ')}</span>
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
  const params = useParams();
  const navigate = useNavigate();

  const [mode, setMode] = createSignal(MODES[params.mode || 'Major']);

  const [flat, setFlat] = createSignal(false);

  // bug in solid-js means unicode ends up as utf8 code points in params
  const scale = createMemo(() => mode().createScale((params.key || 'C').replaceAll('%E2%99%AD', '♭').replaceAll('%E2%99%AF','♯')));

  createEffect( () => navigate(`/scales/${params.key || 'C' }/${mode().short_name}`) );

  const notes = () => flat() ? NOTES_FLAT : NOTES;

  const fingering = () => options().instrument.fingering(scale(), 13);

  return (
	<>
	  <Portal mount={document.querySelector('header')}>
		<h1 class={styles.onlyPrint}>{scale().label(scale().notes[0])} {mode().name}</h1>
	  </Portal>

	  <fieldset>
		<label>Mode</label>
		<select value={mode().short_name} onChange={e => setMode(MODES[e.currentTarget.value])}>
		  { Object.keys(MODES).map(i => <option value={i}>{MODES[i].name}</option>) }
		</select><br/>
	  </fieldset>

      <a href="/scales/C/Major">reset</a>

      <Circle
        scale={scale} mode={mode}
      />

	  <h2>Chords</h2>
	  <div class={styles.chords}>
		<For each={[...Array(scale().notes.length).keys()]}>{ d =>
		  <ChordVariations scale={scale} degree={d} />
		}</For>
	  </div>


	  <div class={styles.scale}>
		<h2>Scale</h2>
		<div>
		  <ChordDiagram instrument={options().instrument} fingering={fingering} no_frets={12}/>
		</div>
	  </div>

    </>
  );
}

export default Scales;
