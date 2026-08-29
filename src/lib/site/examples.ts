import type { Component } from 'svelte';

const modules = import.meta.glob<Component>('./examples/*.svelte', {
	eager: true,
	import: 'default'
});

export function getExample(slug: string) {
	return modules[`./examples/${slug}.svelte`];
}
