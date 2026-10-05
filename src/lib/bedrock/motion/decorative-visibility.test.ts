import { describe, expect, it, vi } from 'vitest';
import { observeDecorativeVisibility } from './decorative-visibility.js';

describe('decorative visibility lifecycle', () => {
	it('requires intersection and document visibility, resumes, and removes all observers', () => {
		let intersection: (entries: { target: Element; isIntersecting: boolean }[]) => void = () => {};
		const observe = vi.fn();
		const disconnect = vi.fn();
		const document = Object.assign(new EventTarget(), {
			visibilityState: 'visible',
			defaultView: {
				IntersectionObserver: class {
					constructor(callback: typeof intersection) {
						intersection = callback;
					}
					observe = observe;
					disconnect = disconnect;
				}
			}
		});
		const node = { ownerDocument: document } as unknown as Element;
		const update = vi.fn();
		const cleanup = observeDecorativeVisibility(node, update);
		expect(observe).toHaveBeenCalledWith(node);
		expect(update).toHaveBeenLastCalledWith(false);
		intersection([{ target: node, isIntersecting: true }]);
		expect(update).toHaveBeenLastCalledWith(true);
		document.visibilityState = 'hidden';
		document.dispatchEvent(new Event('visibilitychange'));
		expect(update).toHaveBeenLastCalledWith(false);
		document.visibilityState = 'visible';
		document.dispatchEvent(new Event('visibilitychange'));
		expect(update).toHaveBeenLastCalledWith(true);
		intersection([{ target: node, isIntersecting: false }]);
		expect(update).toHaveBeenLastCalledWith(false);
		cleanup();
		expect(disconnect).toHaveBeenCalledOnce();
		update.mockClear();
		document.dispatchEvent(new Event('visibilitychange'));
		expect(update).not.toHaveBeenCalled();
	});

	it('still follows document visibility without IntersectionObserver', () => {
		const document = Object.assign(new EventTarget(), {
			visibilityState: 'hidden',
			defaultView: {}
		});
		const update = vi.fn();
		const cleanup = observeDecorativeVisibility(
			{ ownerDocument: document } as unknown as Element,
			update
		);
		expect(update).toHaveBeenLastCalledWith(false);
		document.visibilityState = 'visible';
		document.dispatchEvent(new Event('visibilitychange'));
		expect(update).toHaveBeenLastCalledWith(true);
		cleanup();
	});
});
