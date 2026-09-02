import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './color-picker.test.svelte';

afterEach(() => cleanup());

function slot(container: Element, name: string): HTMLElement {
	const match = container.querySelector<HTMLElement>(`[data-slot="color-picker-${name}"]`);
	if (!match) throw new Error(`Slot not found: color-picker-${name}`);
	return match;
}

function boundValue(container: Element): string {
	return container.querySelector('[data-testid="bound-value"]')?.textContent ?? '';
}

function textInput(container: Element): HTMLInputElement {
	const match = container.querySelector<HTMLInputElement>('input[aria-label="Color value"]');
	if (!match) throw new Error('Text input not found');
	return match;
}

async function press(target: HTMLElement, key: string, init: KeyboardEventInit = {}) {
	target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
	await tick();
}

async function type(container: Element, text: string) {
	const input = textInput(container);
	input.value = text;
	input.dispatchEvent(new Event('input', { bubbles: true }));
	await tick();
}

describe('ColorPicker', () => {
	it('keeps the bound value on invalid text and flags the input', async () => {
		const view = await render(Fixture, { value: '#6e56cf' });
		await type(view.container, 'not-a-color');
		expect(boundValue(view.container)).toBe('#6e56cf');
		expect(textInput(view.container).getAttribute('aria-invalid')).toBe('true');
		expect(view.container.querySelector('[role="alert"]')?.textContent).toContain(
			'Enter a valid HEX, RGB, or HSL color.'
		);
	});

	it('recovers from invalid text once a parseable color is entered', async () => {
		const view = await render(Fixture, { value: '#6e56cf' });
		await type(view.container, 'nope');
		await type(view.container, 'rgb(255, 0, 0)');
		expect(boundValue(view.container)).toBe('#ff0000');
		expect(view.container.querySelector('[role="alert"]')).toBeNull();
	});

	it('changes the value with ArrowRight on the hue rail', async () => {
		const view = await render(Fixture, { value: '#6e56cf' });
		const hue = slot(view.container, 'hue');
		const before = Number(hue.getAttribute('aria-valuenow'));
		await press(hue, 'ArrowRight');
		expect(Number(hue.getAttribute('aria-valuenow'))).toBe(before + 1);
		expect(boundValue(view.container)).not.toBe('#6e56cf');
	});

	it('supports Home, End, PageUp, and PageDown on the hue rail', async () => {
		const view = await render(Fixture, { value: '#6e56cf' });
		const hue = slot(view.container, 'hue');
		await press(hue, 'End');
		expect(hue.getAttribute('aria-valuenow')).toBe('359');
		await press(hue, 'Home');
		expect(hue.getAttribute('aria-valuenow')).toBe('0');
		await press(hue, 'PageUp');
		expect(hue.getAttribute('aria-valuenow')).toBe('10');
		await press(hue, 'PageDown');
		expect(hue.getAttribute('aria-valuenow')).toBe('0');
	});

	it('supports Home, End, PageUp, and PageDown on the SV area', async () => {
		const view = await render(Fixture, { value: '#6e56cf' });
		const area = slot(view.container, 'area');
		await press(area, 'End');
		expect(area.getAttribute('aria-valuenow')).toBe('100');
		await press(area, 'PageDown');
		expect(area.getAttribute('aria-valuenow')).toBe('90');
		await press(area, 'PageUp');
		expect(area.getAttribute('aria-valuenow')).toBe('100');
		await press(area, 'Home');
		expect(area.getAttribute('aria-valuenow')).toBe('0');
	});

	it('adjusts brightness with Alt+arrows and reflects it in aria-valuetext', async () => {
		const view = await render(Fixture, { value: '#ff0000' });
		const area = slot(view.container, 'area');
		await press(area, 'ArrowDown', { altKey: true });
		expect(area.getAttribute('aria-valuetext')).toBe('Saturation 100%, brightness 99%');
	});

	it('cycles the input text shape through hex, rgb, and hsl', async () => {
		const view = await render(Fixture, { value: '#ff0000' });
		const cycle = view.container.querySelector<HTMLButtonElement>(
			'button[aria-label="Color format"]'
		);
		if (!cycle) throw new Error('Format button not found');
		expect(textInput(view.container).value).toBe('#ff0000');
		cycle.click();
		await tick();
		expect(textInput(view.container).value).toBe('rgb(255, 0, 0)');
		cycle.click();
		await tick();
		expect(textInput(view.container).value).toBe('hsl(0, 100%, 50%)');
		cycle.click();
		await tick();
		expect(textInput(view.container).value).toBe('#ff0000');
	});

	it('commits swatch clicks and labels swatches through the labels prop', async () => {
		const onValueChange = vi.fn();
		const view = await render(Fixture, {
			value: '#6e56cf',
			onValueChange,
			labels: { swatch: (hex: string) => `Pick ${hex}` }
		});
		const swatch = view.container.querySelector<HTMLButtonElement>(
			'button[aria-label="Pick #ef4444"]'
		);
		if (!swatch) throw new Error('Swatch not found');
		swatch.click();
		await tick();
		expect(boundValue(view.container)).toBe('#ef4444');
		expect(onValueChange).toHaveBeenCalledWith('#ef4444');
		expect(swatch.getAttribute('aria-pressed')).toBe('true');
	});

	it('shows the alpha rail only when alpha is enabled', async () => {
		const withAlpha = await render(Fixture, { value: '#6e56cf', alpha: true });
		expect(withAlpha.container.querySelector('[data-slot="color-picker-alpha"]')).not.toBeNull();
		cleanup();
		const withoutAlpha = await render(Fixture, { value: '#6e56cf' });
		expect(withoutAlpha.container.querySelector('[data-slot="color-picker-alpha"]')).toBeNull();
	});

	it('emits 8-digit hex when the alpha rail moves', async () => {
		const view = await render(Fixture, { value: '#6e56cf', alpha: true });
		const alphaRail = slot(view.container, 'alpha');
		await press(alphaRail, 'PageDown');
		expect(boundValue(view.container)).toBe('#6e56cfe6');
		expect(alphaRail.getAttribute('aria-valuenow')).toBe('90');
	});

	it('jumps to the pointer position on pointerdown', async () => {
		const view = await render(Fixture, { value: '#6e56cf' });
		const hue = slot(view.container, 'hue');
		const rect = hue.getBoundingClientRect();
		hue.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: rect.right,
				clientY: rect.top + rect.height / 2
			})
		);
		await tick();
		expect(hue.getAttribute('aria-valuenow')).toBe('359');
	});

	it('blocks pointer and keyboard interaction when disabled', async () => {
		const view = await render(Fixture, { value: '#6e56cf', disabled: true });
		const hue = slot(view.container, 'hue');
		const before = hue.getAttribute('aria-valuenow');
		const rect = hue.getBoundingClientRect();
		hue.dispatchEvent(
			new PointerEvent('pointerdown', {
				bubbles: true,
				clientX: rect.right,
				clientY: rect.top + rect.height / 2
			})
		);
		await press(hue, 'ArrowRight');
		await press(slot(view.container, 'area'), 'End');
		expect(hue.getAttribute('aria-valuenow')).toBe(before);
		expect(boundValue(view.container)).toBe('#6e56cf');
		expect(hue.getAttribute('tabindex')).toBe('-1');
		expect(textInput(view.container).disabled).toBe(true);
	});

	it('renders only the swatch grid in the swatches variant', async () => {
		const view = await render(Fixture, { value: '#6e56cf', variant: 'swatches' });
		expect(view.container.querySelector('[data-slot="color-picker-swatches"]')).not.toBeNull();
		expect(view.container.querySelector('[data-slot="color-picker-area"]')).toBeNull();
		expect(view.container.querySelector('input')).toBeNull();
	});
});
