/*
 * Pjäserna som SVG.
 * Ljusa sidan: polerad mässing/guld med pärlemor.
 * Mörka sidan: patinerad brons med mörkt trä.
 * Designregel: drottningen är den högsta pjäsen — kungen är tydligt kortare.
 * Bonden är en bunt av redskap: sköld, högrep och rep.
 */

const PALETTES = {
  w: {
    id: 'w',
    metalTop: '#f6e2a0', metalMid: '#d4a939', metalLow: '#8a6420',
    stroke: '#5f4512',
    pearlTop: '#fdfaf2', pearlLow: '#d9cdb4',
    wood: '#8a5a30', woodDark: '#5f3c1c',
    rope: '#d9c08a',
    jewel: '#4a5aa8'
  },
  b: {
    id: 'b',
    metalTop: '#b9a58c', metalMid: '#7d6347', metalLow: '#45341f',
    stroke: '#241a10',
    pearlTop: '#c9bda6', pearlLow: '#948871',
    wood: '#4e3018', woodDark: '#2e1c0c',
    rope: '#9a8560',
    jewel: '#37436f'
  }
};

function defs(p) {
  return `
  <defs>
    <linearGradient id="metal-${p.id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${p.metalLow}"/>
      <stop offset="0.35" stop-color="${p.metalTop}"/>
      <stop offset="0.6" stop-color="${p.metalMid}"/>
      <stop offset="1" stop-color="${p.metalLow}"/>
    </linearGradient>
    <linearGradient id="pearl-${p.id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${p.pearlLow}"/>
      <stop offset="0.4" stop-color="${p.pearlTop}"/>
      <stop offset="1" stop-color="${p.pearlLow}"/>
    </linearGradient>
    <linearGradient id="wood-${p.id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${p.woodDark}"/>
      <stop offset="0.5" stop-color="${p.wood}"/>
      <stop offset="1" stop-color="${p.woodDark}"/>
    </linearGradient>
  </defs>`;
}

function base(p, y = 186) {
  return `
  <ellipse cx="50" cy="${y + 18}" rx="31" ry="9" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>
  <path d="M24 ${y + 16} Q26 ${y + 2} 34 ${y} L66 ${y} Q74 ${y + 2} 76 ${y + 16} Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>`;
}

function svgWrap(p, inner, viewH = 220) {
  return `<svg viewBox="0 0 100 ${viewH}" xmlns="http://www.w3.org/2000/svg">${defs(p)}${inner}</svg>`;
}

/* ---------- Bonden: sköld + högrep + rep ---------- */
function pawnSVG(p) {
  const fork = `
  <g transform="rotate(-14 50 130)">
    <rect x="47" y="52" width="6" height="140" rx="3" fill="url(#wood-${p.id})" stroke="${p.stroke}" stroke-width="1.5"/>
    <path d="M36 66 L36 40 M50 60 L50 34 M64 66 L64 40 M36 62 Q50 54 64 62"
          fill="none" stroke="url(#metal-${p.id})" stroke-width="5" stroke-linecap="round"/>
    <path d="M36 66 L36 40 M50 60 L50 34 M64 66 L64 40 M36 62 Q50 54 64 62"
          fill="none" stroke="${p.stroke}" stroke-width="1" opacity=".5"/>
  </g>`;

  const rope = `
  <g stroke="${p.stroke}" stroke-width="1.2">
    <ellipse cx="74" cy="150" rx="11" ry="13" fill="none" stroke="${p.rope}" stroke-width="5"/>
    <ellipse cx="74" cy="150" rx="11" ry="13" fill="none" opacity=".6"/>
    <ellipse cx="74" cy="150" rx="5.5" ry="7" fill="none" stroke="${p.rope}" stroke-width="4"/>
    <ellipse cx="74" cy="150" rx="5.5" ry="7" fill="none" opacity=".6"/>
  </g>`;

  const shield = `
  <path d="M50 96 C68 96 79 104 79 116 C79 148 68 170 50 182 C32 170 21 148 21 116 C21 104 32 96 50 96 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.5"/>
  <path d="M50 104 C63 104 71 110 71 119 C71 145 62 163 50 172 C38 163 29 145 29 119 C29 110 37 104 50 104 Z"
        fill="none" stroke="${p.stroke}" stroke-width="1.2" opacity=".55"/>
  <circle cx="50" cy="132" r="9" fill="url(#pearl-${p.id})" stroke="${p.stroke}" stroke-width="2"/>`;

  return svgWrap(p, fork + rope + shield + base(p));
}

