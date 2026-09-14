import { describe, expect, it } from 'vitest';
import { componentGuides } from './index';
import { createComponentReference } from './reference';
import { getComponentReference } from '../../server/component-reference/index';
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

	it('has properties and accessibility guidance for every registered component', () => {
		for (const component of components) {
			const reference = getComponentReference(component.slug, component.category);
			expect(reference.api.length, `${component.slug} API`).toBeGreaterThan(0);
			expect(
				reference.accessibility.semantics.length,
				`${component.slug} semantics`
			).toBeGreaterThan(0);
			expect(reference.accessibility.keyboard.length, `${component.slug} keyboard`).toBeGreaterThan(
				0
			);
			expect(reference.accessibility.focus.length, `${component.slug} focus`).toBeGreaterThan(0);
			expect(reference.accessibility.labels.length, `${component.slug} labels`).toBeGreaterThan(0);
			expect(
				reference.accessibility.announcements.length,
				`${component.slug} announcements`
			).toBeGreaterThan(0);
			expect(
				reference.accessibility.reducedMotion.length,
				`${component.slug} reduced motion`
			).toBeGreaterThan(0);
		}
	});

	it('extracts real primitive contracts, defaults and public aliases', () => {
		const accordion = getComponentReference('accordion', 'layout');
		expect(accordion.parts?.[0].aliases).toContain('Accordion');
		expect(accordion.api.find((entry) => entry.name === 'type')?.type).toContain('single');
		expect(accordion.api.find((entry) => entry.name === 'type')?.type).toContain('multiple');
		expect(accordion.api.find((entry) => entry.name === 'value')?.type).toContain(
			'string | string[]'
		);
		expect(accordion.api.find((entry) => entry.name === 'type')).toMatchObject({ required: true });
		expect(accordion.api.find((entry) => entry.name === 'value')).toMatchObject({
			kind: 'bindable'
		});
		expect(accordion.api.some((entry) => entry.name === 'onValueChange')).toBe(true);
		const button = getComponentReference('button', 'form');
		expect(button.api.find((entry) => entry.name === 'variant')).toMatchObject({
			default: '"default"'
		});
		expect(button.parts).toHaveLength(1);
		expect(button.parts?.[0].aliases).toEqual(['Button']);
		const checkbox = getComponentReference('checkbox', 'form');
		expect(checkbox.api.some((entry) => entry.name === 'checked')).toBe(true);
		expect(checkbox.accessibility.semantics[0]).toContain('mixed');
		expect(getComponentReference('slider', 'form').accessibility.keyboard[0]).toContain('Home/End');
	});

	it('documents Stepped Form coordination and its application-owned accessibility boundaries', () => {
		const guide = createComponentReference('stepped-form', 'form').accessibility;
		expect(guide.semantics.join(' ')).toContain('FormData');
		expect(guide.focus.join(' ')).toContain('preventScroll');
		expect(guide.focus.join(' ')).toContain('inactive section reveals it');
		expect(guide.announcements.join(' ')).toContain('keep it mounted');
		expect(guide.knownGaps?.join(' ')).toContain('no-JavaScript');
		expect(guide.knownGaps?.join(' ')).toContain('popstate');
		expect(guide.knownGaps?.join(' ')).toContain('cannot cancel');
		expect(guide.requirements?.map((item) => item.criteria)).toEqual(
			expect.arrayContaining([
				'WCAG 2.4.3: Focus Order',
				'WCAG 3.3.1: Error Identification',
				'WCAG 4.1.3: Status Messages'
			])
		);
		expect(createComponentReference('button', 'form').accessibility.focus[0]).toContain(
			'test obligation'
		);
	});

	it('documents the full Button contrast test matrix and known upstream gaps', () => {
		const button = getComponentReference('button', 'form');
		expect(button.api.map((entry) => entry.name)).toEqual(
			expect.arrayContaining(['variant', 'size', 'href', 'disabled', 'children', 'ref'])
		);
		expect(button.accessibility.requirements).toHaveLength(6);
		expect(
			button.accessibility.requirements?.find((item) => item.requirement === 'Badge text')?.guidance
		).toContain('72 generated pairs');

		for (const slug of ['badge', 'avatar', 'slider']) {
			const component = components.find((item) => item.slug === slug);
			expect(component).toBeDefined();
			expect(
				getComponentReference(slug, component!.category).accessibility.knownGaps?.length
			).toBeGreaterThan(0);
		}
	});
});
