const {
  Card,
  generateDeck,
  shuffleDeck,
  GameState,
} = require('../js/utils');
/**
 * Initializes a new game round.
 *
 * @returns {Card[]}
 */
function initGame() {
  //Make initial deck
  const deck = generateDeck();

  //Shuffle deck
  const shuffledDeck = shuffleDeck(deck);
  GameState.deck = shuffledDeck;
  GameState.flippedCards = [];
  GameState.score = 0;
  GameState.round = 1;
  GameState.timeLeft = 60;
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
function renderBoard(container, deck) {
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

function setupStartScreen(){
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
    startTimer();
  });

//End Screen Logic

  const endScreen = document.getElementById('end-screen');
  const winnerMsg = document.getElementById('winner-msg');
  const finalScoreText = document.getElementById('final-score');
  const playAgainBtn = document.getElementById('play-again-btn');
}

if (typeof document !== 'undefined') {
  setupStartScreen();
}

/**
 * Displays the end screen modal with the winner and final scores.
 *
 * @param {number} winner - The winning player's number (e.g., 1 or 2)
 * @param {{player1: number, player2: number}} score - An object containing both players' scores
 * @returns {void}
 */
function showEndScreen(winner, score) {
  winnerMsg.textContent = `PLAYER ${winner} WON!`;
  finalScoreText.textContent = `Final Score: ${score.player1} - ${score.player2}`;
  endScreen.classList.remove('hidden'); //make endscreen visible
}

function resetGame() {
  endScreen.classList.add('hidden');
  const newDeck = initGame();

  GameState.combo = 0;
  GameState.score = 0;
  updateScoreAndComboUI();

  renderBoard(cardGrid, newDeck);
  resetTimer();
}

if (typeof document !== 'undefined') {
  playAgainBtn.addEventListener('click', () => {
    resetGame();
  });

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetGame);
  }
}

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
function flipCard(index) {
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
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetScore);
  });
}

//Countdown Timer :
let timerInterval = null;

/**
 * Starts the countdown timer for the game.
 * Initializes `GameState.timeLeft` to 60 seconds,
 * updates the UI, and begins ticking every second.
 * When the timer reaches 0, the interval is cleared
 * and the game-over screen is displayed via `handleTimeOut()`.
 *
 * @returns {void}
 */
function startTimer() {
  clearInterval(timerInterval); // Stop any existing timer
  GameState.timeLeft = 60;
  updateTimerUI();

  timerInterval = setInterval(() => {
    GameState.timeLeft--;
    updateTimerUI();

    // Check if time has run out
    if (GameState.timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

/**
 * Resets the countdown timer to the default value (60 seconds)
 * and updates the UI. Any running timer is cleared.
 *
 * @returns {void}
 */
function resetTimer() {
  clearInterval(timerInterval); // Stop the timer
  GameState.timeLeft = 60;
  updateTimerUI();
}

/**
 * Updates the timer display in the UI to reflect
 * the current value of `GameState.timeLeft`.
 *
 * @returns {void}
 */
function updateTimerUI() {
  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = GameState.timeLeft;
}

/**
 * Handles logic when the timer reaches 0.
 * Displays the end screen with a "TIME'S UP!" message
 * and shows the player's final score.
 *
 * @returns {void}
 */
function handleTimeOut() {
  endScreen.classList.remove('hidden');
  winnerMsg.textContent = `TIME'S UP!`;
  finalScoreText.textContent = `Your Score: ${GameState.score}`;
}

// Export this so it can be used when cards match
//export { updateScore };

module.exports = {initGame,
  renderBoard, 
  showEndScreen, 
  resetGame, 
  flipCard, 
  updateScore
};