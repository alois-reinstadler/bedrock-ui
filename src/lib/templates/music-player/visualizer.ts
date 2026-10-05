import { elementPrefersReducedMotion } from '#lib/bedrock/motion/policy.js';
import { sampleSpectrum, type Spectrum } from './spectrum.js';
export type VisualMode = 'orbit' | 'ribbons' | 'mirror';

export function mountVisualizer(
	canvas: HTMLCanvasElement,
	options: {
		spectrum: Spectrum | null;
		mode: VisualMode;
		playing: boolean;
		still: boolean;
		audio?: HTMLAudioElement;
	}
) {
	const context = canvas.getContext('2d');
	if (!context) return;
	const ctx = context;
	const values = new Float32Array(options.spectrum?.bands ?? 48);
	let width = 0,
		height = 0,
		frame = 0;
	const media = matchMedia('(prefers-reduced-motion: reduce)');
	function draw() {
		if (width <= 0 || height <= 0) return;
		const time = options.audio?.currentTime ?? 0;
		if (options.spectrum) sampleSpectrum(options.spectrum, time, values);
		ctx.clearRect(0, 0, width, height);
		const centerX = width / 2,
			centerY = height / 2;
		const size = Math.min(width, height);
		const bass = values.slice(0, 12).reduce((sum, value) => sum + value, 0) / 12;
		const halo = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size * 0.65);
		halo.addColorStop(0, `rgba(183, 84, 126, ${0.1 + bass * 0.16})`);
		halo.addColorStop(1, 'rgba(183, 84, 126, 0)');
		ctx.fillStyle = halo;
		ctx.fillRect(0, 0, width, height);
		ctx.lineCap = 'round';
		if (options.mode === 'orbit') {
			const radius = size * (0.22 + bass * 0.025);
			for (let index = 0; index < 144; index++) {
				const angle = (index / 144) * Math.PI * 2 - Math.PI / 2;
				const value = values[Math.floor((index / 144) * values.length)];
				const reach = radius + 4 + value * size * 0.16;
				ctx.strokeStyle = `hsl(${325 + (index / 144) * 85} 75% ${65 + value * 15}%)`;
				ctx.lineWidth = Math.max(1.5, size / 180);
				ctx.beginPath();
				ctx.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
				ctx.lineTo(centerX + Math.cos(angle) * reach, centerY + Math.sin(angle) * reach);
				ctx.stroke();
			}
			ctx.strokeStyle = '#e9aec144';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.arc(centerX, centerY, radius - 12, 0, Math.PI * 2);
			ctx.stroke();
			ctx.fillStyle = '#fff0f3';
			ctx.font = `600 ${Math.max(20, size * 0.065)}px sans-serif`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('drift.', centerX, centerY);
		} else if (options.mode === 'ribbons') {
			for (let layer = 0; layer < 6; layer++) {
				ctx.strokeStyle = `hsla(${315 + layer * 13}, 75%, ${70 + layer * 3}%, ${0.8 - layer * 0.09})`;
				ctx.lineWidth = 2 + (5 - layer) * 0.4;
				ctx.beginPath();
				for (let step = 0; step <= 240; step++) {
					const fraction = step / 240;
					const value = values[Math.min(values.length - 1, Math.floor(fraction * values.length))];
					const envelope = Math.sin(fraction * Math.PI);
					const y =
						centerY +
						Math.sin(fraction * Math.PI * 4 + time * 0.45 + layer * 0.45) *
							(12 + value * size * 0.24) *
							envelope +
						(layer - 2.5) * 12;
					const x = width * (0.07 + fraction * 0.86);
					if (!step) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.stroke();
			}
		} else {
			const gap = (width * 0.8) / values.length;
			for (let index = 0; index < values.length; index++) {
				const value = values[index];
				const bar = 3 + value * size * 0.33;
				const x = width * 0.1 + index * gap;
				ctx.fillStyle = `hsl(${320 + (index / values.length) * 75} 70% 73%)`;
				ctx.globalAlpha = 0.9;
				ctx.fillRect(x, centerY - bar, Math.max(2, gap - 3), bar);
				ctx.globalAlpha = 0.23;
				ctx.fillRect(x, centerY + 8, Math.max(2, gap - 3), bar * 0.65);
			}
			ctx.globalAlpha = 1;
		}
		canvas.dataset.sampleTime = time.toFixed(3);
	}
	function animate() {
		draw();
		frame = requestAnimationFrame(animate);
	}
	function update() {
		cancelAnimationFrame(frame);
		if (document.hidden) return;
		draw();
		if (options.playing && !options.still && !elementPrefersReducedMotion(canvas))
			frame = requestAnimationFrame(animate);
	}
	const resize = new ResizeObserver(() => {
		width = canvas.clientWidth;
		height = canvas.clientHeight;
		const ratio = Math.min(devicePixelRatio, 2);
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
		ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
		update();
	});
	resize.observe(canvas);
	const policy = new MutationObserver(update);
	policy.observe(document.documentElement, {
		attributes: true,
		subtree: true,
		attributeFilter: ['data-bedrock-motion']
	});
	media.addEventListener('change', update);
	document.addEventListener('visibilitychange', update);
	options.audio?.addEventListener('seeked', update);
	return () => {
		cancelAnimationFrame(frame);
		resize.disconnect();
		policy.disconnect();
		media.removeEventListener('change', update);
		document.removeEventListener('visibilitychange', update);
		options.audio?.removeEventListener('seeked', update);
	};
}
