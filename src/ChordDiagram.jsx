import styles from './App.module.css';

function ChordDiagram({instrument, fingering, no_frets}) {

  const fret_spacing = 20;
  const nut_margins = 1;

  const w = () => instrument().strings.length*10-10+nut_margins*2;

  const start_fret = () => Math.max(1, fingering() ? fingering().min_fret : 0);

  const end_fret = () => start_fret+no_frets;

  return (
	<svg viewBox={`0 0 ${30+w()+nut_margins*2} ${20+fret_spacing*no_frets}`} class={styles.chord}>
	  <g transform={`translate(15 15)`}>

		<Show when={start_fret() == 1}><line x1={0} y1={0} x2={w()} y2={0} class={styles.nut}/></Show>

		<For each={[...Array(no_frets+1).keys()]}>{i =>
		  <>
			<line x1={nut_margins} x2={w()-nut_margins} y1={fret_spacing*(i)} y2={fret_spacing*(i)} class={styles.fret}/>
			<text class={styles.text} x={-10} y={fret_spacing*(i+0.5)}>{start_fret()+i}</text>
		  </>
		}</For>
		<For each={instrument().strings}>{(n, i) =>
			<line x1={nut_margins+i()*10} x2={nut_margins+i()*10} y1={0} y2={fret_spacing*no_frets} class={styles.string} />
		}</For>

		<Show when={fingering()}>
		  <For each={fingering().fingers}>{f => {
			const x = nut_margins+f.string*10;
			const y = f.mute || f.fret == 0 ? -fret_spacing+fret_spacing/2+4 : (f.fret-start_fret()+1)*fret_spacing-fret_spacing/2 + (f.fret == 0 ? 4 : 0);
			return <>
					 <Show when={f.bar}>
					   <line x1={x} y1={y} y2={y} x2={nut_margins+instrument().strings.length*10-10} class={styles.bar} />
					 </Show>
					 <Show when={!f.mute} fallback={<text class={styles.textx} x={x} y={y}>⨯</text>}>
					   <circle class={styles.finger+' '+styles['n'+(1+f.color)]} cx={x} cy={y} r="5" />
					   <text class={styles.text} x={x} y={y}>{f.label}</text>
					 </Show>
				   </>
		  }}
		  </For>
		</Show>
		</g>
	</svg>
  );
}

export default ChordDiagram;
