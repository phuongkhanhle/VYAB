import React from 'react';
import type { PolicyDomainId } from '../data/policyMapData';

/**
 * Hand-built SVG vignettes for each youth-policy domain, drawn in a Vietnamese
 * folk-illustration style (layered karst hills, rice terraces, swirl clouds,
 * stylised cranes) using the VYAB palette.
 *
 * Every vignette is drawn in a local -60..60 coordinate box so it can be
 * clipped into a circular medallion or a square thumbnail.
 */

export const VY = {
  navy: '#010C44',
  ring: '#072A6A',
  cobalt: '#123985',
  blue: '#2573BE',
  coral: '#EF3E38',
  yellow: '#FFCD0E',
  gold: '#E8A90C',
  green: '#23CC83',
  leaf: '#15B567',
  forest: '#1F7A4D',
  teal: '#2BA79A',
  mint: '#7FD8CC',
  cream: '#FFF7E4',
  sand: '#FBE3B5',
};

/* ---------- Shared motifs ---------- */

export function SwirlCloud({
  x,
  y,
  s = 1,
  fill = '#FFFFFF',
  curl = VY.gold,
}: {
  x: number;
  y: number;
  s?: number;
  fill?: string;
  curl?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-19} y={1} width={38} height={9} rx={4.5} fill={fill} />
      <circle cx={-11} cy={3} r={7} fill={fill} />
      <circle cx={11} cy={4} r={7.5} fill={fill} />
      <circle cx={-4} cy={-4} r={8} fill={fill} />
      <circle cx={6} cy={-5} r={8.5} fill={fill} />
      <path
        d="M-1 -3 a3 3 0 1 1 3 3 a5.5 5.5 0 1 1 -6 -6.5"
        fill="none"
        stroke={curl}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <path
        d="M-16 7 q4 -3 8 0 M8 8 q4 -3 8 0"
        fill="none"
        stroke={curl}
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.8}
      />
    </g>
  );
}

export function FolkCrane({
  x,
  y,
  s = 1,
  body = '#FFFFFF',
  wingA = VY.gold,
  wingB = VY.coral,
  flip = false,
  outline = VY.navy,
}: {
  x: number;
  y: number;
  s?: number;
  body?: string;
  wingA?: string;
  wingB?: string;
  flip?: boolean;
  outline?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-2 -1 L-13 -15 L-7 -16 L4 -2 Z" fill={wingB} />
      <path d="M-4 -1 L-10 -10 M-6 -2 L-9 -7" stroke={body} strokeWidth={0.8} />
      <path d="M6 -1 Q10 -4 12 -5" stroke={outline} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={0} rx={8} ry={2.6} fill={body} stroke={outline} strokeWidth={0.8} />
      <path d="M6 -1 Q10 -4 12 -5" stroke={body} strokeWidth={1.4} fill="none" strokeLinecap="round" />
      <circle cx={12.4} cy={-5.2} r={1.8} fill={body} stroke={outline} strokeWidth={0.7} />
      <path d="M13.8 -5.4 L19 -4.6" stroke={VY.gold} strokeWidth={1} strokeLinecap="round" />
      <circle cx={12.2} cy={-6.2} r={0.9} fill={VY.coral} />
      <path d="M1 -1 L9 -17 L14 -15 L6 0 Z" fill={wingA} />
      <path d="M4 -3 L10 -14 M6 -2 L11 -11" stroke={outline} strokeWidth={0.6} opacity={0.5} />
      <path d="M-7 0 L-15 5 L-13 1 L-16 -2 Z" fill={wingB} />
    </g>
  );
}

function WaveLines({ from, to, step = 8, stroke }: { from: number; to: number; step?: number; stroke: string }) {
  const rows: number[] = [];
  for (let y = from; y <= to; y += step) rows.push(y);
  return (
    <g fill="none" stroke={stroke} strokeWidth={0.9} strokeLinecap="round">
      {rows.map((y, i) => (
        <path
          key={y}
          d={`M-64 ${y} Q-52 ${y - 3} -40 ${y} T-16 ${y} T8 ${y} T32 ${y} T56 ${y} T80 ${y}`}
          transform={`translate(${i % 2 ? 6 : 0} 0)`}
        />
      ))}
    </g>
  );
}

