const units = ['B', 'KB', 'MB', 'GB'] as const;

/** Formats a byte count with compact binary units and locale-aware numbers. */
export function formatFileSize(bytes: number, locale = 'en'): string {
	const safeBytes = Math.max(0, bytes);
	const unitIndex = Math.min(
		safeBytes === 0 ? 0 : Math.floor(Math.log(safeBytes) / Math.log(1024)),
		units.length - 1
	);
	const value = safeBytes / 1024 ** unitIndex;
	const formatted = new Intl.NumberFormat(locale, {
		maximumFractionDigits: unitIndex === 0 ? 0 : value < 10 ? 1 : 0
	}).format(value);

	return `${formatted} ${units[unitIndex]}`;
}
