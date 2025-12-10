import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CurrentMoney from "../CurrentMoney.vue";
import { GameState } from "../../game/GameState";
import CoinIcon from "../icons/CoinIcon.vue";

describe("CurrentMoney.vue", () => {
  it("renders the score from game state", () => {
    const game = new GameState();
    game.score = 12345;

    const wrapper = mount(CurrentMoney, {
      props: {
        game: game,
      },
    });

    expect(wrapper.text()).toContain("12345");
    expect(wrapper.findComponent(CoinIcon).exists()).toBe(true);
  });
});
