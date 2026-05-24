import { describe, expect, it } from "bun:test";
import { formatAmount, parseAmount } from "./amount";

describe("parseAmount", () => {
	describe("integers", () => {
		it("parses a whole number", () => expect(parseAmount("2")).toEqual({ value: 2, fraction: true }));
		it("parses zero", () => expect(parseAmount("0")).toEqual({ value: 0, fraction: true }));
	});

	describe("decimals", () => {
		it("parses a decimal", () => expect(parseAmount("1.5")).toEqual({ value: 1.5, fraction: false }));
		it("parses a decimal less than 1", () => expect(parseAmount("0.25")).toEqual({ value: 0.25, fraction: false }));
	});

	describe("fractions", () => {
		it("parses a simple fraction", () => expect(parseAmount("1/4")).toEqual({ value: 0.25, fraction: true }));
		it("parses 1/2", () => expect(parseAmount("1/2")).toEqual({ value: 0.5, fraction: true }));
		it("parses 3/4", () => expect(parseAmount("3/4")).toEqual({ value: 0.75, fraction: true }));
		it("parses an improper fraction", () => expect(parseAmount("3/2")).toEqual({ value: 1.5, fraction: true }));
	});

	describe("mixed fractions", () => {
		it("parses a mixed fraction", () => expect(parseAmount("1 1/4")).toEqual({ value: 1.25, fraction: true }));
		it("parses a mixed fraction with larger whole", () => expect(parseAmount("2 1/2")).toEqual({ value: 2.5, fraction: true }));
		it("parses a mixed fraction with eighths", () => expect(parseAmount("1 3/8")).toEqual({ value: 1.375, fraction: true }));
	});

	describe("ranges", () => {
		// integers have no "." so isFraction returns true
		it("parses an integer range", () => expect(parseAmount("1 - 2")).toEqual({ value: 1, high: 2, fraction: true }));
		it("parses a range without spaces", () => expect(parseAmount("1-2")).toEqual({ value: 1, high: 2, fraction: true }));
		it("parses a decimal range", () => expect(parseAmount("1.5 - 2.5")).toEqual({ value: 1.5, high: 2.5, fraction: false }));
		it("parses a fraction range", () => expect(parseAmount("1/4 - 1/2")).toEqual({ value: 0.25, high: 0.5, fraction: true }));
		it("parses a mixed fraction range", () => expect(parseAmount("1 1/4 - 2 1/2")).toEqual({ value: 1.25, high: 2.5, fraction: true }));
	});

	describe("invalid input", () => {
		it("returns null for letters", () => expect(parseAmount("abc")).toBeNull());
		it("returns null for empty string", () => expect(parseAmount("")).toBeNull());
		it("returns null for division by zero", () => expect(parseAmount("1/0")).toBeNull());
		it("returns null for bare slash", () => expect(parseAmount("/")).toBeNull());
	});

	describe("fraction flag", () => {
		it("marks integers as fraction (no decimal point)", () => expect(parseAmount("2")?.fraction).toBe(true));
		it("marks decimals as non-fraction", () => expect(parseAmount("1.5")?.fraction).toBe(false));
		it("marks fractions as fraction", () => expect(parseAmount("1/4")?.fraction).toBe(true));
		it("marks mixed fractions as fraction", () => expect(parseAmount("1 1/4")?.fraction).toBe(true));
	});
});

describe("formatAmount", () => {
	describe("fraction formatting", () => {
		it("formats 1/4 as glyph", () => expect(formatAmount({ value: 0.25, fraction: true }, 1)).toBe("¼"));
		it("formats 1/2 as glyph", () => expect(formatAmount({ value: 0.5, fraction: true }, 1)).toBe("½"));
		it("formats 3/4 as glyph", () => expect(formatAmount({ value: 0.75, fraction: true }, 1)).toBe("¾"));
		it("formats 1/8 as glyph", () => expect(formatAmount({ value: 0.125, fraction: true }, 1)).toBe("⅛"));
		it("formats 3/8 as glyph", () => expect(formatAmount({ value: 0.375, fraction: true }, 1)).toBe("⅜"));
		it("formats 5/8 as glyph", () => expect(formatAmount({ value: 0.625, fraction: true }, 1)).toBe("⅝"));
		it("formats 7/8 as glyph", () => expect(formatAmount({ value: 0.875, fraction: true }, 1)).toBe("⅞"));
		it("formats mixed fraction with glyph", () => expect(formatAmount({ value: 1.25, fraction: true }, 1)).toBe("1 ¼"));
		it("formats whole number as integer string", () => expect(formatAmount({ value: 2, fraction: true }, 1)).toBe("2"));
		it("rounds to nearest eighth", () => expect(formatAmount({ value: 0.3, fraction: true }, 1)).toBe("¼"));
		it("scales and formats fraction", () => expect(formatAmount({ value: 0.25, fraction: true }, 2)).toBe("½"));
	});

	describe("decimal formatting", () => {
		// formatDecimal rounds DOWN to the nearest 0.05
		it("formats an integer value", () => expect(formatAmount({ value: 2, fraction: false }, 1)).toBe("2"));
		it("formats a decimal on a 0.05 boundary", () => expect(formatAmount({ value: 1.5, fraction: false }, 1)).toBe("1.5"));
		it("rounds down to nearest 0.05", () => expect(formatAmount({ value: 1.33, fraction: false }, 1)).toBe("1.3"));
		it("rounds down to nearest 0.05 (upper)", () => expect(formatAmount({ value: 1.37, fraction: false }, 1)).toBe("1.35"));
		it("scales then formats", () => expect(formatAmount({ value: 1.5, fraction: false }, 2)).toBe("3"));
	});

	describe("integer mode", () => {
		it("rounds to nearest integer", () => expect(formatAmount({ value: 1.7, fraction: false }, 1, { integer: true })).toBe("2"));
		it("rounds down", () => expect(formatAmount({ value: 1.3, fraction: false }, 1, { integer: true })).toBe("1"));
		it("scales then rounds", () => expect(formatAmount({ value: 1, fraction: false }, 3, { integer: true })).toBe("3"));
		it("rounds fraction values", () => expect(formatAmount({ value: 0.25, fraction: true }, 4, { integer: true })).toBe("1"));
	});

	describe("ranges", () => {
		it("formats an integer range", () => expect(formatAmount({ value: 1, high: 2, fraction: true }, 1)).toBe("1 - 2"));
		it("scales a range", () => expect(formatAmount({ value: 1, high: 2, fraction: true }, 2)).toBe("2 - 4"));
		it("formats a fraction range", () => expect(formatAmount({ value: 0.25, high: 0.5, fraction: true }, 1)).toBe("¼ - ½"));
		it("formats a decimal range", () => expect(formatAmount({ value: 1.5, high: 2.5, fraction: false }, 1)).toBe("1.5 - 2.5"));
	});

	describe("zero value", () => {
		it("returns dash when parsed value is zero", () => expect(formatAmount({ value: 0, fraction: false }, 1)).toBe("-"));
		it("does NOT return dash when scale is zero (checks parsed.value not result)", () => expect(formatAmount({ value: 1, fraction: false }, 0)).toBe("0"));
	});
});
