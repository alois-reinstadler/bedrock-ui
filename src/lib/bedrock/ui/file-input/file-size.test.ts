import { describe, expect, it } from 'vitest';
import { formatFileSize } from './file-size.js';

describe('formatFileSize', () => {
	it('formats bytes through gigabytes', () => {
		expect(formatFileSize(0)).toBe('0 B');
		expect(formatFileSize(1023)).toBe('1,023 B');
		expect(formatFileSize(1024)).toBe('1 KB');
		expect(formatFileSize(1536)).toBe('1.5 KB');
		expect(formatFileSize(1024 ** 2)).toBe('1 MB');
		expect(formatFileSize(1024 ** 3)).toBe('1 GB');
	});

	it('supports locale overrides', () => {
		expect(formatFileSize(1536, 'de-AT')).toBe('1,5 KB');
	});
});
