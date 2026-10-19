import type { ShaderMount } from '@paper-design/shaders';
import { observeDecorativeVisibility } from '../motion/decorative-visibility.js';
import { loadShaderImage, loadShaderBlob, textMask } from './assets.js';
import type { ShaderSettings, ShaderState } from './types.js';

let webglAvailable: boolean | undefined;
const pixelBudget = (value: number) =>
	Number.isFinite(value) ? Math.max(10000, Math.min(4000000, value)) : 1000000;
function supportsWebGL(document: Document) {
	if (webglAvailable !== undefined) return webglAvailable;
	const canvas = document.createElement('canvas');
	const gl = canvas.getContext('webgl2');
	webglAvailable = Boolean(gl);
	gl?.getExtension('WEBGL_lose_context')?.loseContext();
	return webglAvailable;
}

export function createShaderRenderer(host: HTMLElement, onstate: (state: ShaderState) => void) {
	let settings: ShaderSettings | undefined;
	let mount: ShaderMount | undefined;
	let image: HTMLImageElement | undefined;
	let noise: HTMLImageElement | undefined;
	let program: typeof import('./programs.js') | undefined;
	let visible = false;
	let disposed = false;
	let version = 0;
	let pending = false;
	let frame = 12000;
	let removeContextListeners: (() => void) | undefined;
	let scheduled: ReturnType<typeof setTimeout> | undefined;

	function state(value: ShaderState) {
		host.dataset.renderer = value;
		onstate(value);
	}
	function release(lose = true) {
		removeContextListeners?.();
		removeContextListeners = undefined;
		const canvas = mount?.canvasElement ?? host.querySelector('canvas');
		const gl = canvas?.getContext('webgl2');
		if (mount) frame = mount.getCurrentFrame();
		mount?.dispose();
		mount = undefined;
		canvas?.remove();
		if (lose) gl?.getExtension('WEBGL_lose_context')?.loseContext();
	}
	function apply() {
		if (!settings || !mount || !program) return;
		mount.setUniforms(program.shaderUniforms(settings.effect, settings.options, image, noise));
		mount.setMaxPixelCount(pixelBudget(settings.maxPixelCount));
		mount.setSpeed(
			!visible || settings.paused || settings.reduced
				? 0
				: (settings.speed ?? program.defaultSpeed(settings.effect))
		);
	}
	async function start() {
		if (!visible || disposed || pending || mount || !settings) return;
		if (!supportsWebGL(host.ownerDocument)) {
			state('unsupported');
			return;
		}
		pending = true;
		const token = version;
		const snapshot = settings;
		state('loading');
		try {
			const [paper, config] = await Promise.all([
				import('@paper-design/shaders'),
				import('./programs.js')
			]);
			program = config;
			let source = snapshot.src;
			if (snapshot.text !== undefined) source = await textMask(snapshot.text, host.ownerDocument);
			let nextImage: HTMLImageElement | undefined;
			if (source) {
				if (snapshot.effect === 'liquid-metal')
					nextImage = await loadShaderBlob((await paper.toProcessedLiquidMetal(source)).pngBlob);
				else if (snapshot.effect === 'heatmap')
					nextImage = await loadShaderBlob((await paper.toProcessedHeatmap(source)).blob);
				else nextImage = await loadShaderImage(source);
			}
			if (
				['heatmap', 'fluted-glass', 'image-dithering', 'halftone-dots'].includes(snapshot.effect) &&
				!nextImage
			)
				throw new Error('This shader needs an image or text mask');
			const nextNoise = paper.getShaderNoiseTexture();
			if (nextNoise) await nextNoise.decode();
			if (disposed || !visible || token !== version) return;
			image = nextImage;
			noise = nextNoise;
			mount = new paper.ShaderMount(
				host,
				config.programs[snapshot.effect],
				config.shaderUniforms(snapshot.effect, settings.options, image, noise),
				{ alpha: true, premultipliedAlpha: true, antialias: true },
				0,
				frame,
				1,
				pixelBudget(settings.maxPixelCount),
				['u_image']
			);
			const canvas = mount.canvasElement;
			const lost = (event: Event) => {
				event.preventDefault();
				state('loading');
			};
			const restored = () => {
				release(false);
				void start();
			};
			canvas.addEventListener('webglcontextlost', lost);
			canvas.addEventListener('webglcontextrestored', restored);
			removeContextListeners = () => {
				canvas.removeEventListener('webglcontextlost', lost);
				canvas.removeEventListener('webglcontextrestored', restored);
			};
			apply();
			state('ready');
		} catch (error) {
			if (!disposed && token === version) {
				release();
				state('error');
				console.warn('[Shader] Unable to render', snapshot.effect, error);
			}
		} finally {
			pending = false;
			if (!disposed && visible && token !== version) void start();
		}
	}
	const stopVisibility = observeDecorativeVisibility(host, (next) => {
		if (visible === next) return;
		visible = next;
		if (next) void start();
		else {
			version++;
			release();
		}
	});
	return {
		update(next: ShaderSettings) {
			if (disposed) return;
			const sourceChanged =
				!settings ||
				settings.effect !== next.effect ||
				settings.text !== next.text ||
				settings.src !== next.src;
			settings = next;
			if (sourceChanged) {
				version++;
				release();
				state('loading');
				clearTimeout(scheduled);
				scheduled = setTimeout(() => {
					void start();
				}, 120);
			} else {
				apply();
				if (!mount) void start();
			}
		},
		dispose() {
			disposed = true;
			version++;
			clearTimeout(scheduled);
			stopVisibility();
			release();
			image = undefined;
			noise = undefined;
		}
	};
}
