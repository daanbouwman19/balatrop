import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RotateDevice from "../RotateDevice.vue";

describe("RotateDevice.vue", () => {
  it("renders the rotation message", () => {
    const wrapper = mount(RotateDevice);
    expect(wrapper.text()).toContain("Please rotate your device 90 degrees");
  });
});
