// ══════════════════════════════════════
// SOLO MODE
// ══════════════════════════════════════
const soloCheckbox = document.getElementById('solo-mode');
function isSolo() { return soloCheckbox && soloCheckbox.checked; }

// ══════════════════════════════════════
// CARD / TAB SWITCHING (only for inline games)
// ══════════════════════════════════════
const wrapper = document.querySelector('.games-wrapper');

document.querySelectorAll('.game-card[data-game]').forEach((card) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.game-card').forEach((c) => c.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach((p) => p.classList.remove('active'));
    card.classList.add('active');
    wrapper.classList.add('playing');
    document.getElementById(card.dataset.game + '-panel').classList.add('active');
  });
});

function backToMenu() {
  document.querySelectorAll('.game-card').forEach((c) => c.classList.remove('active'));
  document.querySelectorAll('.game-panel').forEach((p) => p.classList.remove('active'));
  wrapper.classList.remove('playing');
}

document.querySelectorAll('[data-back]').forEach((btn) => {
  btn.addEventListener('click', backToMenu);
});

// ══════════════════════════════════════
// TIC TAC TOE
// ══════════════════════════════════════
const tttBoard = Array(9).fill(null);
let tttTurn = 'X';
let tttOver = false;

const tttWins = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function tttUpdateStatus(msg) {
  document.getElementById('ttt-status').innerHTML = msg;
}

function tttCheckWin(board, mark) {
  return tttWins.find((combo) => combo.every((i) => board[i] === mark));
}

function tttHandleClick(e) {
  const idx = +e.target.dataset.index;
  if (tttBoard[idx] || tttOver) return;

  tttBoard[idx] = tttTurn;
  const cell = document.querySelector(`.ttt-cell[data-index="${idx}"]`);
  cell.textContent = tttTurn;
  cell.classList.add('taken', tttTurn.toLowerCase());

  const winCombo = tttCheckWin(tttBoard, tttTurn);
  if (winCombo) {
    tttOver = true;
    winCombo.forEach((i) => {
      document.querySelector(`.ttt-cell[data-index="${i}"]`).classList.add('win');
    });
    const cls = tttTurn === 'X' ? 'player-x' : 'player-o';
    tttUpdateStatus(`<span class="${cls}">${tttTurn}</span> wins!`);
    return;
  }

  if (tttBoard.every((c) => c !== null)) {
    tttOver = true;
    tttUpdateStatus("it's a tie!");
    return;
  }

  tttTurn = tttTurn === 'X' ? 'O' : 'X';
  const cls = tttTurn === 'X' ? 'player-x' : 'player-o';
  tttUpdateStatus(`your turn, <span class="${cls}">${tttTurn}</span>`);

  if (isSolo() && tttTurn === 'O' && !tttOver) {
    setTimeout(tttAiMove, 350);
  }
}

function tttAiMove() {
  // Try to win
  for (let i = 0; i < 9; i++) {
    if (!tttBoard[i]) {
      tttBoard[i] = 'O';
      if (tttCheckWin(tttBoard, 'O')) { tttBoard[i] = null; tttPlayAt(i); return; }
      tttBoard[i] = null;
    }
  }
  // Block X from winning
  for (let i = 0; i < 9; i++) {
    if (!tttBoard[i]) {
      tttBoard[i] = 'X';
      if (tttCheckWin(tttBoard, 'X')) { tttBoard[i] = null; tttPlayAt(i); return; }
      tttBoard[i] = null;
    }
  }
  // Take center, then corners, then any
  const prefs = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (const i of prefs) {
    if (!tttBoard[i]) { tttPlayAt(i); return; }
  }
}

function tttPlayAt(idx) {
  const cell = document.querySelector(`.ttt-cell[data-index="${idx}"]`);
  cell.click();
}

function tttReset() {
  tttBoard.fill(null);
  tttTurn = 'X';
  tttOver = false;
  document.querySelectorAll('.ttt-cell').forEach((cell) => {
    cell.textContent = '';
    cell.className = 'ttt-cell';
  });
  tttUpdateStatus('your turn, <span class="player-x">X</span>');
}

document.querySelectorAll('.ttt-cell').forEach((cell) => {
  cell.addEventListener('click', tttHandleClick);
});
document.getElementById('ttt-reset').addEventListener('click', tttReset);

