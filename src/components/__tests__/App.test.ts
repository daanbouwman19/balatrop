import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../../App.vue";

// Mock child components
vi.mock("../../components/score-bar/ScoreBar.vue", () => ({
  default: { template: '<div class="score-bar-stub"></div>' },
}));
vi.mock("../../components/RotateDevice.vue", () => ({
  default: { template: '<div class="rotate-device-stub"></div>' },
}));
vi.mock("../../components/CurrentMoney.vue", () => ({
  default: { template: '<div class="current-money-stub"></div>' },
}));
vi.mock("../../components/PokemonCard.vue", () => ({
  default: {
    template: '<div class="pokemon-card-stub" @click="$emit(\'click\')"></div>',
  },
}));

describe("App.vue", () => {
  const originalInnerWidth = window.innerWidth;
  const originalScreen = window.screen;

  beforeEach(() => {
    // Reset window properties to a "Desktop" state
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });

    Object.defineProperty(window, "screen", {
      writable: true,
      configurable: true,
      value: {
        orientation: {
          type: "landscape-primary",
        },
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, "screen", {
      writable: true,
      configurable: true,
      value: originalScreen,
    });
  });

  it("renders Intro state initially", () => {
    const wrapper = mount(App);
    // Should NOT show rotate device
    expect(wrapper.find(".rotate-device-stub").exists()).toBe(false);

    // Should show intro
    expect(wrapper.text()).toContain("Welcome to the game!");
  });

  it("transitions from Intro to Game on click", async () => {
    const wrapper = mount(App);

    // Click through intro messages
    // We loop until the overlay is gone.

    // Safety break to prevent infinite loop
    let clicks = 0;
    while (
      wrapper.find(".absolute.inset-0.z-50.bg-black").exists() &&
      clicks < 20
    ) {
      await wrapper.find(".absolute.inset-0.z-50.bg-black").trigger("click");
      clicks++;
    }

    expect(wrapper.find(".absolute.inset-0.z-50.bg-black").exists()).toBe(
      false,
    );
    expect(wrapper.find(".score-bar-stub").exists()).toBe(true);
  });

  it("shows RotateDevice when width is small", async () => {
    const wrapper = mount(App);
    expect(wrapper.find(".rotate-device-stub").exists()).toBe(false);

    // Set mobile width
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 500,
    });

    // Dispatch resize to trigger updateWidth
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".rotate-device-stub").exists()).toBe(true);
  });

  it("shows RotateDevice when orientation is portrait", async () => {
    // Set portrait
    Object.defineProperty(window, "screen", {
      writable: true,
      configurable: true,
      value: {
        orientation: {
          type: "portrait-primary",
        },
      },
    });

    window.dispatchEvent(new Event("orientationchange"));

    const wrapper = mount(App);
    expect(wrapper.find(".rotate-device-stub").exists()).toBe(true);
  });
});
