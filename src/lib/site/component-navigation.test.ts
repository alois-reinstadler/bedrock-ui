import { describe, expect, it } from 'vitest';
import { components } from './registry';
import { componentNavigation, componentNavigationKeywords } from './component-navigation';

describe('component navigation', () => {
	it('gives every documented component exactly one primary home', () => {
		const slugs = componentNavigation.flatMap((section) =>
			section.groups.flatMap((group) => group.components.map((component) => component.slug))
		);
		expect([...slugs].sort()).toEqual(components.map((component) => component.slug).sort());
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it('keeps category names searchable, including forms subgroups', () => {
		expect(componentNavigationKeywords.get('date-input')).toContain(
			'Forms & inputs Dates and time'
		);
		expect(componentNavigationKeywords.get('data-table')).toContain('Components  Data');
		expect(componentNavigationKeywords.get('progressive-blur')).toContain('Effects');
		expect(componentNavigationKeywords.get('visually-hidden')).toContain(
			'Accessibility & performance'
		);
	});
});
