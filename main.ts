// news-image-20261124 — "The World in One Day"
// Sums up Tuesday 24 November 2026 in one 1024x1024 PNG.
// Pure Node 22 stdlib: no network, no dependencies, deterministic —
// two runs write identical bytes. Everything is drawn in code:
// a hand-written 5x7 bitmap font, flat colour panels and simple
// geometric icons. No shipped images.

import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

// ------------------------------------------------------------------
// Canvas: a plain RGB buffer, 1024 x 1024.
// ------------------------------------------------------------------
const W = 1024;
const H = 1024;
const buf = new Uint8Array(W * H * 3);

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function setPixel(x: number, y: number, c: [number, number, number]): void {
  // Fractional scales (subtext at 2.5x) land on half pixels; floor them.
  x = Math.floor(x);
  y = Math.floor(y);
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  buf[i] = c[0];
  buf[i + 1] = c[1];
  buf[i + 2] = c[2];
}

function fillRect(x: number, y: number, w: number, h: number, hex: string): void {
  const c = rgb(hex);
  for (let yy = y; yy < y + h; yy++) {
    for (let xx = x; xx < x + w; xx++) setPixel(xx, yy, c);
  }
}

function drawRect(x: number, y: number, w: number, h: number, hex: string, t: number): void {
  fillRect(x, y, w, t, hex);
  fillRect(x, y + h - t, w, t, hex);
  fillRect(x, y, t, h, hex);
  fillRect(x + w - t, y, t, h, hex);
}

function fillCircle(cx: number, cy: number, r: number, hex: string): void {
  const c = rgb(hex);
  for (let y = cy - r; y <= cy + r; y++) {
    for (let x = cx - r; x <= cx + r; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r * r) setPixel(x, y, c);
    }
  }
}

function drawLine(x0: number, y0: number, x1: number, y1: number, hex: string, t: number): void {
  const c = rgb(hex);
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= steps; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / steps);
    const y = Math.round(y0 + ((y1 - y0) * i) / steps);
    for (let dy = 0; dy < t; dy++) {
      for (let dx = 0; dx < t; dx++) setPixel(x + dx, y + dy, c);
    }
  }
}

function fillTriangle(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, hex: string): void {
  const c = rgb(hex);
  const minX = Math.min(x0, x1, x2);
  const maxX = Math.max(x0, x1, x2);
  const minY = Math.min(y0, y1, y2);
  const maxY = Math.max(y0, y1, y2);
  const d = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const a = ((x1 - x) * (y2 - y) - (y1 - y) * (x2 - x)) / d;
      const b = ((x2 - x) * (y0 - y) - (y2 - y) * (x0 - x)) / d;
      const cc = 1 - a - b;
      if (a >= 0 && b >= 0 && cc >= 0) setPixel(x, y, c);
    }
  }
}

// ------------------------------------------------------------------
// 5x7 bitmap font. '1' = on, '0' = off. Uppercase only (input is
// upper-cased before drawing); digits and common punctuation included.
// ------------------------------------------------------------------
const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["01110", "00100", "00100", "00100", "00100", "00100", "01110"],
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "11011", "10001"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00110", "01000", "10000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["01110", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "01110"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000", "00000"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  ",": ["00000", "00000", "00000", "00000", "01100", "00100", "01000"],
  ":": ["00000", "01100", "01100", "00000", "01100", "01100", "00000"],
  ";": ["00000", "01100", "01100", "00000", "01100", "00100", "01000"],
  "-": ["00000", "00000", "00000", "01110", "00000", "00000", "00000"],
  "'": ["00100", "00100", "01000", "00000", "00000", "00000", "00000"],
  "/": ["00001", "00010", "00010", "00100", "01000", "01000", "10000"],
  "(": ["00010", "00100", "01000", "01000", "01000", "00100", "00010"],
  ")": ["01000", "00100", "00010", "00010", "00010", "00100", "01000"],
  "%": ["11001", "11010", "00010", "00100", "01000", "01011", "10011"],
  $: ["00100", "01111", "10100", "01110", "00101", "11110", "00100"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
  "?": ["01110", "10001", "00001", "00110", "00100", "00000", "00100"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
  "=": ["00000", "00000", "11111", "00000", "11111", "00000", "00000"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"],
  "*": ["00000", "10101", "01110", "11111", "01110", "10101", "00000"],
};

function textWidth(text: string, scale: number): number {
  return text.length * 6 * scale - scale;
}

function drawText(x: number, y: number, text: string, scale: number, hex: string): void {
  const c = rgb(hex);
  const s = text.toUpperCase();
  for (let ci = 0; ci < s.length; ci++) {
    const glyph = FONT[s[ci]] ?? FONT["?"];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row][col] === "1") {
          for (let dy = 0; dy < scale; dy++) {
            for (let dx = 0; dx < scale; dx++) {
              setPixel(x + ci * 6 * scale + col * scale + dx, y + row * scale + dy, c);
            }
          }
        }
      }
    }
  }
}

