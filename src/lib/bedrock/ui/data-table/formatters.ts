// Intl constructors are expensive and tables render many cells; cache every
// formatter by locale (and currency) for the lifetime of the module.
const numberFormats = new Map<string, Intl.NumberFormat>();
const dateFormats = new Map<string, Intl.DateTimeFormat>();
const dateTimeFormats = new Map<string, Intl.DateTimeFormat>();
const currencyFormats = new Map<string, Intl.NumberFormat>();

function cached<T>(cache: Map<string, T>, key: string, create: () => T): T {
	let format = cache.get(key);
	if (!format) {
		format = create();
		cache.set(key, format);
	}
	return format;
}

function numberFormat(locale: string): Intl.NumberFormat {
	return cached(numberFormats, locale, () => new Intl.NumberFormat(locale));
}

function dateFormat(locale: string): Intl.DateTimeFormat {
	return cached(
		dateFormats,
		locale,
		() => new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
	);
}

function dateTimeFormat(locale: string): Intl.DateTimeFormat {
	return cached(
		dateTimeFormats,
		locale,
		() => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' })
	);
}

function currencyFormat(currency: string, locale: string): Intl.NumberFormat {
	return cached(
		currencyFormats,
		`${locale}:${currency}`,
		() => new Intl.NumberFormat(locale, { style: 'currency', currency })
	);
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
			return typeof value === 'number' ? numberFormat(locale).format(value) : String(value);
		case 'currency':
			return typeof value === 'number'
				? currencyFormat(currency, locale).format(value)
				: String(value);
		case 'id':
		case 'badge':
			return String(value);
		case 'date': {
			const date = toDate(value);
			return date ? dateFormat(locale).format(date) : String(value);
		}
		case 'datetime': {
			const date = toDate(value);
			return date ? dateTimeFormat(locale).format(date) : String(value);
		}
		default:
			return String(value);
	}
}
