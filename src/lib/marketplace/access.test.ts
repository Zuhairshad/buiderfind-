import { describe, expect, it } from "vitest";
import { isWithinCoverage } from "./access";

describe("builder lead coverage", () => {
  const centralLondon: [number, number] = [-0.1276, 51.5072];

  it("accepts a nearby job inside the selected radius", () => {
    const westLondon: [number, number] = [-0.2546, 51.4892];
    expect(isWithinCoverage(centralLondon, westLondon, 10)).toBe(true);
  });

  it("rejects a job outside the selected radius", () => {
    const centralBirmingham: [number, number] = [-1.8904, 52.4862];
    expect(isWithinCoverage(centralLondon, centralBirmingham, 50)).toBe(false);
  });
});
