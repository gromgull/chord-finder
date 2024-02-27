import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

const [force_root, setForce_root] = createSignal(true);

const [instrument, setInstrument] = createSignal(INSTRUMENTS.guitar);


function Settings() {

  return (
	<fieldset>
	  <label>Instrument</label>
	  <select onChange={e => setInstrument(INSTRUMENTS[e.currentTarget.value])}>
		{ Object.keys(INSTRUMENTS).map(i => <option value={i} selected={instrument() == INSTRUMENTS[i]}>{i} { INSTRUMENTS[i].strings.map( s => NOTES[s] ).join(' - ') }</option>) }
	  </select>

		<label><input type="checkbox" checked={force_root()} onChange={e => setForce_root(e.currentTarget.checked)}/> Force Root Bass</label>

	  <p><i>Force root bass</i> will ensure the lowest sounding string is the root of a chord. On guitar, this is common, on ukulele or banjo, you probably don't care.</p>

	</fieldset>
  );

}

export { Settings, instrument, force_root };
