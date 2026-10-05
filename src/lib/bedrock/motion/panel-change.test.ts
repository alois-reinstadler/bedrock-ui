import { afterEach, describe, expect, it, vi } from 'vitest';
import { panelChange, type PanelMotion } from './panel-change.js';

vi.mock('./policy.js', () => ({
	elementPrefersReducedMotion: () => false,
	observeMotionReduction: () => () => {}
}));

function fixture() {
	let mutation = () => {};
	vi.stubGlobal(
		'MutationObserver',
		class {
			constructor(callback: () => void) {
				mutation = callback;
			}
			observe() {}
			disconnect() {}
		}
	);
	vi.stubGlobal(
		'ResizeObserver',
		class {
			observe() {}
			disconnect() {}
		}
	);
	vi.stubGlobal('document', { activeElement: null });
	vi.stubGlobal('getComputedStyle', () => ({ opacity: '0.7', transform: 'matrix(1,0,0,1,2,0)' }));
	const cancel = vi.fn();
	const animate = vi.fn<
		(
			frames: Keyframe[],
			options: KeyframeAnimationOptions
		) => { cancel: typeof cancel; playState: string }
	>(() => ({
		cancel,
		playState: 'running'
	}));
	let height = 100;
	const shellAnimate = vi.fn(() => ({ cancel: vi.fn(), onfinish: null }));
	const target = { contains: () => false, animate };
	const root = Object.assign(new EventTarget(), {
		querySelectorAll: () => [target],
		animate: shellAnimate,
		getBoundingClientRect: () => ({ height })
	});
	let state: { key: string; motion: PanelMotion } = { key: 'first', motion: 'panel' };
	const cleanup = panelChange(() => state, '[data-panel]')(root as unknown as HTMLElement);
	return {
		root,
		animate,
		cancel,
		cleanup,
		shellAnimate,
		setHeight: (next: number) => {
			height = next;
		},
		update: (key: string, motion: PanelMotion = 'panel') => {
			state = { key, motion };
			mutation();
		}
	};
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('panel change lifecycle', () => {
	it('animates shell height only for a panel switch, never incidental content updates', () => {
		const f = fixture();
		f.setHeight(140);
		f.update('first');
		expect(f.shellAnimate).not.toHaveBeenCalled();
		f.setHeight(200);
		f.update('second');
		expect(f.shellAnimate).toHaveBeenCalledOnce();
		f.cleanup?.();
	});
	it('skips initial render and incidental mutations, then uses the enter token on a real change', () => {
		const f = fixture();
		expect(f.animate).not.toHaveBeenCalled();
		f.update('first');
		expect(f.animate).not.toHaveBeenCalled();
		f.update('second');
		expect(f.animate).toHaveBeenCalledWith(
			expect.any(Array),
			expect.objectContaining({ duration: 230 })
		);
		f.cleanup?.();
	});
	it('retargets from current paint, cancels stale work and disables immediately', () => {
		const f = fixture();
		f.update('second');
		f.update('third');
		expect(f.cancel).toHaveBeenCalledOnce();
		expect(f.animate.mock.calls[1]?.[0]).toEqual([
			{ opacity: '0.7', transform: 'matrix(1,0,0,1,2,0)' },
			{ opacity: 1, transform: 'none' }
		]);
		f.update('third', 'none');
		expect(f.cancel).toHaveBeenCalledTimes(2);
		f.cleanup?.();
	});
	it('keeps keyboard traversal crisp and permits a later pointer change', () => {
		const f = fixture();
		f.root.dispatchEvent(new Event('keydown'));
		f.update('second');
		expect(f.animate).not.toHaveBeenCalled();
		f.root.dispatchEvent(new Event('pointerdown'));
		f.update('third');
		expect(f.animate).toHaveBeenCalledOnce();
		f.cleanup?.();
	});
});
