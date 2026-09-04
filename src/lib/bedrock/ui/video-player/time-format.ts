/** `65` → `1:05`, `3671` → `1:01:11`. Invalid input renders as `0:00`. */
export function formatTime(totalSeconds: number): string {
	if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00';
	const whole = Math.floor(totalSeconds);
	const hours = Math.floor(whole / 3600);
	const minutes = Math.floor((whole % 3600) / 60);
	const seconds = whole % 60;
	const two = (value: number) => String(value).padStart(2, '0');
	return hours > 0 ? `${hours}:${two(minutes)}:${two(seconds)}` : `${minutes}:${two(seconds)}`;
}

/** Clamp a seek target into the playable range. */
export function clampTime(value: number, duration: number): number {
	if (!Number.isFinite(duration) || duration <= 0) return 0;
	return Math.min(Math.max(value, 0), duration);
}
