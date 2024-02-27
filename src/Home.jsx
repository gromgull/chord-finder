import { createSignal, createEffect } from "solid-js";

import styles from './App.module.css';

import { Finger, MODES, NOTES, INSTRUMENTS } from './mt';

function Home() {
  return (
	<>
	  <p>This is a collection of utilities to help you find your way around your stringed instrument, be it a guitar, uke, banjo, or your very own custom 9 stringed cigar box thing. </p>
	</>
  );
}

export default Home;
