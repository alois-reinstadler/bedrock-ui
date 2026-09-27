/** A 40 dB audio taper: equal slider steps change gain by equal dB steps.
 * Zero is a hard mute; the rest of the travel spans -40 dB to 0 dB.
 * Slider position is a control level, not a claim of measured loudness.
 */
export function clampVolume(value: number): number {
	return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function volumeToGain(position: number): number {
	const level = clampVolume(position);
	return level === 0 ? 0 : 10 ** ((40 * level - 40) / 20);
}

export function gainToVolume(gain: number): number {
	const amplitude = clampVolume(gain);
	return amplitude === 0 ? 0 : clampVolume((20 * Math.log10(amplitude) + 40) / 40);
}
