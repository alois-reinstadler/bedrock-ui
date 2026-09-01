import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import NumberInput from './number-input.svelte';

afterEach(() => cleanup());

function setText(input: HTMLInputElement, value: string): void {
	input.value = value;
	input.dispatchEvent(new Event('input', { bubbles: true }));
}

function key(input: HTMLInputElement, value: string, shiftKey = false): void {
	input.dispatchEvent(new KeyboardEvent('keydown', { key: value, shiftKey, bubbles: true }));
}

async function settle(): Promise<void> {
	await Promise.resolve();
	await Promise.resolve();
}

describe('NumberInput', () => {
	it('commits typed locale text on blur and shows the formatted value', async () => {
		const onValueChange = vi.fn();
		const view = await render(NumberInput, { value: 12, locale: 'de-AT', onValueChange });
		const input = view.container.querySelector('input:not([type="hidden"])') as HTMLInputElement;
		input.focus();
		setText(input, '1234,5');
		input.blur();
		await settle();
		expect(onValueChange).toHaveBeenCalledWith(1234.5);
		expect(input.value).toBe(new Intl.NumberFormat('de-AT').format(1234.5));
	});

	it('commits on Enter and reverts invalid text', async () => {
		const onValueChange = vi.fn();
		const view = await render(NumberInput, { value: 10, onValueChange });
		const input = view.container.querySelector('input') as HTMLInputElement;
		input.focus();
		setText(input, '20.5');
		key(input, 'Enter');
		await settle();
		expect(onValueChange).toHaveBeenCalledWith(20.5);
		setText(input, 'invalid');
		key(input, 'Enter');
		await settle();
		expect(input.value).toBe('20.5');
		expect(onValueChange).toHaveBeenCalledTimes(1);
	});

	it('clamps values to min and max on commit', async () => {
		const onValueChange = vi.fn();
		const view = await render(NumberInput, { value: 5, min: 0, max: 10, onValueChange });
		const input = view.container.querySelector('input') as HTMLInputElement;
		input.focus();
		setText(input, '50');
		input.blur();
		await settle();
		expect(onValueChange).toHaveBeenCalledWith(10);
	});

	it('steps with arrow keys and multiplies the step with Shift', async () => {
		const onValueChange = vi.fn();
		const view = await render(NumberInput, { value: 2, step: 0.5, onValueChange });
		const input = view.container.querySelector('input') as HTMLInputElement;
		input.focus();
		key(input, 'ArrowUp');
		await settle();
		expect(onValueChange).toHaveBeenLastCalledWith(2.5);
		key(input, 'ArrowDown', true);
		await settle();
		expect(onValueChange).toHaveBeenLastCalledWith(-2.5);
	});

	it('labels steppers, steps immediately, and disables them with the field', async () => {
		const onValueChange = vi.fn();
		const view = await render(NumberInput, {
			value: 1,
			steppers: true,
			labels: { increment: 'Add one', decrement: 'Remove one' },
			onValueChange
		});
		const increase = view.container.querySelector('[aria-label="Add one"]') as HTMLButtonElement;
		const decrease = view.container.querySelector('[aria-label="Remove one"]') as HTMLButtonElement;
		expect(increase.disabled).toBe(false);
		increase.click();
		await settle();
		expect(onValueChange).toHaveBeenLastCalledWith(2);
		decrease.click();
		await settle();
		expect(onValueChange).toHaveBeenLastCalledWith(1);

		const disabledView = await render(NumberInput, { value: 1, steppers: true, disabled: true });
		const buttons = disabledView.container.querySelectorAll('button');
		expect([...buttons].every((button) => button.disabled)).toBe(true);
	});

	it('clears to null and submits the raw value through a hidden input', async () => {
		const onValueChange = vi.fn();
		const view = await render(NumberInput, {
			value: 1234.5,
			clearable: true,
			name: 'amount',
			formatOptions: { style: 'currency', currency: 'USD' },
			onValueChange
		});
		const hidden = view.container.querySelector('input[type="hidden"]') as HTMLInputElement;
		expect(hidden.name).toBe('amount');
		expect(hidden.value).toBe('1234.5');
		(view.container.querySelector('[aria-label="Clear"]') as HTMLButtonElement).click();
		await settle();
		expect(onValueChange).toHaveBeenCalledWith(null);
		expect(hidden.value).toBe('');
	});
});