function Sky({ id, top, bottom }: { id: string; top: string; bottom: string }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="1" stopColor={bottom} />
        </linearGradient>
      </defs>
      <rect x={-64} y={-64} width={128} height={128} fill={`url(#${id})`} />
    </>
  );
}

function Petal({ rotate, cx, cy, fill, scale = 1 }: { rotate: number; cx: number; cy: number; fill: string; scale?: number }) {
  return (
    <path
      d="M0 0 C-6 -8 -6 -18 0 -26 C6 -18 6 -8 0 0 Z"
      fill={fill}
      transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}
    />
  );
}

function Berries({ points }: { points: [number, number][] }) {
  return (
    <g>
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={2.3} fill={VY.coral} />
          <circle cx={x + 3.2} cy={y + 1.4} r={2} fill="#C2321F" />
          <circle cx={x + 0.8} cy={y + 3.6} r={1.9} fill="#F06A3A" />
        </g>
      ))}
    </g>
  );
}

/* ---------- Domain vignettes ---------- */

function GreenClimate({ p }: { p: string }) {
  const terraces = [0, 1, 2, 3, 4];
  return (
    <g>
      <Sky id={`${p}-sky`} top="#FFF4D6" bottom="#FFDD94" />
      <WaveLines from={-54} to={-14} stroke="#F4CF7E" />
      <circle cx={24} cy={-32} r={15} fill="none" stroke={VY.gold} strokeWidth={1} strokeDasharray="1.5 3" />
      <circle cx={24} cy={-32} r={10.5} fill={VY.coral} />
      <path
        d="M-64 14 C-56 -6 -52 -30 -44 -34 C-36 -38 -36 -12 -30 -10 C-26 -28 -18 -50 -8 -48 C2 -46 0 -16 8 -12 C14 -26 22 -34 30 -30 C38 -26 40 -8 46 -4 C50 -14 56 -18 64 -16 L64 64 L-64 64 Z"
        fill={VY.teal}
      />
      <path d="M-8 -48 C-14 -36 -14 -22 -12 -10 L-7 -12 C-9 -24 -7 -38 -8 -48 Z" fill={VY.mint} opacity={0.75} />
      <path d="M-44 -34 C-49 -22 -48 -12 -46 -2 L-42 -4 C-44 -14 -43 -24 -44 -34 Z" fill={VY.mint} opacity={0.7} />
      <SwirlCloud x={-24} y={-12} s={0.85} />
      <path d="M-64 8 Q-28 -4 4 8 T64 6 L64 64 L-64 64 Z" fill={VY.green} />
      <g fill="none" stroke="#11A05F" strokeWidth={1.3}>
        {terraces.map((k) => (
          <path key={k} d={`M-64 ${15 + 7 * k} Q-28 ${3 + 7 * k} 4 ${15 + 7 * k} T64 ${13 + 7 * k}`} />
        ))}
      </g>
      <path d="M-64 38 Q-20 24 24 36 T64 32 L64 64 L-64 64 Z" fill="#A6D84E" />
      <g fill="none" stroke="#86BC35" strokeWidth={1.2}>
        <path d="M-64 46 Q-20 32 24 44 T64 40" />
        <path d="M-64 54 Q-20 40 24 52 T64 48" />
      </g>
      {/* wind turbine */}
      <line x1={36} y1={26} x2={36} y2={-6} stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" />
      {[0, 120, 240].map((r) => (
        <path
          key={r}
          d="M36 -6 C38 -14 38 -20 36.5 -25 C35 -20 34.5 -14 36 -6 Z"
          fill="#FFFFFF"
          transform={`rotate(${r} 36 -6)`}
        />
      ))}
      <circle cx={36} cy={-6} r={2} fill={VY.gold} />
      <FolkCrane x={-8} y={-46} s={0.72} />
    </g>
  );
}

