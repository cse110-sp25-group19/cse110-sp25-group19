import { shuffleDeck } from './utils.js';
import { generateDeck } from './utils.js';
import { GameState } from './utils.js';
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
  GameState.deck = shuffledDeck;
  GameState.flippedCards = [];
  GameState.score = 0;
  GameState.round = 1;
  //Return shuffled deck
  return shuffledDeck;
}
console.log('Deck after initGame():', initGame());
console.log('GameState:', GameState);
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
    cardElem.classList.add('card');

    if (card.isFlipped || card.isMatched) {
      cardElem.classList.add('is-flipped');
    }

    cardElem.dataset.id = card.id;
    cardElem.dataset.value = card.value;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    front.textContent = card.value;

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.textContent = '';

    inner.appendChild(front);
    inner.appendChild(back);
    cardElem.appendChild(inner);

    // Add card flip mechanics
    cardElem.addEventListener('click', () => {
      const { deck: updatedDeck } = flipCard(index);
      const currentCard = updatedDeck[index];

      if (currentCard.isFlipped || currentCard.isMatched) {
        cardElem.classList.add('is-flipped');
      } else {
        cardElem.classList.remove('is-flipped');
      }
    });
    container.appendChild(cardElem);
  });
}

// Start Screen Logic

const startScreen = document.getElementById('start-screen');
const gameContainer = document.querySelector('.game-container');
const startBtn = document.getElementById('start-btn');
const cardGrid = document.querySelector('.card-grid');

/**
 * Handles start button click:
 * Hides start screen and shows the game container.
 * Initializes the game by calling initGame() and renders the board.
 */
startBtn.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  GameState.combo = 0;
  GameState.score = 0;
  updateScoreAndComboUI();

  const deck = initGame();
  renderBoard(cardGrid, deck);
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

export function resetGame() {
  endScreen.classList.add('hidden');
  const newDeck = initGame();

  GameState.combo = 0;
  GameState.score = 0;
  updateScoreAndComboUI();

  renderBoard(cardGrid, newDeck);
}

playAgainBtn.addEventListener('click', () => {
  resetGame();
});

function updateScoreAndComboUI() {
  const scoreElem = document.getElementById('score');
  const comboElem = document.getElementById('combo-count');
  if (scoreElem) scoreElem.textContent = GameState.score;
  if (comboElem) comboElem.textContent = GameState.combo;
}

/**
 * Flips a card and updates GameState.
 * Ignores if already flipped, matched, or 2 cards are face-up.
 *
 * @param {number} index - Index of the card in the deck
 * @returns {{ deck: Card[], flippedCards: Card[] }}
 */
export function flipCard(index) {
  const card = GameState.deck[index];

  if (card.isFlipped || card.isMatched || GameState.flippedCards.length >= 2) {
    return { deck: GameState.deck, flippedCards: GameState.flippedCards };
  }

  card.isFlipped = true;
  GameState.flippedCards.push(card);

  if (GameState.flippedCards.length === 2) {
    const [firstCard, secondCard] = GameState.flippedCards;

    if (firstCard.value === secondCard.value) {
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      GameState.score += 1;
      GameState.combo += 1;
      GameState.flippedCards = [];

      updateScoreAndComboUI();
    } else {
      GameState.combo = 0;
      updateScoreAndComboUI();

      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        GameState.flippedCards = [];
        const cardGrid = document.querySelector('.card-grid');
        if (cardGrid) renderBoard(cardGrid, GameState.deck);
      }, 1000);
    }
  } else {
    const comboElem = document.getElementById('combo-count');
    if (comboElem) comboElem.textContent = GameState.combo;
  }

  return { deck: GameState.deck, flippedCards: GameState.flippedCards };
}

//  Score + Reset Button Logic

let score = 0;

/**
 * Increases score and updates the UI
 */
function updateScore() {
  score += 1;
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = score;
}

/**
 * Resets the score and updates the UI
 */
function resetScore() {
  score = 0;
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = score;

  // reset the game board too, if needed
  initGame();
}

// Wait until DOM is ready to attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetScore);
});

// Export this so it can be used when cards match
export { updateScore };