/* ---------- Tornet ---------- */
function rookSVG(p) {
  const body = `
  <path d="M28 58 L28 36 L38 36 L38 46 L45 46 L45 36 L55 36 L55 46 L62 46 L62 36 L72 36 L72 58 L65 66 L65 158 L72 172 L28 172 L35 158 L35 66 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.5"/>
  <rect x="37" y="86" width="26" height="46" rx="4" fill="url(#wood-${p.id})" stroke="${p.stroke}" stroke-width="1.8"/>
  <rect x="41" y="92" width="18" height="10" rx="3" fill="url(#pearl-${p.id})" stroke="${p.stroke}" stroke-width="1.2"/>
  <line x1="35" y1="72" x2="65" y2="72" stroke="${p.stroke}" stroke-width="1.5" opacity=".6"/>
  <line x1="35" y1="146" x2="65" y2="146" stroke="${p.stroke}" stroke-width="1.5" opacity=".6"/>`;
  return svgWrap(p, body + base(p, 172));
}

/* ---------- Springaren ---------- */
function knightSVG(p) {
  const horse = `
  <path d="M33 178 L33 156 C33 122 42 98 60 84 C68 78 72 68 70 56 C69 49 74 47 78 53 L85 65 C89 73 89 84 83 92 L67 112 C61 120 59 129 60 140 L72 178 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M70 56 L64 44 C63 40 67 38 70 42 Z" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>
  <path d="M60 84 C52 96 47 112 46 132" fill="none" stroke="${p.stroke}" stroke-width="1.5" opacity=".5"/>
  <circle cx="72" cy="66" r="2.6" fill="${p.stroke}"/>
  <path d="M82 78 L74 84" stroke="${p.stroke}" stroke-width="1.5" opacity=".7"/>`;
  return svgWrap(p, horse + base(p, 178));
}

/* ---------- Löparen ---------- */
function bishopSVG(p) {
  const mitre = `
  <circle cx="50" cy="42" r="7" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>
  <path d="M50 52 C66 68 74 90 74 108 C74 130 64 142 50 144 C36 142 26 130 26 108 C26 90 34 68 50 52 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.5"/>
  <path d="M40 84 L61 112" stroke="${p.stroke}" stroke-width="4" stroke-linecap="round" opacity=".75"/>
  <ellipse cx="50" cy="150" rx="17" ry="6" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>
  <path d="M42 156 L38 186 L62 186 L58 156 Z" fill="url(#pearl-${p.id})" stroke="${p.stroke}" stroke-width="2"/>`;
  return svgWrap(p, mitre + base(p));
}

/* ---------- Drottningen: den högsta pjäsen ---------- */
function queenSVG(p) {
  const crown = `
  <circle cx="50" cy="30" r="5" fill="${p.jewel}" stroke="${p.stroke}" stroke-width="1.6"/>
  <path d="M33 82 L37 48 L45 66 L50 40 L55 66 L63 48 L67 82 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.4" stroke-linejoin="round"/>
  <circle cx="37" cy="46" r="4" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="1.5"/>
  <circle cx="50" cy="38" r="4" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="1.5"/>
  <circle cx="63" cy="46" r="4" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="1.5"/>
  <ellipse cx="50" cy="86" rx="19" ry="6" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>`;

  const body = `
  <path d="M41 186 C45 152 44 122 39 92 L61 92 C56 122 55 152 59 186 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.4"/>
  <rect x="44.5" y="104" width="11" height="58" rx="5" fill="url(#pearl-${p.id})" stroke="${p.stroke}" stroke-width="1.4"/>
  <ellipse cx="50" cy="170" rx="15" ry="5" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="1.8"/>`;

  return svgWrap(p, crown + body + base(p));
}

/* ---------- Kungen: kortare än drottningen ---------- */
function kingSVG(p) {
  const cross = `
  <path d="M46.5 34 L53.5 34 L53.5 44 L63 44 L63 51 L53.5 51 L53.5 64 L46.5 64 L46.5 51 L37 51 L37 44 L46.5 44 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>`;

  const body = `
  <ellipse cx="50" cy="74" rx="13" ry="9" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.2"/>
  <ellipse cx="50" cy="86" rx="18" ry="6" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2"/>
  <path d="M39 186 C44 152 43 122 38 94 L62 94 C57 122 56 152 61 186 Z"
        fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="2.4"/>
  <ellipse cx="50" cy="128" rx="10" ry="16" fill="url(#pearl-${p.id})" stroke="${p.stroke}" stroke-width="1.4"/>
  <ellipse cx="50" cy="170" rx="15" ry="5" fill="url(#metal-${p.id})" stroke="${p.stroke}" stroke-width="1.8"/>`;

  return svgWrap(p, cross + body + base(p));
}

const PIECE_BUILDERS = {
  p: pawnSVG, r: rookSVG, n: knightSVG, b: bishopSVG, q: queenSVG, k: kingSVG
};

// cache: 12 pjäser, byggs en gång
const PIECE_SVG = {};
for (const color of ['w', 'b']) {
  for (const type of Object.keys(PIECE_BUILDERS)) {
    PIECE_SVG[color + type] = PIECE_BUILDERS[type](PALETTES[color]);
  }
}

function pieceHTML(color, type) {
  return `<div class="piece ${type}">${PIECE_SVG[color + type]}</div>`;
}
