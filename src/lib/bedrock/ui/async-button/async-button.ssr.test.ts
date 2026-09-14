import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Fixture from './async-button.test.svelte';

describe('AsyncButton server rendering', () => {
	it('keeps its action label visible before hydration', () => {
		const { body } = render(Fixture, { props: { action: async () => {} } });
		expect(body).toContain('Upload');
		expect(body).toContain('data-slot="async-button"');
		expect(body).not.toMatch(/opacity:\s*0(?:[;"\s])/);
	});
});
