import { describe, expect, it } from "vitest";
import { canTransitionBooking, canTransitionJob, canTransitionQuote } from "./state";

describe("marketplace state transitions", () => {
  it("allows the normal job lifecycle and blocks reopening terminal jobs", () => {
    expect(canTransitionJob("open", "quoting")).toBe(true);
    expect(canTransitionJob("quoting", "awarded")).toBe(true);
    expect(canTransitionJob("completed", "open")).toBe(false);
    expect(canTransitionJob("cancelled", "open")).toBe(false);
  });
  it("keeps accepted and rejected quotes terminal", () => {
    expect(canTransitionQuote("submitted", "accepted")).toBe(true);
    expect(canTransitionQuote("accepted", "withdrawn")).toBe(false);
    expect(canTransitionQuote("rejected", "accepted")).toBe(false);
  });
  it("allows disputes without allowing cancelled bookings to restart", () => {
    expect(canTransitionBooking("confirmed", "disputed")).toBe(true);
    expect(canTransitionBooking("disputed", "completed")).toBe(true);
    expect(canTransitionBooking("cancelled", "confirmed")).toBe(false);
  });
});
