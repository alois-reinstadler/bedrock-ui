<script lang="ts">
	import * as ToggleGroup from '#lib/bedrock/ui/toggle-group';
	let value = $state('list');
</script>

<section class="space-y-4 rounded-xl border p-5">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<h3 class="font-medium">Launch tasks</h3>
		<ToggleGroup.Root
			type="single"
			{value}
			onValueChange={(next) => (value = next)}
			variant="outline"
			aria-label="Task layout"
			><ToggleGroup.Item value="list">List</ToggleGroup.Item><ToggleGroup.Item value="board"
				>Board</ToggleGroup.Item
			></ToggleGroup.Root
		>
	</div>
	<div class={value === 'board' ? 'grid gap-3 sm:grid-cols-3' : 'divide-y'}>
		{#each [{ name: 'Review content', state: 'Ready' }, { name: 'Test checkout', state: 'In progress' }, { name: 'Publish release', state: 'Planned' }] as task (task.name)}<div
				class={value === 'board' ? 'rounded-lg bg-muted p-4' : 'flex justify-between gap-4 py-3'}
			>
				<p class="text-sm font-medium">{task.name}</p>
				<p class="text-xs text-muted-foreground">{task.state}</p>
			</div>{/each}
	</div>
</section>