function DigitalAi({ p }: { p: string }) {
  const star = 'M0 -5 L1.3 -1.3 L5 0 L1.3 1.3 L0 5 L-1.3 1.3 L-5 0 L-1.3 -1.3 Z';
  return (
    <g>
      <Sky id={`${p}-sky`} top="#EAF3FF" bottom="#B9D5F4" />
      <WaveLines from={-54} to={0} stroke="#A9C8EE" />
      <SwirlCloud x={0} y={-12} s={1.7} curl={VY.blue} />
      <path d="M-64 18 Q-30 0 0 14 T64 8 L64 64 L-64 64 Z" fill={VY.blue} />
      <path d="M-64 36 Q-16 22 30 34 T64 30 L64 64 L-64 64 Z" fill={VY.ring} />
      <g fill="none" stroke="#8FC1F2" strokeWidth={1.3} strokeLinecap="round">
        <path d="M-48 30 L-48 22 L-36 16" />
        <path d="M-22 32 L-22 22 L-12 16" />
        <path d="M20 26 L20 18 L32 12" />
        <path d="M42 30 L50 22" />
      </g>
      <g fill="none" stroke="#5F8FD6" strokeWidth={1.3} strokeLinecap="round">
        <path d="M-42 52 L-30 44 L-12 44" />
        <path d="M8 54 L20 46 L40 46" />
      </g>
      <g fill={VY.yellow}>
        <circle cx={-36} cy={16} r={2.2} />
        <circle cx={-12} cy={16} r={2.2} />
        <circle cx={32} cy={12} r={2.2} />
        <circle cx={-12} cy={44} r={2.2} />
        <circle cx={40} cy={46} r={2.2} />
      </g>
      {/* shield + lock */}
      <path
        d="M0 -40 L19 -33 L19 -16 C19 -3 10 5 0 10 C-10 5 -19 -3 -19 -16 L-19 -33 Z"
        fill={VY.navy}
        stroke={VY.yellow}
        strokeWidth={2}
      />
      <path d="M0 -35 L14 -30 L14 -16 C14 -7 7 -1 0 3 Z" fill={VY.cobalt} />
      <path d="M-4.5 -20 V-24 a4.5 4.5 0 0 1 9 0 V-20" stroke={VY.yellow} strokeWidth={2.2} fill="none" />
      <rect x={-7} y={-20} width={14} height={11} rx={2} fill={VY.yellow} />
      <circle cx={0} cy={-15.5} r={1.7} fill={VY.navy} />
      <path d={star} fill={VY.yellow} transform="translate(28 -40)" />
      <path d={star} fill="#FFFFFF" transform="translate(-30 -32) scale(0.8)" />
      <path d={star} fill={VY.coral} transform="translate(-40 -46) scale(0.6)" />
      <FolkCrane x={30} y={-18} s={0.75} wingA={VY.yellow} wingB={VY.blue} />
    </g>
  );
}

function GreenJobs({ p }: { p: string }) {
  return (
    <g>
      <Sky id={`${p}-sky`} top="#FFF3CF" bottom="#FFCB61" />
      <WaveLines from={-54} to={-16} stroke="#F7D27A" />
      <circle cx={-28} cy={-30} r={13} fill={VY.coral} />
      <SwirlCloud x={-6} y={-34} s={0.8} fill="#FFF3CF" />
      <SwirlCloud x={34} y={-42} s={0.7} fill="#FFF3CF" />
      <path d="M-64 -2 Q-30 -14 0 -4 T64 -8 L64 64 L-64 64 Z" fill="#7FC36B" />
      {/* greenhouses */}
      <path d="M26 4 L26 -2 Q26 -9 34 -9 L56 -9 Q64 -9 64 -2 L64 4 Z" fill="#43B9A9" />
      <path d="M-8 6 L-8 -6 Q-8 -17 6 -17 L30 -17 Q44 -17 44 -6 L44 6 Z" fill={VY.teal} />
      <g stroke={VY.mint} strokeWidth={1}>
        {[0, 8, 16, 24, 32].map((x) => (
          <line key={x} x1={x} y1={-16} x2={x} y2={6} />
        ))}
        <path d="M-8 -6 H44" />
      </g>
      <rect x={-10} y={6} width={56} height={3} fill="#B5621E" />
      <path d="M-64 10 Q0 2 64 12 L64 64 L-64 64 Z" fill="#C8DC5A" />
      <g fill="none" stroke="#A3BE3B" strokeWidth={1.1}>
        {[0, 1, 2, 3].map((k) => (
          <path key={k} d={`M-64 ${17 + k * 6} Q0 ${9 + k * 6} 64 ${19 + k * 6}`} />
        ))}
      </g>
      {/* coffee bushes */}
      <g fill={VY.forest}>
        <circle cx={-44} cy={46} r={16} />
        <circle cx={-18} cy={50} r={14} />
        <circle cx={8} cy={47} r={16} />
        <circle cx={34} cy={50} r={15} />
        <circle cx={58} cy={46} r={12} />
      </g>
      <g fill="#2E9B5F">
        <ellipse cx={-48} cy={38} rx={6} ry={2.4} transform="rotate(-25 -48 38)" />
        <ellipse cx={-20} cy={42} rx={6} ry={2.4} transform="rotate(20 -20 42)" />
        <ellipse cx={6} cy={38} rx={6} ry={2.4} transform="rotate(-20 6 38)" />
        <ellipse cx={34} cy={42} rx={6} ry={2.4} transform="rotate(25 34 42)" />
        <ellipse cx={56} cy={38} rx={5} ry={2.2} transform="rotate(-25 56 38)" />
      </g>
      <Berries
        points={[
          [-40, 44],
          [-28, 52],
          [-14, 46],
          [0, 52],
          [14, 44],
          [26, 52],
          [42, 46],
          [52, 54],
        ]}
      />
    </g>
  );
}

