import { describe, expect, it } from "vitest";
import { formatGooglePlaceLabel, looksLikeGooglePlusCode } from "@/lib/google-place-label";

describe("looksLikeGooglePlusCode", () => {
  it("detects Dover ferry port plus code", () => {
    expect(looksLikeGooglePlusCode("48GM+RC, Dover CT16 1JA")).toBe(true);
  });

  it("ignores normal street addresses", () => {
    expect(looksLikeGooglePlusCode("10 High Street, Dover CT16 1EH")).toBe(false);
  });
});

describe("formatGooglePlaceLabel", () => {
  it("keeps autocomplete selection for ferry port", () => {
    expect(
      formatGooglePlaceLabel({
        name: "Port of Dover",
        formattedAddress: "48GM+RC, Dover CT16 1JA",
        selectedText: "Dover Ferry Port, Dover",
        types: ["ferry_terminal", "point_of_interest"],
      }),
    ).toBe("Dover Ferry Port, Dover");
  });

  it("uses place name when formatted address is a plus code", () => {
    expect(
      formatGooglePlaceLabel({
        name: "Dover Ferry Port",
        formattedAddress: "48GM+RC, Dover CT16 1JA",
        types: ["point_of_interest"],
      }),
    ).toBe("Dover Ferry Port");
  });

  it("keeps normal formatted addresses", () => {
    expect(
      formatGooglePlaceLabel({
        formattedAddress: "10 High Street, Dover CT16 1EH",
      }),
    ).toBe("10 High Street, Dover CT16 1EH");
  });
});
