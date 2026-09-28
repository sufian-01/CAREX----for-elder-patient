/**
 * Mini Games Page Module — Realistic Tic-Tac-Toe (Cross ❌ vs Circle ⭕).
 * Multi-Language Support (English / Hindi).
 */

import { toast } from '../components/toast.js';
import { router } from '../router.js';
import { t } from '../services/languageService.js';

let board = Array(9).fill(null);
let currentPlayer = 'X'; // 'X' or 'O'
let gameMode = 'ai'; // 'ai' or '2player'
let gameActive = true;
let winner = null; // 'X', 'O', or 'draw'
let scores = { X: 0, O: 0, ties: 0 };
let winningLine = [];

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export function render() {
  let turnStatus = '';
  if (winner) {
    if (winner === 'draw') {
      turnStatus = t('games.draw_msg');
    } else if (winner === 'X') {
      turnStatus = t('games.player_x_wins');
    } else {
      turnStatus = gameMode === 'ai' ? t('games.computer_wins') : t('games.player_o_wins');
    }
  } else {
    if (currentPlayer === 'X') {
      turnStatus = t('games.player_x_turn');
    } else {
      turnStatus = gameMode === 'ai' ? t('games.computer_thinking') : t('games.player_o_turn');
    }
  }

  return `
    <div class="page">
      <div class="page-header">
        <div>
          <h1 class="page-title">🎮 ${t('games.title')}</h1>
          <p class="page-subtitle">${t('games.subtitle')}</p>
        </div>
      </div>

      <!-- Mode & Scoreboard Card -->
      <div class="card" style="text-align: center; padding: var(--space-lg);">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md); margin-bottom: var(--space-md);">
          
          <!-- Mode Switcher -->
          <div style="display: flex; gap: var(--space-xs);">
            <button id="mode-ai-btn" class="btn ${gameMode === 'ai' ? 'btn-primary' : 'btn-secondary'} btn-sm">
              🤖 ${t('games.vs_computer')}
            </button>
            <button id="mode-2p-btn" class="btn ${gameMode === '2player' ? 'btn-primary' : 'btn-secondary'} btn-sm">
              👥 ${t('games.two_players')}
            </button>
          </div>

          <!-- Scoreboard -->
          <div style="display: flex; gap: var(--space-md); font-weight: 800; font-size: var(--font-size-base);">
            <span style="color: var(--color-primary);">${t('games.x_wins')}: ${scores.X}</span>
            <span style="color: var(--color-danger);">${t('games.o_wins')}: ${scores.O}</span>
            <span style="color: var(--color-text-secondary);">${t('games.ties')}: ${scores.ties}</span>
          </div>

          <button id="reset-ttt-btn" class="btn btn-secondary btn-sm">
            <i data-lucide="rotate-ccw"></i> ${t('games.restart')}
          </button>
        </div>

        <!-- Turn / Status Indicator -->
        <div style="margin-bottom: var(--space-md); font-size: var(--font-size-xl); font-weight: 800; color: var(--color-text);">
          ${turnStatus}
        </div>

        <!-- Tic Tac Toe 3x3 Grid -->
        <div class="ttt-grid">
          ${board.map((cell, idx) => {
            const isWinningCell = winningLine.includes(idx);
            return `
              <button class="ttt-cell ${isWinningCell ? 'winning-cell' : ''} ${cell ? 'filled' : ''}" data-index="${idx}" aria-label="Cell ${idx + 1}">
                <span class="ttt-symbol ${cell === 'X' ? 'symbol-x' : 'symbol-o'}">
                  ${cell === 'X' ? '❌' : (cell === 'O' ? '⭕' : '')}
                </span>
              </button>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function init() {
  const resetBtn = document.getElementById('reset-ttt-btn');
  const aiBtn = document.getElementById('mode-ai-btn');
  const twoPBtn = document.getElementById('mode-2p-btn');

  function checkWinner(currentBoard) {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: combo };
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return { winner: 'draw', line: [] };
    }
    return null;
  }

  function handleMove(idx) {
    if (!gameActive || board[idx] !== null) return;

    board[idx] = currentPlayer;
    const result = checkWinner(board);

    if (result) {
      gameActive = false;
      winner = result.winner;
      winningLine = result.line;

      if (winner === 'X') scores.X++;
      else if (winner === 'O') scores.O++;
      else if (winner === 'draw') scores.ties++;

      if (winner === 'X') toast.show(t('games.player_x_wins'), 'success');
      else if (winner === 'O') toast.show(gameMode === 'ai' ? t('games.computer_wins') : t('games.player_o_wins'), 'info');
      else toast.show(t('games.draw_msg'), 'info');

      router.handleRoute();
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    router.handleRoute();

    // AI Move
    if (gameMode === 'ai' && currentPlayer === 'O' && gameActive) {
      setTimeout(makeAiMove, 500);
    }
  }

  function makeAiMove() {
    if (!gameActive) return;

    // 1. Try to win if possible
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        if (checkWinner(board)?.winner === 'O') {
          board[i] = null;
          handleMove(i);
          return;
        }
        board[i] = null;
      }
    }

    // 2. Block X from winning
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        if (checkWinner(board)?.winner === 'X') {
          board[i] = null;
          handleMove(i);
          return;
        }
        board[i] = null;
      }
    }

    // 3. Take center if available
    if (board[4] === null) {
      handleMove(4);
      return;
    }

    // 4. Take random available spot
    const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (emptyIndices.length > 0) {
      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      handleMove(randomIndex);
    }
  }

  function resetBoard() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    winner = null;
    winningLine = [];
    router.handleRoute();
  }

  if (resetBtn) resetBtn.onclick = resetBoard;

  if (aiBtn) {
    aiBtn.onclick = () => {
      gameMode = 'ai';
      resetBoard();
    };
  }

  if (twoPBtn) {
    twoPBtn.onclick = () => {
      gameMode = '2player';
      resetBoard();
    };
  }

  document.querySelectorAll('.ttt-cell').forEach(cell => {
    cell.onclick = () => {
      const idx = parseInt(cell.dataset.index, 10);
      handleMove(idx);
    };
  });
}