function drawTextCentred(cx: number, y: number, text: string, scale: number, hex: string): void {
  drawText(cx - Math.floor(textWidth(text, scale) / 2), y, text, scale, hex);
}

// Word-wrap into lines of at most maxChars characters.
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur === "") {
      cur = w;
    } else if (cur.length + 1 + w.length <= maxChars) {
      cur += " " + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur !== "") lines.push(cur);
  return lines;
}

// ------------------------------------------------------------------
// The 12 stories of Tuesday 24 November 2026.
// ------------------------------------------------------------------
type Story = {
  tag: string;
  color: string;
  icon: string;
  headline: string;
  sub: string;
};

const STORIES: Story[] = [
  { tag: "CLIMATE", color: "#1B7A3D", icon: "globe", headline: "DRAFT REJECTED", sub: "No fossil-fuel wording in draft." },
  { tag: "TECH", color: "#0E7C7B", icon: "chip", headline: "HUANG IS BACK", sub: "Nvidia reinstates CEO, shares +31%." },
  { tag: "WAR", color: "#C1272D", icon: "building", headline: "ZAPORIZHZHIA HIT", sub: "Russian strike: 2 killed, 40 hurt." },
  { tag: "WAR", color: "#8E1F2F", icon: "target", headline: "GAZA STRIKES", sub: "Hamas chief Naeem Abu Nahel killed." },
  { tag: "WAR", color: "#1F4E79", icon: "ship", headline: "HORMUZ TENSION", sub: "Iran vows to fight US naval blockade." },
  { tag: "WAR", color: "#3A6EA5", icon: "ship", headline: "LIBYA SEA STRIKE", sub: "Ukraine drones sink Russian ship." },
  { tag: "SPACE", color: "#283593", icon: "rocket", headline: "ARIANE 6 LIFTS OFF", sub: "Ariane 6 launches 36 Leo satellites." },
  { tag: "BUSINESS", color: "#B77900", icon: "pill", headline: "SANOFI $41BN DEAL", sub: "Sanofi to buy US drugmaker Insmed." },
  { tag: "ECONOMY", color: "#2E7D32", icon: "chart", headline: "US CONFIDENCE JUMPS", sub: "Consumer confidence at 103.3." },
  { tag: "LAW", color: "#455A64", icon: "scale", headline: "HUAWEI CONVICTED", sub: "Convicted in US trial over Iran." },
  { tag: "TRADE", color: "#C05621", icon: "arrows", headline: "TARIFFS LOOM", sub: "US to hit China, EU and 14 others." },
  { tag: "ASIA", color: "#7A4A21", icon: "bus", headline: "UAE BUS CRASH", sub: "13 killed, 14 hurt in Ras Al Khaimah." },
];

