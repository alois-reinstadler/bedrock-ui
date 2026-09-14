import { describe, expect, it } from 'vitest';
import { componentGuides } from './index';
import { components } from '../registry';

const examples = import.meta.glob('../examples/*.svelte');

describe('component documentation coverage', () => {
	it('has a substantive guide for every registered component and no stale guides', () => {
		const registeredSlugs = components.map((component) => component.slug).sort();
		const guideSlugs = Object.keys(componentGuides).sort();

		expect(guideSlugs).toEqual(registeredSlugs);
		for (const slug of registeredSlugs) {
			const guide = componentGuides[slug];
			expect(guide?.purpose.length, `${slug} purpose`).toBeGreaterThan(40);
			expect(guide?.useWhen.length, `${slug} use cases`).toBeGreaterThanOrEqual(2);
			expect(guide?.avoidWhen.length, `${slug} exclusions`).toBeGreaterThanOrEqual(2);
			expect(guide?.anatomy.length, `${slug} anatomy`).toBeGreaterThanOrEqual(1);
			expect(guide?.examplePlan.length, `${slug} examples`).toBeGreaterThanOrEqual(1);
			expect(
				guide?.examplePlan.some((example) => example.priority === 'primary'),
				`${slug} primary example`
			).toBe(true);
		}
	});

	it('has a live example module for every registered component', () => {
		for (const component of components) {
			expect(
				Object.hasOwn(examples, `../examples/${component.slug}.svelte`),
				`${component.slug} example`
			).toBe(true);
		}
	});
});
