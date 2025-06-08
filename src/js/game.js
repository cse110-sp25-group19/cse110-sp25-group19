import {
  generateDeck,
  shuffleDeck,
  GameState,
  triggerComboEffect,
} from './utils.js';
/**
 * Initializes a new game round.
 * @params {number} [difficulty=8] - The number of pairs to generate, the more pairs, the harder the game.
 * @returns {Card[]}
 */
function initGame(difficulty = 8) {
  //Make initial deck
  const deck = generateDeck(difficulty);

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
    } else {
      cardElem.classList.remove('is-flipped');
    }

    cardElem.dataset.id = card.id;
    cardElem.dataset.value = card.value;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front', `card-front-${card.value}`);

    const back = document.createElement('div');
    back.classList.add('card-back');

    inner.appendChild(front);
    inner.appendChild(back);
    cardElem.appendChild(inner);

    // Add card flip mechanics
    cardElem.addEventListener('click', () => {
      flipCard(index, cardElem);
      allMatched();
    });
    container.appendChild(cardElem);
  });
  updateHighScoreUI();
}

function setupStartScreen() {
  // Start Screen Logic
  const startScreen = document.getElementById('start-screen');
  const gameContainer = document.querySelector('.game-container');
  const startBtn = document.getElementById('start-btn');
  const cardGrid = document.querySelector('.card-grid');
  //add the dificulty selector here after done with frontend
  // ex: difficulty = document.getElementById('difficulty');
  const difficultySelect = document.getElementById('difficulty-select');
  if (
    !startScreen ||
    !gameContainer ||
    !startBtn ||
    !cardGrid ||
    !difficultySelect
  )
    return;

  /**
   * Handles start button click:
   * Hides start screen and shows the game container.
   * Initializes the game by calling initGame() and renders the board.
   */
  startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    let selectedDifficulty = parseInt(difficultySelect.value) || 8;
    GameState.combo = 0;
    GameState.score = 0;
    updateScoreAndComboUI();

    const deck = initGame(selectedDifficulty);
    renderBoard(cardGrid, deck);

    startTimer();
  });

  updateHighScoreUI();
}

//End Screen Logic

const endScreen = document.getElementById('end-screen');
const winnerMsg = document.getElementById('winner-msg');
const finalScoreText = document.getElementById('final-score');

/**
 * Displays the end screen modal with the winner and final scores and high scores.
 *
 * @param {number} winner - The winning player's number (e.g., 1 or 2)
 * @returns {void}
 */
function showEndScreen() {
  if (winnerMsg) winnerMsg.textContent = `YOU WON!`;
  if (finalScoreText)
    finalScoreText.textContent = `Final Score: ${GameState.score}`;
  if (endScreen) endScreen.classList.remove('hidden');

  const highScoreElEnd = document.getElementById('highscore-end-val');
  if (highScoreElEnd) {
    const highScore2 = parseInt(localStorage.getItem('matchHighScore'));
    highScoreElEnd.textContent = highScore2;
  }
}

function resetGame() {
  const cardGrid = document.querySelector('.card-grid');
  endScreen.classList.add('hidden');
  const difficultySelect = document.getElementById('difficulty-select');
  let selectedDifficulty = parseInt(difficultySelect.value) || 8;
  const newDeck = initGame(selectedDifficulty);

  GameState.combo = 0;
  GameState.score = 0;
  GameState.flippedCards = [];
  GameState.round = 1;
  GameState.timeLeft = 60;

  updateScoreAndComboUI();
  renderBoard(cardGrid, newDeck);
  resetTimer();
  startTimer();
  updateHighScoreUI();
}

// if (playAgainBtn) {
//   playAgainBtn.addEventListener('click', () => {
//     resetGame();
//   });
// }

// const resetBtn = document.getElementById('reset-btn');
// if (resetBtn) {
//   resetBtn.addEventListener('click', () => {
//     resetGame();
//   });
// }

/**
 * Updates the score, combo count, and high score in the display.
 */
function updateScoreAndComboUI() {
  const scoreElem = document.getElementById('score');
  const comboElem = document.getElementById('combo-count');
  if (scoreElem) scoreElem.textContent = GameState.score;
  if (comboElem) comboElem.textContent = `Combo: ${GameState.combo}`;
  triggerComboEffect(GameState.combo);
  updateHighScoreUI();
}

/**
 * Flips a card and updates GameState.
 * Ignores if already flipped, matched, or 2 cards are face-up.
 *
 * @param {number} index - Index of the card in the deck
 * @param {HTMLElement} cardElem - The DOM element representing the card
 * @returns {{ deck: Card[], flippedCards: Card[] }}
 */
