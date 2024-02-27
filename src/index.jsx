/* @refresh reload */
import { render } from 'solid-js/web';
import { HashRouter, Route } from "@solidjs/router";

import './index.css';
import Home from './Home';
import Scales from './Scales';
import Chords from './Chords';
import { Settings } from './Settings';

import styles from './App.module.css';
import logo from "./assets/guitar.png";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

function App(props) {
  let menuBtn;
  return (
  <>
	<header class={styles.header}>
	  <a href="" class={styles.logo}><img width="32" src={logo} alt="chords logo" />Chord Finder</a>
	  <input ref={menuBtn} class={styles.menuBtn} type="checkbox" id="menu-btn" />
	  <label class={styles.menuIcon} for="menu-btn"><span class={styles.navicon}></span></label>
	  <ul class={styles.menu}>
		<li><a onClick={ () => menuBtn.click() } href="/scales">Scales</a></li>
		<li><a onClick={ () => menuBtn.click() } href="/chords">Chords</a></li>
		<li><a onClick={ () => menuBtn.click() } href="/settings">Settings</a></li>
	  </ul>
	</header>
	<div class={styles.content}>
      {props.children}
	</div>
	<div class={styles.footer}>
	  Chord finder! / <a href="https://github.com/gromgull/chord-finder">GitHub</a> / AGPL License
	</div>
  </>
);
}

render(() => <HashRouter root={App}>
    <Route path="/scales" component={Scales} />
    <Route path="/chords" component={Chords} />
    <Route path="/settings" component={Settings} />
    <Route path="/" component={Home} />
  </HashRouter>, root);
