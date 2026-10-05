import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import * as Shapes from './index.js';

describe('individual shape components', () => {
	it('exports and renders 72 distinct standalone SVG components', () => {
		const entries = Object.entries(Shapes);
		expect(entries.map(([name]) => name)).toEqual(
			Array.from({ length: 72 }, (_, i) => `Shape${String(i + 1).padStart(2, '0')}`)
		);
		const paths = entries.map(([, Component]) => {
			const { body } = render(Component);
			expect(body).toContain('aria-hidden="true"');
			expect(body).toContain('viewBox="0 0 256 256"');
			return body.match(/<path\s+d="([^"]+)"/)?.[1];
		});
		expect(paths.every(Boolean)).toBe(true);
		expect(new Set(paths).size).toBe(72);
	});

	it('accepts native SVG styling and accessible labels', () => {
		const { body } = render(Shapes.Shape18, {
			props: { label: 'Brand mark', fill: '#d45632', class: 'size-12 rotate-45', id: 'brand-mark' }
		});
		expect(body).toContain('role="img"');
		expect(body).toContain('aria-label="Brand mark"');
		expect(body).not.toContain('aria-hidden="true"');
		expect(body).toContain('fill="#d45632"');
		expect(body).toContain('id="brand-mark"');
		expect(body).toContain('size-12 rotate-45');
		expect(body).not.toContain('size-24');
	});
});
