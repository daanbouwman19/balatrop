import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import DamageIcon from "../DamageIcon.vue";

describe("DamageIcon.vue", () => {
  it("renders a div", () => {
    const wrapper = mount(DamageIcon);
    expect(wrapper.find("div").exists()).toBe(true);
  });
});
