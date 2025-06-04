import {
  Card,
  generateDeck,
  shuffleDeck,
  GameState,
  addScore,
  getScore,
  matchCheck,
} from './utils.js';
/**
 * Initializes a new game round.
 *
 * @returns {Card[]}
 */
function initGame() {
  const deck = generateDeck();
  const shuffledDeck = shuffleDeck(deck);

  GameState.deck = shuffledDeck;
  GameState.flippedCards = [];
  GameState.score = 0;
  GameState.round = 1;
  GameState.timeLeft = 60;

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
  if (!container) return; // to prevent a failing test when the container is null

  container.innerHTML = '';

  deck.forEach((card, index) => {
    const cardElem = document.createElement('article');
    cardElem.classList.add('card');
    cardElem.setAttribute('tabindex', '0');
    cardElem.dataset.id = card.id;
    cardElem.dataset.value = card.value;

    const inner = document.createElement('div');
    inner.classList.add('card-inner');

    const front = document.createElement('div');
    front.classList.add('card-front');
    front.setAttribute('aria-hidden', 'true');
    front.textContent = '?';

    const back = document.createElement('div');
    back.classList.add('card-back');
    back.textContent = card.value;

    if (card.isFlipped || card.isMatched) {
      cardElem.classList.add('flipped');
    }

    cardElem.addEventListener('click', () => {
      const { deck: updatedDeck } = flipCard(index);
      renderBoard(container, updatedDeck);
    });

    inner.appendChild(front);
    inner.appendChild(back);
    cardElem.appendChild(inner);
    container.appendChild(cardElem);
  });
}

// Setup Start Screen
function setupStartScreen() {
  const startScreen = document.getElementById('start-screen');
  const gameContainer = document.querySelector('.game-container');
  const startBtn = document.getElementById('start-btn');
  const cardGrid =
    document.getElementById('card-grid') ||
    document.querySelector('.card-grid');

  if (!startScreen || !gameContainer || !startBtn || !cardGrid) return;

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
}

// End Screen Logic
const endScreen = document.getElementById('end-screen');
const winnerMsg = document.getElementById('winner-msg');
const finalScoreText = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again-btn');

function showEndScreen(winner, score) {
  winnerMsg.textContent = `PLAYER ${winner} WON!`;
  finalScoreText.textContent = `Final Score: ${score.player1} - ${score.player2}`;
  endScreen.classList.remove('hidden');
}

function resetGame() {
  endScreen.classList.add('hidden');
  const newDeck = initGame();

  GameState.combo = 0;
  GameState.score = 0;
  updateScoreAndComboUI();

  const cardGrid =
    document.getElementById('card-grid') ||
    document.querySelector('.card-grid');
  renderBoard(cardGrid, newDeck);
  resetTimer();
}

if (playAgainBtn) {
  playAgainBtn.addEventListener('click', resetGame);
}

const resetBtn = document.getElementById('reset-btn');
if (resetBtn) resetBtn.addEventListener('click', resetGame);

function updateScoreAndComboUI() {
  const scoreElem = document.getElementById('score');
  const comboElem = document.getElementById('combo-count');
  if (scoreElem) scoreElem.textContent = GameState.score;
  if (comboElem) comboElem.textContent = GameState.combo;
}

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

        const cardGrid =
          document.getElementById('card-grid') ||
          document.querySelector('.card-grid');
        renderBoard(cardGrid, GameState.deck);
      }, 1000);
    }
  }

  return { deck: GameState.deck, flippedCards: GameState.flippedCards };
}

document.addEventListener('DOMContentLoaded', () => {
  setupStartScreen();
});

// Countdown Timer
let timerInterval = null;

function startTimer() {
  clearInterval(timerInterval);
  GameState.timeLeft = 60;
  updateTimerUI();

  timerInterval = setInterval(() => {
    GameState.timeLeft--;
    updateTimerUI();

    if (GameState.timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeOut();
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  GameState.timeLeft = 60;
  updateTimerUI();
}

function updateTimerUI() {
  const timerEl = document.getElementById('timer');
  if (timerEl) timerEl.textContent = GameState.timeLeft;
}

function handleTimeOut() {
  endScreen.classList.remove('hidden');
  winnerMsg.textContent = `TIME'S UP!`;
  finalScoreText.textContent = `Your Score: ${GameState.score}`;
}

// Export this so it can be used when cards match
//export { updateScore };

export {
  initGame,
  renderBoard,
  showEndScreen,
  resetGame,
  flipCard,
  updateScoreAndComboUI,
};
