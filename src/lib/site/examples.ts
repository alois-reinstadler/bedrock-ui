import type { Component } from 'svelte';

type ExampleModule = { default: Component };

export type ComponentExample = {
	component: Component;
	source: string;
};

// Keep every component demo out of the shared docs bundle. Vite turns each
// loader into a cached, hashed chunk and the browser only fetches the example
// for the page being viewed.
const modules = import.meta.glob<ExampleModule>('./examples/*.svelte');
const sources = import.meta.glob<string>('./examples/*.svelte', {
	query: '?raw',
	import: 'default'
});

export async function getExample(slug: string): Promise<ComponentExample | undefined> {
	if (typeof window === 'undefined') return undefined;
	const key = `./examples/${slug}.svelte`;
	const [module, source] = await Promise.all([modules[key]?.(), sources[key]?.()]);
	if (!module || source === undefined) return undefined;
	return { component: module.default, source };
}