function EducationMobility({ p }: { p: string }) {
  return (
    <g>
      <Sky id={`${p}-sky`} top="#EEF1FF" bottom="#C6D1FA" />
      <WaveLines from={-54} to={-6} stroke="#B4C2F2" />
      {/* globe */}
      <circle cx={26} cy={-32} r={14} fill={VY.blue} stroke={VY.yellow} strokeWidth={1.8} />
      <ellipse cx={26} cy={-32} rx={6} ry={14} fill="none" stroke={VY.yellow} strokeWidth={1.2} />
      <path d="M12 -32 H40 M14 -39 H38 M14 -25 H38" stroke={VY.yellow} strokeWidth={1} />
      <path d="M20 -38 q4 -2 6 2 q-2 4 -6 2 Z M28 -28 q5 0 6 4 q-4 2 -7 0 Z" fill={VY.green} />
      <path d="M-4 -2 C-8 -20 2 -34 10 -30" fill="none" stroke={VY.coral} strokeWidth={1.4} strokeDasharray="2.5 3" />
      <FolkCrane x={-34} y={-34} s={0.72} />
      <FolkCrane x={-14} y={-46} s={0.55} wingA={VY.yellow} wingB={VY.blue} />
      {/* distant hills */}
      <path d="M-64 14 C-50 0 -40 -4 -30 4 C-22 -8 -12 -10 -4 0 C6 -6 18 -6 28 4 C40 -6 54 -4 64 4 L64 64 L-64 64 Z" fill={VY.teal} />
      <path d="M-64 20 Q-30 10 0 18 T64 16 L64 64 L-64 64 Z" fill={VY.green} />
      {/* open book */}
      <path
        d="M-52 26 L-52 56 C-32 50 -14 50 0 58 C14 50 32 50 52 56 L52 26 Z"
        fill={VY.ring}
      />
      <path d="M0 24 C-14 16 -32 16 -47 22 L-47 52 C-32 46 -14 46 0 54 Z" fill="#FFFFFF" />
      <path d="M0 24 C14 16 32 16 47 22 L47 52 C32 46 14 46 0 54 Z" fill="#FFF7E4" />
      <g fill="none" stroke="#C6D1FA" strokeWidth={1}>
        {[0, 6, 12, 18].map((k) => (
          <React.Fragment key={k}>
            <path d={`M-40 ${28 + k} C-28 ${24 + k} -14 ${24 + k} -6 ${29 + k}`} />
            <path d={`M40 ${28 + k} C28 ${24 + k} 14 ${24 + k} 6 ${29 + k}`} />
          </React.Fragment>
        ))}
      </g>
      <line x1={0} y1={24} x2={0} y2={54} stroke={VY.ring} strokeWidth={1.2} />
      {/* graduation cap rising from the book */}
      <g transform="translate(-2 6)">
        <path d="M-9 2 L-9 8 Q0 13 9 8 L9 2 Z" fill={VY.ring} />
        <path d="M0 -6 L18 0 L0 6 L-18 0 Z" fill={VY.navy} stroke={VY.yellow} strokeWidth={1} />
        <path d="M0 0 L13 3 L13 11" stroke={VY.yellow} strokeWidth={1.2} fill="none" />
        <circle cx={13} cy={12} r={1.8} fill={VY.yellow} />
      </g>
    </g>
  );
}

