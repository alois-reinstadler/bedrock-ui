import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createLightRaysRenderer, raysUniforms, type RaysOptions } from './runtime.js';

const shader = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('@paper-design/shaders', () => ({
	ShaderMount: function (...args: unknown[]) {
		return shader.create(...args);
	},
	getShaderColorFromString: () => [1, 1, 1, 1],
	godRaysFragmentShader: 'rays',
	meshGradientFragmentShader: 'gradient'
}));

const options: RaysOptions = {
	intensity: 13,
	rays: 32,
	reach: 16,
	position: 50,
	animation: { animate: true, speed: 10 },
	raysColor: { mode: 'single', color: '#639AFF' },
	paused: false,
	reduced: false,
	maxPixelCount: 1000000
};

function fixture() {
	const document = Object.assign(new EventTarget(), {
		visibilityState: 'visible',
		defaultView: {}
	});
	const host = {
		ownerDocument: document,
		dataset: {} as Record<string, string>,
		querySelector: () => null,
		replaceChildren: vi.fn()
	} as unknown as HTMLElement;
	const renderer = createLightRaysRenderer(host);
	return { host, document, renderer };
}

function mount() {
	return {
		canvasElement: Object.assign(new EventTarget(), {
			style: { visibility: '' },
			remove: vi.fn(),
			getContext: () => ({ getExtension: () => ({ loseContext: vi.fn() }) })
		}),
		setUniforms: vi.fn(),
		setMaxPixelCount: vi.fn(),
		setSpeed: vi.fn(),
		setFrame: vi.fn(),
		getCurrentFrame: () => 12345,
		dispose: vi.fn()
	};
}

describe('shader renderer recovery', () => {
	const disposers: (() => void)[] = [];
	beforeEach(() => {
		shader.create.mockReset().mockImplementation(mount);
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});
	afterEach(() => {
		for (const dispose of disposers.splice(0)) dispose();
		vi.restoreAllMocks();
	});

	it('retries a failed initialization when playback props change', async () => {
		shader.create.mockImplementationOnce(() => {
			throw new Error('WebGL unavailable');
		});
		const { host, renderer } = fixture();
		disposers.push(renderer.dispose);
		renderer.update(options);
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('fallback'));
		expect(host.dataset.rendererError).toBe('WebGL unavailable');
		expect(console.warn).toHaveBeenCalledWith(
			'[LightRays] Renderer initialization failed:',
			expect.objectContaining({ message: 'WebGL unavailable' })
		);
		renderer.update({ ...options, paused: true });
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('webgl2'));
		expect(host.dataset.rendererError).toBeUndefined();
		expect(shader.create).toHaveBeenCalledTimes(2);
		expect(shader.create.mock.results[1].value.setSpeed).toHaveBeenLastCalledWith(0);
	});

	it('retries a failed renderer when the document becomes visible again', async () => {
		shader.create.mockImplementationOnce(() => {
			throw new Error('WebGL unavailable');
		});
		const { host, document, renderer } = fixture();
		disposers.push(renderer.dispose);
		renderer.update(options);
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('fallback'));
		document.visibilityState = 'hidden';
		document.dispatchEvent(new Event('visibilitychange'));
		expect(shader.create).toHaveBeenCalledTimes(1);
		document.visibilityState = 'visible';
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('webgl2'));
	});

	it('allows context restoration and rebuilds with the latest paused state', async () => {
		const { host, renderer } = fixture();
		disposers.push(renderer.dispose);
		renderer.update(options);
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('webgl2'));
		const first = shader.create.mock.results[0].value;
		const lost = new Event('webglcontextlost', { cancelable: true });
		first.canvasElement.dispatchEvent(lost);
		expect(lost.defaultPrevented).toBe(true);
		expect(host.dataset.renderer).toBe('fallback');
		expect(first.canvasElement.style.visibility).toBe('hidden');
		expect(first.dispose).not.toHaveBeenCalled();
		renderer.update({ ...options, paused: true });
		first.canvasElement.dispatchEvent(new Event('webglcontextrestored'));
		await vi.waitFor(() => expect(shader.create).toHaveBeenCalledTimes(2));
		expect(first.dispose).toHaveBeenCalledOnce();
		expect(host.dataset.renderer).toBe('webgl2');
		expect(shader.create.mock.results[1].value.setSpeed).toHaveBeenLastCalledWith(0);
	});

	it('does not restart a disposed renderer after context loss', async () => {
		const { host, renderer } = fixture();
		renderer.update(options);
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('webgl2'));
		const first = shader.create.mock.results[0].value;
		first.canvasElement.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
		renderer.dispose();
		first.canvasElement.dispatchEvent(new Event('webglcontextrestored'));
		renderer.update(options);
		expect(shader.create).toHaveBeenCalledTimes(1);
		expect(first.dispose).toHaveBeenCalledOnce();
	});

	it('keeps the live renderer when playback and reduced-motion settings change', async () => {
		const { host, renderer } = fixture();
		disposers.push(renderer.dispose);
		renderer.update(options);
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('webgl2'));
		const current = shader.create.mock.results[0].value;
		renderer.update({ ...options, paused: true });
		expect(current.setSpeed).toHaveBeenLastCalledWith(0);
		renderer.update({ ...options, reduced: true });
		expect(current.setFrame).toHaveBeenLastCalledWith(0);
		expect(current.setSpeed).toHaveBeenLastCalledWith(0);
		renderer.update(options);
		expect(current.setSpeed).toHaveBeenLastCalledWith(options.animation.speed / 10);
		expect(shader.create).toHaveBeenCalledOnce();
	});

	it('does not mount after disposal while the renderer module is loading', async () => {
		const { renderer } = fixture();
		renderer.update(options);
		renderer.dispose();
		await vi.dynamicImportSettled();
		expect(shader.create).not.toHaveBeenCalled();
	});
});

describe('Spell UI controls', () => {
	const randomColors: [[number, number, number], [number, number, number]] = [
		[1, 0, 0],
		[0, 0, 1]
	];
	it('preserves the original default control ranges and blue color', () => {
		const uniforms = raysUniforms(options, randomColors);
		expect(uniforms.u_intensity).toBeCloseTo(0.065);
		expect(uniforms.u_rays).toBeCloseTo(0.096);
		expect(uniforms.u_reach).toBeCloseTo(0.08);
		expect(uniforms.u_position).toBe(0.5);
		expect(uniforms.u_colors).toEqual([
			[99 / 255, 154 / 255, 1, 1],
			[99 / 255, 154 / 255, 1, 1]
		]);
	});
	it('supports the original multi-color demo and stable random colors', () => {
		expect(
			raysUniforms(
				{ ...options, raysColor: { mode: 'multi', color1: '#2060DF', color2: '#ffffff' } },
				randomColors
			).u_colors
		).toEqual([
			[32 / 255, 96 / 255, 223 / 255, 1],
			[1, 1, 1, 1]
		]);
		expect(
			raysUniforms({ ...options, raysColor: { mode: 'random' } }, randomColors).u_colors
		).toEqual([
			[1, 0, 0, 1],
			[0, 0, 1, 1]
		]);
	});
});
