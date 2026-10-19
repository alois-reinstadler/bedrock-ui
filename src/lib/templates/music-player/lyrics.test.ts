import { describe, expect, it } from 'vitest';
import { activeLyric, parseLrc, selectLyrics, type LyricsRecord } from './lyrics.js';
import { tracks } from './data.js';

describe('synced lyrics', () => {
	it('parses offsets, repeated timestamps and instrumental breaks in time order', () => {
		const lines = parseLrc(
			'[ar:Test]\n[offset:-500]\n[00:12.50][01:02.5]An original test line\n[00:20.00]\n[00:65.0]Invalid'
		);
		expect(lines).toEqual([
			{ time: 12, text: 'An original test line' },
			{ time: 19.5, text: '' },
			{ time: 62, text: 'An original test line' }
		]);
		expect(activeLyric(lines, 0)).toBe(-1);
		expect(activeLyric(lines, 19.5)).toBe(1);
		expect(activeLyric(lines, 14)).toBe(0);
		expect(activeLyric(lines, 100)).toBe(2);
	});
	it('rejects other recordings and artists, preferring the nearest timed recording', () => {
		const record: LyricsRecord = {
			trackName: 'On & On',
			artistName: 'Cartoon',
			duration: 208,
			instrumental: false,
			plainLyrics: 'Original test words',
			syncedLyrics: '[00:01]Original test words'
		};
		expect(
			selectLyrics(
				[
					{ ...record, duration: 215 },
					{ ...record, artistName: 'Someone else' }
				],
				tracks[0]
			)
		).toBeUndefined();
		expect(selectLyrics([{ ...record, duration: 207 }, record], tracks[0])).toEqual(record);
	});
});
