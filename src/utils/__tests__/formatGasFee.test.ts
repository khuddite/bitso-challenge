import { beforeAll, describe, expect, it, vi } from "vitest";
import formatGasFee from "../formatGasFee";

describe("formatGasFee", () => {
  let OriginalNumberFormat: typeof Intl.NumberFormat;
  beforeAll(() => {
    OriginalNumberFormat = Intl.NumberFormat;

    vi.spyOn(Intl, "NumberFormat").mockImplementation((_locales, options) => {
      const formatter = new OriginalNumberFormat("en-US", options);

      return {
        format: formatter.format.bind(formatter), // Bind the original format function
      } as Intl.NumberFormat;
    });
  });

  it("formats gas fee as expected", () => {
    const formatted = formatGasFee("0.001566342", 3500);
    expect(formatted).toBe("0.001566 ETH / 5.48 USD");
  });
});
