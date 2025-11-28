import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameState } from "../GameState";

describe("GameState", () => {
  let gameState: GameState;

  beforeEach(() => {
    // Reset any mocks if needed
    vi.restoreAllMocks();
    gameState = new GameState();
  });

  it("should initialize with correct default state", () => {
    expect(gameState.state).toBe("INTRO"); // constructor calls restartGame -> startIntro
    expect(gameState.pokemon_cards.length).toBeGreaterThan(0);
    expect(gameState.player_deck.length).toBe(40);
    expect(gameState.hand_cards.length).toBe(0);
    expect(gameState.score).toBe(0);
  });

  it("should transition through intro messages", () => {
    gameState.restartGame();
    expect(gameState.state).toBe("INTRO");
    expect(gameState.introMessage).toBe("Welcome to the game!");

    // Advance through messages
    const messagesCount = 7; // Based on restartGame array
    for (let i = 0; i < messagesCount - 1; i++) {
      gameState.nextIntroMessage();
    }

    // Last message
    expect(gameState.introMessage).toBe("Smell ya later!");

    // Finish intro
    gameState.nextIntroMessage();
    expect(gameState.state).toBe("SELECT_CARDS"); // fillHand sets it to SELECT_CARDS
    expect(gameState.enemy).not.toBeNull();
    expect(gameState.hand_cards.length).toBe(8);
  });

  it("should fill hand correctly", () => {
    gameState.hand_cards = [];
    gameState.state = "START";
    gameState.fillHand();

    expect(gameState.hand_cards.length).toBe(8);
    expect(gameState.state).toBe("SELECT_CARDS");
    expect(gameState.drawed_this_round.length).toBe(8);
  });

  it("should not draw more cards if deck is empty", () => {
    gameState.player_deck = [];
    gameState.hand_cards = [];
    gameState.fillHand();
    expect(gameState.hand_cards.length).toBe(0);
  });

  it("should toggle card selection", () => {
    gameState.state = "SELECT_CARDS";
    const card = gameState.pokemon_cards[0];

    // Select
    gameState.toggleSelectCard(card);
    expect(gameState.selectedCards).toContain(card);

    // Deselect
    gameState.toggleSelectCard(card);
    expect(gameState.selectedCards).not.toContain(card);
  });

  it("should limit selection to 5 cards", () => {
    gameState.state = "SELECT_CARDS";
    const cards = gameState.pokemon_cards.slice(0, 6);

    cards.forEach((card) => gameState.toggleSelectCard(card));

    expect(gameState.selectedCards.length).toBe(5);
    expect(gameState.selectedCards).toEqual(cards.slice(0, 5));
  });

  it("should calculate type multiplier correctly", () => {
    // Mock card and target types
    // Using known types from typeRelationsMap.json (need to assume content or mock it)
    // Since we import the real json, we can rely on it if we know the data.
    // Fire double damage to Grass.

    const fireCard = {
      ...gameState.pokemon_cards[0],
      types: [{ type: { name: "fire" } }],
    };
    const grassTarget = [{ type: { name: "grass" } }];

    const multiplier = gameState.calculateTypeMultiplier(fireCard, grassTarget);
    expect(multiplier).toBe(2);

    const waterCard = {
      ...gameState.pokemon_cards[0],
      types: [{ type: { name: "water" } }],
    };
    const fireTarget = [{ type: { name: "fire" } }];
    // Water double damage to Fire
    expect(gameState.calculateTypeMultiplier(waterCard, fireTarget)).toBe(2);

    // Normal to Ghost (No damage)
    const normalCard = {
      ...gameState.pokemon_cards[0],
      types: [{ type: { name: "normal" } }],
    };
    const ghostTarget = [{ type: { name: "ghost" } }];
    expect(gameState.calculateTypeMultiplier(normalCard, ghostTarget)).toBe(0);
  });

  it("should calculate hand stats correctly", () => {
    // Setup state
    gameState.restartGame();
    // fast forward to game
    while (gameState.state === "INTRO") gameState.nextIntroMessage();

    const card1 = {
      ...gameState.pokemon_cards[0],
      value: 10,
      types: [{ type: { name: "normal" } }],
    };
    const card2 = {
      ...gameState.pokemon_cards[0],
      value: 20,
      types: [{ type: { name: "normal" } }],
    }; // Same type -> multiplier bonus

    gameState.selectedCards = [card1, card2];

    // Mock enemy to have neutral type
    if (gameState.enemy) {
      gameState.enemy.pokemon.types = [];
    }

    const stats = gameState.calculateCurrentHandStats();

    // Multiplier: 1 + 1.5 (pair) = 2.5 ??
    // Logic:
    // cardTypesCount['normal'] = 1 -> (first card)
    // cardTypesCount['normal'] = 2 -> multiplier += 1.5
    // Base multiplier 1.
    // Total 2.5.

    expect(stats.multiplier).toBe(2.5);
    expect(stats.damage).toBe(30); // 10 + 20
  });

  it("should submit hand and deal damage", async () => {
    vi.useFakeTimers();
    gameState.restartGame();
    while (gameState.state === "INTRO") gameState.nextIntroMessage();

    const initialHp = gameState.enemy?.hp || 100;
    const card = gameState.hand_cards[0];
    gameState.toggleSelectCard(card);

    gameState.submitHand();

    // Wait for timeout
    vi.advanceTimersByTime(300);

    expect(gameState.enemy?.hp).toBeLessThan(initialHp);
    expect(gameState.selectedCards.length).toBe(0);

    vi.useRealTimers();
  });

  it("should handle enemy death and respawn", () => {
    vi.useFakeTimers();
    gameState.restartGame();
    while (gameState.state === "INTRO") gameState.nextIntroMessage();

    if (!gameState.enemy) throw new Error("No enemy");

    // Force kill
    const card = gameState.hand_cards[0];
    gameState.toggleSelectCard(card);

    // Hack damage calculation to ensure kill
    // We can just spyOn calculateCurrentHandStats or modify enemy HP directly?
    // modifying enemy HP directly won't work because submitHand calculates damage.
    // Let's set enemy HP to 1.
    gameState.enemy.hp = 1;

    gameState.submitHand();
    vi.advanceTimersByTime(300);

    expect(gameState.enemies_defeated).toBe(1);
    expect(gameState.enemy.hp).toBeGreaterThan(0); // New enemy spawned

    vi.useRealTimers();
  });

  it("should game over if submits run out", () => {
    vi.useFakeTimers();
    gameState.restartGame();
    while (gameState.state === "INTRO") gameState.nextIntroMessage();

    gameState.submitsRemaining = 1;
    // Set enemy HP high so it doesn't die
    if (gameState.enemy) gameState.enemy.hp = 999999;

    const card = gameState.hand_cards[0];
    gameState.toggleSelectCard(card);

    gameState.submitHand();
    vi.advanceTimersByTime(300);

    expect(gameState.state).toBe("GAME_OVER");

    vi.useRealTimers();
  });
});
