import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

function ChordDiagram({instrument, fingers}) {

  const fret_spacing = 20;
  const nut_margins = 1;

  const w = () => instrument().strings.length*10-10+nut_margins*2;

  return (
	<svg viewBox="0 0 100 100" class={styles.chord}>
	  <g transform={`translate(${50-w()/2} 15)`}>
		<line x1={0} y1={0} x2={w()} y2={0} class={styles.nut}/>

		<For each={[...Array(5)]}>{(_, i) =>
		  <>
			<line x1={nut_margins} x2={w()-nut_margins} y1={fret_spacing*(i()+1)} y2={fret_spacing*(i()+1)} class={styles.fret}/>
			<text class={styles.text} x={-10} y={fret_spacing*(i()+0.5)}>{1+i()}</text>
		  </>
		}</For>
		<For each={instrument().strings}>{(n, i) =>
			<line x1={nut_margins+i()*10} x2={nut_margins+i()*10} y1={0} y2={100} class={styles.string} />
		}</For>

		<For each={fingers()}>{f => {
		  const x = nut_margins+f.string*10;
		  const y = f.fret*fret_spacing-fret_spacing/2 + (f.fret == 0 ? 4 : 0);
		  return <>
			<circle class={styles.finger+' '+styles['n'+(1+f.color)]} cx={x} cy={y} r="5" />
			<text class={styles.text} x={x} y={y}>{f.label}</text>
		  </>
		  }
		}</For>
	  </g>
	</svg>
  );
}

function App() {

  const [root, setRoot] = createSignal(0);

  const [instrument, setInstrument] = createSignal(INSTRUMENTS.bass);

  const [mode, setMode] = createSignal(MODES.Ionian);

  const scale = () => mode().transpose(root());
  const fingers = () => instrument().fingerings(scale(), 6);

  console.log(instrument());
  console.log(fingers);
  return (
	<div>
	  <select onChange={e => setInstrument(INSTRUMENTS[e.currentTarget.value])}>
		{ Object.keys(INSTRUMENTS).map(i => <option>{i}</option>) }
	  </select><br/>
	  <select onChange={e => setMode(MODES[e.currentTarget.value])}>
		{ Object.keys(MODES).map(i => <option>{i}</option>) }
	  </select><br/>

	  { Object.values(NOTES).map((n, i) =>
		  <button classList={{[styles.active]: i==root()}} onClick={() => setRoot(i)}>{n}</button>
	  )}
	  <ul>
	  <For each={[...Array(7)]}>{ (_,d) => <li>{1+d()} {scale().chord(d()).label}</li> }</For>
	  </ul>
	  <br/>
	  <ChordDiagram instrument={instrument} fingers={fingers}/>
    </div>
  );
}

export default App;
