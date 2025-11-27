import { describe, it, expect } from "vitest";
import { lerp } from "../math";

describe("math utils", () => {
  describe("lerp", () => {
    it("interpolates between two numbers", () => {
      expect(lerp(0, 10, 0.5)).toBe(5);
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
    });

    it("handles negative numbers", () => {
        expect(lerp(-10, 10, 0.5)).toBe(0);
    });

    it("extrapolates", () => {
        expect(lerp(0, 10, 1.5)).toBe(15);
        expect(lerp(0, 10, -0.5)).toBe(-5);
    });
  });
});
