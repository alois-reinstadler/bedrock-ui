import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { tracks } from './data.js';
import { decodeSpectrum, sampleSpectrum } from './spectrum.js';

describe('catalog spectra', () => {
	it('has valid frequency data covering every exact catalog recording', () => {
		for (const track of tracks) {
			const bytes = readFileSync(`static/templates/music-player/spectra/${track.id}.bin`);
			const spectrum = decodeSpectrum(
				bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
			);
			expect(spectrum.frames / spectrum.fps).toBeCloseTo(track.duration, 0);
			expect(spectrum.data.some((value) => value > 0)).toBe(true);
		}
	});
	it('interpolates at the audio position, including backwards seeks and end clamping', () => {
		const spectrum = { fps: 2, bands: 2, frames: 2, data: new Uint8Array([0, 255, 255, 0]) };
		const output = new Float32Array(2);
		sampleSpectrum(spectrum, 0.25, output);
		expect([...output]).toEqual([0.5, 0.5]);
		sampleSpectrum(spectrum, 500, output);
		expect([...output]).toEqual([1, 0]);
		sampleSpectrum(spectrum, 0, output);
		expect([...output]).toEqual([0, 1]);
		expect(() => decodeSpectrum(new ArrayBuffer(4))).toThrow('Invalid spectrum');
	});
});
