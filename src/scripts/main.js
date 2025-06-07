'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.button.start');

  startButton.addEventListener('click', () => {
    game.restart();
    startButton.textContent = 'Restart';
  });

  document.addEventListener('keydown', (e) => {
    game.handleKey(e.key);
  });
});
