import { createSignal, createEffect, on } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

const saved_options = JSON.parse(localStorage.getItem('options') || '{}');
const default_options = { ...{
  force_root: true,
  max_fret: 12,
  max_fingers: 4,
  max_reach: 4,
  instrument: 'Guitar',
}, ...saved_options};

const [force_root, setForce_root] = createSignal(default_options.force_root);
const [max_fret, setmax_fret] = createSignal(default_options.max_fret);
const [max_fingers, setMax_fingers] = createSignal(default_options.max_fingers);
const [max_reach, setMax_reach] = createSignal(default_options.max_reach);

const [instrument, setInstrument] = createSignal(INSTRUMENTS[default_options.instrument]);

const [instruments, setInstruments] = createSignal(INSTRUMENTS)

const options = () => ({ force_root: force_root(), max_reach: max_reach(), max_fingers: max_fingers(), max_fret: max_fret(), instrument: instrument() });

function Settings() {

  createEffect(on([force_root, max_reach, max_fingers, max_fret, instrument], ([force_root, max_reach, max_fingers, max_fret, instrument]) => localStorage.setItem('options', JSON.stringify({ force_root, max_reach, max_fingers, max_fret, instrument: instrument.name}))));

  return (
	<fieldset>

	  <p>We'll save these settings in your browser!</p>

	  <label>Instrument</label>
	  <select onChange={e => setInstrument(instruments()[e.currentTarget.value])}>
		{ Object.values(INSTRUMENTS).map(i => <option value={i.name} selected={instrument() == i}>{i.name} [{ i.strings.map( s => NOTES[s] ).join(' - ') }]</option>) }
	  </select>

	  <label><input type="checkbox" checked={force_root()} onChange={e => setForce_root(e.currentTarget.checked)}/> Force Root Bass</label>

	  <p><i>Force root bass</i> will ensure the lowest sounding string is the root of a chord. On guitar, this is common, on ukulele or banjo, you probably don't care.</p>

	  <label>Max Fret</label><input type="number" value={max_fret()} onChange={e => setmax_fret(parseInt(e.currentTarget.value, 10))}/>

	  <p><i>Max fret</i> decides how high up the neck we will form chords.</p>

	  <label>Max Reach</label><input type="number" value={max_reach()} onChange={e => setMax_reach(parseInt(e.currentTarget.value, 10))}/>

	  <p><i>Max reach</i> determines how many frets chord can cover. If you have small hands, maybe chose 3, if you are John Mayer chose 5.</p>

	  <label>Max Fingers</label><input type="number" value={max_fingers()} onChange={e => setMax_fingers(parseInt(e.currentTarget.value, 10))}/>

	  <p><i>Max fingers</i> determines how many fingers we can use for a chord. If you are Django Reinhardt, chose 3, if you are in the <a href="https://www.youtube.com/watch?v=_Jijy3OCbdg">Barcelona Guitar Trio</a>, chose 15. </p>

	</fieldset>
  );

}

export { Settings, options };
