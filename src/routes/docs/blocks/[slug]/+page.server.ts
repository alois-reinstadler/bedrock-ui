import { error } from '@sveltejs/kit';
import { getBlock } from '#lib/site/blocks.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const block = getBlock(params.slug);
	if (!block) error(404, 'Block not found');
	return { block };
};
