import { highlight } from '#lib/server/docs/highlight.js';
import { error } from '@sveltejs/kit';
import { getBlock } from '#lib/site/blocks.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const block = getBlock(params.slug);
	if (!block) error(404, 'Block not found');
	const importCode = `import { ${block.importName} } from '#lib/bedrock/blocks/${block.slug}/index.js';`;
	return { block, importCode, importHtml: await highlight(importCode, 'typescript') };
};
