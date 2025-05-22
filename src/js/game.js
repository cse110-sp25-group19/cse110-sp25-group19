import { shuffleDeck } from './utils.js';
import { generateDeck } from './utils.js';

/**
 * Initializes a new game round.
 *
 * @returns {Card[]}
 */
export function initGame() {
  //Make initial deck
  const deck = generateDeck();

  //Shuffle deck
  const shuffledDeck = shuffleDeck(deck);

  //Return shuffled deck
  return shuffledDeck;
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
  container.innerHTML = '';
  deck.forEach((card, index) => {
    let cardElem = document.createElement('div');
    cardElem.dataset.id = card.id;
    cardElem.dataset.value = card.value;

    container.appendChild(cardElem);
  });
}

// Start Screen Logic

const startScreen = document.getElementById('start-screen');
const gameContainer = document.querySelector('.game-container');
const startBtn = document.getElementById('start-btn');

/**
 * Handles start button click:
 * Hides start screen and shows the game container.
 */
startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
});

//End Screen Logic

const endScreen = document.getElementById('end-screen');
const winnerMsg = document.getElementById('winner-msg');
const finalScoreText = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');

/**
 * Displays the end screen modal with the winner and final scores.
 *
 * @param {number} winner - The winning player's number (e.g., 1 or 2)
 * @param {{player1: number, player2: number}} score - An object containing both players' scores
 * @returns {void}
 */
export function showEndScreen(winner, score) {
  winnerMsg.textContent = `PLAYER ${winner} WON!`;
  finalScoreText.textContent = `Final Score: ${score.player1} - ${score.player2}`;
  endScreen.classList.remove('hidden'); //make endscreen visible
}

/**
 * Handles "Play Again" button click:
 * Reloads the page (temporary until proper game reset is implemented).
 *
 * TODO: Replace location.reload() with actual resetGame() logic.
 */
playAgainBtn.addEventListener('click', () => {
  location.reload(); //just refreshes page for now. needs actual logic to reset game board
});
