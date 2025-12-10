import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EnemyHeader from "../EnemyHeader.vue";
import { GameState } from "@/game/GameState";

describe("EnemyHeader.vue", () => {
  it("displays 'Rival' during INTRO state", () => {
    const game = new GameState();
    game.state = "INTRO";

    const wrapper = mount(EnemyHeader, {
      props: { game },
    });

    expect(wrapper.text()).toContain("A wild Rival has appeared");
  });

  it("displays enemy pokemon name during game", () => {
    const game = new GameState();
    game.state = "SELECT_CARDS"; // or any other state
    game.enemy = {
      pokemon: {
        name: "Mewtwo",
        image: "mewtwo.png",
      },
      hp: 100,
      maxHp: 100,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const wrapper = mount(EnemyHeader, {
      props: { game },
    });

    expect(wrapper.text()).toContain("A wild Mewtwo has appeared");
  });

  it("displays 'Unknown' if enemy is missing outside INTRO", () => {
    const game = new GameState();
    game.state = "SELECT_CARDS";
    game.enemy = null;

    const wrapper = mount(EnemyHeader, {
      props: { game },
    });

    expect(wrapper.text()).toContain("A wild Unknown has appeared");
  });
});
