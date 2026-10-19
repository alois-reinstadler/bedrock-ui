import { observeDecorativeVisibility } from '../../motion/decorative-visibility.js';
import type { ShaderMount, ShaderMountUniforms } from '@paper-design/shaders';

export type BackgroundEffect = 'gradient' | 'rays';
export type BackgroundOptions = {
	effect: BackgroundEffect;
	colors: string[];
	speed: number;
	paused: boolean;
	reduced: boolean;
	intensity: number;
	density: number;
	distortion: number;
	swirl: number;
	grain: number;
	maxPixelCount: number;
};

export function bounded(value: number, min: number, max: number, fallback: number) {
	return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

/** Restrict shader colors to an unambiguous format supported by Paper and CSS. */
export function backgroundColors(colors: string[], effect: BackgroundEffect) {
	const valid = colors.filter((color) => /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(color));
	return (valid.length ? valid : ['#24243e', '#7065d8', '#e7a9a2']).slice(
		0,
		effect === 'rays' ? 5 : 10
	);
}

/** Lazy browser-only renderer. Updates arriving during loading use the latest options. */
export function createBackgroundRenderer(host: HTMLElement) {
	let disposed = false;
	let mount: ShaderMount | undefined;
	let latest: BackgroundOptions | undefined;
	let loading = false;
	let contextLost = false;
	let removeContextListener: (() => void) | undefined;
	let paper: typeof import('@paper-design/shaders') | undefined;
	let noise: HTMLImageElement | undefined;
	let visible = false;
	const stopVisibility = observeDecorativeVisibility(host, (next) => {
		const becameVisible = next && !visible;
		visible = next;
		if (becameVisible && latest && !mount) void start();
		else apply();
	});
	function release(loseContext = true) {
		removeContextListener?.();
		removeContextListener = undefined;
		const canvas = mount?.canvasElement ?? host.querySelector('canvas');
		const context = canvas?.getContext('webgl2');
		mount?.dispose();
		mount = undefined;
		if (loseContext) context?.getExtension('WEBGL_lose_context')?.loseContext();
	}

	function uniforms(options: BackgroundOptions): ShaderMountUniforms {
		if (!paper) return {};
		const colors = backgroundColors(options.colors, options.effect).map((color) =>
			paper!.getShaderColorFromString(color)
		);
		const sizing = {
			u_fit: 2,
			u_scale: 1,
			u_rotation: 0,
			u_originX: 0.5,
			u_originY: 0.5,
			u_offsetX: 0,
			u_offsetY: 0,
			u_worldWidth: 0,
			u_worldHeight: 0,
			u_colors: colors,
			u_colorsCount: colors.length
		};
		return options.effect === 'gradient'
			? {
					...sizing,
					u_distortion: bounded(options.distortion, 0, 1, 0.4),
					u_swirl: bounded(options.swirl, 0, 1, 0.3),
					u_grainMixer: 0,
					u_grainOverlay: bounded(options.grain, 0, 1, 0.03)
				}
			: {
					...sizing,
					u_colorBack: [0.025, 0.025, 0.05, 1],
					u_colorBloom: colors[0],
					u_bloom: 0.25,
					u_intensity: bounded(options.intensity, 0, 1, 0.75),
					u_density: bounded(options.density, 0, 1, 0.55),
					u_spotty: 0.25,
					u_midSize: 0.2,
					u_midIntensity: 0.3,
					u_noiseTexture: noise
				};
	}

	function apply() {
		if (!mount || !latest || disposed || contextLost) return;
		mount.setUniforms(uniforms(latest));
		mount.setMaxPixelCount(bounded(latest.maxPixelCount, 10000, 4000000, 1000000));
		mount.setSpeed(
			!visible || latest.paused || latest.reduced ? 0 : bounded(latest.speed, -3, 3, 0.35)
		);
		if (latest.reduced) mount.setFrame(0);
	}

	async function start() {
		if (disposed || loading || contextLost || !latest) return;
		loading = true;
		host.dataset.renderer = 'loading';
		try {
			paper = await import('@paper-design/shaders');
			if (disposed || !latest) return;
			if (latest.effect === 'rays') {
				noise = paper.getShaderNoiseTexture();
				if (!noise) throw new Error('The shader noise texture is unavailable.');
				await noise.decode();
				if (disposed) return;
			}
			mount = new paper.ShaderMount(
				host,
				latest.effect === 'rays' ? paper.godRaysFragmentShader : paper.meshGradientFragmentShader,
				uniforms(latest),
				{ alpha: true, antialias: false },
				0,
				0,
				1,
				bounded(latest.maxPixelCount, 10000, 4000000, 1000000)
			);
			const canvas = mount.canvasElement;
			const lost = (event: Event) => {
				// Keep the canvas alive and opt in to the browser restoring its context.
				event.preventDefault();
				contextLost = true;
				host.dataset.renderer = 'fallback';
				canvas.style.visibility = 'hidden';
				mount?.setSpeed(0);
			};
			const restored = () => {
				// Paper's uniforms, textures and program must be rebuilt after restoration.
				release(false);
				contextLost = false;
				void start();
			};
			canvas.addEventListener('webglcontextlost', lost);
			canvas.addEventListener('webglcontextrestored', restored);
			removeContextListener = () => {
				canvas.removeEventListener('webglcontextlost', lost);
				canvas.removeEventListener('webglcontextrestored', restored);
			};
			host.dataset.renderer = 'webgl2';
			apply();
		} catch {
			release();
			host.replaceChildren();
			if (!disposed) host.dataset.renderer = 'fallback';
		} finally {
			loading = false;
		}
	}

	return {
		update(options: BackgroundOptions) {
			if (disposed) return;
			latest = options;
			if (!mount) void start();
			else apply();
		},
		dispose() {
			disposed = true;
			stopVisibility();
			release();
		}
	};
}
