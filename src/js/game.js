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
  container.innerHTML = ''
  deck.forEach((card, index) => {
    let cardElem = document.createElement('div');
    cardElem.dataset.id = card.id;
    cardElem.dataset.value = card.value

    container.appendChild(cardElem)

  })
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

  return { deck: GameState.deck, flippedCards: GameState.flippedCards };
}