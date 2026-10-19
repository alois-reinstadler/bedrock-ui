import { afterEach, describe, expect, it, vi } from 'vitest';
import { disclosureProse } from './disclosure-prose.js';
import { motionPresets } from './tokens.js';

function fixture(interactive = false, reduced = false) {
	const cancel = vi.fn();
	const animate = vi.fn(() => ({ cancel, onfinish: null }));
	const node = Object.assign(new EventTarget(), {
		firstElementChild: { animate, querySelector: () => (interactive ? {} : null) },
		closest: () => (reduced ? {} : null),
		contains: () => false,
		parentElement: null
	});
	vi.stubGlobal('document', { activeElement: null });
	return { node, animate, cancel };
}

afterEach(() => vi.unstubAllGlobals());

describe('optional disclosure prose', () => {
	it('does not animate initial content and sharpens only on opening, inside the early hint budget', () => {
		const { node, animate, cancel } = fixture();
		const cleanup = disclosureProse(true)(node as unknown as HTMLElement);
		expect(animate).not.toHaveBeenCalled();
		node.dispatchEvent(new Event('introstart'));
		expect(animate).toHaveBeenCalledWith(
			[{ filter: 'blur(2px)' }, { filter: 'blur(0px)' }],
			expect.objectContaining({ duration: motionPresets.hint.enter })
		);
		node.dispatchEvent(new Event('outrostart'));
		expect(cancel).toHaveBeenCalledOnce();
		expect(animate).toHaveBeenCalledOnce();
		cleanup?.();
	});
	it('clears the optional paint as soon as focus enters', () => {
		const { node, cancel } = fixture();
		const cleanup = disclosureProse(true)(node as unknown as HTMLElement);
		node.dispatchEvent(new Event('introstart'));
		node.dispatchEvent(new Event('focusin'));
		expect(cancel).toHaveBeenCalledOnce();
		cleanup?.();
	});
	it.each([
		[true, false],
		[false, true]
	])('never blurs interactive or reduced content (%s, %s)', (interactive, reduced) => {
		const { node, animate } = fixture(interactive, reduced);
		const cleanup = disclosureProse(true)(node as unknown as HTMLElement);
		node.dispatchEvent(new Event('introstart'));
		expect(animate).not.toHaveBeenCalled();
		cleanup?.();
	});
	it('removes all listeners when detached', () => {
		const { node, animate, cancel } = fixture();
		const cleanup = disclosureProse(true)(node as unknown as HTMLElement);
		node.dispatchEvent(new Event('introstart'));
		cleanup?.();
		node.dispatchEvent(new Event('introstart'));
		expect(animate).toHaveBeenCalledOnce();
		expect(cancel).toHaveBeenCalledOnce();
	});
});
