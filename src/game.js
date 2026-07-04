/*
 * Spelet: bräde, klick, drag, dialoger och status.
 * Reglerna sköts helt av chess.js — rockad, en passant, förvandling,
 * schackmatt, patt, trefaldig upprepning, 50-dragsregeln, allt.
 */

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const movelistEl = document.getElementById('movelist');

let game = new Chess();
let mode = 'human';        // 'human' | 'ai'
let aiColor = 'b';         // datorns färg i ai-läge
let aiLevel = 1;
let orientation = 'w';     // vilken färg som är närmast spelaren
let selected = null;       // vald ruta, t.ex. 'e2'
let legalTargets = [];     // verbose-drag från vald ruta
let lastMove = null;       // {from, to}
let pendingPromotion = null;
let aiThinking = false;

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

/* ---------- Rendering ---------- */

function render() {
  boardEl.innerHTML = '';
  const board = game.board(); // [rad8 ... rad1]
  const ranks = orientation === 'w' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];
  const files = orientation === 'w' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0];

  const inCheck = game.in_check();
  const turn = game.turn();

  for (const r of ranks) {
    for (const c of files) {
      const squareName = FILES[c] + (8 - r);
      const sq = board[r][c];
      const el = document.createElement('div');
      el.className = 'square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
      el.dataset.square = squareName;

      if (lastMove && (squareName === lastMove.from || squareName === lastMove.to)) {
        el.classList.add('lastmove');
      }
      if (selected === squareName) el.classList.add('selected');
      if (inCheck && sq && sq.type === 'k' && sq.color === turn) {
        el.classList.add('check');
      }

      if (sq) el.innerHTML = pieceHTML(sq.color, sq.type);

      const target = legalTargets.find(m => m.to === squareName);
      if (target) {
        const marker = document.createElement('div');
        marker.className = target.captured ? 'ring' : 'dot';
        el.appendChild(marker);
      }

      // koordinater på kantrutorna
      const isBottomRow = r === (orientation === 'w' ? 7 : 0);
      const isLeftCol = c === (orientation === 'w' ? 0 : 7);
      if (isBottomRow) {
        const f = document.createElement('span');
        f.className = 'coord file';
        f.textContent = FILES[c];
        el.appendChild(f);
      }
      if (isLeftCol) {
        const rk = document.createElement('span');
        rk.className = 'coord rank';
        rk.textContent = 8 - r;
        el.appendChild(rk);
      }

      el.addEventListener('click', () => onSquareClick(squareName));
      boardEl.appendChild(el);
    }
  }

  renderMoves();
  renderStatus();
}

