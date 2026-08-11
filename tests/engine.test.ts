import { describe, it, expect } from "vitest";
import { listDevices, resolveViewport, demo, inspect, run } from "../src/engine";

describe("mobile-previewer", () => {
  it("lists built-in devices", () => {
    expect(listDevices().length).toBeGreaterThanOrEqual(4);
  });

  it("swaps dimensions for landscape phones", () => {
    const p = resolveViewport("iphone-15", "portrait");
    const l = resolveViewport("iphone-15", "landscape");
    expect(p.width).toBeLessThan(p.height);
    expect(l.width).toBeGreaterThan(l.height);
    expect(p.userAgent).toContain("iPhone");
  });

  it("scores multi-device previews", () => {
    const r = run({ devices: ["iphone-15", "desktop-hd"], network: "4g" });
    expect(r.viewports).toHaveLength(2);
    expect(r.network.label).toBe("4g");
    expect(r.author).toContain("zAx4hub");
  });

  it("demo + inspect", () => {
    expect(demo().metrics.devices).toBeGreaterThanOrEqual(4);
    expect(inspect().devices).toContain("pixel-8");
  });
});
