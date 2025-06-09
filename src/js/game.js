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
  GameState.difficulty = difficulty;

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

/**
 * Initializes and sets up the start screen UI and logic.
 *
 * This function:
 * - Selects key DOM elements related to the start screen and game container.
 * - Attaches a click event listener to the start button to:
 *   - Hide the start screen and show the game container.
 *   - Initialize the game state and deck based on the selected difficulty.
 *   - Render the game board.
 *   - Reset and start the game timer.
 * - Updates the displayed high score on the start screen.
 *
 * If any required elements are missing, the function exits early.
 *
 * @returns {void}
 */
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
/**
 * The container element for the end screen modal.
 * @type {HTMLElement | null}
 */
const endScreen = document.getElementById('end-screen');

/**
 * The element that displays the winner message.
 * @type {HTMLElement | null}
 */
const winnerMsg = document.getElementById('winner-msg');

/**
 * The element that displays the final score or time left.
 * @type {HTMLElement | null}
 */
const finalScoreText = document.getElementById('final-score');

/**
 * Displays the end screen modal with the winner message, final time left, and the high score.
 * Updates relevant DOM elements to show game results and high score.
 *
 * - Sets the winner message text.
 * - Displays the remaining time left.
 * - Reveals the end screen modal.
 * - Retrieves and displays the high score for the current difficulty level.
 * - Ensures the high score display falls back to 0 if no high score is found.
 *
 * @returns {void}
 */
function showEndScreen() {
  if (winnerMsg) winnerMsg.textContent = `YOU WON!`;
  if (finalScoreText)
    finalScoreText.textContent = `Time left: ${GameState.timeLeft}s`;
  if (endScreen) endScreen.classList.remove('hidden');

  const highScoreElEnd = document.getElementById('highscore-end-val');
  if (highScoreElEnd) {
    const highScore2 = getHighScore(GameState.difficulty);
    highScoreElEnd.textContent = highScore2;
  }
  const hsEnd = document.getElementById('highscore-end-val');
  if (hsEnd) {
    const score = getHighScore(GameState.difficulty);
    hsEnd.textContent = score !== null && score !== undefined ? score : 0;
  }
}

/**
 * Resets the game to its initial state.
 * - Hides the end screen.
 * - Retrieves the selected difficulty level.
 * - Reinitializes the game deck and state variables.
 * - Updates the UI for score, combo, and timer.
 * - Starts a new countdown timer.
 *
 * @returns {void}
 */
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

      //Card combo effect
      triggerComboEffect(GameState.combo);

      // Card match effect
      setTimeout(() => {
        matchEffect(firstCard, secondCard);
      }, 300);

      GameState.flippedCards = [];
      updateScoreAndComboUI();

      const allMatched = GameState.deck.every((c) => c.isMatched);
      if (allMatched) {
        clearInterval(timerInterval);
        checkAndUpdateHighScore(GameState.difficulty);
        showEndScreen();
      }
    } else {
      // ----- NOT matched -----
      GameState.combo = 0;
      updateScoreAndComboUI();

      setTimeout(() => {
        firstCard.isFlipped = false;
        secondCard.isFlipped = false;
        firstElem.classList.remove('is-flipped');
        secondElem.classList.remove('is-flipped');
        GameState.flippedCards = [];
      }, 1000);
    }
  } else {
    const comboElem = document.getElementById('combo-count');
    if (comboElem) comboElem.textContent = `Combo: ${GameState.combo}`;
  }

  return { deck: GameState.deck, flippedCards: GameState.flippedCards };
}

/**
 * Triggers a visual flash effect on both matched cards.
 * Adds the 'card-flash' class to the .card-front of each matched card
 *
 * @param {Object} card1 - The first matched card object
 * @param {Object} card2 - The second matched card object
 * @returns {void}
 */
function matchEffect(card1, card2) {
  const card1Element = document.querySelector(
    `[data-id="${card1.id}"] .card-front`,
  );
  const card2Element = document.querySelector(
    `[data-id="${card2.id}"] .card-front`,
  );

  if (card1Element && card2Element) {
    card1Element.classList.add('card-flash');
    card2Element.classList.add('card-flash');

    setTimeout(() => {
      card1Element.classList.remove('card-flash');
      card2Element.classList.remove('card-flash');
    }, 1000);
  }
}

/**
 * Checks if all cards in the current deck are matched.
 * If all cards are matched, stops the timer, updates the high score,
 * and shows the end screen.
 *
 * @returns {void}
 */
