'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  generateNewTitle() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newTileValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newTileValue;
  }

  render() {
    const cells = document.querySelectorAll('.field-cell');

    if (!cells.length) {
      return;
    }

    let index = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];
        const cell = cells[index];

        cell.textContent = value !== 0 ? value : '';

        cell.className = 'field-cell';

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
        } else {
          cell.classList.add('field-cell--empty');
        }

        index++;
      }
    }

    // Оновити рахунок у DOM
    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  moveLeft() {
    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((x) => x !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
        }
      }

      newRow = newRow.filter((x) => x !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.board[row] = newRow;
    }
  }

  moveRight() {
    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((x) => x !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow[i - 1] = 0;
          this.score += newRow[i];
        }
      }

      newRow = newRow.filter((x) => x !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }
      this.board[row] = newRow;
    }
  }

  moveUp() {
    for (let col = 0; col < 4; col++) {
      const colData = [];

      for (let row = 0; row < 4; row++) {
        colData.push(this.board[row][col]);
      }

      let newCol = colData.filter((x) => x !== 0);

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
          this.score += newCol[i];
        }
      }

      newCol = newCol.filter((x) => x !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }
  }

  moveDown() {
    for (let col = 0; col < 4; col++) {
      const colData = [];

      for (let row = 0; row < 4; row++) {
        colData.push(this.board[row][col]);
      }

      let newCol = colData.filter((x) => x !== 0);

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] *= 2;
          newCol[i - 1] = 0;
          this.score += newCol[i];
        }
      }

      newCol = newCol.filter((x) => x !== 0);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }
  }

  isGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (current === 0) {
          return false;
        }

        if (col < 3 && current === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  isWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  handleKey(key) {
    if (this.status !== 'playing') {
      return;
    }

    switch (key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      default:
        return;
    }

    this.generateNewTitle();
    this.render();

    if (this.isWin() && this.status !== 'win') {
      this.status = 'win';
      document.querySelector('.message-win')?.classList.remove('hidden');
    } else if (this.isGameOver()) {
      this.status = 'lose';
      document.querySelector('.message-lose')?.classList.remove('hidden');
    }
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    document.querySelector('.message-start')?.classList.add('hidden');
    document.querySelector('.message-win')?.classList.add('hidden');
    document.querySelector('.message-lose')?.classList.add('hidden');

    this.generateNewTitle();
    this.generateNewTitle();
    this.render();
  }

  restart() {
    this.start();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }
}

module.exports = Game;
