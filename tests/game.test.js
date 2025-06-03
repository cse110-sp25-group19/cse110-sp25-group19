const { initGame, flipCard } = require('../src/js/game');
const { Card, GameState } = require('../src/js/utils');

beforeEach(() => {
  // Reset GameState before each test
  GameState.deck = [];
  GameState.flippedCards = [];
  GameState.score = 0;
  GameState.round = 1;
  GameState.combo = 0;
});

test('initGame() returns a deck of 16 cards and initializes GameState properly', () => {
  const deck = initGame();

  // Should create 16 cards by default (8 pairs)
  expect(deck.length).toBe(16);
  expect(GameState.deck.length).toBe(16);

  // IDs in returned deck and in GameState.deck should match (though ordering is shuffled)
  const returnedIds = deck.map((c) => c.id).sort();
  const stateIds = GameState.deck.map((c) => c.id).sort();
  expect(returnedIds).toEqual(stateIds);

  // After initGame, other GameState values should be reset
  expect(GameState.flippedCards).toHaveLength(0);
  expect(GameState.score).toBe(0);
  expect(GameState.round).toBe(1);
  expect(GameState.combo).toBe(0);
});

test('flipCard(index) flips a single card and adds it to flippedCards', () => {
  // Manually build a tiny deck
  const c1 = new Card(1, 'X');
  const c2 = new Card(2, 'Y');
  GameState.deck = [c1, c2];

  const result = flipCard(0);
  expect(result.flippedCards).toHaveLength(1);
  expect(GameState.deck[0].isFlipped).toBe(true);
});

test('flipCard on two non-matching cards resets combo and flips them back after 1s', () => {
  jest.useFakeTimers();

  const c1 = new Card(1, 'A');
  const c2 = new Card(2, 'B');
  GameState.deck = [c1, c2];
  GameState.combo = 1;

  // Flip first card
  flipCard(0);
  expect(GameState.flippedCards).toHaveLength(1);

  // Flip second card (non-matching)
  const result = flipCard(1);

  // After flipping second card
  expect(result.flippedCards.length).toBe(2);
  expect(GameState.combo).toBe(0);

  // Both cards should remain face-up until timeout
  expect(c1.isFlipped).toBe(true);
  expect(c2.isFlipped).toBe(true);

  // Fast-forward timers so the 1-second timeout runs
  jest.runAllTimers();

  expect(c1.isFlipped).toBe(false);
  expect(c2.isFlipped).toBe(false);
  expect(GameState.flippedCards).toHaveLength(0);

  jest.useRealTimers();
});

test('flipCard on two matching cards increments score & combo and marks them as matched', () => {
  const cA1 = new Card(1, 'Z');
  const cA2 = new Card(2, 'Z');
  GameState.deck = [cA1, cA2];
  GameState.score = 0;
  GameState.combo = 0;

  // Flip both matching cards
  flipCard(0);
  flipCard(1);

  expect(GameState.score).toBe(1);
  expect(GameState.combo).toBe(1);
  expect(cA1.isMatched).toBe(true);
  expect(cA2.isMatched).toBe(true);
  expect(GameState.flippedCards).toHaveLength(0);
});

test('flipCard does nothing if you flip an already flipped or matched card', () => {
  const card = new Card(1, 'X');
  card.isFlipped = true;
  GameState.deck = [card];
  GameState.flippedCards = [card];

  const result = flipCard(0);
  // flippedCards should remain unchanged
  expect(result.flippedCards).toHaveLength(1);
  expect(result.flippedCards[0]).toBe(card);
});
