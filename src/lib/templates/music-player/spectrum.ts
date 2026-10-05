export type Spectrum = { fps: number; bands: number; frames: number; data: Uint8Array };
export function decodeSpectrum(buffer: ArrayBuffer): Spectrum {
	const view = new DataView(buffer);
	if (buffer.byteLength < 12 || view.getUint32(0) !== 0x44524654)
		throw new Error('Invalid spectrum');
	const fps = view.getUint16(4, true),
		bands = view.getUint16(6, true),
		frames = view.getUint32(8, true);
	if (!fps || !bands || !frames || buffer.byteLength !== 12 + bands * frames)
		throw new Error('Invalid spectrum size');
	return { fps, bands, frames, data: new Uint8Array(buffer, 12) };
}
/** Interpolate against the media clock, so pauses, seeks and buffering stay exact. */
export function sampleSpectrum(spectrum: Spectrum, time: number, output: Float32Array) {
	const position = Math.max(0, time) * spectrum.fps;
	const frame = Math.min(spectrum.frames - 1, Math.floor(position));
	const next = Math.min(spectrum.frames - 1, frame + 1);
	const mix = Math.min(1, position - frame);
	for (let band = 0; band < spectrum.bands; band++) {
		output[band] =
			(spectrum.data[frame * spectrum.bands + band] * (1 - mix) +
				spectrum.data[next * spectrum.bands + band] * mix) /
			255;
	}
}
