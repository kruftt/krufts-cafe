const VALUE = /\d+ \d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?/
export const AMOUNT_REGEX = new RegExp(`^(${VALUE.source})(\\s*-\\s*(${VALUE.source}))?$`)

const INT_VALUE = /\d+/
export const SERVES_REGEX = new RegExp(`^(${INT_VALUE.source})(\\s*-\\s*(${INT_VALUE.source}))?$`)

export type ParsedAmount = {
	value: number
	high?: number
	fraction: boolean
}

// "1/4" -> 0.25
function parseFraction(s: string): number | null {
	const parts = s.split('/')
	if (parts.length !== 2) return null
	const num = parseFloat(parts[0]!)
	const den = parseFloat(parts[1]!)
	if (isNaN(num) || isNaN(den) || den === 0) return null
	return num / den
}

// Parses "1", "1.5", "1 1/4" -> number or null
function parseValue(s: string): number | null {
	s = s.trim()
	const spaceIdx = s.indexOf(' ')
	if (spaceIdx !== -1) {
		// mixed fraction: "1 1/4"
		const whole = parseFloat(s.slice(0, spaceIdx))
		const frac = parseFraction(s.slice(spaceIdx + 1))
		if (isNaN(whole) || frac === null) return null
		return whole + frac
	}
	if (s.includes('/')) return parseFraction(s)
	const n = parseFloat(s)
	return isNaN(n) ? null : n
}

function isFraction(s: string): boolean {
	return !s.includes('.')
}

// Rounds a float to the nearest 1/8
function roundToEighth(n: number): number {
	return Math.round(n * 8) / 8
}

// Converts a float to a mixed fraction string, rounded to nearest 1/8
function formatFraction(n: number): string {
	const rounded = roundToEighth(n)
	const whole = Math.floor(rounded)
	const frac = rounded - whole
	if (frac === 0) return whole === 0 ? '0' : String(whole)

	// express frac as n/8, then simplify
	let num = Math.round(frac * 8)
	let den = 8
	const g = gcd(num, den)
	num /= g
	den /= g

	const glyph = FRACTION_GLYPHS[`${num}/${den}`] ?? `${num}/${den}`
	return whole > 0 ? `${whole} ${glyph}` : glyph
}

const FRACTION_GLYPHS: Record<string, string> = {
	"1/2": "½",
	"1/4": "¼", "3/4": "¾",
	"1/8": "⅛", "3/8": "⅜", "5/8": "⅝", "7/8": "⅞",
}

function gcd(a: number, b: number): number {
	return b === 0 ? a : gcd(b, a % b)
}

function formatDecimal(n: number): string {
	n = n + 0.0001;
	n = n - (n % 0.05);
	n = (Math.round(100 * n) / 100);
	return String(n);
}

export function parseAmount(s: string): ParsedAmount | null {
	// split on range separator: " - ", "-" (with optional spaces)
	const rangeParts = s.split(/\s*-\s*/)

	if (rangeParts.length === 2) {
		const low = parseValue(rangeParts[0]!)
		const high = parseValue(rangeParts[1]!)
		if (low === null || high === null) return null
		const fraction = isFraction(s)
		return { value: low, high, fraction }
	}

	const value = parseValue(s)
	if (value === null) return null
	return { value, fraction: isFraction(s) }
}

export function formatAmount(parsed: ParsedAmount, scale: number, { integer = false } = {}): string {
	const fmt = integer
		? (n: number) => String(Math.round(n))
		: parsed.fraction ? formatFraction : formatDecimal
	if (parsed.high !== undefined) {
		return `${fmt(parsed.value * scale)} - ${fmt(parsed.high * scale)}`
	}
	return parsed.value > 0 ? fmt(parsed.value * scale) : "-"
}
