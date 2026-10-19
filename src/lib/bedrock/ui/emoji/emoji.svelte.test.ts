import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { Emoji } from './index';

afterEach(() => {
	getSelection()?.removeAllRanges();
	cleanup();
	vi.unstubAllGlobals();
});

function selectContents(element: Element) {
	const range = document.createRange();
	range.selectNodeContents(element);
	getSelection()?.removeAllRanges();
	getSelection()?.addRange(range);
	return getSelection()?.toString();
}

describe('Emoji', () => {
	it('uses the same component for a named symbol and ordinary text', async () => {
		const view = await render(Emoji, { value: '😊', label: 'Happy', size: 24 });
		const root = view.container.querySelector<HTMLElement>('[data-slot="emoji"]')!;
		expect(root.getAttribute('role')).toBe('img');
		expect(root.getAttribute('aria-label')).toBe('Happy');
		expect(root.style.fontSize).toBe('24px');
		await view.rerender({ value: 'Ready to ship 🚀✨', label: undefined, size: undefined });
		expect(root.hasAttribute('role')).toBe(false);
		expect(root.hasAttribute('aria-label')).toBe(false);
		expect(root.style.fontSize).toBe('');
		expect(root.textContent).toBe('Ready to ship 🚀✨');
		await view.rerender({ decorative: true });
		expect(root.getAttribute('aria-hidden')).toBe('true');
	});
	it('preserves original Unicode in selection and excludes artwork from interaction', async () => {
		const value = 'Hello 👩🏽‍💻 🇦🇹 1️⃣ 👨‍👩‍👧‍👦!';
		const view = await render(Emoji, { value });
		const root = view.container.querySelector<HTMLElement>('[data-slot="emoji"]')!;
		expect(root.textContent).toBe(value);
		expect(selectContents(root)).toBe(value);
		expect(root.querySelector('img')).toBeNull();
		const glyphs = root.querySelectorAll('[data-renderer]');
		expect(glyphs).toHaveLength(4);
		expect(selectContents(glyphs[0])).toBe('👩🏽‍💻');
		expect(selectContents(glyphs[3])).toBe('👨‍👩‍👧‍👦');
	});
	it('preserves selection and semantics after image failure and retries on value changes', async () => {
		const probes: { src: string; onload: (() => void) | null; onerror: (() => void) | null }[] = [];
		vi.stubGlobal(
			'Image',
			class {
				src = '';
				onload: (() => void) | null = null;
				onerror: (() => void) | null = null;
				constructor() {
					probes.push(this);
				}
			}
		);
		const view = await render(Emoji, { value: '❤️', label: 'Love' });
		const root = view.container.querySelector<HTMLElement>('[data-slot="emoji"]')!;
		const oldError = probes[0].onerror!;
		oldError();
		await vi.waitFor(() =>
			expect(root.querySelector('[data-renderer]')?.getAttribute('data-renderer')).toBe('native')
		);
		expect(root.querySelector('img')).toBeNull();
		expect(root.getAttribute('aria-label')).toBe('Love');
		expect(selectContents(root)).toBe('❤️');
		await view.rerender({ value: '😊', label: 'Happy' });
		expect(probes[1].src).toContain('1f60a.png');
		oldError();
		probes[1].onload!();
		await vi.waitFor(() =>
			expect(root.querySelector('[data-state]')?.getAttribute('data-state')).toBe('loaded')
		);
		expect(root.querySelector('[data-renderer]')?.getAttribute('data-renderer')).toBe('image');
		expect(selectContents(root)).toBe('😊');
	});
	it('cancels dragging selected text so the browser cannot create an artwork ghost', async () => {
		const view = await render(Emoji, { value: 'Hello 😊' });
		const root = view.container.querySelector<HTMLElement>('[data-slot="emoji"]')!;
		const glyph = root.querySelector('[data-renderer]')!;
		expect(selectContents(root)).toBe('Hello 😊');
		const drag = new DragEvent('dragstart', { bubbles: true, cancelable: true });
		glyph.dispatchEvent(drag);
		expect(drag.defaultPrevented).toBe(true);
		expect(root.draggable).toBe(false);
	});
	it('escapes markup and preserves text presentation and whitespace', async () => {
		const value = '<script>alert(1)</script> © ™ ♥︎\n  👩🏽‍💻';
		const view = await render(Emoji, { value, style: 'white-space: pre-wrap' });
		const root = view.container.querySelector('[data-slot="emoji"]')!;
		expect(root.querySelector('script')).toBeNull();
		expect(root.querySelectorAll('[data-renderer]')).toHaveLength(1);
		expect(selectContents(root)).toBe(value);
		await view.rerender({ value: '' });
		expect(root.textContent).toBe('');
		expect(root.querySelector('img')).toBeNull();
	});
});
