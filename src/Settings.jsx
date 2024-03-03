import { createSignal, createEffect, on } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Instrument, NOTES, INSTRUMENTS } from './mt';

const saved_options = JSON.parse(localStorage.getItem('options') || '{}');
const default_options = { ...{
  force_root: true,
  lefty: false,
  max_fret: 12,
  max_fingers: 4,
  max_reach: 4,
  instrument: 'Guitar',
  custom_instruments: {},
}, ...saved_options};

default_options['custom_instruments'] = Object.fromEntries(Object.entries(default_options['custom_instruments']).map( ([k,v]) => [k, new Instrument(v.name, v.strings)] ));

const [force_root, setForce_root] = createSignal(default_options.force_root);
const [lefty, setLefty] = createSignal(default_options.lefty);
const [max_fret, setmax_fret] = createSignal(default_options.max_fret);
const [max_fingers, setMax_fingers] = createSignal(default_options.max_fingers);
const [max_reach, setMax_reach] = createSignal(default_options.max_reach);

const [instruments, setInstruments] = createSignal({...INSTRUMENTS, ...(default_options.custom_instruments || {})});

const [instrument, setInstrument] = createSignal(instruments()[default_options.instrument] || INSTRUMENTS['Guitar']);


const options = () => ({ force_root: force_root(), lefty: lefty(), max_reach: max_reach(), max_fingers: max_fingers(), max_fret: max_fret(), instrument: instrument() });

function addInstrument(i) {
  setInstruments({...instruments(), [i.name]: i});
  setInstrument(i);

}

function Settings() {

  createEffect(on([force_root, lefty, max_reach, max_fingers, max_fret, instrument, instruments], ([force_root, lefty, max_reach, max_fingers, max_fret, instrument, instruments]) => {
	const custom_instruments = Object.fromEntries( Object.entries(instruments).filter(([k,v]) => INSTRUMENTS[k] === undefined));
	const opts = { force_root, lefty, max_reach, max_fingers, max_fret, instrument: instrument.name, custom_instruments };
	localStorage.setItem('options', JSON.stringify(opts))
  }));

  return (
	<fieldset>

	  <p>We'll save these settings in your browser!</p>

	  <label>Instrument</label>
	  <select onChange={e => setInstrument(instruments()[e.currentTarget.value])}>
		<For each={Object.values(instruments())}>{ i => <option value={i.name} selected={instrument() == i}>{i.name} [{ i.strings.map( s => NOTES[s] ).join(' - ') }]</option>
		}</For>
	  </select>
		<p>
		  <a href="/instrument">Add a new instrument</a>
		</p>

	  <label><input type="checkbox" checked={force_root()} onChange={e => setForce_root(e.currentTarget.checked)}/> Force Root Bass</label>

	  <p><i>Force root bass</i> will ensure the lowest sounding string is the root of a chord. On guitar, this is common, on ukulele or banjo, you probably don't care.</p>

	  <label><input type="checkbox" checked={lefty()} onChange={e => setLefty(e.currentTarget.checked)}/> Lefty</label>

	  <p><i>Lefty</i> swaps the order of the strings, used for a left-handed instrument.</p>

	  <label>Max Fret</label><input type="number" value={max_fret()} onChange={e => setmax_fret(parseInt(e.currentTarget.value, 10))}/>

	  <p><i>Max fret</i> decides how high up the neck we will form chords.</p>

	  <label>Max Reach</label><input type="number" value={max_reach()} onChange={e => setMax_reach(parseInt(e.currentTarget.value, 10))}/>

	  <p><i>Max reach</i> determines how many frets chord can cover. If you have small hands, maybe chose 3, if you are John Mayer chose 5.</p>

	  <label>Max Fingers</label><input type="number" value={max_fingers()} onChange={e => setMax_fingers(parseInt(e.currentTarget.value, 10))}/>

	  <p><i>Max fingers</i> determines how many fingers we can use for a chord. If you are Django Reinhardt, chose 3, if you are in the <a href="https://www.youtube.com/watch?v=_Jijy3OCbdg">Barcelona Guitar Trio</a>, chose 15. </p>

	</fieldset>
  );

}

export { Settings, options, instruments, addInstrument };
