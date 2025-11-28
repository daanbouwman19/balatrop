import { describe, it, expect } from "vitest";
import { lerp } from "../math";

describe("math utils", () => {
  describe("lerp", () => {
    it("should interpolate between two numbers", () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it("should handle negative numbers", () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
      expect(lerp(-10, 10, 0)).toBe(-10);
      expect(lerp(-10, 10, 1)).toBe(10);
    });

    it("should handle t outside 0-1 range if the implementation allows it", () => {
      // Based on the implementation: a + (b - a) * t
      // lerp(0, 10, 2) => 0 + (10 - 0) * 2 = 20
      expect(lerp(0, 10, 2)).toBe(20);
      expect(lerp(0, 10, -1)).toBe(-10);
    });
  });
});