function renderMoves() {
  const history = game.history();
  movelistEl.innerHTML = '';
  for (let i = 0; i < history.length; i += 2) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${history[i]}</span><span>${history[i + 1] || ''}</span>`;
    movelistEl.appendChild(li);
  }
  movelistEl.scrollTop = movelistEl.scrollHeight;
}

function renderStatus() {
  let text;
  const white = 'Vit', black = 'Svart';
  const turnName = game.turn() === 'w' ? white : black;

  if (game.in_checkmate()) {
    const winner = game.turn() === 'w' ? black : white;
    text = `Schackmatt! ${winner} vinner. 👑`;
  } else if (game.in_stalemate()) {
    text = 'Patt — remi.';
  } else if (game.in_threefold_repetition()) {
    text = 'Remi — samma ställning tre gånger.';
  } else if (game.insufficient_material()) {
    text = 'Remi — ingen kan göra matt.';
  } else if (game.in_draw()) {
    text = 'Remi — 50-dragsregeln.';
  } else if (aiThinking) {
    text = 'Jag tänker…';
  } else {
    text = `${turnName} att spela`;
    if (game.in_check()) text += ' — schack!';
    if (mode === 'ai') {
      text += game.turn() === aiColor ? '' : ' (din tur)';
    }
  }
  statusEl.textContent = text;
}

/* ---------- Klick och drag ---------- */

function onSquareClick(square) {
  if (game.game_over() || aiThinking || pendingPromotion) return;
  if (mode === 'ai' && game.turn() === aiColor) return;

  const piece = game.get(square);

  // klick på egen pjäs: välj (eller byt val)
  if (piece && piece.color === game.turn()) {
    if (selected === square) {
      clearSelection();
    } else {
      selected = square;
      legalTargets = game.moves({ square, verbose: true });
    }
    render();
    return;
  }

  // klick på mål: försök göra draget
  if (selected) {
    const move = legalTargets.find(m => m.to === square);
    if (move) {
      if (move.flags.includes('p')) {
        // bondeförvandling: fråga spelaren
        pendingPromotion = { from: move.from, to: move.to, color: game.turn() };
        showPromotionDialog();
        return;
      }
      makeMove({ from: move.from, to: move.to });
    } else {
      clearSelection();
      render();
    }
  }
}

function clearSelection() {
  selected = null;
  legalTargets = [];
}

function makeMove(moveObj) {
  const result = game.move(moveObj);
  if (!result) return;
  lastMove = { from: result.from, to: result.to };
  clearSelection();
  render();

  if (mode === 'ai' && !game.game_over() && game.turn() === aiColor) {
    scheduleAiMove();
  }
}

/* ---------- Datorns drag ---------- */

function scheduleAiMove() {
  aiThinking = true;
  renderStatus();
  // liten paus så brädet hinner ritas innan sökningen börjar
  setTimeout(() => {
    const move = pickAiMove(game.fen(), aiLevel);
    aiThinking = false;
    if (move) {
      const result = game.move(move);
      if (result) lastMove = { from: result.from, to: result.to };
    }
    render();
  }, 120);
}

/* ---------- Bondeförvandling ---------- */

function showPromotionDialog() {
  const overlay = document.getElementById('promotion');
  const choices = document.getElementById('promo-choices');
  choices.innerHTML = '';
  for (const type of ['q', 'r', 'b', 'n']) {
    const btn = document.createElement('button');
    btn.innerHTML = PIECE_SVG[pendingPromotion.color + type];
    btn.addEventListener('click', () => {
      const { from, to } = pendingPromotion;
      pendingPromotion = null;
      overlay.classList.add('hidden');
      makeMove({ from, to, promotion: type });
    });
    choices.appendChild(btn);
  }
  overlay.classList.remove('hidden');
}

/* ---------- Knappar ---------- */

document.getElementById('btn-undo').addEventListener('click', () => {
  if (aiThinking || pendingPromotion) return;
  game.undo();
  // mot datorn: ta tillbaka både datorns svar och ditt drag
  if (mode === 'ai' && game.turn() === aiColor) game.undo();
  lastMove = null;
  clearSelection();
  render();
});

document.getElementById('btn-flip').addEventListener('click', () => {
  orientation = orientation === 'w' ? 'b' : 'w';
  render();
});

document.getElementById('btn-new').addEventListener('click', () => {
  document.getElementById('landing').classList.remove('hidden');
  document.getElementById('game').classList.add('hidden');
});

/* ---------- Landningssidan ---------- */

function wireChoice(containerId, onPick) {
  const container = document.getElementById(containerId);
  container.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      onPick(btn);
    });
  });
}

wireChoice('opp-choice', btn => {
  const isAi = btn.dataset.opp === 'ai';
  document.querySelectorAll('.ai-only').forEach(f =>
    f.classList.toggle('hidden', !isAi));
});
wireChoice('color-choice', () => {});
wireChoice('level-choice', () => {});

document.getElementById('btn-start').addEventListener('click', () => {
  mode = document.querySelector('#opp-choice .selected').dataset.opp;
  const humanColor = document.querySelector('#color-choice .selected').dataset.color;
  aiLevel = parseInt(document.querySelector('#level-choice .selected').dataset.level, 10);
  aiColor = humanColor === 'w' ? 'b' : 'w';
  orientation = mode === 'ai' ? humanColor : 'w';

  game = new Chess();
  lastMove = null;
  clearSelection();
  aiThinking = false;
  pendingPromotion = null;
  document.getElementById('landing').classList.add('hidden');
  document.getElementById('game').classList.remove('hidden');
  render();

  if (mode === 'ai' && game.turn() === aiColor) {
    scheduleAiMove();
  }
});

/* ---------- Start ---------- */

// dekorativa pjäser på landningssidan — drottningen högst, förstås
document.getElementById('hero-pieces').innerHTML =
  `<span class="hp-pawn">${PIECE_SVG.wp}</span>` +
  `<span class="hp-queen">${PIECE_SVG.wq}</span>` +
  `<span class="hp-king">${PIECE_SVG.wk}</span>` +
  `<span class="hp-knight">${PIECE_SVG.wn}</span>`;

render();

// testlucka för felsökning i konsolen
window.__schack = {
  load(fen) { game = new Chess(fen); lastMove = null; clearSelection(); render(); },
  fen() { return game.fen(); },
  history() { return game.history(); }
};
