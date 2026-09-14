import generated from './generated.json';
import { createComponentReference } from '#lib/site/component-guides/reference.js';
import type { ComponentPublicPart } from '#lib/site/component-guides/types.js';
import type { ComponentDoc } from '#lib/site/registry';

/** Only the selected family's metadata crosses the server load boundary. */
export function getComponentReference(slug: string, category: ComponentDoc['category']) {
	const reference = createComponentReference(slug, category);
	const parts = (generated as Record<string, ComponentPublicPart[]>)[slug] ?? [];
	return { ...reference, parts, api: parts[0]?.entries ?? [] };
}
