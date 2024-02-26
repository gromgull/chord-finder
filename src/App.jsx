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
	<svg preserveAspectRatio="xMidYMin meet" viewBox={`0 0 ${w()+nut_margins*2} ${20+fret_spacing*no_frets}`} style={{height: no_frets*35+'px'}}class={styles.chord}>
	  <g transform={`translate(0 15)`}>

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
			const y = (f.fret-start_fret()+1)*fret_spacing-fret_spacing/2 + (f.fret == 0 ? 4 : 0);
			return <>
					 <Show when={f.color !== null} fallback={<text class={styles.text} x={x} y={y}>⨯</text>}>
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

function ChordVariations({scale, degree, instrument, force_root}) {
  const [n, setN] = createSignal(0);
  const chord = () => scale().chord(degree());
  const fingerings = () => instrument().chord_fingerings(chord(), { max_fret: 12, max_reach: 3, force_root: force_root() });
  const fingering = () => fingerings()[n()];
  return (
	<div class={styles.chordblock}>
	  <h3>{chord().label} ({n()+1}/{fingerings().length})</h3>
	  <ChordDiagram instrument={instrument} fingering={fingering} no_frets={5} />
	  <div>
		<button disabled={n()==0} onClick={() => setN(n()-1)}>❮</button>
		<button disabled={n()>=fingerings().length-1} onClick={() => setN(n()+1)}>❯</button>
	  </div>
	</div>
  );
}

function App() {

  const [root, setRoot] = createSignal(0);
  const [force_root, setForce_root] = createSignal(true);


  const [instrument, setInstrument] = createSignal(INSTRUMENTS.guitar);

  const [mode, setMode] = createSignal(MODES.Ionian);

  const scale = () => mode().transpose(root());
  const fingering = () => instrument().fingering(scale(), 9);

  return (
	<>
	  <div class={styles.content}>
		<h1>Chords!</h1>
		<fieldset>
		  <label>Instrument</label>
		  <select onChange={e => setInstrument(INSTRUMENTS[e.currentTarget.value])}>
			{ Object.keys(INSTRUMENTS).map(i => <option selected={instrument() == INSTRUMENTS[i]}>{i}</option>) }
		  </select><br/>
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
		  <label><input type="checkbox" checked={force_root()} onChange={e => setForce_root(e.currentTarget.checked)}/> Force Root</label>
		  <br/>
		  <For each={[...Array(scale().notes.length)]}>{ (_,d) =>
			<ChordVariations scale={scale} instrument={instrument} degree={d} force_root={force_root} />
		  }</For>
		</div>
		<br class={styles.clear}/>
		<h2>Scale</h2>
		<ChordDiagram instrument={instrument} fingering={fingering} no_frets={8}/>
	  </div>
	  <div class={styles.footer}>
		Chord finder! / <a href="https://github.com/gromgull/chord-finder">GitHub</a> / AGPL License
	  </div>
    </>
  );
}

export default App;
