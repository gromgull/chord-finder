import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';
import logo from "./assets/guitar.png";

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

function Chords() {
  const [root, setRoot] = createSignal(0);

  return (
	<fieldset>
	  <label>Root</label>
	  { Object.values(NOTES).map((n, i) =>
		<button classList={{[styles.active]: i==root()}} onClick={() => setRoot(i)}>{n}</button>
	  )}
	</fieldset>
  );

}

export default Chords;
