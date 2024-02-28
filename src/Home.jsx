import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

function Home() {
  return (
	<>
	  <p>This is a collection of utilities to help you find your way around your stringed instrument, be it a guitar, uke, banjo, or your very own custom 9 stringed cigar box thing. </p>

	  <p>Pick your instrument on the settings page, and go either to the scales or chords page!</p>

	  <p>This is not a chord data-base, the app calculates ways to play the chords on the fly!</p>
	</>
  );
}

export default Home;
