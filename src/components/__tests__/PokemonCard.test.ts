import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PokemonCard from "../PokemonCard.vue";
import type { PokemonCard as IPokemonCard } from "../../game/GameState";

describe("PokemonCard.vue", () => {
  const mockCard: IPokemonCard = {
    name: "Pikachu",
    value: 5,
    image: "pikachu.png",
    evolvedFrom: null,
    evolvesTo: ["Raichu"],
    types: [{ type: { name: "electric" } }],
    id: "test-id",
  };

  it("renders card details correctly", () => {
    const wrapper = mount(PokemonCard, {
      props: {
        card: mockCard,
        selected: false,
      },
    });

    expect(wrapper.text()).toContain("Pikachu");
    expect(wrapper.text()).toContain("Val: 5");
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe("pikachu.png");

    const typeImg = wrapper.findAll("img")[1]; // Second image is type
    expect(typeImg.attributes("src")).toBe("/images/electric.png");
  });

  it("applies selected classes", () => {
    const wrapper = mount(PokemonCard, {
      props: {
        card: mockCard,
        selected: true,
      },
    });

    const div = wrapper.find("div");
    expect(div.classes()).toContain("border-blue-500");
    expect(div.classes()).toContain("-translate-y-5");
  });

  it("applies hover classes when not selected", () => {
    const wrapper = mount(PokemonCard, {
      props: {
        card: mockCard,
        selected: false,
      },
    });

    const div = wrapper.find("div");
    // Check for new hover classes
    expect(div.classes()).toContain("hover:border-yellow-400");
    expect(div.classes()).toContain("hover:brightness-105");
  });

  it("emits click event", async () => {
    const wrapper = mount(PokemonCard, {
      props: {
        card: mockCard,
        selected: false,
      },
    });

    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toBeTruthy();
  });
});
