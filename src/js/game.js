import { shuffleDeck } from './utils.js';

/**
 * Initializes a new game round.
 *
 * @returns {void}
 */
export function initGame() {
  // TODO: build deck, call shuffleDeck, etc.
}

/**
 * Renders the card grid into the supplied container.
 *
 * @param   {HTMLElement} container DOM node that will hold the cards
 * @param   {Array}       deck      Card array created by initGame()
 * @returns {void}
 */
export function renderBoard(container, deck) {
  // TODO: inject placeholder elements
}

//  Score + Reset Button Logic 

let score = 0;

/**
 * Increases score and updates the UI
 */
function updateScore() {
  score += 1;
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = score;
}

/**
 * Resets the score and updates the UI
 */
function resetScore() {
  score = 0;
  const scoreEl = document.getElementById("score");
  if (scoreEl) scoreEl.textContent = score;

  // reset the game board too, if needed
  initGame();
}

// Wait until DOM is ready to attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) resetBtn.addEventListener("click", resetScore);
});

// Export this so it can be used when cards match
export { updateScore };
