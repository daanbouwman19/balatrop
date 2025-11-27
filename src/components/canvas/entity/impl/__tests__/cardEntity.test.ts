import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardEntity, PokemonCard } from "../cardEntity";
import typeRelationsMap from "@/typeRelationsMap.json";

// Mock the image loading to avoid issues in jsdom environment
global.Image = class {
  width: number = 0;
  height: number = 0;
  src: string = "";
  onload: (() => void) | null = null;

  constructor(width?: number, height?: number) {
    if (width) this.width = width;
    if (height) this.height = height;

    // Auto-trigger load
    setTimeout(() => {
        if (this.onload) this.onload();
        this.dispatchEvent(new Event("load"));
    }, 0);
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      if (type === 'load') {
          // Store it to simulate triggering if needed, or just rely on dispatchEvent
          this.listeners['load'].push(listener);
      }
  }

  listeners: Record<string, Function[]> = {
      'load': []
  };

  dispatchEvent(event: Event) {
      if (this.listeners[event.type]) {
          this.listeners[event.type].forEach((l: Function) => l(event));
      }
      return true;
  }
} as any;

describe("CardEntity", () => {
  let card: PokemonCard;
  let cardEntity: CardEntity;

  beforeEach(() => {
    card = {
      name: "TestMon",
      value: 10,
      image: "test.png",
      evolvedFrom: null,
      evolvesTo: [],
      types: [{ type: { name: "fire" } }],
      entity: null,
    };
    cardEntity = new CardEntity(0, 0, card);
  });

  describe("calculateTypeMultiplier", () => {
    it("returns 1 for neutral match", () => {
      // Normal type vs Fire type
      // Based on typeRelationsMap.json (which we should probably inspect or mock if we want pure unit tests, but importing it is fine for now)
      // Fire is neutral to Normal in Gen 1 logic usually.
      const targetTypes = [{ type: { name: "normal" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);
      expect(multiplier).toBe(1);
    });

    it("returns 2 for super effective match", () => {
      // Fire is super effective against Grass
      const targetTypes = [{ type: { name: "grass" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);
      expect(multiplier).toBe(2);
    });

    it("returns 0.5 for not very effective match", () => {
      // Fire is not very effective against Water
      const targetTypes = [{ type: { name: "water" } }];
      const multiplier = cardEntity.calculateTypeMultiplier(targetTypes);
      expect(multiplier).toBe(0.5);
    });

    it("returns 0 for no effect match", () => {
        // Ghost has no effect on Normal (and vice versa) in Gen 1? Or Ground vs Flying.
        // Let's use Electric vs Ground (Electric has no effect on Ground)
        const electricCard: PokemonCard = {
            ...card,
            types: [{ type: { name: "electric" } }]
        };
        const electricEntity = new CardEntity(0,0, electricCard);
        const targetTypes = [{ type: { name: "ground" } }];

        const multiplier = electricEntity.calculateTypeMultiplier(targetTypes);
        expect(multiplier).toBe(0);
    });

    it("handles multiple types correctly", () => {
        // Fire/Flying vs Grass/Bug (4x weak)
         const dualTypeCard: PokemonCard = {
            ...card,
            types: [{ type: { name: "fire" } }, { type: { name: "flying" } }]
        };
        const dualTypeEntity = new CardEntity(0,0, dualTypeCard);

        // Grass is weak to Fire (2x) and Flying (2x) -> 4x
        const targetTypes = [{ type: { name: "grass" } }];

        const multiplier = dualTypeEntity.calculateTypeMultiplier(targetTypes);
        expect(multiplier).toBe(4);
    });

    it("handles empty or invalid inputs gracefully", () => {
         const multiplier = cardEntity.calculateTypeMultiplier([]);
         expect(multiplier).toBe(1);
    });
  });
});
