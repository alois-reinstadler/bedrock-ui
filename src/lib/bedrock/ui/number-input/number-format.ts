const numberFormats = new Map<string, Intl.NumberFormat>();
const numberParts = new Map<string, { group: string; decimal: string; minus: string }>();

function optionsKey(options?: Intl.NumberFormatOptions): string {
	if (!options) return '';
	return JSON.stringify(
		Object.entries(options).sort(([left], [right]) => left.localeCompare(right))
	);
}

function getNumberFormat(locale: string, options?: Intl.NumberFormatOptions): Intl.NumberFormat {
	const key = `${locale}:${optionsKey(options)}`;
	let formatter = numberFormats.get(key);
	if (!formatter) {
		formatter = new Intl.NumberFormat(locale, options);
		numberFormats.set(key, formatter);
	}
	return formatter;
}

function getNumberParts(locale: string): { group: string; decimal: string; minus: string } {
	let parts = numberParts.get(locale);
	if (!parts) {
		const formatted = new Intl.NumberFormat(locale).formatToParts(-12345.6);
		parts = {
			group: formatted.find((part) => part.type === 'group')?.value ?? ',',
			decimal: formatted.find((part) => part.type === 'decimal')?.value ?? '.',
			minus: formatted.find((part) => part.type === 'minusSign')?.value ?? '-'
		};
		numberParts.set(locale, parts);
	}
	return parts;
}

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Parse user-entered digits using the locale's group and decimal separators. */
export function parseLocaleNumber(text: string, locale: string): number | null {
	const { group, decimal, minus } = getNumberParts(locale);
	let normalized = text.trim();
	if (!normalized) return null;

	normalized = normalized.replace(/[\u00a0\u202f\s]/g, '');
	if (!/[\u00a0\u202f\s]/.test(group)) {
		normalized = normalized.replace(new RegExp(escapeRegExp(group), 'g'), '');
	}
	if (decimal !== '.' && normalized.includes(decimal)) {
		// A dot is also accepted as the raw decimal separator. When the locale
		// decimal is present, however, dots are unambiguously grouping marks.
		normalized = normalized.replace(/\./g, '').replace(new RegExp(escapeRegExp(decimal), 'g'), '.');
	} else if (decimal !== '.') {
		normalized = normalized.replace(new RegExp(escapeRegExp(decimal), 'g'), '.');
	}
	normalized = normalized.replace(new RegExp(escapeRegExp(minus), 'g'), '-');

	if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return null;
	const value = Number(normalized);
	return Number.isFinite(value) ? value : null;
}

/** Format a finite number with a cached Intl.NumberFormat instance. */
export function formatNumber(
	value: number,
	locale: string,
	options?: Intl.NumberFormatOptions
): string {
	return getNumberFormat(locale, options).format(value);
}
