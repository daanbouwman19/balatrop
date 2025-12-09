import { describe, it, expect, vi } from "vitest";
import { GameState } from "../game/GameState";

// Integration test for a full game loop
describe("Game Integration", () => {
  it("should play a full game loop from start to winning a round", async () => {
    vi.useFakeTimers();
    const game = new GameState();

    // 1. Start Intro
    expect(game.state).toBe("INTRO");

    // 2. Skip Intro
    while (game.state === "INTRO") {
      game.nextIntroMessage();
    }

    // 3. Game Start (Select Cards)
    expect(game.state).toBe("SELECT_CARDS");
    expect(game.enemy).toBeDefined();
    expect(game.hand_cards.length).toBe(8);

    // 4. Play a hand
    const enemyMaxHp = game.enemy!.maxHp;

    // Select best cards (greedy strategy for test)
    // Just pick first 5
    const cardsToPlay = game.hand_cards.slice(0, 5);
    cardsToPlay.forEach((c) => game.toggleSelectCard(c));

    expect(game.selectedCards.length).toBe(5);

    // Calculate expected damage
    const { damage, multiplier } = game.calculateCurrentHandStats();
    const totalDamage = damage * multiplier;

    // Submit
    game.submitHand();

    // Check state before damage application
    expect(game.hand_cards.length).toBe(3); // 8 - 5

    // Advance time for damage
    vi.advanceTimersByTime(300);

    // Check enemy HP
    const expectedHp = Math.max(0, enemyMaxHp - totalDamage);
    // Note: Floating point errors might happen, but logic is simple math.
    // However, if damage >= hp, enemy respawns.

    if (totalDamage >= enemyMaxHp) {
      // Enemy died and respawned
      expect(game.enemies_defeated).toBe(1);
      expect(game.enemy!.hp).toBe(game.enemy!.maxHp); // Full HP new enemy
      expect(game.submitsRemaining).toBe(4); // Reset to 4
      expect(game.hand_cards.length).toBe(8); // Hand refilled
    } else {
      // Enemy took damage
      expect(game.enemy!.hp).toBe(expectedHp);
      expect(game.submitsRemaining).toBe(3);
    }

    vi.useRealTimers();
  });
});
