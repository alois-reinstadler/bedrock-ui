import { tick } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './color-family.test.svelte';

afterEach(cleanup);
function input(container: Element) {
	return container.querySelector<HTMLInputElement>('input:not([type="hidden"])')!;
}
async function type(container: Element, text: string) {
	const field = input(container);
	field.value = text;
	field.dispatchEvent(new Event('input', { bubbles: true }));
	await tick();
}
async function key(container: Element, selector: string, key: string) {
	container
		.querySelector(selector)!
		.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
	await tick();
}
describe('composable color family', () => {
	it.each([false, true])(
		'remembers the latest external hue through gray and black (standalone=%s)',
		async (standalone) => {
			const { container } = await render(Fixture, { standalone });
			for (const color of ['blue', 'gray', 'black']) {
				container.querySelector<HTMLButtonElement>(`[data-external="${color}"]`)!.click();
				await tick();
				expect(container.querySelector('[data-channel="hue"]')!.getAttribute('aria-valuenow')).toBe(
					'240'
				);
			}
			await key(container, '[data-slot="color-area"]', 'End');
			const area = container.querySelector('[data-slot="color-area"]')!;
			area.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', altKey: true, bubbles: true }));
			await tick();
			expect(container.querySelector('output')!.textContent).toBe('#0000ff80');
		}
	);

	it('coordinates custom picker children and submits canonical alpha color', async () => {
		const { container } = await render(Fixture);
		expect(input(container).value).toBe('rgba(255, 0, 0, 0.502)');
		await key(container, '[data-channel="alpha"]', 'Home');
		expect(container.querySelector('output')!.textContent).toBe('#ff000000');
		expect(input(container).value).toBe('rgba(255, 0, 0, 0)');
		expect(new FormData(container.querySelector('form')!).get('color')).toBe('#ff000000');
	});
	it('keeps the chosen hue when saturation becomes zero', async () => {
		const { container } = await render(Fixture);
		await key(container, '[data-channel="hue"]', 'End');
		await key(container, '[data-slot="color-area"]', 'Home');
		expect(container.querySelector('[data-channel="hue"]')!.getAttribute('aria-valuenow')).toBe(
			'359'
		);
		await key(container, '[data-slot="color-area"]', 'End');
		expect(container.querySelector('[data-channel="hue"]')!.getAttribute('aria-valuenow')).toBe(
			'359'
		);
	});
	it('preserves incomplete input and clears it with Escape', async () => {
		const { container } = await render(Fixture);
		await type(container, 'rgb(12,');
		expect(input(container).value).toBe('rgb(12,');
		expect(input(container).getAttribute('aria-invalid')).toBe('true');
		expect(container.querySelector('output')!.textContent).toBe('#ff000080');
		await key(container, 'input:not([type="hidden"])', 'Escape');
		expect(input(container).value).toBe('rgba(255, 0, 0, 0.502)');
		expect(container.querySelector('[role="alert"]')).toBeNull();
	});
	it('inherits disabled state for every child and excludes form submission', async () => {
		const { container } = await render(Fixture, { disabled: true });
		expect(input(container).disabled).toBe(true);
		expect(container.querySelector('[data-channel="hue"]')!.getAttribute('tabindex')).toBe('-1');
		await key(container, '[data-slot="color-area"]', 'Home');
		expect(container.querySelector('output')!.textContent).toBe('#ff000080');
		expect(new FormData(container.querySelector('form')!).has('color')).toBe(false);
	});
	it('supports standalone fields, sliders and areas bound to a value', async () => {
		const { container } = await render(Fixture, { standalone: true });
		await type(container, '#00ff0080');
		expect(container.querySelector('[data-channel="hue"]')!.getAttribute('aria-valuenow')).toBe(
			'120'
		);
		expect(new FormData(container.querySelector('form')!).get('color')).toBe('#00ff0080');
		await key(container, '[data-channel="hue"]', 'Home');
		expect(container.querySelector('output')!.textContent).toBe('#ff000080');
	});
	it('allows duplicate swatches and normalizes equivalent color syntax for selection', async () => {
		const { container } = await render(Fixture);
		const buttons = container.querySelectorAll<HTMLButtonElement>(
			'[data-slot="color-swatch-picker"] button'
		);
		expect(buttons.length).toBe(4);
		buttons[2].click();
		await tick();
		expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
		expect(buttons[3].getAttribute('aria-pressed')).toBe('true');
		expect(container.querySelector('output')!.textContent).toBe('#0000ffff');
	});
});
