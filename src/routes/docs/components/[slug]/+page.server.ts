import { highlight } from '#lib/server/docs/highlight.js';
import { importPath } from '#lib/site/registry';
import { getComponentReference } from '#lib/server/component-reference/index.js';
import { error } from '@sveltejs/kit';
import { componentGuides } from '#lib/site/component-guides/index.js';
import { components, getComponent } from '#lib/site/registry';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = () =>
	components.map((component) => ({ slug: component.slug }));

export const load: PageServerLoad = async ({ params }) => {
	const component = getComponent(params.slug);
	if (!component) error(404, 'Component not found');
	const guide = componentGuides[params.slug];
	if (!guide) error(500, 'Component guide not found');
	const exportName = component.importName ?? component.title.replaceAll(' ', '');
	const importCode =
		guide.anatomy.length > 1
			? `import * as ${exportName} from '${importPath(component.slug)}';`
			: `import { ${exportName} } from '${importPath(component.slug)}';`;
	return {
		component,
		guide,
		importCode,
		importHtml: await highlight(importCode, 'typescript'),
		reference: getComponentReference(component.slug, component.category)
	};
};
