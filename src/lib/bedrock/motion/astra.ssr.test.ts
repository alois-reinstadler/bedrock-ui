import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Fixture from './astra.test.svelte';

describe('Astra opt-in SSR contract', () => {
	it('renders native controls and initial motion styles alongside consumer styles without DOM access', () => {
		const { body } = render(Fixture);
		expect(body).toContain('<button');
		expect(body).toContain('Consumer action');
		expect(body).toContain('Server-rendered panel content');
		expect(body).toContain('consumer-button');
		expect(body).toContain('--consumer-token: 7');
		expect(body).toContain('padding: 13px');
		expect(body).toMatch(/opacity:\s*0\.4/);
		expect(body).toMatch(/translate:\s*0px 12px/);
	});

	it('preserves native link semantics on the CSS button', () => {
		const { body } = render(Fixture, { props: { href: '#destination' } });
		expect(body).toContain('<a');
		expect(body).toContain('href="#destination"');
		expect(body).not.toContain('<button');
	});

	it('keeps CSS, engine and existing Bedrock APIs independently importable on the server', async () => {
		const [css, engine, legacy] = await Promise.all([
			import('./css.js'),
			import('./engine.js'),
			import('./index.js')
		]);
		for (const name of ['CssButton', 'CssPanel', 'createMotion'] as const)
			expect(css[name]).toBeTypeOf('function');
		for (const name of ['Motion', 'MotionConfig', 'createMotion', 'Presence'] as const)
			expect(engine[name]).toBeTypeOf('function');
		for (const name of ['layout', 'reveal', 'appear', 'vanish', 'drawer'] as const)
			expect(legacy[name]).toBeTypeOf('function');
	});
});

describe('Default content visibility', () => {
	it('renders essential panel content visibly before hydration', async () => {
		const { default: PolicyFixture } = await import('./astra-policy.test.svelte');
		const { body } = render(PolicyFixture);
		expect(body).toContain('Essential content');
		expect(body).not.toMatch(/opacity:\s*0(?:[;"\s])/);
	});
});
