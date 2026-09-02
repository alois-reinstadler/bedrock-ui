import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './indicator.test.svelte';

afterEach(() => cleanup());

function root(container: Element, testId: string): HTMLElement {
	const match = container.querySelector<HTMLElement>(`[data-testid="${testId}"] > [data-slot]`);
	if (!match) throw new Error(`Indicator not found: ${testId}`);
	return match;
}

describe('Indicators', () => {
	it('renders a mark per state and nothing when unchecked', async () => {
		const view = await render(Fixture);

		expect(root(view.container, 'checkbox-unchecked').childElementCount).toBe(0);
		expect(root(view.container, 'checkbox-checked').querySelector('svg')).not.toBeNull();
		const indeterminate = root(view.container, 'checkbox-indeterminate');
		expect(indeterminate.querySelector('svg')).toBeNull();
		expect(indeterminate.childElementCount).toBe(1);

		expect(root(view.container, 'check-unchecked').childElementCount).toBe(0);
		expect(root(view.container, 'check-checked').querySelector('svg')).not.toBeNull();

		expect(root(view.container, 'radio-unchecked').childElementCount).toBe(0);
		expect(root(view.container, 'radio-checked').childElementCount).toBe(1);
	});

	it('renders children instead of the state mark', async () => {
		const view = await render(Fixture);
		const busy = root(view.container, 'checkbox-busy');
		expect(busy.querySelector('[data-testid="busy-mark"]')).not.toBeNull();
		expect(busy.querySelector('svg')).toBeNull();
	});

	it('hides every indicator root from assistive technology', async () => {
		const view = await render(Fixture);
		const roots = [...view.container.querySelectorAll('[data-slot$="-indicator"]')];
		expect(roots).toHaveLength(8);
		for (const element of roots) {
			expect(element.getAttribute('aria-hidden')).toBe('true');
		}
	});

	it('exposes the state on data-state for owner styling', async () => {
		const view = await render(Fixture);
		expect(root(view.container, 'checkbox-indeterminate').dataset.state).toBe('indeterminate');
		expect(root(view.container, 'radio-checked').dataset.state).toBe('checked');
	});
});
