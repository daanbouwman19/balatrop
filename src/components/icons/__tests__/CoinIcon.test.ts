import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CoinIcon from "../CoinIcon.vue";

describe("CoinIcon.vue", () => {
  it("renders the coin image with pixelated class", () => {
    const wrapper = mount(CoinIcon);
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/images/coin.png");
    expect(img.classes()).toContain("pixelated");
  });
});
