/**
 * @param {number|string} id - Unique identifier for the card
 * @param {*} value - Value used to determine matching pairs
 */
class Card {
  constructor(id, value) {
    this.id = id;
    this.value = value;
    this.isFlipped = false;
    this.isMatched = false;
  }
}

/*
 * Generates a fresh deck of paired cards (16 cards by default).
 * @param {number} pairs - Number of matching pairs to include (default: 8)
 * @returns {Card[]} Array of Card instances
 */
function generateDeck(pairs = 8) {
  const deck = [];
  let idCounter = 0;
  for (let value = 1; value <= pairs; value++) {
    deck.push(new Card(idCounter++, value));
    deck.push(new Card(idCounter++, value));
  }
  return deck;
}

/**
 * Shuffles the deck using the Fisher–Yates algorithm.
 *
 * @param   {Array} deck  Array of Card objects
 * @returns {Array}       Same array reference, after shuffling
 */

function shuffleDeck(deck) {
  // TODO: Implement Fisher–Yates
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

/**
 * Deck: an array of 16 shuffled Card instances.
 */
// export const Deck = shuffleDeck(generateDeck());

/**
 * Tracks the full state of the game, including the deck, flipped cards, score, time, and current round.
 */
const GameState = {
  deck: generateDeck(),
  flippedCards: [],
  score: 0,
  round: 1,
  combo: 0,
  timeLeft: 60,
};

/**
 * Adds points to the player's score.
 *
 * @param   {number} [points=1]  How many points to add
 * @returns {number}             New total score
 */
function addScore(points = 1) {
  GameState.score += points;
  return GameState.score;
}

/**
 * Retrieves the current score.
 *
 * @returns {number}  Current score value
 */
function getScore() {
  return GameState.score;
}

/**
 * Checks if the cards in flippedCards array matches.
 *
 * @returns {bool}       True if cards match, False if cards are mismatched.
 */
function matchCheck() {
  if (GameState.flippedCards.length !== 2) return;
  let match = false;

  const [card1, card2] = GameState.flippedCards;
  if (card1.value == card2.value) {
    match = true;
    addScore();
  } else {
    setTimeout(() => {
      card1.isFlipped = false;
      card2.isFlipped = false;
    }, 1000);
  }

  GameState.flippedCards = [];
  return match;
}

/**
 * Based on the combo count, function triggers a visual effect.
 * @param {*} combo
 * @returns
 */

export function triggerComboEffect(combo) {
  const gameContainer = document.querySelector('.game-container');
  if (!gameContainer) {
    return;
  }

  gameContainer.classList.remove('combo-2', 'combo-3', 'combo-4', 'combo-5');
  if (combo <= 4 && combo >= 2) {
    gameContainer.classList.add(`combo-${combo}`);
  } else if (combo > 4) {
    gameContainer.classList.add('combo-5');
  }

  if (combo >= 2) {
    gameContainer.classList.add('shake');
    setTimeout(() => {
      gameContainer.classList.remove('shake');
    }, 400);
  }
}

export {
  Card,
  generateDeck,
  shuffleDeck,
  GameState,
  addScore,
  getScore,
  matchCheck,
};
