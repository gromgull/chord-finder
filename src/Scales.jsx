import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

function ChordDiagram({instrument, fingering, no_frets}) {

  const fret_spacing = 20;
  const nut_margins = 1;

  const w = () => instrument().strings.length*10-10+nut_margins*2;

  const start_fret = () => Math.max(1, fingering() ? fingering().min_fret : 0);

  const end_fret = () => fingering().min_fret+no_frets;

  return (
	<svg viewBox={`0 0 ${30+w()+nut_margins*2} ${20+fret_spacing*no_frets}`} class={styles.chord}>
	  <g transform={`translate(15 15)`}>

		<Show when={start_fret() == 1}><line x1={0} y1={0} x2={w()} y2={0} class={styles.nut}/></Show>

		<For each={[...Array(no_frets+1).keys()]}>{i =>
		  <>
			<line x1={nut_margins} x2={w()-nut_margins} y1={fret_spacing*(i)} y2={fret_spacing*(i)} class={styles.fret}/>
			<text class={styles.text} x={-10} y={fret_spacing*(i+0.5)}>{start_fret()+i}</text>
		  </>
		}</For>
		<For each={instrument().strings}>{(n, i) =>
			<line x1={nut_margins+i()*10} x2={nut_margins+i()*10} y1={0} y2={fret_spacing*no_frets} class={styles.string} />
		}</For>

		<Show when={fingering()}>
		  <For each={fingering().fingers}>{f => {
			const x = nut_margins+f.string*10;
			const y = f.mute ? -fret_spacing+fret_spacing/2+4 : (f.fret-start_fret()+1)*fret_spacing-fret_spacing/2 + (f.fret == 0 ? 4 : 0);
			return <>
					 <Show when={f.bar}>
					   <line x1={x} y1={y} y2={y} x2={nut_margins+instrument().strings.length*10-10} class={styles.bar} />
					 </Show>
					 <Show when={!f.mute} fallback={<text class={styles.textx} x={x} y={y}>⨯</text>}>
					   <circle class={styles.finger+' '+styles['n'+(1+f.color)]} cx={x} cy={y} r="5" />
					   <text class={styles.text} x={x} y={y}>{f.label}</text>
					 </Show>
				   </>
		  }}
		  </For>
		</Show>
		</g>
	</svg>
  );
}

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
  const [force_root, setForce_root] = createSignal(true);


  const [instrument, setInstrument] = createSignal(INSTRUMENTS.guitar);

  const [mode, setMode] = createSignal(MODES['Ionian / Major']);

  const scale = () => mode().transpose(root());
  const fingering = () => instrument().fingering(scale(), 9);

  return (
	<>
	  <fieldset>
		<label>Instrument</label>
		<select onChange={e => setInstrument(INSTRUMENTS[e.currentTarget.value])}>
		  { Object.keys(INSTRUMENTS).map(i => <option value={i} selected={instrument() == INSTRUMENTS[i]}>{i} { INSTRUMENTS[i].strings.map( s => NOTES[s] ).join(' - ') }</option>) }
		</select>

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
		<label><input type="checkbox" checked={force_root()} onChange={e => setForce_root(e.currentTarget.checked)}/> Force Root Bass</label>
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
