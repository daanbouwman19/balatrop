import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { reactive } from "vue";
import CurrentScore from "../CurrentScore.vue";
import { GameState } from "@/game/GameState";

describe("CurrentScore.vue", () => {
  it("computes and displays current hand score", () => {
    const game = reactive(new GameState());

    // Create a mock card
    const card = {
      name: "Pikachu",
      value: 5, // Chips: 5*10 = 50
      image: "",
      types: [{ type: { name: "electric" } }],
      id: "1",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    game.selectedCards.push(card);

    const wrapper = mount(CurrentScore, {
      props: { game },
    });

    // Score = 55 * 1 = 55
    expect(wrapper.text()).toContain("55");
    expect(wrapper.text()).toContain("1");
    expect(wrapper.text()).toContain("X");
  });

  it("updates when game state changes", async () => {
    const game = reactive(new GameState());
    const card = {
      name: "Pikachu",
      value: 5,
      image: "",
      types: [{ type: { name: "electric" } }],
      id: "1",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    game.selectedCards.push(card);

    const wrapper = mount(CurrentScore, {
      props: { game },
    });

    expect(wrapper.text()).toContain("55");

    // Add another card to change score
    const card2 = { ...card, id: "2" };
    game.selectedCards.push(card2);

    await wrapper.vm.$nextTick();

    // Check reactivity
    expect(wrapper.text()).toContain("110"); // Damage
    expect(wrapper.text()).toContain("2");   // Mult
    expect(wrapper.text()).toContain("220"); // Total
  });
});
