import codepoints from './codepoints.json';

const normalize = (value: string) => value.replaceAll('\uFE0F', '');
const filenames = new Map(
	codepoints.map((code) => [
		normalize(String.fromCodePoint(...code.split('-').map((point) => parseInt(point, 16)))),
		`${code}.png`
	])
);

/** Resolve complete sequences, including flags, skin tones, keycaps and ZWJ families. */
export function getEmojiFilename(value: string): string | undefined {
	return filenames.get(normalize(value));
}

/** Apple artwork is NOT covered by the metadata's MIT license. See README.md. */
export function appleEmojiSource(value: string): string | undefined {
	const filename = getEmojiFilename(value);
	return filename
		? `https://cdn.jsdelivr.net/npm/emoji-datasource-apple@16.0.0/img/apple/64/${filename}`
		: undefined;
}

export function splitEmojiText(text: string): { value: string; emoji: boolean; index: number }[] {
	// Older runtimes retain readable text instead of splitting a joined emoji incorrectly.
	if (typeof Intl.Segmenter === 'undefined') return [{ value: text, emoji: false, index: 0 }];
	const segments = new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(text);
	const result: { value: string; emoji: boolean; index: number }[] = [];
	for (const { segment, index } of segments) {
		// Honor explicit text presentation and leave ordinary ©, ™, digits, etc. alone.
		const emoji =
			!segment.includes('\uFE0E') &&
			/[\p{Emoji_Presentation}\uFE0F\u20E3]/u.test(segment) &&
			getEmojiFilename(segment) !== undefined;
		const previous = result.at(-1);
		if (!emoji && previous && !previous.emoji) previous.value += segment;
		else result.push({ value: segment, emoji, index });
	}
	return result;
}
