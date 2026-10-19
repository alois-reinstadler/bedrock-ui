import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import { Skeleton, SkeletonGroup, type SkeletonVariant } from './index';
import Fixture from './skeleton-group.test.svelte';

describe('Skeleton server rendering', () => {
	it('preserves the single native placeholder and consumer attributes', () => {
		const { body } = render(Skeleton, {
			props: { id: 'loading-avatar', class: 'size-10 rounded-full', 'aria-hidden': 'true' }
		});
		expect(body.match(/<div\b/g)).toHaveLength(1);
		expect(body).toContain('id="loading-avatar"');
		expect(body).toContain('aria-hidden="true"');
		expect(body).toContain('rounded-full');
		expect(body).not.toContain('rounded-md');
		expect(body).toContain('animate-pulse');
	});

	it.each<SkeletonVariant>(['pulse', 'shimmer', 'static'])(
		'allows consumers to disable %s through the existing class override',
		(variant) => {
			const { body } = render(Skeleton, { props: { variant, class: 'animate-none' } });
			expect(body).toContain('animate-none');
			expect(body).not.toContain('animate-pulse');
			expect(body).not.toContain('animate-[');
			expect(body).not.toMatch(/\svariant=/);
		}
	);

	it('inherits group settings on the server and respects child overrides and nested groups', () => {
		const { body } = render(Fixture);
		const tag = (id: string) => body.match(new RegExp(`<div[^>]*id="${id}"[^>]*>`))?.[0];
		expect(tag('shared-first')).toContain('data-variant="shimmer"');
		expect(tag('shared-first')).toContain('data-skeleton-grouped');
		expect(tag('static-child')).toContain('data-variant="static"');
		expect(tag('static-child')).not.toContain('data-skeleton-grouped');
		expect(tag('pulse-child')).toContain('animate-pulse');
		expect(tag('nested-static')).toContain('data-variant="static"');
		expect(tag('nested-shimmer')).toContain('data-skeleton-grouped');
		expect(body).toContain('--skeleton-group-duration: 3200ms');
		expect(body).toContain('animation-direction: reverse');
	});

	it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
		'normalizes invalid duration %s',
		(duration) => {
			const { body } = render(SkeletonGroup, { props: { duration } });
			expect(body).toContain('--skeleton-group-duration: 2000ms');
		}
	);
});
