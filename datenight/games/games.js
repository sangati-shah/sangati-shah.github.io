// ══════════════════════════════════════
// MULTIPLAYER (PeerJS)
// ══════════════════════════════════════
let mpPeer = null;
let mpConn = null;
let mpMode = 'local'; // 'local' or 'online'
let mpRole = null;     // ttt: 'X'/'O', c4: 'red'/'yellow'

function mpGenCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function mpPeerId(code) {
  return 'shahhub-game-' + code.toUpperCase();
}

function mpShowEl(id) {
  document.getElementById(id).classList.remove('mp-hidden');
}

function mpHideEl(id) {
  document.getElementById(id).classList.add('mp-hidden');
}

function mpShowError(msg) {
  const el = document.getElementById('mp-error');
  el.textContent = msg;
  el.classList.remove('mp-hidden');
  setTimeout(() => el.classList.add('mp-hidden'), 4000);
}

function mpSend(data) {
  if (mpConn && mpConn.open) mpConn.send(data);
}

function mpOnData(data) {
  if (data.type === 'ttt-move') {
    tttApplyMove(data.index);
  } else if (data.type === 'c4-move') {
    c4ApplyMove(data.col);
  } else if (data.type === 'reset-ttt') {
    tttReset(true);
  } else if (data.type === 'reset-c4') {
    c4Reset(true);
  }
}

function mpOnConnected(conn, role) {
  mpConn = conn;
  mpRole = role;
  mpMode = 'online';

  mpHideEl('mp-create-join');
  mpHideEl('mp-waiting');
  mpShowEl('mp-connected');

  const roleEl = document.getElementById('mp-your-role');
  const activeTab = document.querySelector('.game-tab.active').dataset.game;
  if (activeTab === 'tictactoe') {
    roleEl.textContent = role;
    roleEl.className = 'mp-role ' + (role === 'X' ? 'player-x' : 'player-o');
  } else {
    roleEl.textContent = role;
    roleEl.className = 'mp-role ' + (role === 'red' ? 'player-red' : 'player-yellow');
  }

  tttReset();
  c4Reset();

  conn.on('data', mpOnData);
  conn.on('close', mpOnDisconnected);
}

function mpOnDisconnected() {
  mpConn = null;
  mpMode = 'local';
  mpRole = null;

  mpHideEl('mp-connected');
  mpHideEl('mp-waiting');
  mpShowEl('mp-create-join');

  if (mpPeer) {
    mpPeer.destroy();
    mpPeer = null;
  }

  tttReset();
  c4Reset();

  // Show a brief disconnect notice
  const panel = document.getElementById('mp-online-panel');
  if (panel.classList.contains('visible')) {
    const note = document.createElement('div');
    note.className = 'mp-disconnect-note';
    note.textContent = 'player disconnected';
    panel.appendChild(note);
    setTimeout(() => note.remove(), 3000);
  }
}

function mpCreateRoom() {
  const code = mpGenCode();
  const id = mpPeerId(code);

  mpPeer = new Peer(id);

  mpPeer.on('open', () => {
    document.getElementById('mp-room-code').textContent = code;
    mpHideEl('mp-create-join');
    mpHideEl('mp-error');
    mpShowEl('mp-waiting');
  });

  mpPeer.on('connection', (conn) => {
    conn.on('open', () => {
      // Host is player 1 (X / red)
      const activeTab = document.querySelector('.game-tab.active').dataset.game;
      const hostRole = activeTab === 'tictactoe' ? 'X' : 'red';
      const guestRole = activeTab === 'tictactoe' ? 'O' : 'yellow';
      conn.send({ type: 'assign-role', role: guestRole, game: activeTab });
      mpOnConnected(conn, hostRole);
    });
  });

  mpPeer.on('error', (err) => {
    if (err.type === 'unavailable-id') {
      mpShowError('room code taken, try again');
    } else {
      mpShowError('connection error, try again');
    }
    mpPeer.destroy();
    mpPeer = null;
    mpHideEl('mp-waiting');
    mpShowEl('mp-create-join');
  });
}

function mpJoinRoom() {
  const code = document.getElementById('mp-code-input').value.trim().toUpperCase();
  if (code.length !== 4) {
    mpShowError('enter a 4-letter code');
    return;
  }

  mpPeer = new Peer();

  mpPeer.on('open', () => {
    const conn = mpPeer.connect(mpPeerId(code), { reliable: true });

    conn.on('open', () => {
      conn.on('data', (data) => {
        if (data.type === 'assign-role') {
          // Switch to the right game tab
          const tab = document.querySelector(`.game-tab[data-game="${data.game}"]`);
          if (tab) tab.click();
          mpOnConnected(conn, data.role);
        } else {
          mpOnData(data);
        }
      });
      conn.on('close', mpOnDisconnected);
    });

    // Timeout if connection doesn't establish
    setTimeout(() => {
      if (!mpConn) {
        mpShowError('could not find that room');
        mpPeer.destroy();
        mpPeer = null;
      }
    }, 8000);
  });

  mpPeer.on('error', () => {
    mpShowError('could not connect, check the code');
    mpPeer.destroy();
    mpPeer = null;
  });
}

