import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Fixture from './chat-composer.test.svelte';

describe('ChatComposer server rendering', () => {
	it('keeps both idle and busy controls visible before hydration', () => {
		const { body } = render(Fixture);
		expect(body).toContain('data-slot="chat-send-button"');
		expect(body).toContain('data-slot="chat-stop-button"');
		expect(body).not.toMatch(/opacity:\s*0(?:[;"\s])/);
	});
});