function HealthWellbeing({ p }: { p: string }) {
  return (
    <g>
      <Sky id={`${p}-sky`} top="#FFF0E8" bottom="#FFC6B0" />
      <WaveLines from={-54} to={0} stroke="#F9B9A0" />
      <SwirlCloud x={-36} y={-24} s={0.9} curl={VY.coral} />
      <SwirlCloud x={38} y={-14} s={0.75} curl={VY.coral} />
      <circle cx={0} cy={-27} r={21} fill="none" stroke={VY.gold} strokeWidth={1.2} strokeDasharray="1.5 3.5" />
      <path
        d="M0 -32 C-4 -40 -16 -40 -16 -30 C-16 -22 -6 -16 0 -10 C6 -16 16 -22 16 -30 C16 -40 4 -40 0 -32 Z"
        fill={VY.coral}
      />
      <rect x={-1.9} y={-33} width={3.8} height={12} rx={1} fill="#FFFFFF" />
      <rect x={-6} y={-28.9} width={12} height={3.8} rx={1} fill="#FFFFFF" />
      {/* water */}
      <rect x={-64} y={18} width={128} height={46} fill="#8FDACD" />
      <g fill="none" stroke="#FFFFFF" strokeWidth={1} opacity={0.8}>
        <path d="M-60 30 q6 -3 12 0 t12 0 M20 28 q6 -3 12 0 t12 0" />
        <path d="M-40 44 q6 -3 12 0 t12 0 M14 50 q6 -3 12 0 t12 0" />
      </g>
      {/* lotus pads + stem */}
      <ellipse cx={-36} cy={32} rx={16} ry={4.5} fill="#2E9B5F" />
      <ellipse cx={38} cy={38} rx={13} ry={3.8} fill="#2E9B5F" />
      <path d="M-36 32 L-36 28" stroke={VY.forest} strokeWidth={1} />
      <path d="M44 34 C44 20 48 12 52 6" stroke={VY.forest} strokeWidth={1.6} fill="none" />
      <ellipse cx={52} cy={4} rx={7} ry={4} fill="#F7A1A0" transform="rotate(-25 52 4)" />
      {/* lotus flower */}
      {[-56, -28, 0, 28, 56].map((r) => (
        <Petal key={r} rotate={r} cx={0} cy={28} fill="#F7A1A0" />
      ))}
      {[-34, 0, 34].map((r) => (
        <Petal key={r} rotate={r} cx={0} cy={28} fill={VY.coral} scale={0.8} />
      ))}
      <ellipse cx={0} cy={26} rx={5} ry={2.6} fill={VY.yellow} />
      <path d="M-14 30 Q0 36 14 30" stroke="#C2321F" strokeWidth={0.8} fill="none" />
    </g>
  );
}

