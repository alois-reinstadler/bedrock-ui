/** RMS removes DC offset so a biased input cannot look like speech. */
export function microphoneLevel(samples: Float32Array): number {
	if (!samples.length) return 0;
	let mean = 0;
	for (const sample of samples) mean += Number.isFinite(sample) ? sample : 0;
	mean /= samples.length;
	let energy = 0;
	for (const sample of samples) energy += ((Number.isFinite(sample) ? sample : 0) - mean) ** 2;
	return Math.min(1, Math.sqrt(energy / samples.length));
}

export function clampLevel(level: number): number {
	return Number.isFinite(level) ? Math.max(0, Math.min(1, level)) : 0;
}

/** Visual gain only: expands quiet speech without changing the captured audio. */
export function expressiveLevel(level: number, sensitivity = 2.2, noiseFloor = 0.003): number {
	const gain = Number.isFinite(sensitivity) ? Math.max(0.1, Math.min(8, sensitivity)) : 2.2;
	const floor = Number.isFinite(noiseFloor) ? Math.max(0, Math.min(0.2, noiseFloor)) : 0.003;
	return Math.sqrt(1 - Math.exp(-Math.max(0, clampLevel(level) - floor) * gain * 6));
}

/** Frame-rate independent attack/release: quick on syllables, gentle between words. */
export function smoothLevel(previous: number, next: number, elapsedMs: number): number {
	const duration = next > previous ? 65 : 240;
	return previous + (next - previous) * (1 - Math.exp(-Math.max(0, elapsedMs) / duration));
}

/** A designed amplitude visualization, not a literal oscilloscope or audio history. */
export function waveformPath(level: number, phase: number, layer = 0): string {
	const points = Array.from({ length: 65 }, (_, index) => {
		const t = index / 64;
		const envelope = Math.sin(Math.PI * t) ** 1.4;
		const wave =
			Math.sin(t * Math.PI * 5 - phase + layer * 0.65) * 0.76 +
			Math.sin(t * Math.PI * 9 + phase * 0.6 + layer) * 0.24;
		return [t * 640, 48 + wave * envelope * clampLevel(level) * (40 - layer * 7)];
	});
	let path = 'M 0 48';
	for (let i = 1; i < points.length - 1; i++) {
		const [x, y] = points[i];
		const [nextX, nextY] = points[i + 1];
		path += ` Q ${x.toFixed(2)} ${y.toFixed(2)} ${((x + nextX) / 2).toFixed(2)} ${((y + nextY) / 2).toFixed(2)}`;
	}
	return path + ' Q 640 48 640 48';
}

export type WaveformOptions = {
	active: boolean;
	level: number;
	analyser?: AnalyserNode;
	sensitivity: number;
	noiseFloor: number;
	reduced: boolean;
};

export function createWaveformRenderer(node: HTMLDivElement) {
	const paths = [...node.querySelectorAll<SVGPathElement>('[data-wave]')];
	const meter = node.querySelector('meter')!;
	let options: WaveformOptions;
	let samples = new Float32Array(0);
	let frame = 0;
	let visible = true;
	let amplitude = 0;
	let phase = 0;
	let previousTime = 0;
	let meterTime = 0;
	let disposed = false;
	function draw() {
		paths.forEach((path, layer) => path.setAttribute('d', waveformPath(amplitude, phase, layer)));
	}
	function stop() {
		cancelAnimationFrame(frame);
		frame = 0;
		previousTime = 0;
	}
	function schedule() {
		if (!disposed && !frame && options?.active && visible && !document.hidden)
			frame = requestAnimationFrame(tick);
	}
	function tick(time: number) {
		frame = 0;
		const delta = previousTime ? Math.min(100, time - previousTime) : 16;
		// Reduced motion keeps amplitude feedback but removes travelling waves and runs at 8Hz.
		if (options.reduced && previousTime && time - previousTime < 125) {
			schedule();
			return;
		}
		previousTime = time;
		let raw = clampLevel(options.level);
		if (options.analyser) {
			if (samples.length !== options.analyser.fftSize)
				samples = new Float32Array(options.analyser.fftSize);
			options.analyser.getFloatTimeDomainData(samples);
			raw = microphoneLevel(samples);
		}
		const target = expressiveLevel(raw, options.sensitivity, options.noiseFloor);
		amplitude = options.reduced ? target : smoothLevel(amplitude, target, delta);
		if (amplitude < 0.0001) amplitude = 0;
		phase = options.reduced ? 0 : phase + delta * 0.0018;
		draw();
		if (!target || time - meterTime > 150 || !meterTime) {
			meter.value = raw;
			meterTime = time;
		}
		if (options.analyser || amplitude || target) schedule();
	}
	function visibilityChanged() {
		if (document.hidden) stop();
		else schedule();
	}
	const observer = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible) schedule();
		else stop();
	});
	observer.observe(node);
	document.addEventListener('visibilitychange', visibilityChanged);
	return {
		update(next: WaveformOptions) {
			options = next;
			if (!next.active) {
				stop();
				amplitude = phase = 0;
				meter.value = 0;
				draw();
			} else schedule();
		},
		dispose() {
			disposed = true;
			stop();
			observer.disconnect();
			document.removeEventListener('visibilitychange', visibilityChanged);
		}
	};
}
