const currencyFormats = new Map<string, Intl.NumberFormat>();

function currencyFormat(currency: string, locale: string): Intl.NumberFormat {
	const key = `${locale}:${currency}`;
	let format = currencyFormats.get(key);
	if (!format) {
		format = new Intl.NumberFormat(locale, { style: 'currency', currency });
		currencyFormats.set(key, format);
	}
	return format;
}

export type DataTableColumnType =
	'text' | 'number' | 'currency' | 'date' | 'datetime' | 'id' | 'badge';

export type CurrencyParts = { amount: string; currency: string };

export function formatCurrencyParts(
	value: unknown,
	currency = 'EUR',
	locale = 'en-US'
): CurrencyParts | null {
	if (value == null || value === '') return null;
	if (typeof value !== 'number') return { amount: String(value), currency };
	const parts = currencyFormat(currency, locale).formatToParts(value);
	return {
		amount: parts
			.filter((part) => part.type !== 'currency' && part.type !== 'literal')
			.map((part) => part.value)
			.join(''),
		currency
	};
}

function toDate(value: unknown): Date | null {
	if (value instanceof Date) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? null : date;
	}
	return null;
}

/** Format one cell value for display using the requested locale. */
export function formatCellValue(
	value: unknown,
	type: DataTableColumnType = 'text',
	currency = 'EUR',
	locale = 'en-US'
): string {
	if (value == null || value === '') return '–';
	switch (type) {
		case 'number':
			return typeof value === 'number'
				? new Intl.NumberFormat(locale).format(value)
				: String(value);
		case 'currency':
			return typeof value === 'number'
				? currencyFormat(currency, locale).format(value)
				: String(value);
		case 'id':
		case 'badge':
			return String(value);
		case 'date': {
			const date = toDate(value);
			return date
				? new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)
				: String(value);
		}
		case 'datetime': {
			const date = toDate(value);
			return date
				? new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
				: String(value);
		}
		default:
			return String(value);
	}
}