function allMatched() {
  const allMatched = GameState.deck.every((c) => c.isMatched);
  if (allMatched) {
    clearInterval(timerInterval);
    checkAndUpdateHighScore(GameState.difficulty);
    showEndScreen();
  }
}

/**
 * Checks if the current time left is a new high score for the given difficulty,
 * updates the high score in storage if needed, refreshes the high score display
 * in the game UI and the start screen.
 *
 * @param {number} diff - The difficulty level to check the high score for.
 * @returns {void}
 */
function checkAndUpdateHighScore(diff) {
  maybeSetHighScore(diff, GameState.timeLeft);
  updateHighScoreUI();
  renderStartScreenHighScores();
}

//  Score + Reset Button Logic
/**
 * Current player score.
 * @type {number}
 */
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

      renderStartScreenHighScores();

      resetTimer();
    });
  }
});

/**
 * Countdown timer
 *
 * @type {number | null}
 */
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

/** Map Difficulty → Storage‑Key */
/**
 * Returns the localStorage key for a given difficulty level.
 *
 * @param {number} diff - The difficulty level (e.g., 4, 6, or 8).
 * @returns {string} - The associated localStorage key.
 */
function keyFor(diff) {
  switch (diff) {
    case 4:
      return 'matchHighScore_easy';
    case 6:
      return 'matchHighScore_medium';
    case 8: // fall-through
    default:
      return 'matchHighScore_hard';
  }
}

/** Holt High‑Score (oder null) */
/**
 * Retrieves the high score for a given difficulty from localStorage.
 *
 * @param {number} diff - The difficulty level.
 * @returns {number|null} - The high score or null if not set.
 */
function getHighScore(diff) {
  const val = localStorage.getItem(keyFor(diff));
  return val !== null ? parseInt(val) : null;
}

/** Speichert neuen High‑Score, wenn besser (größer) */
/**
 * Saves the current score to localStorage if it's higher than the existing one.
 *
 * @param {number} diff - The difficulty level.
 * @param {number} timeLeft - The remaining time when game ended.
 * @returns {void}
 */
function maybeSetHighScore(diff, timeLeft) {
  const score = getHighScore(diff);
  const current = score !== null && score !== undefined ? score : -1;
  if (timeLeft > current) {
    localStorage.setItem(keyFor(diff), timeLeft);
  }
}

/**
 * Updates the start screen UI with the high scores for each difficulty level.
 *
 * @returns {void}
 */
function renderStartScreenHighScores() {
  const startScreen = document.getElementById('start-screen');
  if (!startScreen || startScreen.style.display === 'none') return;
  const map = [
    { diff: 4, el: 'hs-easy' },
    { diff: 6, el: 'hs-medium' },
    { diff: 8, el: 'hs-hard' },
  ];
  map.forEach(({ diff, el }) => {
    const span = document.getElementById(el);
    if (!span) return;
    const val = getHighScore(diff);
    span.textContent = val !== null ? val : '–';
  });
}

document.addEventListener('DOMContentLoaded', renderStartScreenHighScores);

/**
 * Handles logic when the timer reaches 0.
 * Displays the end screen with a "TIME'S UP!" message
 * and shows the player's final score and high score.
 *
 * @returns {void}
 */
function handleTimeOut() {
  checkAndUpdateHighScore(GameState.difficulty);
  const highScoreElEnd = document.getElementById('highscore-end-val');
  if (highScoreElEnd) {
    const highScore2 = getHighScore(GameState.difficulty);
    highScoreElEnd.textContent = highScore2;
  }

  checkAndUpdateHighScore(GameState.difficulty);
  const hsEnd = document.getElementById('highscore-end-val');
  if (hsEnd) {
    const score = getHighScore(GameState.difficulty);
    hsEnd.textContent = score !== null && score !== undefined ? score : 0;
  }
  if (endScreen) endScreen.classList.remove('hidden');
  if (winnerMsg) winnerMsg.textContent = `TIME'S UP!`;
  if (finalScoreText)
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
    const highScore = getHighScore(GameState.difficulty) || 0;
    highScoreEl.textContent = highScore;
  }
  const el = document.getElementById('highscore');
  if (!el) return;
  const best = getHighScore(GameState.difficulty);
  el.textContent = best !== null && best !== undefined ? best : 0;
}

export {
  initGame,
  renderBoard,
  showEndScreen,
  resetGame,
  flipCard,
  updateScore,
};
