import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

const [force_root, setForce_root] = createSignal(localStorage.getItem('forceRoot')===undefined ? true : localStorage.getItem('forceRoot') == 'true');

const [instrument, setInstrument] = createSignal(INSTRUMENTS[localStorage.getItem('instrument') || 'guitar']);


function Settings() {

  function saveInstrument(i) {
	localStorage.setItem('instrument', i);
	setInstrument(INSTRUMENTS[i]);
  }

  function saveForceRoot(f) {
	localStorage.setItem('forceRoot', f);
	setForce_root(f);
  }

  return (
	<fieldset>
	  <label>Instrument</label>
	  <select onChange={e => saveInstrument(e.currentTarget.value)}>
		{ Object.keys(INSTRUMENTS).map(i => <option value={i} selected={instrument() == INSTRUMENTS[i]}>{i} { INSTRUMENTS[i].strings.map( s => NOTES[s] ).join(' - ') }</option>) }
	  </select>

		<label><input type="checkbox" checked={force_root()} onChange={e => saveForceRoot(e.currentTarget.checked)}/> Force Root Bass</label>

	  <p><i>Force root bass</i> will ensure the lowest sounding string is the root of a chord. On guitar, this is common, on ukulele or banjo, you probably don't care.</p>

	  <p>We'll save your instrument in your browser. More and custom tunings coming soon!</p>

	</fieldset>
  );

}

export { Settings, instrument, force_root };
