const LOCALE = 'de-AT';

const numberFormat = new Intl.NumberFormat(LOCALE);
const dateFormat = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' });
const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
	dateStyle: 'medium',
	timeStyle: 'short'
});
const currencyFormats = new Map<string, Intl.NumberFormat>();

function currencyFormat(currency: string): Intl.NumberFormat {
	let format = currencyFormats.get(currency);
	if (!format) {
		format = new Intl.NumberFormat(LOCALE, { style: 'currency', currency });
		currencyFormats.set(currency, format);
	}
	return format;
}

export type DataTableColumnType = 'text' | 'number' | 'currency' | 'date' | 'datetime';

function toDate(value: unknown): Date | null {
	if (value instanceof Date) return value;
	if (typeof value === 'string' || typeof value === 'number') {
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? null : date;
	}
	return null;
}

/** Format one cell value for display, `de-AT` throughout. */
export function formatCellValue(
	value: unknown,
	type: DataTableColumnType = 'text',
	currency = 'EUR'
): string {
	if (value == null || value === '') return '–';
	switch (type) {
		case 'number':
			return typeof value === 'number' ? numberFormat.format(value) : String(value);
		case 'currency':
			return typeof value === 'number' ? currencyFormat(currency).format(value) : String(value);
		case 'date': {
			const date = toDate(value);
			return date ? dateFormat.format(date) : String(value);
		}
		case 'datetime': {
			const date = toDate(value);
			return date ? dateTimeFormat.format(date) : String(value);
		}
		default:
			return String(value);
	}
}
