import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ScoreBar from "../ScoreBar.vue";
import { GameState } from "@/game/GameState";

import EnemyStats from "../enemy/EnemyStats.vue";
import EnemyHeader from "../enemy/EnemyHeader.vue";
import CurrentScore from "../current-round/CurrentScore.vue";
import HandInformation from "../current-round/HandInformation.vue";

describe("ScoreBar.vue", () => {
  const game = new GameState();

  it("renders child components when mounted", () => {
    const wrapper = mount(ScoreBar, {
      shallow: true,
      props: {
        isMounted: true,
        game: game,
      },
    });

    expect(wrapper.findComponent(EnemyStats).exists()).toBe(true);
    expect(wrapper.findComponent(EnemyHeader).exists()).toBe(true);
    expect(wrapper.findComponent(CurrentScore).exists()).toBe(true);
    expect(wrapper.findComponent(HandInformation).exists()).toBe(true);
  });

  it("does not render content when not mounted", () => {
    const wrapper = mount(ScoreBar, {
      shallow: true,
      props: {
        isMounted: false,
        game: game,
      },
    });

    // The v-if is on the root div, so nothing should be rendered or just empty comment
    expect(wrapper.findComponent(EnemyStats).exists()).toBe(false);
  });
});
