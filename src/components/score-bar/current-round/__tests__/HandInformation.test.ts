import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HandInformation from "../HandInformation.vue";
import { GameState } from "@/game/GameState";

describe("HandInformation.vue", () => {
  it("calculates cards left correctly", () => {
    const game = new GameState();

    // Create dummy cards
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dummyCard = { id: "1", name: "Pikachu" } as any;

    game.player_deck = new Array(10).fill(dummyCard);
    game.drawed_this_round = new Array(3).fill(dummyCard);

    const wrapper = mount(HandInformation, {
      props: { game },
    });

    // 10 - 3 = 7
    expect(wrapper.text()).toContain("7");
    expect(wrapper.text()).toContain("Total cards left");
  });
});
