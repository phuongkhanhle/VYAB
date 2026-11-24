import React, { useEffect, useRef } from 'react';
import type { Lang, PillarKey } from '../data/vyabData';

/**
 * VYAB Booth Pass — a portrait event badge (1080×1350) drawn on canvas.
 * The same draw routine powers the live preview and the PNG download,
 * so what visitors see is exactly what they save.
 */

export const PASS_W = 1080;
export const PASS_H = 1350;

const C = {
  navy: '#010C44',
  ring: '#072A6A',
  coral: '#EF3E38',
  blue: '#2573BE',
  yellow: '#FFCD0E',
  green: '#23CC83',
};

export const PILLAR_COLORS: Record<PillarKey, string> = {
  engage: C.coral,
  empower: C.blue,
  connect: C.green,
};

const DISPLAY = '"Barlow Condensed", "Source Sans 3", sans-serif';
const BODY = '"Source Sans 3", sans-serif';

export interface PassPersona {
  key: PillarKey;
  code: string;
  title: string;
  desc: string;
}

export interface PassData {
  lang: Lang;
  name: string;
  avatar: HTMLImageElement | null;
  persona: PassPersona | null;
  score: string;
  serial: string;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
      if (lines.length === maxLines) break;
    } else {
      line = test;
    }
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxW && last.length > 1) last = last.slice(0, -1);
    lines[maxLines - 1] = `${last.replace(/[\s,.;:]+$/, '')}…`;
  }
  return lines;
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'VY';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || '';
  return (first + last).toUpperCase();
}

/** Slanted yellow twin bars used as the VYAB kicker motif */
function kickerBars(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = C.yellow;
  const bar = (bx: number, w: number) => {
    ctx.beginPath();
    ctx.moveTo(bx + 6, y);
    ctx.lineTo(bx + w + 6, y);
    ctx.lineTo(bx + w, y + 18);
    ctx.lineTo(bx, y + 18);
    ctx.closePath();
    ctx.fill();
  };
  bar(x, 38);
  bar(x + 46, 14);
}

/** Small pictogram per pillar: speech bubble (Engage), rising arrow (Empower), linked rings (Connect) */
function drawSealGlyph(ctx: CanvasRenderingContext2D, key: PillarKey | null, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = key ? '#FFFFFF' : C.navy;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  if (key === 'engage') {
    roundRect(ctx, x - 26, y - 20, 52, 34, 9);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 12);
    ctx.lineTo(x - 18, y + 24);
    ctx.lineTo(x - 2, y + 12);
    ctx.fill();
    ctx.fillStyle = PILLAR_COLORS.engage;
    [-12, 0, 12].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(x + dx, y - 3, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  } else if (key === 'empower') {
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x, y + 22);
    ctx.lineTo(x, y - 18);
    ctx.moveTo(x - 16, y - 2);
    ctx.lineTo(x, y - 20);
    ctx.lineTo(x + 16, y - 2);
    ctx.stroke();
  } else if (key === 'connect') {
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x - 9, y, 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 9, y, 14, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.textAlign = 'center';
    ctx.font = `900 50px ${DISPLAY}`;
    ctx.fillText('?', x, y + 18);
  }
  ctx.restore();
}

