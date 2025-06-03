const {
  Card,
  generateDeck,
  shuffleDeck,
  addScore,
  getScore,
  matchCheck,
  GameState,
} = require('../src/js/utils');

test('generateDeck(4) returns 8 cards with exactly 4 matching pairs', () => {
  const deck = generateDeck(4);
  expect(deck.length).toBe(8);

  // Verify each value 1–4 appears exactly twice
  const counts = {};
  deck.forEach((card) => {
    counts[card.value] = (counts[card.value] || 0) + 1;
  });

  expect(Object.keys(counts).length).toBe(4);
  Object.values(counts).forEach((count) => {
    expect(count).toBe(2);
  });
});

test('shuffleDeck keeps same cards but (likely) changes order', () => {
  const original = generateDeck(6); // 12 cards
  const copyIds = original.map((c) => c.id).sort();

  const shuffled = shuffleDeck(original);
  expect(shuffled.length).toBe(12);

  // After sorting by id, the ID lists should match
  const shuffledIds = shuffled.map((c) => c.id).sort();
  expect(shuffledIds).toEqual(copyIds);

  expect(shuffled).not.toEqual(original);
});

test('addScore() increments by 1, and addScore(5) increments by 5', () => {
  expect(getScore()).toBe(0);

  const newScore1 = addScore();
  expect(newScore1).toBe(1);
  expect(getScore()).toBe(1);

  const newScore2 = addScore(5);
  expect(newScore2).toBe(6);
  expect(getScore()).toBe(6);
});

test('matchCheck() returns true for matching cards and clears flippedCards', () => {
  GameState.score = 0;
  const cardA = new Card(1, 'X');
  const cardB = new Card(2, 'X');
  GameState.flippedCards = [cardA, cardB];

  const result = matchCheck();
  expect(result).toBe(true);
  expect(getScore()).toBe(1);
  expect(GameState.flippedCards).toHaveLength(0);
});

test('matchCheck() returns false for non-matching cards, flips them back after 1s, and clears flippedCards', () => {
  jest.useFakeTimers();

  const card1 = new Card(1, 'A');
  const card2 = new Card(2, 'B');
  card1.isFlipped = true;
  card2.isFlipped = true;
  GameState.flippedCards = [card1, card2];

  const result = matchCheck();
  expect(result).toBe(false);

  // Immediately after calling matchCheck, flippedCards should be cleared
  expect(GameState.flippedCards).toHaveLength(0);

  // Cards should still be flipped until the timeout fires
  expect(card1.isFlipped).toBe(true);
  expect(card2.isFlipped).toBe(true);

  // Advance timers so that the 1-second callback runs
  jest.runAllTimers();

  expect(card1.isFlipped).toBe(false);
  expect(card2.isFlipped).toBe(false);

  jest.useRealTimers();
});
