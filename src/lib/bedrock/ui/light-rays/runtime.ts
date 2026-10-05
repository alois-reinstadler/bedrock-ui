import type { ShaderMount } from '@paper-design/shaders';
import { observeDecorativeVisibility } from '../../motion/decorative-visibility.js';
import { bounded } from '../backgrounds/runtime.js';
import { colorToRGB, hslToRgb, lightRaysFragmentShader } from './shader.js';

export type RaysColorConfig =
	| { mode: 'single'; color: string }
	| { mode: 'multi'; color1: string; color2: string }
	| { mode: 'random' };
export type AnimationConfig = { animate: boolean; speed: number };
export type RaysOptions = {
	intensity: number;
	rays: number;
	reach: number;
	position: number;
	animation: AnimationConfig;
	raysColor: RaysColorConfig;
	paused: boolean;
	reduced: boolean;
	maxPixelCount: number;
};
type RGB = [number, number, number];

/** Spell UI's public 0–100 controls map directly to its shader uniforms. */
export function raysUniforms(options: RaysOptions, randomColors: [RGB, RGB]) {
	const config = options.raysColor;
	const colors =
		config.mode === 'random'
			? randomColors
			: config.mode === 'multi'
				? [colorToRGB(config.color1), colorToRGB(config.color2)]
				: [colorToRGB(config.color), colorToRGB(config.color)];
	return {
		u_colors: colors.map((color) => [...color, 1]),
		u_intensity: bounded(options.intensity, 0, 100, 13) * 0.005,
		u_rays: bounded(options.rays, 0, 100, 32) * 0.003,
		u_reach: bounded(options.reach, 0, 100, 16) * 0.005,
		u_position: bounded(options.position, 0, 100, 50) / 100
	};
}

export function createLightRaysRenderer(host: HTMLElement) {
	let mount: ShaderMount | undefined;
	let options: RaysOptions | undefined;
	let disposed = false;
	let loading = false;
	let lost = false;
	let visible = false;
	let removeContextListeners: (() => void) | undefined;
	const hue = Math.random() * 360;
	const saturation = 60 + Math.random() * 40;
	const randomColors: [RGB, RGB] = [hslToRgb(hue, saturation, 50), hslToRgb(hue, saturation, 65)];
	let frame = Math.random() * 10000000;
	const stopVisibility = observeDecorativeVisibility(host, (next) => {
		const becameVisible = next && !visible;
		visible = next;
		if (becameVisible && options && !mount) void start();
		else apply();
	});

	function release(loseContext = true) {
		removeContextListeners?.();
		removeContextListeners = undefined;
		const canvas = mount?.canvasElement ?? host.querySelector('canvas');
		const gl = canvas?.getContext('webgl2');
		mount?.dispose();
		mount = undefined;
		canvas?.remove();
		if (loseContext) gl?.getExtension('WEBGL_lose_context')?.loseContext();
	}

	function apply() {
		if (!mount || !options || disposed || lost) return;
		mount.setUniforms(raysUniforms(options, randomColors));
		mount.setMaxPixelCount(bounded(options.maxPixelCount, 10000, 4000000, 1000000));
		mount.setSpeed(
			!visible || options.paused || options.reduced || !options.animation.animate
				? 0
				: bounded(options.animation.speed, 0, 100, 10) / 10
		);
		if (options.reduced) mount.setFrame(0);
	}

	async function start() {
		if (disposed || loading || lost || !options) return;
		loading = true;
		host.dataset.renderer = 'loading';
		delete host.dataset.rendererError;
		try {
			const { ShaderMount } = await import('@paper-design/shaders');
			if (disposed) return;
			mount = new ShaderMount(
				host,
				lightRaysFragmentShader,
				raysUniforms(options, randomColors),
				{ alpha: true, premultipliedAlpha: true, antialias: true },
				0,
				options.reduced ? 0 : frame,
				1,
				bounded(options.maxPixelCount, 10000, 4000000, 1000000)
			);
			const canvas = mount.canvasElement;
			const onLost = (event: Event) => {
				event.preventDefault();
				lost = true;
				frame = mount?.getCurrentFrame() ?? frame;
				mount?.setSpeed(0);
				canvas.style.visibility = 'hidden';
				host.dataset.renderer = 'fallback';
			};
			const onRestored = () => {
				release(false);
				lost = false;
				void start();
			};
			canvas.addEventListener('webglcontextlost', onLost);
			canvas.addEventListener('webglcontextrestored', onRestored);
			removeContextListeners = () => {
				canvas.removeEventListener('webglcontextlost', onLost);
				canvas.removeEventListener('webglcontextrestored', onRestored);
			};
			host.dataset.renderer = 'webgl2';
			apply();
		} catch (error) {
			release();
			if (!disposed) {
				host.dataset.renderer = 'fallback';
				host.dataset.rendererError = error instanceof Error ? error.message : String(error);
				console.warn('[LightRays] Renderer initialization failed:', error);
			}
		} finally {
			loading = false;
		}
	}

	return {
		update(next: RaysOptions) {
			if (disposed) return;
			options = next;
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
