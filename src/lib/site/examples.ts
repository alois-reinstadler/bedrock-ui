import type { Component } from 'svelte';
type ExampleModule = { default: Component };
export type ComponentExample = { component: Component };
const modules = import.meta.glob<ExampleModule>('./examples/*.svelte');
const previews = import.meta.glob<ExampleModule>('./previews/*.svelte');
async function load(loader?: () => Promise<ExampleModule>): Promise<ComponentExample | undefined> {
	if (typeof window === 'undefined' || !loader) return undefined;
	return { component: (await loader()).default };
}
export function getExample(slug: string) {
	return load(modules[`./examples/${slug}.svelte`]);
}
export function getPreview(slug: string) {
	return load(previews[`./previews/${slug}.svelte`]);
}
export async function getExampleSource(slug: string): Promise<{ code: string; html: string }> {
	const response = await fetch(`/docs/components/${encodeURIComponent(slug)}/source.json`);
	if (!response.ok) throw new Error('Example source could not be loaded');
	return response.json();
}
