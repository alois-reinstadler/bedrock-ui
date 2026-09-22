import { error } from '@sveltejs/kit';
import { records } from '#lib/site/motion-route-prototype/data.js';
import type { PageLoad } from './$types';

export const entries = () => records.map(({ id }) => ({ id }));

export const load: PageLoad = async ({ params, url }) => {
	const record = records.find((candidate) => candidate.id === params.id);
	if (!record) error(404, 'Story not found');
	// Static builds have no query-specific content. Delays are a client-only evaluation control.
	if (typeof window === 'undefined') return { record, ready: 0, image: record.image };
	const delay = Math.max(0, Math.min(2000, Number(url.searchParams.get('delay')) || 0));
	if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
	const image = url.searchParams.has('broken')
		? '/motion-missing.jpg'
		: url.searchParams.has('art')
			? records.find((r) => r.id !== record.id)!.image
			: record.image;
	return {
		record,
		image:
			image + (url.searchParams.has('fresh') ? '?motion=' + url.searchParams.get('fresh') : ''),
		ready: Math.max(0, Math.min(2000, Number(url.searchParams.get('ready')) || 0))
	};
};
