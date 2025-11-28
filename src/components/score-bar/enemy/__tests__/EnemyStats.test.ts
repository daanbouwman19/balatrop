import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EnemyStats from "../EnemyStats.vue";
import { GameState } from "@/game/GameState";
import CoinIcon from "../../../icons/CoinIcon.vue";

describe("EnemyStats.vue", () => {
  it("renders correct number of coins based on reward", () => {
    const game = new GameState();
    game.fightReward = 3;

    const wrapper = mount(EnemyStats, {
      shallow: true,
      props: { game },
    });

    expect(wrapper.text()).toContain("Reward:");
    // When shallow mounted, CoinIcon will be a stub.
    // We can count the components.
    const coins = wrapper.findAllComponents(CoinIcon);
    expect(coins.length).toBe(3);
  });
});