function flipCard(index, cardElem) {
  const card = GameState.deck[index];

  if (card.isFlipped || card.isMatched || GameState.flippedCards.length >= 2) {
    return { deck: GameState.deck, flippedCards: GameState.flippedCards };
  }

  card.isFlipped = true;
  cardElem.classList.add('is-flipped');
  GameState.flippedCards.push({ cardData: card, domElement: cardElem });

  if (GameState.flippedCards.length === 2) {
    // get the things we just pused ^^
    const [
      { cardData: firstCard, domElement: firstElem },
      { cardData: secondCard, domElement: secondElem },
    ] = GameState.flippedCards;

    if (firstCard.value === secondCard.value) {
      firstCard.isMatched = true;
      secondCard.isMatched = true;
      GameState.score += 1;
      GameState.combo += 1;
      triggerComboEffect(GameState.combo);
      GameState.flippedCards = [];

      updateScoreAndComboUI();
      const isAllMatched = GameState.deck.every((card) => card.isMatched);
      if (isAllMatched) {
        clearInterval(timerInterval);
        showEndScreen();
      }
    } else {
      GameState.combo = 0;
      updateScoreAndComboUI();

      setTimeout(() => {
        // Update memory state
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;

        // flip them back by removing the class instead of re-rendering
        if (firstElem) firstElem.classList.remove('is-flipped');
        if (secondElem) secondElem.classList.remove('is-flipped');

        // Reset flipped cards list
        GameState.flippedCards = [];
      }, 1000);
    }
  } else {
    const comboElem = document.getElementById('combo-count');
    if (comboElem) comboElem.textContent = `Combo: ${GameState.combo}`;
  }

  return { deck: GameState.deck, flippedCards: GameState.flippedCards };
}
/*
 * function to check if all cards are matched and the game is over, and update high score if needed.
 */
function allMatched() {
  const allMatched = GameState.deck.every((c) => c.isMatched);
  let highScoreStorage = parseInt(localStorage.getItem('matchHighScore')) || 0;
  if (GameState.score > highScoreStorage) {
    localStorage.setItem('matchHighScore', GameState.score);
    updateHighScoreUI();
  }
  if (allMatched) {
    clearInterval(timerInterval);
    showEndScreen();
  }
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

// Wait until DOM is ready to attach event listeners
document.addEventListener('DOMContentLoaded', () => {
  setupStartScreen();
  const resetBtn = document.getElementById('reset-btn');
  const homeBtn = document.getElementById('home-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      resetGame();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetGame();
    });
  }
  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      const gameContainer = document.querySelector('.game-container');
      const startScreen = document.getElementById('start-screen');
      const cardGrid = document.querySelector('.card-grid');
      if (gameContainer) gameContainer.style.display = 'none';
      if (startScreen) startScreen.style.display = 'flex';
      if (cardGrid) cardGrid.innerHTML = '';

      resetTimer();
    });
  }
});

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
  const timerEl = document.getElementById('timer-container');
  if (timerEl) timerEl.textContent = `Time: ${GameState.timeLeft}s`;
}

/**
 * Handles logic when the timer reaches 0.
 * Displays the end screen with a "TIME'S UP!" message
 * and shows the player's final score and high score.
 *
 * @returns {void}
 */
function handleTimeOut() {
  let highScoreStorage = parseInt(localStorage.getItem('matchHighScore')) || 0;
  if (GameState.score > highScoreStorage) {
    localStorage.setItem('matchHighScore', GameState.score);
  }
  const highScoreElEnd = document.getElementById('highscore-end-val');
  if (highScoreElEnd) {
    const highScore2 = parseInt(localStorage.getItem('matchHighScore'));
    highScoreElEnd.textContent = highScore2;
  }

  endScreen.classList.remove('hidden');
  winnerMsg.textContent = `TIME'S UP!`;
  finalScoreText.textContent = `Your Score: ${GameState.score}`;
}

/**
 * Updates the high score display in the UI.
 * Retrieves the "matchHighScore" value from localStorage,
 * safely defaults to 0 if the value is null or invalid.
 *
 * @returns {void}
 */
function updateHighScoreUI() {
  const highScoreEl = document.getElementById('highscore');
  if (highScoreEl) {
    const highScore = parseInt(localStorage.getItem('matchHighScore')) || 0;
    highScoreEl.textContent = highScore;
  }
}

// Export this so it can be used when cards match
//export { updateScore };

export {
  initGame,
  renderBoard,
  showEndScreen,
  resetGame,
  flipCard,
  updateScore,
};