function YouthGovernance({ p }: { p: string }) {
  const bubbles: { x: number; y: number; c: string }[] = [
    { x: -36, y: -40, c: VY.coral },
    { x: -12, y: -48, c: VY.blue },
    { x: 12, y: -42, c: VY.yellow },
    { x: 34, y: -34, c: VY.green },
  ];
  return (
    <g>
      <Sky id={`${p}-sky`} top="#E6F7F3" bottom="#B4E4DA" />
      <WaveLines from={-54} to={-6} stroke="#9FD8CB" />
      {/* VYAB speech bubbles */}
      {bubbles.map((b) => (
        <g key={b.x} transform={`translate(${b.x} ${b.y})`}>
          <rect x={-9} y={-6} width={18} height={12} rx={3} fill={b.c} />
          <path d="M-3 6 L-6 10 L1 6 Z" fill={b.c} />
          <circle cx={-4} cy={0} r={1.3} fill="#FFFFFF" />
          <circle cx={0} cy={0} r={1.3} fill="#FFFFFF" />
          <circle cx={4} cy={0} r={1.3} fill="#FFFFFF" />
        </g>
      ))}
      <path d="M-64 24 Q-20 12 20 22 T64 18 L64 64 L-64 64 Z" fill={VY.green} />
      {/* trees */}
      <rect x={-52} y={12} width={2.4} height={14} fill="#8E4A16" />
      <circle cx={-51} cy={10} r={9} fill={VY.forest} />
      <circle cx={-47} cy={6} r={5} fill="#2E9B5F" />
      <rect x={50} y={12} width={2.4} height={14} fill="#8E4A16" />
      <circle cx={51} cy={10} r={9} fill={VY.forest} />
      <circle cx={47} cy={6} r={5} fill="#2E9B5F" />
      {/* communal house (đình) */}
      <rect x={-44} y={36} width={88} height={6} fill="#8E4A16" />
      <rect x={-40} y={30} width={80} height={7} fill="#B5621E" />
      <rect x={-34} y={6} width={68} height={24} fill={VY.sand} />
      <rect x={-6} y={13} width={12} height={17} fill={VY.ring} />
      <g fill={VY.coral}>
        {[-30, -18, 13, 25].map((x) => (
          <rect key={x} x={x} y={6} width={5} height={24} />
        ))}
      </g>
      <path
        d="M-52 8 Q-44 6 -36 -6 L36 -6 Q44 6 52 8 Q55 2 50 1 Q46 4 40 -9 L-40 -9 Q-46 4 -50 1 Q-55 2 -52 8 Z"
        fill={VY.navy}
      />
      <path
        d="M-36 -8 Q-30 -12 -24 -22 L24 -22 Q30 -12 36 -8 Q38 -14 34 -14 Q30 -14 26 -24 L-26 -24 Q-30 -14 -34 -14 Q-38 -14 -36 -8 Z"
        fill={VY.ring}
      />
      <rect x={-28} y={-27} width={56} height={3.4} rx={1.5} fill={VY.yellow} />
      <path d="M-28 -25.5 q-5 -1 -5 -5 q0 -3 3 -3" stroke={VY.yellow} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <path d="M28 -25.5 q5 -1 5 -5 q0 -3 -3 -3" stroke={VY.yellow} strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <circle cx={0} cy={-30} r={2.6} fill={VY.coral} />
      <path d="M-52 8 L52 8" stroke={VY.gold} strokeWidth={0.8} opacity={0.6} />
      {/* youth figures */}
      {[
        { x: -18, c: VY.coral },
        { x: -6, c: VY.blue },
        { x: 6, c: VY.yellow },
        { x: 18, c: VY.green },
      ].map((f) => (
        <g key={f.x} transform={`translate(${f.x} 52)`}>
          <circle cx={0} cy={-6} r={2.6} fill={VY.navy} />
          <path d="M-4 4 Q-4 -3 0 -3 Q4 -3 4 4 Z" fill={f.c} />
        </g>
      ))}
    </g>
  );
}

const VIGNETTES: Record<PolicyDomainId, (props: { p: string }) => React.ReactElement> = {
  'green-climate': GreenClimate,
  'digital-ai': DigitalAi,
  'green-jobs': GreenJobs,
  'education-mobility': EducationMobility,
  'health-wellbeing': HealthWellbeing,
  'youth-governance': YouthGovernance,
};

/** Raw vignette group in the -60..60 box (use inside your own <svg>). */
export function DomainVignette({ id, prefix }: { id: PolicyDomainId; prefix: string }) {
  const Comp = VIGNETTES[id];
  return <Comp p={`${prefix}-${id}`} />;
}

/** Stand-alone circular illustrated badge, e.g. for survey choice cards. */
export function DomainBadge({
  id,
  color,
  className = '',
}: {
  id: PolicyDomainId;
  color: string;
  className?: string;
}) {
  const uid = React.useId().replace(/:/g, '');
  return (
    <svg viewBox="-64 -64 128 128" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${uid}-clip`}>
          <circle r={58} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${uid}-clip)`}>
        <DomainVignette id={id} prefix={uid} />
      </g>
      <circle r={58} fill="none" stroke={color} strokeWidth={6} />
    </svg>
  );
}
