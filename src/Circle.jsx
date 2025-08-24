import { createMemo } from "solid-js";

import { CIRCLE_OF_FIFTHS, interval_quality } from './mt';

const COLORS = {
  perfect: '#a71b4b',
  major: '#f9c25c',
  minor: '#00a3b6',
};

function Circle({ scale, mode }) {
  const [ x,y ] = [ Math.sin(30*Math.PI/180), Math.cos(30*Math.PI/180) ];
  const r = 60;
  const r2 = 30;
  const o = 0;
  const text2r = 0.75;

  const outer = createMemo(() => CIRCLE_OF_FIFTHS.map( i => scale().label(i)));

  const inner = createMemo(() => CIRCLE_OF_FIFTHS.map( i => scale().interval_number(i) ));

  const colors = createMemo(() => inner().map( i => i == '' ? 'lightgrey' : COLORS[interval_quality(i)]));

  return (
    <svg width="300" height="300" viewBox="-100 -100 200 200">
      { [...Array(12).keys()].map( i =>
        <g>
          <a href={`/scales/${outer()[i]}/Major`}>
            <path fill={colors()[i]} stroke="white" stroke-width="4" d={`M ${r} 0 H 100 A 100 100 0 0 1 ${100*y} ${100*x} L ${r*y} ${r*x} A 100 100 0 0 0 ${r} 0`} transform={`rotate(${-105+i*30})`}/>
          </a>
        </g>
      )}
      { [...Array(12).keys()].map( i =>
        <path fill={colors()[i]} stroke="white" stroke-width="4" d={`M ${r2} 0 H ${r-o} A ${r-o} ${r-o} 0 0 1 ${(r-o)*y} ${(r-o)*x} L ${r2*y} ${r2*x} A ${r-o} ${r-o} 0 0 0 ${r2} 0`} transform={`rotate(${-105+i*30})`}/>
      )}

      { [...Array(12).keys()].map( i =>
        <text text-decoration={ CIRCLE_OF_FIFTHS[i] == scale().notes[0] ? 'underline' : '' } pointer-events="none" fill="white" dominant-baseline="middle" text-anchor="middle" x={(r+(100-r)/2)*Math.sin(i*30*Math.PI/180)} y={-(r+(100-r)/2)*Math.cos(i*30*Math.PI/180)} >{outer()[i]}</text>
      )}
      { [...Array(12).keys()].map( i =>
        <text font-size="70%" fill="white" dominant-baseline="middle" text-anchor="middle" x={(r*text2r)*Math.sin(i*30*Math.PI/180)} y={1+-(r*text2r)*Math.cos(i*30*Math.PI/180)} >{inner()[i]}</text>
      )}

    </svg>
  );
}

export default Circle;
