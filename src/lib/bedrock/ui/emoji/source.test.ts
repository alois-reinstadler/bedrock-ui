import { describe, expect, it } from 'vitest';
import { appleEmojiSource, getEmojiFilename, splitEmojiText } from './source';

describe('emoji sources', () => {
	it.each([
		['😊', '1f60a.png'],
		['❤️', '2764-fe0f.png'],
		['❤', '2764-fe0f.png'],
		['👍🏽', '1f44d-1f3fd.png'],
		['👩🏽‍💻', '1f469-1f3fd-200d-1f4bb.png'],
		['👨‍👩‍👧‍👦', '1f468-200d-1f469-200d-1f467-200d-1f466.png'],
		['🇦🇹', '1f1e6-1f1f9.png'],
		['1️⃣', '0031-fe0f-20e3.png'],
		['🏳️‍🌈', '1f3f3-fe0f-200d-1f308.png']
	])('resolves %s to its canonical asset', (value, filename) => {
		expect(getEmojiFilename(value)).toBe(filename);
		expect(appleEmojiSource(value)).toBe(
			`https://cdn.jsdelivr.net/npm/emoji-datasource-apple@16.0.0/img/apple/64/${filename}`
		);
	});
	it('does not turn arbitrary text, explicit text presentation or multiple emoji into URLs', () => {
		for (const value of ['', 'hello', '../secret', '😊😊', '♥\uFE0E']) {
			expect(getEmojiFilename(value)).toBeUndefined();
		}
	});
	it('preserves graphemes, text symbols, whitespace, and untrusted markup', () => {
		const text = '<b>Hi</b> © ™ 1 # ♥︎\n👩🏽‍💻 🇦🇹 1️⃣ ❤️';
		const parts = splitEmojiText(text);
		expect(parts.map((part) => part.value).join('')).toBe(text);
		expect(parts.filter((part) => part.emoji).map((part) => part.value)).toEqual([
			'👩🏽‍💻',
			'🇦🇹',
			'1️⃣',
			'❤️'
		]);
		expect(parts[0].value).toBe('<b>Hi</b> © ™ 1 # ♥︎\n');
	});
});