export function drawBoothPass(ctx: CanvasRenderingContext2D, d: PassData) {
  const vi = d.lang === 'vi';
  const accent = d.persona ? PILLAR_COLORS[d.persona.key] : C.yellow;
  ctx.save();
  ctx.clearRect(0, 0, PASS_W, PASS_H);
  ctx.textBaseline = 'alphabetic';

  // Base
  ctx.fillStyle = C.navy;
  ctx.fillRect(0, 0, PASS_W, PASS_H);

  // Concentric rings (top-right) — VYAB template motif
  ctx.strokeStyle = C.ring;
  ctx.lineWidth = 40;
  for (const r of [250, 160]) {
    ctx.beginPath();
    ctx.arc(1010, 150, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Soft halo behind avatar in persona colour
  const halo = ctx.createRadialGradient(540, 560, 60, 540, 560, 340);
  halo.addColorStop(0, `${accent}55`);
  halo.addColorStop(1, `${accent}00`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 200, PASS_W, 760);

  // Twin coral circles (bottom-right)
  ctx.fillStyle = C.coral;
  ctx.beginPath();
  ctx.arc(1005, PASS_H + 10, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(842, PASS_H, 42, 0, Math.PI * 2);
  ctx.fill();

  // Four-colour strip along the top edge
  [C.coral, C.blue, C.yellow, C.green].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect((PASS_W / 4) * i, 0, PASS_W / 4, 18);
  });

  // Lanyard slot
  ctx.fillStyle = 'rgba(255,255,255,0.14)';
  roundRect(ctx, 470, 52, 140, 26, 13);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Wordmark
  ctx.textAlign = 'left';
  ctx.font = `900 104px ${DISPLAY}`;
  let x = 84;
  const letters: [string, string][] = [
    ['V', C.coral],
    ['Y', C.blue],
    ['A', C.yellow],
    ['B', C.green],
  ];
  letters.forEach(([ch, col]) => {
    ctx.fillStyle = col;
    ctx.fillText(ch, x, 206);
    x += ctx.measureText(ch).width + 4;
  });
  ctx.fillStyle = 'rgba(255,255,255,0.86)';
  ctx.font = `600 27px ${BODY}`;
  ctx.fillText('Vietnam Youth Advisory Board', 86, 248);

  // Kicker
  kickerBars(ctx, 86, 286);
  ctx.fillStyle = C.yellow;
  ctx.font = `700 24px ${BODY}`;
  ctx.fillText(vi ? 'THẺ THÀNH VIÊN BOOTH · KHÓA 1' : 'BOOTH MEMBER PASS · COHORT 1', 160, 304);

  // Avatar with four-colour ring
  const ax = 540;
  const ay = 560;
  const ar = 178;
  ctx.lineWidth = 20;
  [C.coral, C.blue, C.yellow, C.green].forEach((c, i) => {
    ctx.strokeStyle = c;
    ctx.beginPath();
    const start = -Math.PI / 2 + (i * Math.PI) / 2 + 0.06;
    ctx.arc(ax, ay, ar + 24, start, start + Math.PI / 2 - 0.12);
    ctx.stroke();
  });
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(ax, ay, ar + 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(ax, ay, ar, 0, Math.PI * 2);
  ctx.clip();
  if (d.avatar && d.avatar.naturalWidth) {
    const img = d.avatar;
    const s = Math.max((ar * 2) / img.naturalWidth, (ar * 2) / img.naturalHeight);
    const w = img.naturalWidth * s;
    const h = img.naturalHeight * s;
    ctx.drawImage(img, ax - w / 2, ay - h / 2, w, h);
  } else {
    const g = ctx.createLinearGradient(ax - ar, ay - ar, ax + ar, ay + ar);
    g.addColorStop(0, C.ring);
    g.addColorStop(1, '#123985');
    ctx.fillStyle = g;
    ctx.fillRect(ax - ar, ay - ar, ar * 2, ar * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = `800 150px ${DISPLAY}`;
    ctx.fillText(initialsOf(d.name), ax, ay + 52);
  }
  ctx.restore();

  // Pillar seal on the avatar
  const sx = ax + 138;
  const sy = ay + 138;
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(sx, sy, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = C.navy;
  ctx.lineWidth = 8;
  ctx.stroke();
  drawSealGlyph(ctx, d.persona?.key ?? null, sx, sy);

  // Name (auto-fit) — everything below is centred
  ctx.textAlign = 'center';
  const name = d.name.trim() || (vi ? 'Tên của bạn' : 'Your Name');
  let size = 104;
  ctx.font = `800 ${size}px ${DISPLAY}`;
  while (ctx.measureText(name.toUpperCase()).width > 900 && size > 56) {
    size -= 4;
    ctx.font = `800 ${size}px ${DISPLAY}`;
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(name.toUpperCase(), 540, 878);

  // Persona pill
  const pillText = d.persona
    ? `${d.persona.code} · ${d.persona.title}`.toUpperCase()
    : vi
      ? 'TRỤ CỘT CỦA BẠN LÀ GÌ?'
      : 'WHICH PILLAR ARE YOU?';
  ctx.font = `700 34px ${DISPLAY}`;
  const pw = Math.min(940, ctx.measureText(pillText).width + 64);
  ctx.fillStyle = d.persona ? accent : 'rgba(255,255,255,0.12)';
  roundRect(ctx, 540 - pw / 2, 910, pw, 60, 30);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(pillText, 540, 952);

  // Description
  ctx.font = `400 28px ${BODY}`;
  ctx.fillStyle = 'rgba(255,255,255,0.84)';
  const desc = d.persona
    ? d.persona.desc
    : vi
      ? 'Hoàn thành 5 câu hỏi để khám phá trụ cột hành động của bạn và mở khóa thẻ kỷ niệm VYAB.'
      : 'Answer 5 quick questions to discover your action pillar and unlock your VYAB pass.';
  wrapLines(ctx, desc, 860, 3).forEach((l, i) => ctx.fillText(l, 540, 1022 + i * 38));

  // Pillar chips
  const chips: [PillarKey, string][] = [
    ['engage', 'ENGAGE'],
    ['empower', 'EMPOWER'],
    ['connect', 'CONNECT'],
  ];
  ctx.font = `800 28px ${DISPLAY}`;
  const chipW = 190;
  const gap = 18;
  const total = chipW * 3 + gap * 2;
  chips.forEach(([k, label], i) => {
    const cx = 540 - total / 2 + i * (chipW + gap);
    const on = d.persona?.key === k;
    ctx.fillStyle = on ? PILLAR_COLORS[k] : 'rgba(255,255,255,0)';
    roundRect(ctx, cx, 1142, chipW, 48, 24);
    ctx.fill();
    ctx.strokeStyle = on ? PILLAR_COLORS[k] : 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = on ? '#FFFFFF' : 'rgba(255,255,255,0.6)';
    ctx.fillText(label, cx + chipW / 2, 1176);
  });

  // Footer
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(84, 1222);
  ctx.lineTo(760, 1222);
  ctx.stroke();

  ctx.textAlign = 'left';
  const foot: [string, string][] = [
    [vi ? 'ĐIỂM THỬ THÁCH' : 'CHALLENGE', d.score],
    [vi ? 'MÃ THẺ' : 'PASS NO.', d.serial],
    [vi ? 'NHIỆM KỲ' : 'COHORT', '2024–2026'],
  ];
  foot.forEach(([label, value], i) => {
    const fx = 84 + i * 236;
    ctx.fillStyle = C.yellow;
    ctx.font = `700 19px ${BODY}`;
    ctx.fillText(label, fx, 1266);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 40px ${DISPLAY}`;
    ctx.fillText(value, fx, 1310);
  });

  ctx.restore();
}

/** Live canvas preview, re-drawn whenever the pass data changes. */
export function BoothPassCanvas({
  data,
  className = '',
  label,
}: {
  data: PassData;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { lang, name, avatar, persona, score, serial } = data;

  useEffect(() => {
    let alive = true;
    const draw = () => {
      const ctx = ref.current?.getContext('2d');
      if (alive && ctx) drawBoothPass(ctx, { lang, name, avatar, persona, score, serial });
    };
    draw();
    // Redraw once web fonts are ready so the condensed display type is used
    document.fonts?.ready.then(draw).catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [lang, name, avatar, persona, score, serial]);

  return (
    <canvas
      ref={ref}
      width={PASS_W}
      height={PASS_H}
      role="img"
      aria-label={label}
      className={className}
    />
  );
}

/** Render the pass off-screen and trigger a PNG download. */
export async function downloadBoothPass(data: PassData, filename: string) {
  try {
    await document.fonts?.ready;
  } catch {
    // fonts not critical
  }
  const canvas = document.createElement('canvas');
  canvas.width = PASS_W;
  canvas.height = PASS_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawBoothPass(ctx, data);
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/** Hook: load a user-picked image file into an HTMLImageElement (kept in-browser only). */
export function useAvatarImage() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);

  const pick = (file: File | undefined | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    const next = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => {
      setImg(el);
      setUrl(next);
    };
    el.onerror = () => URL.revokeObjectURL(next);
    el.src = next;
  };

  const clear = () => {
    setImg(null);
    setUrl(null);
  };

  return { img, url, pick, clear };
}
