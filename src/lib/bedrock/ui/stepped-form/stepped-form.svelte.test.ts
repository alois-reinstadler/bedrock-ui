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
	for (const action of ['disable', 'remove']) {
		it(`omits ${action}d mounted panels without deleting same-name enabled values`, async () => {
			const onSubmit = vi.fn();
			const validateStep = vi.fn<import('./context.js').SteppedFormValidator>(() => true);
			const view = await render(Fixture, { onSubmit, validateStep, keepDetailsMounted: true });
			const email = view.container.querySelector<HTMLInputElement>('#email')!;
			email.value = 'ada@example.com';
			const team = view.container.querySelector<HTMLInputElement>('#team')!;
			team.value = 'Excluded value';
			team.name = 'email';
			view.container.querySelector<HTMLButtonElement>(`[data-testid="${action}-details"]`)!.click();
			await tick();
			const form = view.container.querySelector('form')!;
			expect(new FormData(form).getAll('email')).toEqual(['ada@example.com']);
			expect(team.value).toBe('Excluded value');
			expect(team.matches(':disabled')).toBe(true);
			view.container.querySelector<HTMLButtonElement>('[data-testid="control-review"]')!.click();
			await tick();
			view.container.querySelector<HTMLButtonElement>('[data-slot="stepped-form-submit"]')!.click();
			await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
			expect(onSubmit.mock.calls[0][0].formData.getAll('email')).toEqual(['ada@example.com']);
			expect(
				validateStep.mock.calls.every((args) => args[0].formData.getAll('email').length === 1)
			).toBe(true);
		});
	}

	it('restores preserved controls when a disabled step is enabled again', async () => {
		const view = await render(Fixture);
		const team = view.container.querySelector<HTMLInputElement>('#team')!;
		team.value = 'Field notes';
		view.container.querySelector<HTMLButtonElement>('[data-testid="disable-details"]')!.click();
		await tick();
		expect(new FormData(view.container.querySelector('form')!).has('team')).toBe(false);
		view.container.querySelector<HTMLButtonElement>('[data-testid="enable-details"]')!.click();
		await tick();
		expect(new FormData(view.container.querySelector('form')!).get('team')).toBe('Field notes');
		expect(
			view.container.querySelector<HTMLElement>('[data-stepped-form-step="details"]')!.hidden
		).toBe(true);
	});

	it('announces async submission failure, prevents duplicates and retries with retained data', async () => {
		let reject!: (error: Error) => void;
		const onSubmit = vi
			.fn()
			.mockImplementationOnce(() => new Promise<void>((_, fail) => (reject = fail)))
			.mockResolvedValue(undefined);
		const view = await render(Fixture, { onSubmit });
		view.container.querySelector<HTMLInputElement>('#email')!.value = 'ada@example.com';
		view.container.querySelector<HTMLButtonElement>('[data-testid="control-review"]')!.click();
		await tick();
		const submit = view.container.querySelector<HTMLButtonElement>(
			'[data-slot="stepped-form-submit"]'
		)!;
		submit.click();
		await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
		expect(view.container.querySelector('form')?.getAttribute('data-status')).toBe('submitting');
		expect(submit.disabled).toBe(true);
		submit.click();
		expect(onSubmit).toHaveBeenCalledOnce();
		reject(new Error('Temporary connection failure'));
		await vi.waitFor(() =>
			expect(
				view.container.querySelector('[data-slot="stepped-form-status"]')?.textContent
			).toContain('Temporary connection failure')
		);
		view.container
			.querySelector<HTMLButtonElement>('[data-slot="stepped-form-status"] button')!
			.click();
		await vi.waitFor(() =>
			expect(view.container.querySelector('form')?.getAttribute('data-status')).toBe('success')
		);
		expect(onSubmit).toHaveBeenCalledTimes(2);
		expect(onSubmit.mock.calls[1][0].formData.get('email')).toBe('ada@example.com');
	});

	it('synchronizes bound value and honors the nonlinear domain guard', async () => {
		const canNavigate = vi.fn().mockResolvedValueOnce(false).mockResolvedValue(true);
		const onValueChange = vi.fn();
		const view = await render(Fixture, { canNavigate, onValueChange });
		view.container.querySelector<HTMLInputElement>('#email')!.value = 'ada@example.com';
		const progress = view.container.querySelectorAll<HTMLButtonElement>(
			'[data-slot="stepped-form-progress"] button'
		);
		progress[2].click();
		await tick();
		expect(canNavigate).not.toHaveBeenCalled();
		expect(
			view.container.querySelector<HTMLElement>('[data-stepped-form-step="account"]')!.hidden
		).toBe(false);
		view.container
			.querySelectorAll<HTMLButtonElement>('[data-slot="stepped-form-progress"] button')[1]
			.click();
		await vi.waitFor(() => expect(canNavigate).toHaveBeenCalledOnce());
		await tick();
		expect(onValueChange).not.toHaveBeenCalled();
		view.container
			.querySelectorAll<HTMLButtonElement>('[data-slot="stepped-form-progress"] button')[1]
			.click();
		await vi.waitFor(() =>
			expect(view.container.querySelector('[data-testid="controlled-value"]')?.textContent).toBe(
				'details'
			)
		);
		expect(onValueChange).toHaveBeenCalledWith('details', 'account', 'progress');
		view.container.querySelector<HTMLButtonElement>('[data-testid="control-review"]')!.click();
		await tick();
		expect(
			view.container.querySelector<HTMLElement>('[data-stepped-form-step="review"]')!.hidden
		).toBe(false);
		expect(canNavigate).toHaveBeenCalledTimes(2);
	});
});
