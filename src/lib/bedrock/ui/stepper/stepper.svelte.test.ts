import { tick } from 'svelte';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './stepper.test.svelte';

afterEach(() => cleanup());

function getSteps(container: HTMLElement) {
	return container.querySelectorAll<HTMLElement>('[data-slot="stepper-step"]');
}

describe('Stepper', () => {
	it('renders an ordered list with an accessible label', async () => {
		const view = await render(Fixture);
		const list = view.container.querySelector('ol')!;

		expect(list.getAttribute('aria-label')).toBe('Onboarding progress');
		expect(list.querySelectorAll('li')).toHaveLength(4);
	});

	it('marks the active step with aria-current and sr-only state text', async () => {
		const view = await render(Fixture);
		const steps = getSteps(view.container);

		expect(steps[1].getAttribute('aria-current')).toBe('step');
		expect(steps[1].textContent).toContain('Current step');
		expect(steps[0].hasAttribute('aria-current')).toBe(false);
	});

	it('shows a check mark and sr-only text on completed steps', async () => {
		const view = await render(Fixture);
		const completedIndicator = getSteps(view.container)[0].querySelector(
			'[data-slot="stepper-indicator"]'
		)!;

		expect(completedIndicator.querySelector('svg')).not.toBeNull();
		expect(getSteps(view.container)[0].textContent).toContain('Completed');
	});

	it('recolors only the indicator for a status and adds sr-only status text', async () => {
		const view = await render(Fixture);
		const statusStep = getSteps(view.container)[2];
		const indicator = statusStep.querySelector('[data-slot="stepper-indicator"]')!;
		const connectorFill = statusStep.querySelector('[data-slot="stepper-connector"] > div')!;

		expect(indicator.className).toContain('amber');
		expect(connectorFill.className).not.toContain('amber');
		expect(statusStep.textContent).toContain('Warning');
	});

	it('renders clickable steps as buttons that report their index', async () => {
		const onStepClick = vi.fn();
		const view = await render(Fixture, { onStepClick });
		const steps = getSteps(view.container);

		steps[0].querySelector('button')!.click();
		await tick();
		expect(onStepClick).toHaveBeenCalledWith(0);
		steps[2].querySelector('button')!.click();
		await tick();
		expect(onStepClick).toHaveBeenCalledWith(2);
	});

	it('never renders a button for a disabled step', async () => {
		const view = await render(Fixture, { onStepClick: vi.fn() });

		expect(getSteps(view.container)[3].querySelector('button')).toBeNull();
	});

	it('animates the covered segment only when advancing by exactly one step', async () => {
		const view = await render(Fixture);

		expect(view.container.querySelector('[data-animated]')).toBeNull();

		view.container.querySelector<HTMLElement>('[data-testid="advance"]')!.click();
		await tick();
		const animated = view.container.querySelector('[data-animated="true"]')!;
		expect(getSteps(view.container)[2].contains(animated)).toBe(true);
		cleanup();

		const jumped = await render(Fixture);
		jumped.container.querySelector<HTMLElement>('[data-testid="jump"]')!.click();
		await tick();
		expect(jumped.container.querySelector('[data-animated]')).toBeNull();
		cleanup();

		const back = await render(Fixture);
		back.container.querySelector<HTMLElement>('[data-testid="back"]')!.click();
		await tick();
		expect(back.container.querySelector('[data-animated]')).toBeNull();
	});
});
