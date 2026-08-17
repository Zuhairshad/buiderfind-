import { describe, expect, it } from "vitest";
import { customerRegistrationSchema, jobCreateSchema, postcodeSchema, quoteCreateSchema } from "./schemas";

describe("platform input validation", () => {
  it("normalises UK postcodes", () => expect(postcodeSchema.parse("sw1a 1aa")).toBe("SW1A 1AA"));
  it("requires strong customer passwords", () => expect(customerRegistrationSchema.safeParse({ firstName: "Jane", lastName: "Smith", email: "jane@example.com", password: "weakpass", acceptedTerms: true }).success).toBe(false));
  it("rejects inverted job budgets", () => expect(jobCreateSchema.safeParse({ trade: "Builder", title: "Rear kitchen extension", description: "A detailed project description that is long enough to validate correctly.", postcode: "M1 1AA", budgetLabel: "£5k", budgetMin: 10000, budgetMax: 5000, preferredStart: "Within a month" }).success).toBe(false));
  it("rejects expired quotes", () => expect(quoteCreateSchema.safeParse({ amount: 1000, message: "A sufficiently detailed quote message for the customer.", scope: ["Labour and materials"], exclusions: [], estimatedDurationDays: 2, availableFrom: new Date(), validUntil: new Date(Date.now() - 1000) }).success).toBe(false));
});
