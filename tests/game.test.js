const { initGame, flipCard } = require('../src/js/game');
const { Card,  GameState } = require('../src/js/utils');


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