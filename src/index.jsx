/* @refresh reload */
import { render } from 'solid-js/web';
import { HashRouter, Route } from "@solidjs/router";

import './index.css';
import Home from './Home';
import Scales from './Scales';
import Chords from './Chords';

import styles from './App.module.css';
import logo from "./assets/guitar.png";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const App = props => (
  <>
	<div class={styles.content}>
	  <div class={styles.header}>
		<h1><img src={logo} alt="chords logo" />Chords!</h1>
		<a href="/scales">Scales</a> <a href="/chords">Chords</a>
		<hr/>
	  </div>
      {props.children}
	</div>
	<div class={styles.footer}>
	  Chord finder! / <a href="https://github.com/gromgull/chord-finder">GitHub</a> / AGPL License
	</div>
  </>
)

render(() => <HashRouter root={App}>
    <Route path="/scales" component={Scales} />
    <Route path="/chords" component={Chords} />
    <Route path="/" component={Home} />
  </HashRouter>, root);
