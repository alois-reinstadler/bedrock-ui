import { error } from '@sveltejs/kit';
import { getShader, shaders } from '#lib/bedrock/shaders/catalog.js';
import type { PageLoad, EntryGenerator } from './$types';
export const entries: EntryGenerator = () => shaders.map(({ slug }) => ({ slug }));
export const load: PageLoad = ({ params }) => {
	const shader = getShader(params.slug);
	if (!shader) error(404, 'Shader not found');
	return { shader };
};
