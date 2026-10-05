import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import Fixture from './phone-input.test.svelte';

afterEach(() => cleanup());

describe('PhoneInput', () => {
	it('keeps raw text intact and submits a separate valid E.164 value', async () => {
		const view = await render(Fixture);
		const input = page.getByRole('textbox', { name: 'Phone number' });
		await input.fill('+44 20 7946 0018');
		await expect.element(page.getByTestId('raw')).toHaveTextContent('+44 20 7946 0018');
		await expect.element(page.getByTestId('e164')).toHaveTextContent('+442079460018');
		expect(new FormData(view.container.querySelector('form')!).get('phone')).toBe(
			'+44 20 7946 0018'
		);
		expect(new FormData(view.container.querySelector('form')!).get('phoneE164')).toBe(
			'+442079460018'
		);
		await expect
			.element(page.getByRole('combobox', { name: 'Country calling code' }))
			.toHaveTextContent('GB');
	});
	it('preserves the caret during a middle edit and clears stale normalization', async () => {
		const view = await render(Fixture);
		const field = view.container.querySelector<HTMLInputElement>('input[type="tel"]')!;
		await page.getByRole('textbox', { name: 'Phone number' }).fill('0664 1234567');
		field.focus();
		field.setSelectionRange(5, 5);
		field.setRangeText('9', 5, 5, 'end');
		field.dispatchEvent(new Event('input', { bubbles: true }));
		await tick();
		expect(field.value).toBe('0664 91234567');
		expect(field.selectionStart).toBe(6);
		await page.getByRole('textbox', { name: 'Phone number' }).fill('+');
		await expect.element(page.getByTestId('e164')).toHaveTextContent('');
		expect(new FormData(view.container.querySelector('form')!).get('phoneE164')).toBe('');
	});
	it('searches calling codes and uses the selected country for national input', async () => {
		await render(Fixture);
		await page.getByRole('combobox', { name: 'Country calling code' }).click();
		await page.getByPlaceholder('Search countries or calling codes…').fill('United Kingdom');
		await page.getByRole('option', { name: /United Kingdom/ }).click();
		await page.getByRole('textbox', { name: 'Phone number' }).fill('020 7946 0018');
		await expect.element(page.getByTestId('e164')).toHaveTextContent('+442079460018');
	});
	it('forwards required and invalid and prevents editing read-only fields', async () => {
		const view = await render(Fixture, { readonly: true, required: true, invalid: true });
		const field = view.container.querySelector<HTMLInputElement>('input[type="tel"]')!;
		expect(field.readOnly).toBe(true);
		expect(field.required).toBe(true);
		expect(field.getAttribute('aria-invalid')).toBe('true');
		await expect
			.element(page.getByRole('combobox', { name: 'Country calling code' }))
			.toBeDisabled();
	});
	it('uses native required validation and clears normalization on form reset', async () => {
		const view = await render(Fixture, { required: true });
		const form = view.container.querySelector('form')!;
		expect(form.checkValidity()).toBe(false);
		await page.getByRole('textbox', { name: 'Phone number' }).fill('0664 1234567');
		expect(form.checkValidity()).toBe(true);
		form.reset();
		await expect.element(page.getByRole('textbox', { name: 'Phone number' })).toHaveValue('');
		await expect.element(page.getByTestId('raw')).toHaveTextContent('');
		expect(new FormData(form).get('phoneE164')).toBe('');
	});
	it('omits both fields from form submission when disabled', async () => {
		const view = await render(Fixture, { disabled: true });
		await expect.element(page.getByRole('textbox', { name: 'Phone number' })).toBeDisabled();
		const form = new FormData(view.container.querySelector('form')!);
		expect(form.has('phone')).toBe(false);
		expect(form.has('phoneE164')).toBe(false);
	});
});
