import { describe, it, expect, beforeEach, vi } from "vitest";
import { GameState, PokemonCard } from "../GameState";

describe("GameState", () => {
  let gameState: GameState;

  // Helper to create mock cards
  const createCard = (value: number, types: string[]): PokemonCard => ({
    name: "mock",
    value,
    image: "mock.png",
    evolvedFrom: null,
    evolvesTo: null,
    types: types.map((t) => ({ type: { name: t } })),
    id: crypto.randomUUID(),
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    gameState = new GameState();
  });

      
  it("should initialize with correct default state", () => {
    expect(gameState.state).toBe("INTRO");
    expect(gameState.pokemon_cards.length).toBeGreaterThan(0);
    expect(gameState.player_deck.length).toBe(40);
    expect(gameState.hand_cards.length).toBe(0);
    expect(gameState.score).toBe(0);
    expect(gameState.fightReward).toBe(50);
    expect(gameState.discardsRemaining).toBe(3);
  });

  it("should evaluate High Card", () => {
    const cards = [
      createCard(1, ["normal"]),
      createCard(2, ["fire"]),
      createCard(4, ["water"]), // Gap, no straight
      createCard(3, ["grass"]), 
    ];
    // With 4 cards 1,2,3,4 it is just High Card.
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("High Card");
    expect(result.chips).toBe(5);
    expect(result.mult).toBe(1);
  });

  it("should evaluate Pair", () => {
    const cards = [
      createCard(5, ["normal"]),
      createCard(5, ["fire"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Pair");
    expect(result.chips).toBe(10);
    expect(result.mult).toBe(2);
  });

  it("should evaluate Two Pair", () => {
    const cards = [
      createCard(5, ["normal"]),
      createCard(5, ["fire"]),
      createCard(3, ["water"]),
      createCard(3, ["grass"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Two Pair");
    expect(result.chips).toBe(20);
    expect(result.mult).toBe(2);
  });

  it("should evaluate Three of a Kind", () => {
    const cards = [
      createCard(5, ["normal"]),
      createCard(5, ["fire"]),
      createCard(5, ["water"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Three of a Kind");
    expect(result.chips).toBe(30);
    expect(result.mult).toBe(3);
  });

  it("should evaluate Straight", () => {
    const cards = [
      createCard(1, ["normal"]),
      createCard(2, ["fire"]),
      createCard(3, ["water"]),
      createCard(4, ["grass"]),
      createCard(5, ["electric"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Straight");
    expect(result.chips).toBe(45);
    expect(result.mult).toBe(5);
  });

  it("should evaluate Flush", () => {
    const cards = [
      createCard(1, ["fire"]),
      createCard(1, ["fire"]),
      createCard(3, ["fire"]),
      createCard(4, ["fire"]),
      createCard(5, ["fire"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Flush");
    expect(result.chips).toBe(50);
    expect(result.mult).toBe(6);
  });

  it("should evaluate Full House", () => {
    const cards = [
      createCard(5, ["normal"]),
      createCard(5, ["fire"]),
      createCard(5, ["water"]),
      createCard(2, ["grass"]),
      createCard(2, ["electric"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Full House");
    expect(result.chips).toBe(40);
    expect(result.mult).toBe(4);
  });

  it("should evaluate Four of a Kind", () => {
    const cards = [
      createCard(5, ["normal"]),
      createCard(5, ["fire"]),
      createCard(5, ["water"]),
      createCard(5, ["grass"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Four of a Kind");
    expect(result.chips).toBe(60);
    expect(result.mult).toBe(7);
  });

  it("should evaluate Five of a Kind", () => {
    const cards = [
      createCard(5, ["normal"]),
      createCard(5, ["fire"]),
      createCard(5, ["water"]),
      createCard(5, ["grass"]),
      createCard(5, ["electric"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Five of a Kind");
    expect(result.chips).toBe(120);
    expect(result.mult).toBe(12);
  });

  it("should evaluate Straight Flush", () => {
    const cards = [
      createCard(1, ["fire"]),
      createCard(2, ["fire"]),
      createCard(3, ["fire"]),
      createCard(4, ["fire"]),
      createCard(5, ["fire"]),
    ];
    const result = gameState.evaluateHand(cards);
    expect(result.name).toBe("Straight Flush");
    expect(result.chips).toBe(120);
    expect(result.mult).toBe(10);
  });
  
  it("should calculate type effectiveness", () => {
      // Mock card and type map interactions are integration tests usually, 
      // but we can test logic with known inputs.
      // Fire vs Grass (2x)
      const fireCard = createCard(1, ["fire"]);
      const grassTypes = [{ type: { name: "grass" } }];
      expect(gameState.getTypeEffectiveness(fireCard, grassTypes)).toBe(2);

      // Water vs Fire (2x)
      const waterCard = createCard(1, ["water"]);
      const fireTypes = [{ type: { name: "fire" } }];
      expect(gameState.getTypeEffectiveness(waterCard, fireTypes)).toBe(2);
      
      // Normal vs Ghost (0x)
       const normalCard = createCard(1, ["normal"]);
       const ghostTypes = [{ type: { name: "ghost" } }];
       expect(gameState.getTypeEffectiveness(normalCard, ghostTypes)).toBe(0);
  });

  it("should evaluate hand stats with chips and mult", () => {
      // Pair of 5s (Fire vs Grass -> 2x effectiveness on chips)
      const c1 = createCard(5, ["fire"]);
      const c2 = createCard(5, ["fire"]);
      
      gameState.selectedCards = [c1, c2];
      
      // Mock Enemy
      gameState.enemy = {
          pokemon: createCard(1, ["grass"]),
          hp: 100,
          maxHp: 100,
          damageTaken: 0,
      };

      const stats = gameState.calculateCurrentHandStats();
      expect(stats.handName).toBe("Pair");
      
      // Chips:
      // Base Hand Chips for Pair: 10
      // Card 1: Value 5 -> 50 base. Eff 2x -> 100.
      // Card 2: Value 5 -> 50 base. Eff 2x -> 100.
      // Total Chips: 10 + 100 + 100 = 210.
      expect(stats.damage).toBe(210);
      
      // Mult:
      // Base Hand Mult for Pair: 2
      expect(stats.multiplier).toBe(2);
  });
  
  it("should submit hand dealing correct damage", () => {
     vi.useFakeTimers();
     gameState.restartGame(); 
     while(gameState.state === "INTRO") gameState.nextIntroMessage();
     
     // Mock Enemy HP
     if(gameState.enemy) gameState.enemy.hp = 1000;
     
     const c1 = createCard(5, ["fire"]); // Value 5
     gameState.hand_cards = [c1];
     gameState.selectedCards = [c1];
     
     // Mock enemy types to nothing to avoid varying multipliers
     if(gameState.enemy) gameState.enemy.pokemon.types = []; 

     // High Card Stats:
     // Chips: 5 (Base) + 50 (Card: 5*10 * 1eff) = 55.
     // Mult: 1.
     // Total: 55.
     
     gameState.submitHand();
     vi.advanceTimersByTime(500);
     
     // Enemy HP should reduce by 55
     expect(gameState.enemy?.hp).toBe(1000 - 55);
     vi.useRealTimers();
  });
  
  it("should reset submitsRemaining on enemy kill", () => {
      vi.useFakeTimers();
      gameState.restartGame();
      while(gameState.state === "INTRO") gameState.nextIntroMessage();
      
      if(gameState.enemy) gameState.enemy.hp = 1;
      
      const c1 = createCard(5, ["fire"]);
      gameState.hand_cards = [c1];
      gameState.selectedCards = [c1];
      
      gameState.submitHand(); // Should kill
      vi.advanceTimersByTime(500);
      
      expect(gameState.enemies_defeated).toBe(1);
      expect(gameState.submitsRemaining).toBe(4); // Reset to 4
      expect(gameState.enemy?.hp).toBeGreaterThan(1); // New enemy
      
      vi.useRealTimers();
  });
  
  it("should discard selected cards and refill hand", () => {
      gameState.restartGame();
      while(gameState.state === "INTRO") gameState.nextIntroMessage();
      
      expect(gameState.hand_cards.length).toBe(8);
      expect(gameState.discardsRemaining).toBe(3);
      
      // Select 2 cards
      const c1 = gameState.hand_cards[0];
      const c2 = gameState.hand_cards[1];
      gameState.selectedCards = [c1, c2];
      
      gameState.discardSelected();
      
      // Discard should decrease
      expect(gameState.discardsRemaining).toBe(2);
      
      // Hand should be full again
      expect(gameState.hand_cards.length).toBe(8);
      
      // Hand should not contain discarded cards (assuming deck has enough cards and random doesn't pick same if referenced, 
      // but logic removes them from deck so they shouldn't reappear immediately unless deck wraps around or similar.
      // The current implementation draws from deck. deck length is 40.
      expect(gameState.hand_cards).not.toContain(c1);
      expect(gameState.hand_cards).not.toContain(c2);
  });

  it("should not discard if 0 discards remaining", () => {
      gameState.restartGame();
      while(gameState.state === "INTRO") gameState.nextIntroMessage();
      
      gameState.discardsRemaining = 0;
      
      const c1 = gameState.hand_cards[0];
      gameState.selectedCards = [c1];
      
      gameState.discardSelected();
      
      expect(gameState.discardsRemaining).toBe(0);
      expect(gameState.hand_cards).toContain(c1);
  });
});
