/**
 * @param {number|string} id - Unique identifier for the card
 * @param {*} value - Value used to determine matching pairs
 */
export class Card {
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
export function generateDeck(pairs = 8) {
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

export function shuffleDeck(deck) {
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
 * Tracks the full state of the game, including the deck, flipped cards, score, and current round.
 */
export const GameState = {
  deck: generateDeck(),
  flippedCards: [],
  score: 0,
  round: 1,
  combo: 0,
};