// ══════════════════════════════════════
// CONNECT 4
// ══════════════════════════════════════
const C4_ROWS = 6;
const C4_COLS = 7;
let c4Board = Array.from({ length: C4_ROWS }, () => Array(C4_COLS).fill(null));
let c4Turn = 'red';
let c4Over = false;

function c4UpdateStatus(msg) {
  document.getElementById('c4-status').innerHTML = msg;
}

function c4BuildBoard() {
  const boardEl = document.getElementById('c4-board');
  boardEl.innerHTML = '';
  for (let r = 0; r < C4_ROWS; r++) {
    for (let c = 0; c < C4_COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'c4-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.addEventListener('click', () => c4HandleClick(c));
      boardEl.appendChild(cell);
    }
  }
}

function c4GetCell(r, c) {
  return document.querySelector(`.c4-cell[data-row="${r}"][data-col="${c}"]`);
}

function c4DropRow(col) {
  for (let r = C4_ROWS - 1; r >= 0; r--) {
    if (!c4Board[r][col]) return r;
  }
  return -1;
}

function c4CheckWin(board, mark) {
  const dirs = [[0, 1], [1, 0], [1, 1], [1, -1]];
  for (let r = 0; r < C4_ROWS; r++) {
    for (let c = 0; c < C4_COLS; c++) {
      if (board[r][c] !== mark) continue;
      for (const [dr, dc] of dirs) {
        const cells = [];
        let valid = true;
        for (let i = 0; i < 4; i++) {
          const nr = r + dr * i;
          const nc = c + dc * i;
          if (nr < 0 || nr >= C4_ROWS || nc < 0 || nc >= C4_COLS || board[nr][nc] !== mark) {
            valid = false;
            break;
          }
          cells.push([nr, nc]);
        }
        if (valid) return cells;
      }
    }
  }
  return null;
}

function c4HandleClick(col) {
  if (c4Over) return;
  const row = c4DropRow(col);
  if (row < 0) return;

  c4Board[row][col] = c4Turn;
  const cell = c4GetCell(row, col);
  cell.classList.add('taken', c4Turn, 'drop');

  const winCells = c4CheckWin(c4Board, c4Turn);
  if (winCells) {
    c4Over = true;
    winCells.forEach(([r, c]) => c4GetCell(r, c).classList.add('win'));
    const cls = c4Turn === 'red' ? 'player-red' : 'player-yellow';
    c4UpdateStatus(`<span class="${cls}">${c4Turn}</span> wins!`);
    return;
  }

  if (c4Board[0].every((cell) => cell !== null)) {
    c4Over = true;
    c4UpdateStatus("it's a tie!");
    return;
  }

  c4Turn = c4Turn === 'red' ? 'yellow' : 'red';
  const cls = c4Turn === 'red' ? 'player-red' : 'player-yellow';
  c4UpdateStatus(`your turn, <span class="${cls}">${c4Turn}</span>`);

  if (isSolo() && c4Turn === 'yellow' && !c4Over) {
    setTimeout(c4AiMove, 400);
  }
}

function c4AiMove() {
  // Try to win
  for (let c = 0; c < C4_COLS; c++) {
    const r = c4DropRow(c);
    if (r < 0) continue;
    c4Board[r][c] = 'yellow';
    if (c4CheckWin(c4Board, 'yellow')) { c4Board[r][c] = null; c4HandleClick(c); return; }
    c4Board[r][c] = null;
  }
  // Block red from winning
  for (let c = 0; c < C4_COLS; c++) {
    const r = c4DropRow(c);
    if (r < 0) continue;
    c4Board[r][c] = 'red';
    if (c4CheckWin(c4Board, 'red')) { c4Board[r][c] = null; c4HandleClick(c); return; }
    c4Board[r][c] = null;
  }
  // Prefer center columns
  const prefs = [3, 2, 4, 1, 5, 0, 6];
  for (const c of prefs) {
    if (c4DropRow(c) >= 0) { c4HandleClick(c); return; }
  }
}

function c4Reset() {
  c4Board = Array.from({ length: C4_ROWS }, () => Array(C4_COLS).fill(null));
  c4Turn = 'red';
  c4Over = false;
  c4BuildBoard();
  c4UpdateStatus('your turn, <span class="player-red">red</span>');
}

document.getElementById('c4-reset').addEventListener('click', c4Reset);

// Initialize
c4BuildBoard();
