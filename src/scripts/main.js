'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

// Write your code here
const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Play extends Game {
  constructor(initialState) {
    super(initialState);

    this.board = initialState || [...board];
    this.score = 0;
    this.status = 'ongoing';
  }
  getState() {
    return this.board;
  }
  getScore() {
    return this.score;
  }
  getStatus() {
    return this.status;
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];
      let newRow = row.filter((value) => value !== 0);

      for (let j = 0; j < newRow.length; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          newRow[j + 1] = 0;
          this.score += newRow[j];
        }
      }
      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.board[i] = newRow;
    }
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      row.reverse();

      let newRow = row.filter((value) => value !== 0);

      for (let j = 0; j < newRow.length; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          newRow[j + 1] = 0;
          this.score += newRow[j];
        }
      }
      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      newRow.reverse();
      this.board[i] = newRow;
    }
  }

  moveUp() {
    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.processLine(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }
  }

  moveDown() {
    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.processLine(column.reverse());

      newColumn.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const arrayOfZeros = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          arrayOfZeros.push({ row, col });
        }
      }
    }

    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * arrayOfZeros.length);
      // Ensure uniqueness by removing the selected position
      const { row, col } = arrayOfZeros.splice(randomIndex, 1)[0];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  processLine(line) {
    let newLine = line.filter((v) => v !== 0);

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        newLine[i + 1] = 0;
        this.score += newLine[i];
      }
    }
    newLine = newLine.filter((v) => v !== 0);

    while (newLine.length < 4) {
      newLine.push(0);
    }

    return newLine;
  }

  hasWon() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (this.board[j][i] === this.board[j + 1][i]) {
          return true;
        }
      }
    }

    return false;
  }
}

const game = new Play();

const button = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const score = document.querySelector('.game-score');
const win = document.querySelector('.message-win');
const lose = document.querySelector('.message-lose');

function updateUI() {
  for (let i = 0; i < cells.length; i++) {
    const row = Math.floor(i / 4);
    const col = i % 4;
    const value = game.board[row][col];

    cells[i].textContent = value === 0 ? '' : value;
    cells[i].className = `field-cell field-cell--${value}`;
  }
}

button.addEventListener('click', () => {
  startMessage.classList.add('hidden');

  if (button.classList.contains('start') === true) {
    game.start();
    updateUI();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Reset';
  } else {
    game.restart();
    updateUI();

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    startMessage.classList.remove('hidden');
  }

  score.textContent = game.getScore() || 0;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    game.addRandomTile();
    updateUI();
    score.textContent = game.getScore();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
    game.addRandomTile();
    updateUI();
    score.textContent = game.getScore();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
    game.addRandomTile();
    updateUI();
    score.textContent = game.getScore();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
    game.addRandomTile();
    updateUI();
    score.textContent = game.getScore();
  }

  if (game.hasWon()) {
    win.classList.remove('hidden');
  }

  if (!game.canMove()) {
    lose.classList.remove('hidden');
  }
});