function mpCancel() {
  if (mpPeer) {
    mpPeer.destroy();
    mpPeer = null;
  }
  mpConn = null;
  mpMode = 'local';
  mpRole = null;
  mpHideEl('mp-waiting');
  mpShowEl('mp-create-join');
}

// Lobby UI wiring
document.getElementById('mp-local-btn').addEventListener('click', () => {
  document.getElementById('mp-local-btn').classList.add('active');
  document.getElementById('mp-online-btn').classList.remove('active');
  document.getElementById('mp-online-panel').classList.remove('visible');
  mpCancel();
});

document.getElementById('mp-online-btn').addEventListener('click', () => {
  document.getElementById('mp-online-btn').classList.add('active');
  document.getElementById('mp-local-btn').classList.remove('active');
  document.getElementById('mp-online-panel').classList.add('visible');
});

document.getElementById('mp-create-btn').addEventListener('click', mpCreateRoom);
document.getElementById('mp-join-btn').addEventListener('click', mpJoinRoom);
document.getElementById('mp-cancel-btn').addEventListener('click', mpCancel);
document.getElementById('mp-code-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') mpJoinRoom();
});

// ══════════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════════
document.querySelectorAll('.game-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.game-tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.game-panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.game + '-panel').classList.add('active');

    // Update the role display when switching tabs while connected
    if (mpMode === 'online' && mpConn) {
      const roleEl = document.getElementById('mp-your-role');
      if (tab.dataset.game === 'tictactoe') {
        const role = mpRole === 'X' || mpRole === 'red' ? 'X' : 'O';
        mpRole = role;
        roleEl.textContent = role;
        roleEl.className = 'mp-role ' + (role === 'X' ? 'player-x' : 'player-o');
      } else {
        const role = mpRole === 'X' || mpRole === 'red' ? 'red' : 'yellow';
        mpRole = role;
        roleEl.textContent = role;
        roleEl.className = 'mp-role ' + (role === 'red' ? 'player-red' : 'player-yellow');
      }
    }
  });
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

function tttIsMyTurn() {
  if (mpMode === 'local') return true;
  return mpRole === tttTurn;
}

function tttApplyMove(idx) {
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
  if (mpMode === 'online') {
    tttUpdateStatus(tttIsMyTurn()
      ? `your turn (<span class="${cls}">${tttTurn}</span>)`
      : `waiting for <span class="${cls}">${tttTurn}</span>...`);
  } else {
    tttUpdateStatus(`your turn, <span class="${cls}">${tttTurn}</span>`);
  }
}

function tttHandleClick(e) {
  const idx = +e.target.dataset.index;
  if (tttBoard[idx] || tttOver) return;
  if (!tttIsMyTurn()) return;

  tttApplyMove(idx);
  mpSend({ type: 'ttt-move', index: idx });
}

function tttReset(fromRemote) {
  tttBoard.fill(null);
  tttTurn = 'X';
  tttOver = false;
  document.querySelectorAll('.ttt-cell').forEach((cell) => {
    cell.textContent = '';
    cell.className = 'ttt-cell';
  });
  if (mpMode === 'online') {
    const cls = 'player-x';
    tttUpdateStatus(tttIsMyTurn()
      ? `your turn (<span class="${cls}">X</span>)`
      : `waiting for <span class="${cls}">X</span>...`);
  } else {
    tttUpdateStatus('your turn, <span class="player-x">X</span>');
  }
  if (!fromRemote) mpSend({ type: 'reset-ttt' });
}

document.querySelectorAll('.ttt-cell').forEach((cell) => {
  cell.addEventListener('click', tttHandleClick);
});
document.getElementById('ttt-reset').addEventListener('click', () => tttReset());

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

function c4IsMyTurn() {
  if (mpMode === 'local') return true;
  return mpRole === c4Turn;
}

function c4ApplyMove(col) {
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
  if (mpMode === 'online') {
    c4UpdateStatus(c4IsMyTurn()
      ? `your turn (<span class="${cls}">${c4Turn}</span>)`
      : `waiting for <span class="${cls}">${c4Turn}</span>...`);
  } else {
    c4UpdateStatus(`your turn, <span class="${cls}">${c4Turn}</span>`);
  }
}

function c4HandleClick(col) {
  if (c4Over) return;
  if (!c4IsMyTurn()) return;
  if (c4DropRow(col) < 0) return;

  c4ApplyMove(col);
  mpSend({ type: 'c4-move', col: col });
}

function c4Reset(fromRemote) {
  c4Board = Array.from({ length: C4_ROWS }, () => Array(C4_COLS).fill(null));
  c4Turn = 'red';
  c4Over = false;
  c4BuildBoard();
  if (mpMode === 'online') {
    const cls = 'player-red';
    c4UpdateStatus(c4IsMyTurn()
      ? `your turn (<span class="${cls}">red</span>)`
      : `waiting for <span class="${cls}">red</span>...`);
  } else {
    c4UpdateStatus('your turn, <span class="player-red">red</span>');
  }
  if (!fromRemote) mpSend({ type: 'reset-c4' });
}

document.getElementById('c4-reset').addEventListener('click', () => c4Reset());

// Initialize
c4BuildBoard();
