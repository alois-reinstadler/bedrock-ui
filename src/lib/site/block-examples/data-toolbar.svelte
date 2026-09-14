<script lang="ts">
	import { DataToolbar } from '#lib/bedrock/blocks/data-toolbar/index.js';
	import { Button } from '#lib/bedrock/ui/button';
	let query = $state('');
	let filters = $state<string[]>([]);
	let projects = $state([
		{ name: 'Design system', active: true },
		{ name: 'Customer research', active: false },
		{ name: 'Product launch', active: true }
	]);
	let visible = $derived(
		projects.filter(
			(project) =>
				project.name.toLowerCase().includes(query.toLowerCase()) &&
				(!filters.includes('active') || project.active)
		)
	);
</script>

<DataToolbar
	bind:query
	resultCount={visible.length}
	filters={[{ id: 'active', label: 'Active only' }]}
	bind:activeFilters={filters}
>
	{#snippet actions()}<Button
			onclick={() =>
				(projects = [...projects, { name: `New project ${projects.length + 1}`, active: true }])}
			>New project</Button
		>{/snippet}
</DataToolbar>
<ul class="space-y-2">
	{#each visible as project (project.name)}<li class="rounded-lg border bg-card p-3 text-sm">
			{project.name}
		</li>{/each}
</ul>
