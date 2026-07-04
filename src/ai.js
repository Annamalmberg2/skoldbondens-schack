/*
 * Datormotståndaren: minimax med alfa-beta-beskärning ovanpå chess.js.
 * Nivå 1 (Lätt): grunt sök + slumpar bland de okej dragen — går att vinna mot.
 * Nivå 2 (Medel): 2 drag framåt.
 * Nivå 3 (Svår): 3 drag framåt med dragsortering.
 */

const PIECE_VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };

// Positionstabeller (ur vits perspektiv, rad 0 = rad 8 på brädet)
const PST = {
  p: [
    [0,0,0,0,0,0,0,0],
    [50,50,50,50,50,50,50,50],
    [10,10,20,30,30,20,10,10],
    [5,5,10,25,25,10,5,5],
    [0,0,0,20,20,0,0,0],
    [5,-5,-10,0,0,-10,-5,5],
    [5,10,10,-20,-20,10,10,5],
    [0,0,0,0,0,0,0,0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,0,0,0,0,-20,-40],
    [-30,0,10,15,15,10,0,-30],
    [-30,5,15,20,20,15,5,-30],
    [-30,0,15,20,20,15,0,-30],
    [-30,5,10,15,15,10,5,-30],
    [-40,-20,0,5,5,0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,0,0,0,0,0,0,-10],
    [-10,0,5,10,10,5,0,-10],
    [-10,5,5,10,10,5,5,-10],
    [-10,0,10,10,10,10,0,-10],
    [-10,10,10,10,10,10,10,-10],
    [-10,5,0,0,0,0,5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,0,0,0,0,0,0,0],
    [5,10,10,10,10,10,10,5],
    [-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],
    [-5,0,0,0,0,0,0,-5],
    [0,0,0,5,5,0,0,0]
  ],
  q: [
    [-20,-10,-10,-5,-5,-10,-10,-20],
    [-10,0,0,0,0,0,0,-10],
    [-10,0,5,5,5,5,0,-10],
    [-5,0,5,5,5,5,0,-5],
    [0,0,5,5,5,5,0,-5],
    [-10,5,5,5,5,5,0,-10],
    [-10,0,5,0,0,0,0,-10],
    [-20,-10,-10,-5,-5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20,20,0,0,0,0,20,20],
    [20,30,10,0,0,10,30,20]
  ]
};

function evaluateBoard(game) {
  const board = game.board();
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = board[r][c];
      if (!sq) continue;
      const v = PIECE_VALUE[sq.type];
      if (sq.color === 'w') {
        score += v + PST[sq.type][r][c];
      } else {
        score -= v + PST[sq.type][7 - r][c];
      }
    }
  }
  return score;
}

function orderedMoves(game) {
  const moves = game.moves({ verbose: true });
  // slag först, värdefullaste byte överst
  moves.sort((a, b) => {
    const av = a.captured ? PIECE_VALUE[a.captured] - PIECE_VALUE[a.piece] / 10 : -1;
    const bv = b.captured ? PIECE_VALUE[b.captured] - PIECE_VALUE[b.piece] / 10 : -1;
    return bv - av;
  });
  return moves;
}

function minimax(game, depth, alpha, beta, maximizing) {
  if (game.in_checkmate()) {
    // den som ska dra är matt — dåligt för den sidan; föredra snabb matt
    return maximizing ? -100000 - depth : 100000 + depth;
  }
  if (game.in_draw() || game.in_stalemate()) return 0;
  if (depth === 0) return evaluateBoard(game);

  const moves = orderedMoves(game);
  if (maximizing) {
    let best = -Infinity;
    for (const m of moves) {
      game.move(m);
      best = Math.max(best, minimax(game, depth - 1, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      game.move(m);
      best = Math.min(best, minimax(game, depth - 1, alpha, beta, true));
      game.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

/**
 * Väljer datorns drag.
 * @param {string} fen  aktuell ställning
 * @param {number} level  1 = lätt, 2 = medel, 3 = svår
 * @returns {{from: string, to: string, promotion: string}|null}
 */
function pickAiMove(fen, level) {
  const game = new Chess(fen);
  const aiIsWhite = game.turn() === 'w';
  const depth = level; // 1, 2 eller 3

  const moves = orderedMoves(game);
  if (moves.length === 0) return null;

  const scored = moves.map(m => {
    game.move(m);
    const score = minimax(game, depth - 1, -Infinity, Infinity, !aiIsWhite);
    game.undo();
    return { move: m, score: aiIsWhite ? score : -score };
  });

  scored.sort((a, b) => b.score - a.score);

  let chosen;
  if (level === 1) {
    // Lätt: slumpa bland drag som inte är katastrofalt sämre än bästa
    const tolerance = 120; // drygt en bonde
    const okMoves = scored.filter(s => s.score >= scored[0].score - tolerance);
    chosen = okMoves[Math.floor(Math.random() * okMoves.length)];
  } else {
    // liten slump bland exakt likvärdiga drag så partierna varierar
    const top = scored.filter(s => s.score === scored[0].score);
    chosen = top[Math.floor(Math.random() * top.length)];
  }

  const m = chosen.move;
  return { from: m.from, to: m.to, promotion: m.promotion || 'q' };
}
