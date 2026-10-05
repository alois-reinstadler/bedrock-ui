import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBackgroundRenderer, type BackgroundOptions } from './runtime.js';

const shader = vi.hoisted(() => ({ create: vi.fn(), decode: vi.fn() }));
vi.mock('@paper-design/shaders', () => ({
	ShaderMount: function (...args: unknown[]) {
		return shader.create(...args);
	},
	getShaderNoiseTexture: () => ({ decode: shader.decode }),
	getShaderColorFromString: () => [1, 1, 1, 1],
	godRaysFragmentShader: 'rays',
	meshGradientFragmentShader: 'gradient'
}));

const options: BackgroundOptions = {
	effect: 'rays',
	colors: ['#ffffff'],
	speed: 0.35,
	paused: false,
	reduced: false,
	intensity: 0.75,
	density: 0.55,
	distortion: 0.4,
	swirl: 0.3,
	grain: 0.03,
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
	const renderer = createBackgroundRenderer(host);
	return { host, document, renderer };
}

function mount() {
	return {
		canvasElement: Object.assign(new EventTarget(), {
			style: { visibility: '' },
			getContext: () => ({ getExtension: () => ({ loseContext: vi.fn() }) })
		}),
		setUniforms: vi.fn(),
		setMaxPixelCount: vi.fn(),
		setSpeed: vi.fn(),
		setFrame: vi.fn(),
		dispose: vi.fn()
	};
}

describe('shader renderer recovery', () => {
	const disposers: (() => void)[] = [];
	beforeEach(() => {
		shader.create.mockReset().mockImplementation(mount);
		shader.decode.mockReset().mockResolvedValue(undefined);
	});
	afterEach(() => {
		for (const dispose of disposers.splice(0)) dispose();
	});

	it('retries a failed initialization when playback props change', async () => {
		shader.create.mockImplementationOnce(() => {
			throw new Error('WebGL unavailable');
		});
		const { host, renderer } = fixture();
		disposers.push(renderer.dispose);
		renderer.update(options);
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('fallback'));
		renderer.update({ ...options, paused: true });
		await vi.waitFor(() => expect(host.dataset.renderer).toBe('webgl2'));
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
		expect(current.setSpeed).toHaveBeenLastCalledWith(options.speed);
		expect(shader.create).toHaveBeenCalledOnce();
	});

	it('does not mount after disposal while the rays texture is decoding', async () => {
		let finishDecode!: () => void;
		shader.decode.mockReturnValue(
			new Promise<void>((resolve) => {
				finishDecode = resolve;
			})
		);
		const { renderer } = fixture();
		renderer.update(options);
		await vi.waitFor(() => expect(shader.decode).toHaveBeenCalledOnce());
		renderer.dispose();
		finishDecode();
		await Promise.resolve();
		expect(shader.create).not.toHaveBeenCalled();
	});
});
