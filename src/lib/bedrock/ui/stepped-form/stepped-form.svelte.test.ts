import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './stepped-form.test.svelte';

afterEach(() => cleanup());

describe('Stepped Form', () => {
	it('validates the current step and focuses the first invalid field', async () => {
		const view = await render(Fixture);
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		expect(document.activeElement).toBe(view.container.querySelector('#email'));
		expect(
			view.container.querySelector('[data-slot="stepped-form-status"]')?.textContent
		).toContain('Review the fields');
	});

	it('preserves values while moving forward and backward', async () => {
		const view = await render(Fixture);
		const email = view.container.querySelector<HTMLInputElement>('#email')!;
		email.value = 'ada@example.com';
		email.dispatchEvent(new Event('input', { bubbles: true }));
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		expect(
			view.container.querySelector('[data-stepped-form-step="details"]')?.hasAttribute('hidden')
		).toBe(false);
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-previous"]')!.click();
		await tick();
		expect(view.container.querySelector<HTMLInputElement>('#email')?.value).toBe('ada@example.com');
	});

	it('runs async validation before advancing', async () => {
		let resolveValidation!: (value: boolean) => void;
		const validateStep = vi.fn(
			() => new Promise<boolean>((resolve) => (resolveValidation = resolve))
		);
		const view = await render(Fixture, { validateStep });
		const email = view.container.querySelector<HTMLInputElement>('#email')!;
		email.value = 'ada@example.com';
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('true');
		resolveValidation(true);
		await tick();
		await tick();
		expect(
			view.container.querySelector('[data-stepped-form-step="details"]')?.hasAttribute('hidden')
		).toBe(false);
	});

	it('submits values from hidden steps and announces success', async () => {
		const onSubmit = vi.fn();
		const view = await render(Fixture, { onSubmit });
		const email = view.container.querySelector<HTMLInputElement>('#email')!;
		email.value = 'ada@example.com';
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-submit"]')!.click();
		await tick();
		await tick();
		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onSubmit.mock.calls[0][0].formData.get('email')).toBe('ada@example.com');
		expect(
			view.container.querySelector('[data-slot="stepped-form-status"]')?.textContent
		).toContain('successfully');
	});

	it('falls back to a valid step when the current dynamic step is removed', async () => {
		const view = await render(Fixture);
		const email = view.container.querySelector<HTMLInputElement>('#email')!;
		email.value = 'ada@example.com';
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		view.container.querySelector<HTMLButtonElement>('[data-testid="remove-details"]')!.click();
		await tick();
		expect(
			view.container.querySelector('[data-stepped-form-step="account"]')?.hasAttribute('hidden')
		).toBe(false);
	});
	it('uses unique heading relationships for simultaneous instances', async () => {
		const first = await render(Fixture);
		const second = await render(Fixture);
		const a = first.container.querySelector('[data-slot="stepped-form-title"]')!;
		const b = second.container.querySelector('[data-slot="stepped-form-title"]')!;
		expect(a.id).not.toBe(b.id);
		expect(
			second.container
				.querySelector('[data-stepped-form-step="account"]')
				?.getAttribute('aria-labelledby')
		).toBe(b.id);
	});

	it('ignores async validation resolved after the target step is removed', async () => {
		let resolve!: (valid: boolean) => void;
		const view = await render(Fixture, {
			validateStep: () => new Promise<boolean>((done) => (resolve = done))
		});
		view.container.querySelector<HTMLInputElement>('#email')!.value = 'ada@example.com';
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-next"]')!.click();
		await tick();
		view.container.querySelector<HTMLButtonElement>('[data-testid="remove-details"]')!.click();
		await tick();
		resolve(true);
		await vi.waitFor(() =>
			expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('false')
		);
		expect(
			view.container.querySelector('[data-stepped-form-step="account"]')?.hasAttribute('hidden')
		).toBe(false);
	});

	it('blocks duplicate async navigation and retries rejected guards', async () => {
		const guard = vi
			.fn()
			.mockRejectedValueOnce(new Error('Connection unavailable'))
			.mockResolvedValue(true);
		const view = await render(Fixture, { canNavigate: guard });
		view.container.querySelector<HTMLInputElement>('#email')!.value = 'ada@example.com';
		const next = view.container.querySelector<HTMLButtonElement>(
			'[data-slot="stepped-form-next"]'
		)!;
		next.click();
		next.click();
		await vi.waitFor(() =>
			expect(
				view.container.querySelector('[data-slot="stepped-form-status"]')?.textContent
			).toContain('Connection unavailable')
		);
		expect(guard).toHaveBeenCalledOnce();
		view.container
			.querySelector<HTMLButtonElement>('[data-slot="stepped-form-status"] button')!
			.click();
		await vi.waitFor(() =>
			expect(
				view.container.querySelector('[data-stepped-form-step="details"]')?.hasAttribute('hidden')
			).toBe(false)
		);
	});

	it('revalidates hidden fields before submission and reveals the failed section', async () => {
		const onSubmit = vi.fn();
		const view = await render(Fixture, {
			onSubmit,
			persistence: { read: () => 'review', write: () => {} }
		});
		await tick();
		view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-submit"]')!.click();
		await vi.waitFor(() =>
			expect(
				view.container.querySelector('[data-stepped-form-step="account"]')?.hasAttribute('hidden')
			).toBe(false)
		);
		expect(onSubmit).not.toHaveBeenCalled();
		expect(document.activeElement).toBe(view.container.querySelector('#email'));
	});

	it('keeps inactive fields inert, mounted and outside sequential focus', async () => {
		const view = await render(Fixture);
		const panel = view.container.querySelector<HTMLElement>('[data-stepped-form-step="details"]')!;
		expect(panel.inert).toBe(true);
		expect(panel.hidden).toBe(true);
		expect(panel.getAttribute('aria-hidden')).toBe('true');
		expect(panel.querySelector('input')).not.toBeNull();
	});
});
