import { describe, expect, it } from 'vitest';
import { labPages, rubricDimensions } from './types.js';

describe('Motion Lab registry', () => {
	it('keeps the requested global benchmark groups navigable', () => {
		expect(labPages).toHaveLength(6);
		expect(new Set(labPages.map((page) => page.href)).size).toBe(labPages.length);
		expect(labPages[0]?.href).toBe('/demo/motion');
	});

	it('contains the complete evaluation rubric', () => {
		expect(rubricDimensions.map(([name]) => name)).toEqual([
			'Zweck',
			'Frequenz',
			'Timing',
			'Easing',
			'Räumlichkeit',
			'Richtung',
			'Ursprung',
			'Kontinuität',
			'Unterbrechbarkeit',
			'Manipulation',
			'Performance',
			'Barrierefreiheit',
			'Kohäsion',
			'Zurückhaltung'
		]);
	});
});