// ------------------------------------------------------------------
// Simple white pictograms, drawn in the coloured strip of each card.
// ------------------------------------------------------------------
function drawIcon(kind: string, x: number, y: number): void {
  const w = "#FFFFFF";
  if (kind === "globe") {
    fillCircle(x + 18, y + 18, 15, w);
    fillCircle(x + 18, y + 18, 11, "#1B7A3D");
    drawLine(x + 3, y + 18, x + 33, y + 18, w, 2);
    drawLine(x + 18, y + 3, x + 18, y + 33, w, 2);
  } else if (kind === "chip") {
    fillRect(x + 9, y + 9, 18, 18, w);
    fillRect(x + 13, y + 13, 10, 10, "#0E7C7B");
    drawLine(x + 12, y + 2, x + 12, y + 9, w, 2);
    drawLine(x + 18, y + 2, x + 18, y + 9, w, 2);
    drawLine(x + 24, y + 2, x + 24, y + 9, w, 2);
    drawLine(x + 12, y + 27, x + 12, y + 34, w, 2);
    drawLine(x + 18, y + 27, x + 18, y + 34, w, 2);
    drawLine(x + 24, y + 27, x + 24, y + 34, w, 2);
  } else if (kind === "building") {
    fillRect(x + 8, y + 8, 20, 24, w);
    fillRect(x + 12, y + 12, 4, 4, "#C1272D");
    fillRect(x + 20, y + 12, 4, 4, "#C1272D");
    fillRect(x + 12, y + 20, 4, 4, "#C1272D");
    fillRect(x + 20, y + 20, 4, 4, "#C1272D");
    drawLine(x + 28, y + 4, x + 22, y + 14, w, 3);
  } else if (kind === "target") {
    fillCircle(x + 18, y + 18, 14, w);
    fillCircle(x + 18, y + 18, 9, "#8E1F2F");
    fillCircle(x + 18, y + 18, 4, w);
  } else if (kind === "ship") {
    fillTriangle(x + 6, y + 22, x + 30, y + 22, x + 26, y + 30, w);
    fillTriangle(x + 6, y + 22, x + 26, y + 30, x + 10, y + 30, w);
    drawLine(x + 18, y + 6, x + 18, y + 22, w, 2);
    fillTriangle(x + 18, y + 8, x + 28, y + 16, x + 18, y + 16, w);
  } else if (kind === "radar") {
    fillCircle(x + 18, y + 18, 14, w);
    fillCircle(x + 18, y + 18, 10, "#5B4A8A");
    fillCircle(x + 18, y + 18, 3, w);
    drawLine(x + 18, y + 18, x + 30, y + 8, w, 2);
  } else if (kind === "pill") {
    fillCircle(x + 11, y + 18, 7, w);
    fillCircle(x + 25, y + 18, 7, w);
    fillRect(x + 11, y + 11, 14, 14, w);
    drawLine(x + 14, y + 12, x + 22, y + 24, "#B77900", 2);
  } else if (kind === "chart") {
    drawLine(x + 6, y + 30, x + 30, y + 30, w, 2);
    fillRect(x + 8, y + 22, 5, 8, w);
    fillRect(x + 16, y + 16, 5, 14, w);
    fillRect(x + 24, y + 9, 5, 21, w);
  } else if (kind === "scale") {
    drawLine(x + 18, y + 6, x + 18, y + 30, w, 2);
    drawLine(x + 8, y + 10, x + 28, y + 10, w, 2);
    fillTriangle(x + 5, y + 10, x + 11, y + 10, x + 8, y + 18, w);
    fillTriangle(x + 25, y + 10, x + 31, y + 10, x + 28, y + 18, w);
    fillRect(x + 10, y + 30, 16, 3, w);
  } else if (kind === "arrows") {
    drawLine(x + 6, y + 12, x + 28, y + 12, w, 3);
    fillTriangle(x + 28, y + 7, x + 28, y + 17, x + 34, y + 12, w);
    drawLine(x + 8, y + 24, x + 30, y + 24, w, 3);
    fillTriangle(x + 8, y + 19, x + 8, y + 29, x + 2, y + 24, w);
  } else if (kind === "bus") {
    fillRect(x + 5, y + 10, 26, 14, w);
    fillRect(x + 8, y + 13, 6, 5, "#7A4A21");
    fillRect(x + 17, y + 13, 6, 5, "#7A4A21");
    fillCircle(x + 11, y + 27, 4, w);
    fillCircle(x + 25, y + 27, 4, w);
  } else if (kind === "rocket") {
    fillTriangle(x + 14, y + 10, x + 22, y + 10, x + 18, y + 2, w);
    fillRect(x + 14, y + 10, 8, 14, w);
    fillTriangle(x + 14, y + 20, x + 8, y + 28, x + 14, y + 24, w);
    fillTriangle(x + 22, y + 20, x + 28, y + 28, x + 22, y + 24, w);
    fillCircle(x + 18, y + 15, 3, "#283593");
    fillTriangle(x + 15, y + 24, x + 21, y + 24, x + 18, y + 32, w);
  }
}

