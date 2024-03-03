import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

function Home() {
  return (
	<>
	  <p>This is a collection of utilities to help you find your way around your stringed instrument, be it a guitar, uke, banjo, or your very own custom 9 stringed cigar box thing. </p>

	  <p>Pick your instrument on the <a href="/settings">settings</a> page, and go either to the <a href="/scales">scales</a> or <a href="/chords">chords</a> page!</p>

	  <p>This is not a chord data-base, the app calculates ways to play the chords on the fly. You can tweak exactly how on the settings page.</p>

	  <h2>Updates</h2>
	  <dl>
		<dt>2024-03-03</dt>
		<dd>Added option for left-handed instruments</dd>
		<dt>2024-03-02</dt>
		<dd>Added print stylesheet for nice printed/PDF versions</dd>
	  </dl>
	</>
  );
}

export default Home;
