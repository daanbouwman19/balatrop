import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import App from "../../App.vue";

// Mock child components
vi.mock("../../components/score-bar/ScoreBar.vue", () => ({
  default: {
    props: ["game", "isMounted"],
    template: '<div class="score-bar-stub"></div>'
  },
}));
vi.mock("../../components/RotateDevice.vue", () => ({
  default: { template: '<div class="rotate-device-stub"></div>' },
}));
vi.mock("../../components/CurrentMoney.vue", () => ({
  default: { template: '<div class="current-money-stub"></div>' },
}));
vi.mock("../../components/PokemonCard.vue", () => ({
  default: {
    props: ["card", "selected"],
    emits: ["click"],
    template: '<div class="pokemon-card-stub" :class="{ selected }" @click="$emit(\'click\')"></div>',
  },
}));

// Mock Element.animate
const mockAnimate = vi.fn(() => ({
  onfinish: null,
  cancel: vi.fn(),
}));

describe("App.vue", () => {
  const originalInnerWidth = window.innerWidth;
  const originalScreen = window.screen;
  const originalAnimate = HTMLElement.prototype.animate;

  beforeEach(() => {
    vi.clearAllMocks();

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

    // Mock animate
    HTMLElement.prototype.animate = mockAnimate as unknown as typeof HTMLElement.prototype.animate;
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

    HTMLElement.prototype.animate = originalAnimate;
  });

  // Helper to skip intro
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function skipIntro(wrapper: any) {
    let clicks = 0;
    while (
      wrapper.find(".absolute.inset-0.z-50.bg-black").exists() &&
      clicks < 20
    ) {
      await wrapper.find(".absolute.inset-0.z-50.bg-black").trigger("click");
      clicks++;
    }
  }

  it("renders Intro state initially", () => {
    const wrapper = mount(App);
    expect(wrapper.find(".rotate-device-stub").exists()).toBe(false);
    expect(wrapper.text()).toContain("Welcome to the game!");
  });

  it("transitions from Intro to Game on click", async () => {
    const wrapper = mount(App);
    await skipIntro(wrapper);
    expect(wrapper.find(".absolute.inset-0.z-50.bg-black").exists()).toBe(false);
    expect(wrapper.find(".score-bar-stub").exists()).toBe(true);
  });

  it("shows RotateDevice when width is small", async () => {
    const wrapper = mount(App);
    Object.defineProperty(window, "innerWidth", { value: 500 });
    window.dispatchEvent(new Event("resize"));
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".rotate-device-stub").exists()).toBe(true);
  });

  it("shows RotateDevice when orientation is portrait", async () => {
    Object.defineProperty(window, "screen", {
      value: { orientation: { type: "portrait-primary" } },
    });
    const wrapper = mount(App);
    window.dispatchEvent(new Event("orientationchange"));
    expect(wrapper.find(".rotate-device-stub").exists()).toBe(true);
  });

  it("handles card selection and discard", async () => {
    const wrapper = mount(App);
    await skipIntro(wrapper);

    // Find Discard Button
    const buttons = wrapper.findAll("button");
    const discardBtn = buttons.find((b) => b.text().includes("Discard"));

    expect(discardBtn?.element.disabled).toBe(true);

    // Access GameState via VM to ensure we select correctly
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;

    // Select a card via method
    const card = vm.game.hand_cards[0];
    vm.game.toggleSelectCard(card);
    await wrapper.vm.$nextTick();

    expect(discardBtn?.element.disabled).toBe(false);

    // Discard
    await discardBtn?.trigger("click");
    expect(discardBtn?.text()).toContain("Remaining: 2");

    // Hand should refill
    expect(vm.game.hand_cards.length).toBe(8);
  });

  it("shows Game Over screen and restarts", async () => {
    const wrapper = mount(App);
    await skipIntro(wrapper);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;
    vm.game.state = "GAME_OVER";
    vm.game.score = 999;
    await wrapper.vm.$nextTick();

    const gameOverOverlay = wrapper.find(".bg-black\\/90");
    expect(gameOverOverlay.exists()).toBe(true);
    expect(gameOverOverlay.text()).toContain("GAME OVER");
    expect(gameOverOverlay.text()).toContain("Score: 999");

    // Click Restart
    const restartBtn = gameOverOverlay.find("button");
    await restartBtn.trigger("click");

    expect(vm.game.state).toBe("INTRO");
    // Should be back to intro
    expect(wrapper.text()).toContain("Welcome to the game!");
  });

  it("triggers animations and damage numbers on enemy hit", async () => {
    vi.useFakeTimers();
    const div = document.createElement('div');
    document.body.appendChild(div);
    const wrapper = mount(App, { attachTo: div });

    await skipIntro(wrapper);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vm = wrapper.vm as any;

    const enemyImg = wrapper.find("img");
    expect(enemyImg.exists()).toBe(true);

    vm.game.lastSubmittedHand = {
        damage: 100,
        cardCount: 1,
        timestamp: Date.now(),
        cards: [{ damage: 100, id: "123" }]
    };

    await wrapper.vm.$nextTick();
    vi.advanceTimersByTime(500);

    expect(mockAnimate).toHaveBeenCalled();
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain("100");

    vi.useRealTimers();
    wrapper.unmount();
    div.remove();
  });

  it("triggers screen shake", async () => {
      vi.useFakeTimers();

      const div = document.createElement('div');
      document.body.appendChild(div);
      const wrapper = mount(App, { attachTo: div });

      await skipIntro(wrapper);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const vm = wrapper.vm as any;

      expect(wrapper.find("img").exists()).toBe(true);

      const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);

      vm.game.lastSubmittedHand = {
        damage: 50,
        cardCount: 1,
        timestamp: Date.now(),
        cards: [{ damage: 50, id: "123" }]
      };

      await wrapper.vm.$nextTick();
      vi.advanceTimersByTime(500);
      await wrapper.vm.$nextTick(); // Wait for state update to propagate to DOM

      // Ensure hit triggered
      expect(mockAnimate).toHaveBeenCalled();

      // Check if any element has 'animate-shake' class
      const shakeElement = wrapper.find(".animate-shake");
      expect(shakeElement.exists()).toBe(true);

      vi.advanceTimersByTime(200);
      await wrapper.vm.$nextTick();
      expect(shakeElement.classes()).not.toContain("animate-shake");

      randomSpy.mockRestore();
      vi.useRealTimers();
      wrapper.unmount();
      div.remove();
  });
});