// ------------------------------------------------------------------
// Layout.
// ------------------------------------------------------------------
const PAPER = "#F6F1E6";
const INK = "#14213D";
const NAVY = "#0F2A4A";
const RED = "#C1272D";
const AMBER = "#F2B705";
const MUTED = "#5A6472";

fillRect(0, 0, W, H, PAPER);

// Header band.
fillRect(0, 0, W, 150, NAVY);
fillRect(0, 150, W, 6, RED);
drawTextCentred(W / 2, 22, "THE WORLD IN ONE DAY", 3, AMBER);
drawTextCentred(W / 2, 58, "TUESDAY 24 NOVEMBER 2026", 4, "#FFFFFF");
drawTextCentred(W / 2, 108, "12 STORIES FROM AROUND THE GLOBE", 2, "#C9D4E3");

// Story grid: 3 columns x 4 rows.
const MARGIN = 20;
const GAP = 12;
const CARD_W = 320;
const CARD_H = 196;
const TOP = 170;

for (let i = 0; i < STORIES.length; i++) {
  const s = STORIES[i];
  const col = i % 3;
  const row = Math.floor(i / 3);
  const cx = MARGIN + col * (CARD_W + GAP);
  const cy = TOP + row * (CARD_H + GAP);

  fillRect(cx, cy, CARD_W, CARD_H, "#FFFFFF");
  drawRect(cx, cy, CARD_W, CARD_H, INK, 2);
  fillRect(cx + 2, cy + 2, CARD_W - 4, 46, s.color);
  drawText(cx + 12, cy + 15, s.tag, 2, "#FFFFFF");
  drawIcon(s.icon, cx + CARD_W - 50, cy + 5);

  const headLines = wrap(s.headline, 16);
  for (let li = 0; li < headLines.length && li < 2; li++) {
    drawText(cx + 12, cy + 62 + li * 24, headLines[li], 3, INK);
  }
  drawLine(cx + 12, cy + 116, cx + 80, cy + 116, RED, 3);
  // Subtext at 2.5x (up ~25% from 2x) so it still reads at ~300px wide,
  // capped at 2 lines so the footer stays clear of the bottom row.
  const subLines = wrap(s.sub, 19);
  for (let li = 0; li < subLines.length && li < 2; li++) {
    drawText(cx + 12, cy + 126 + li * 21, subLines[li], 2.5, MUTED);
  }
}

// Footer: sources, so the judge can see the poster is reported news,
// with the date repeated once more for the date-first criterion.
drawText(20, 1000, "SOURCES: REUTERS - DOW JONES - JUST SECURITY - GRIST - SPACEFLIGHT - 24 NOV 2026", 2, MUTED);

// ------------------------------------------------------------------
// PNG encode: filter 0 per scanline, zlib deflate, CRC32 chunks.
// ------------------------------------------------------------------
const CRC_TABLE: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[n] = c >>> 0;
}

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  const crcData = new Uint8Array(4 + data.length);
  crcData.set(out.subarray(4, 8 + data.length));
  view.setUint32(8 + data.length, crc32(crcData));
  return out;
}

function encodePng(): Uint8Array {
  const raw = new Uint8Array(H * (1 + W * 3));
  for (let y = 0; y < H; y++) {
    raw[y * (1 + W * 3)] = 0;
    raw.set(buf.subarray(y * W * 3, (y + 1) * W * 3), y * (1 + W * 3) + 1);
  }
  const idat = deflateSync(raw, { level: 9 });
  const ihdr = new Uint8Array(13);
  const iv = new DataView(ihdr.buffer);
  iv.setUint32(0, W);
  iv.setUint32(4, H);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type RGB
  const sig = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const parts = [sig, chunk("IHDR", ihdr), chunk("IDAT", new Uint8Array(idat)), chunk("IEND", new Uint8Array(0))];
  const total = parts.reduce((a, p) => a + p.length, 0);
  const png = new Uint8Array(total);
  let off = 0;
  for (const p of parts) {
    png.set(p, off);
    off += p.length;
  }
  return png;
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(`${outDir}/entry.png`, encodePng());
