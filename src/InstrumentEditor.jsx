import { createSignal, createEffect, on } from "solid-js";
import { useNavigate } from "@solidjs/router";

import styles from './App.module.css';

import { Instrument, NOTES } from './mt';
import { addInstrument } from './Settings';

function InstrumentEditor() {
  const navigate = useNavigate();

  const [ strings, setStrings ] = createSignal([createSignal(0), createSignal(5), createSignal(11)]);

  const [ name, setName ] = createSignal('My Cigar Box Banjo');

  const save = () => {
	addInstrument(new Instrument(name(), strings().map( ([s,_]) => parseInt(s(),10) )));
	navigate("/settings", { replace: true });
  }

  const validate = () => name() && strings().length;

  return (
	<fieldset class={styles.instrumentEditor}>

	  <label>Name:</label>
	  <input type="text" onChange={e => setName(e.currentTarget.value)} value={name()}/>

	  <label>Strings <input class={styles.smallButton} onClick={() => setStrings([...strings(), createSignal(0)])} type="button" value="+" /></label>

	  <For each={strings()}>{ ([note, setNote],i) =>
		<>
		  <span>String {1+i()}</span>
		  <select onChange={e => setNote(e.currentTarget.value)}>
			{ Object.keys(NOTES).map(n => <option selected={n==note()} value={n}>{NOTES[n]}</option>) }
		  </select>
		  <input class={styles.smallButton} type="button" value="✕" onClick={() => setStrings([...strings()].toSpliced(i(), 1))} />
		  <br/>
		</>
	  }</For>
	  <br/>
	  <input onClick={e => save()} disabled={!validate()} type="button" value="Save" />
	</fieldset>
  );
}

export default InstrumentEditor;
