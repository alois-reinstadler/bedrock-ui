import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createShaderRenderer } from './runtime.js';
import type { ShaderSettings } from './types.js';

const mocks = vi.hoisted(() => ({ create: vi.fn(), loadImage: vi.fn() }));
vi.mock('@paper-design/shaders', async (original) => ({
	...(await original<typeof import('@paper-design/shaders')>()),
	ShaderMount: function (...args: unknown[]) {
		return mocks.create(...args);
	},
	getShaderNoiseTexture: () => undefined
}));
vi.mock('./assets.js', () => ({
	loadShaderImage: mocks.loadImage,
	loadShaderBlob: vi.fn(),
	textMask: vi.fn()
}));
const settings: ShaderSettings = {
	effect: 'mesh-gradient',
	options: {},
	paused: false,
	reduced: false,
	maxPixelCount: 300000,
	speed: 0.7
};
function fakeMount() {
	return {
		canvasElement: Object.assign(new EventTarget(), {
			getContext: () => ({ getExtension: () => ({ loseContext: vi.fn() }) }),
			remove: vi.fn()
		}),
		dispose: vi.fn(),
		setSpeed: vi.fn(),
		setUniforms: vi.fn(),
		setMaxPixelCount: vi.fn(),
		getCurrentFrame: () => 12345
	};
}
function fixture() {
	const document = Object.assign(new EventTarget(), {
		visibilityState: 'visible',
		defaultView: {},
		createElement: () => ({
			getContext: () => ({ getExtension: () => ({ loseContext: vi.fn() }) })
		})
	});
	const host = {
		ownerDocument: document,
		dataset: {},
		querySelector: () => null
	} as unknown as HTMLElement;
	const state = vi.fn();
	const renderer = createShaderRenderer(host, state);
	return { document, host, state, renderer };
}
async function mounted() {
	await vi.waitFor(() => expect(mocks.create).toHaveBeenCalled(), { timeout: 1500 });
}

describe('shader lifecycle', () => {
	const cleanups: (() => void)[] = [];
	beforeEach(() => {
		mocks.create.mockReset().mockImplementation(fakeMount);
		mocks.loadImage.mockReset().mockResolvedValue({ naturalWidth: 800, naturalHeight: 600 });
	});
	afterEach(() => {
		for (const cleanup of cleanups.splice(0)) cleanup();
	});
	it('updates controls without recreating the renderer and respects pause and reduced motion', async () => {
		const { renderer } = fixture();
		cleanups.push(renderer.dispose);
		renderer.update(settings);
		await mounted();
		const mount = mocks.create.mock.results[0].value;
		expect(mount.setSpeed).toHaveBeenLastCalledWith(0.7);
		renderer.update({ ...settings, paused: true });
		expect(mount.setSpeed).toHaveBeenLastCalledWith(0);
		renderer.update({ ...settings, reduced: true });
		expect(mount.setSpeed).toHaveBeenLastCalledWith(0);
		renderer.update({ ...settings, options: { distortion: 0.2 } });
		expect(mount.setUniforms.mock.lastCall[0].u_distortion).toBe(0.2);
		expect(mocks.create).toHaveBeenCalledOnce();
	});
	it('releases hidden contexts and resumes at the same frame', async () => {
		const { renderer, document } = fixture();
		cleanups.push(renderer.dispose);
		renderer.update(settings);
		await mounted();
		const mount = mocks.create.mock.results[0].value;
		document.visibilityState = 'hidden';
		document.dispatchEvent(new Event('visibilitychange'));
		expect(mount.dispose).toHaveBeenCalledOnce();
		document.visibilityState = 'visible';
		document.dispatchEvent(new Event('visibilitychange'));
		await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledTimes(2));
		expect(mocks.create.mock.lastCall![5]).toBe(12345);
	});
	it('discards decoded images after unmount', async () => {
		let complete!: (image: HTMLImageElement) => void;
		mocks.loadImage.mockReturnValue(
			new Promise<HTMLImageElement>((resolve) => {
				complete = resolve;
			})
		);
		const { renderer } = fixture();
		renderer.update({ ...settings, effect: 'water', src: '/photo.jpg' });
		await vi.waitFor(() => expect(mocks.loadImage).toHaveBeenCalled());
		renderer.dispose();
		complete({} as HTMLImageElement);
		await new Promise((resolve) => setTimeout(resolve, 10));
		expect(mocks.create).not.toHaveBeenCalled();
	});
	it('uses the latest source when uploads race', async () => {
		let complete!: (image: HTMLImageElement) => void;
		const latest = { naturalWidth: 640 } as HTMLImageElement;
		mocks.loadImage
			.mockReturnValueOnce(
				new Promise<HTMLImageElement>((resolve) => {
					complete = resolve;
				})
			)
			.mockResolvedValue(latest);
		const { renderer } = fixture();
		cleanups.push(renderer.dispose);
		renderer.update({ ...settings, effect: 'water', src: '/old.jpg' });
		await vi.waitFor(() => expect(mocks.loadImage).toHaveBeenCalledOnce());
		renderer.update({ ...settings, effect: 'water', src: '/new.jpg' });
		complete({} as HTMLImageElement);
		await mounted();
		expect(mocks.create).toHaveBeenCalledOnce();
		expect(mocks.create.mock.lastCall![2].u_image).toBe(latest);
	});
	it('restores a lost context with the current playback settings', async () => {
		const { renderer, state } = fixture();
		cleanups.push(renderer.dispose);
		renderer.update(settings);
		await mounted();
		const canvas = mocks.create.mock.results[0].value.canvasElement;
		const lost = new Event('webglcontextlost', { cancelable: true });
		canvas.dispatchEvent(lost);
		expect(lost.defaultPrevented).toBe(true);
		expect(state).toHaveBeenLastCalledWith('loading');
		renderer.update({ ...settings, paused: true });
		canvas.dispatchEvent(new Event('webglcontextrestored'));
		await vi.waitFor(() => expect(mocks.create).toHaveBeenCalledTimes(2));
		expect(mocks.create.mock.results[1].value.setSpeed).toHaveBeenLastCalledWith(0);
	});
	it('limits the initial pixel allocation as well as updates', async () => {
		const { renderer } = fixture();
		cleanups.push(renderer.dispose);
		renderer.update({ ...settings, maxPixelCount: Infinity });
		await mounted();
		expect(mocks.create.mock.lastCall![7]).toBe(1000000);
	});
});
