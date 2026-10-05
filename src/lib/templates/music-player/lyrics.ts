import type { Track } from './data.js';

export type LyricLine = { time: number; text: string };
export type Lyrics = {
	lines: LyricLine[];
	plain: string;
	instrumental: boolean;
};
export type LyricsRecord = {
	trackName: string;
	artistName: string;
	duration: number;
	instrumental: boolean;
	plainLyrics: string | null;
	syncedLyrics: string | null;
};

/** LRC supports repeated timestamps and a global offset in milliseconds. */
export function parseLrc(source: string): LyricLine[] {
	const offset = Number(source.match(/\[offset:([+-]?\d+)\]/i)?.[1] ?? 0) / 1000;
	return source
		.split(/\r?\n/)
		.flatMap((line) => {
			const stamps = [...line.matchAll(/\[(\d+):(\d{2}(?:\.\d+)?)\]/g)];
			const text = line.replace(/\[[^\]]*\]/g, '').trim();
			return stamps
				.filter((stamp) => Number(stamp[2]) < 60)
				.map((stamp) => ({
					time: Math.max(0, Number(stamp[1]) * 60 + Number(stamp[2]) + offset),
					text
				}));
		})
		.sort((a, b) => a.time - b.time);
}

export function activeLyric(lines: LyricLine[], time: number): number {
	let low = 0,
		high = lines.length;
	while (low < high) {
		const middle = (low + high) >>> 1;
		if (lines[middle].time <= time) low = middle + 1;
		else high = middle;
	}
	return low - 1;
}

function title(value: string) {
	return value
		.toLowerCase()
		.replace(/\s*[([]?feat\..*$/i, '')
		.replace(/[^\p{L}\p{N}]/gu, '');
}
export function selectLyrics(records: LyricsRecord[], track: Track): LyricsRecord | undefined {
	const artist = title(track.artist.split(/,| feat\.| & /i)[0]);
	return records
		.filter(
			(record) =>
				title(record.trackName) === title(track.title) &&
				title(record.artistName).includes(artist) &&
				Math.abs(record.duration - track.duration) <= 2
		)
		.sort(
			(a, b) =>
				Number(!!b.syncedLyrics) - Number(!!a.syncedLyrics) ||
				Math.abs(a.duration - track.duration) - Math.abs(b.duration - track.duration)
		)[0];
}

const cache = new Map<string, Lyrics>();
export async function loadLyrics(track: Track, signal: AbortSignal): Promise<Lyrics> {
	const cached = cache.get(track.id);
	if (cached) return cached;
	const query = new URLSearchParams({
		track_name: track.title.replace(/\s*\(feat\..*$/i, ''),
		artist_name: track.artist.split(/,| feat\.| & /i)[0]
	});
	const response = await fetch(`https://lrclib.net/api/search?${query}`, {
		signal: AbortSignal.any([signal, AbortSignal.timeout(12000)])
	});
	if (!response.ok) throw new Error('Lyrics service unavailable');
	const records: LyricsRecord[] = await response.json();
	const record = selectLyrics(records, track);
	const result = {
		lines: parseLrc(record?.syncedLyrics ?? ''),
		plain: record?.plainLyrics ?? '',
		instrumental: record?.instrumental ?? false
	};
	cache.set(track.id, result);
	return result;
}
