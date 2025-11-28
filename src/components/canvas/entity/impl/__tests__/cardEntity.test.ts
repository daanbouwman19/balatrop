import { describe, it, expect, vi } from "vitest";
import { CardEntity, PokemonCard } from "../cardEntity";

// Mock dependencies if necessary.
// For now, CardEntity uses Image, which is available via jsdom.
// It imports typeRelationsMap, which we will use for verification or mock if needed.

describe("CardEntity", () => {
  // Helper to create a dummy card
  const createPokemonCard = (types: string[]): PokemonCard => ({
    name: "TestPokemon",
    value: 10,
    image: "test.png",
    evolvedFrom: null,
    evolvesTo: [],
    types: types.map((t) => ({ type: { name: t } })),
    entity: null,
  });

  describe("calculateTypeMultiplier", () => {
    let cardEntity: CardEntity;

    it("should return 1 if types are invalid or missing", () => {
      const card = createPokemonCard(["normal"]);
      cardEntity = new CardEntity(0, 0, card);

      // @ts-expect-error Testing robust handling of invalid input
      expect(cardEntity.calculateTypeMultiplier(null)).toBe(1);
      // @ts-expect-error Testing robust handling of invalid input
      expect(cardEntity.calculateTypeMultiplier(undefined)).toBe(1);
    });

    it("should correctly calculate double damage (2x)", () => {
      // Water deals double damage to Fire
      const card = createPokemonCard(["water"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [{ type: { name: "fire" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(2);
    });

    it("should correctly calculate half damage (0.5x)", () => {
      // Water deals half damage to Water
      const card = createPokemonCard(["water"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [{ type: { name: "water" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(0.5);
    });

    it("should correctly calculate no damage (0x)", () => {
      // Normal deals no damage to Ghost (checking typeRelationsMap for verification)
      // typeRelationsMap['normal'].noDamageTo should include 'ghost'

      const card = createPokemonCard(["normal"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [{ type: { name: "ghost" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(0);
    });

    it("should correctly calculate neutral damage (1x)", () => {
      // Normal deals neutral damage to Normal (usually)
      const card = createPokemonCard(["normal"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [{ type: { name: "normal" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(1);
    });

    it("should stack multipliers for multiple card types", () => {
      // If a card has two types, both apply their multipliers.
      // Example: Flying (2x to Bug) + Rock (2x to Bug) -> 4x
      // Let's find a real example or just trust the logic.
      // Fire deals 2x to Bug. Flying deals 2x to Bug.
      // Charizard is Fire/Flying. Target: Bug.

      const card = createPokemonCard(["fire", "flying"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [{ type: { name: "bug" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(4);
    });

    it("should stack multipliers for multiple target types", () => {
      // If target has multiple types.
      // Water vs (Fire + Ground).
      // Water -> Fire (2x)
      // Water -> Ground (2x)
      // Total 4x

      const card = createPokemonCard(["water"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [
        { type: { name: "fire" } },
        { type: { name: "ground" } },
      ];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(4);
    });

    it("should handle complex interactions (0.5 * 2 = 1)", () => {
      // Water vs (Fire + Water)
      // Water -> Fire (2x)
      // Water -> Water (0.5x)
      // Total 1x

      const card = createPokemonCard(["water"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [
        { type: { name: "fire" } },
        { type: { name: "water" } },
      ];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(1);
    });

    it("should handle immunity (0 * anything = 0)", () => {
      // Ground vs (Electric + Fire)
      // Ground -> Electric (2x) ? Wait, Electric -> Ground is 0.
      // Ground -> Fire (2x)
      // Ground -> Electric (2x)

      // Let's use Electric vs (Ground + Water)
      // Electric -> Ground (0x)
      // Electric -> Water (2x)
      // Total 0x

      const card = createPokemonCard(["electric"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [
        { type: { name: "ground" } },
        { type: { name: "water" } },
      ];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(0);
    });

    it("should handle unknown types gracefully", () => {
      const card = createPokemonCard(["unknown_type"]);
      cardEntity = new CardEntity(0, 0, card);

      const targetTypes = [{ type: { name: "fire" } }];

      // Should warn and ignore (return 1)
      const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);

      expect(multiplier).toBe(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Type "unknown_type" not found in typeRelationsMap.',
      );

      consoleSpy.mockRestore();
    });
  });
});
