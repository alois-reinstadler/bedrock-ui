<script lang="ts">
	import { AuthenticationPanel } from '#lib/bedrock/blocks/authentication-panel/index.js';
	import { DataToolbar } from '#lib/bedrock/blocks/data-toolbar/index.js';
	import { SettingsSection } from '#lib/bedrock/blocks/settings-section/index.js';
	import { Switch } from '#lib/bedrock/ui/switch';
	import { Button } from '#lib/bedrock/ui/button';
	let { kind }: { kind: 'authentication-panel' | 'data-toolbar' | 'settings-section' } = $props();
	let query = $state('');
	let filters = $state<string[]>([]);
	let updates = $state(true);
	let savedUpdates = $state(true);
	let fail = $state(false);
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
	async function authenticate() {
		await new Promise((resolve) => setTimeout(resolve, 450));
		if (fail) throw new Error('Demo failure');
	}
	async function save() {
		await new Promise((resolve) => setTimeout(resolve, 450));
		if (fail) throw new Error('Demo failure');
		savedUpdates = updates;
	}
</script>

<div class="space-y-4 rounded-2xl border bg-muted/20 p-4 sm:p-6">
	{#if kind === 'authentication-panel'}
		<p class="text-sm text-muted-foreground">
			Demo only. Use fictional credentials; nothing is sent or stored.
		</p>
		<AuthenticationPanel onSubmit={authenticate} />
	{:else if kind === 'data-toolbar'}
		<DataToolbar
			bind:query
			resultCount={visible.length}
			filters={[{ id: 'active', label: 'Active only' }]}
			bind:activeFilters={filters}
		>
			{#snippet actions()}<Button
					onclick={() =>
						(projects = [
							...projects,
							{ name: `New project ${projects.length + 1}`, active: true }
						])}>New project</Button
				>{/snippet}
		</DataToolbar>
		<ul class="space-y-2">
			{#each visible as project (project.name)}<li class="rounded-lg border bg-card p-3 text-sm">
					{project.name}
				</li>{/each}
		</ul>
	{:else}
		<SettingsSection
			title="Notifications"
			description="Changes take effect after saving."
			dirty={updates !== savedUpdates}
			onSave={save}
		>
			<div class="flex items-center justify-between gap-4">
				<span class="text-sm font-medium">Product updates</span><Switch
					bind:checked={updates}
					aria-label="Product updates"
				/>
			</div>
		</SettingsSection>
	{/if}
	{#if kind !== 'data-toolbar'}<div class="flex items-center justify-between gap-4 text-sm">
			<span>Simulate a server error</span><Switch
				bind:checked={fail}
				aria-label="Simulate a server error"
			/>
		</div>{/if}
</div>
