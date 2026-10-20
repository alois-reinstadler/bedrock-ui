import { highlight } from './highlight.js';
import { getComponentReference } from '#lib/server/component-reference/index.js';
import { importPath, type ComponentDoc } from '#lib/site/registry';
import type { ComponentGuide } from '#lib/site/component-guides/index.js';

export async function loadReferencePage(
	component: ComponentDoc,
	guide: ComponentGuide,
	href = `/docs/components/${component.slug}`,
	section = component.category as string
) {
	const exportName = component.importName ?? component.title.replaceAll(' ', '');
	const importCode =
		guide.anatomy.length > 1
			? `import * as ${exportName} from '${importPath(component.slug)}';`
			: `import { ${exportName} } from '${importPath(component.slug)}';`;
	return {
		component,
		guide,
		href,
		section,
		importCode,
		importHtml: await highlight(importCode, 'typescript'),
		reference: getComponentReference(component.slug, component.category)
	};
}

export type ReferencePageData = Awaited<ReturnType<typeof loadReferencePage>>;
