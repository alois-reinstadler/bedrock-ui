<script lang="ts">
	import { Token } from '#lib/bedrock/ui/token';

	let filters = $state(['Ready', 'Needs review']);
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Filter the sample inventory</h3>
		<p class="text-sm text-muted-foreground">
			Remove a filter without clearing the entire search. Keep active criteria visible above the
			results.
		</p>
	</div>

	<div class="max-w-md space-y-4 rounded-xl border p-5">
		<div class="flex flex-wrap gap-2">
			{#each filters as filter (filter)}<Token
					label={filter}
					onRemove={() => (filters = filters.filter((item) => item !== filter))}
				/>{/each}
		</div>
		<p role="status" class="text-sm">
			{filters.length ? `Filtering by: ${filters.join(', ')}` : 'Showing all samples'}
		</p>
		<ul class="divide-y text-sm">
			{#each [{ name: 'Sample 07', status: 'Ready' }, { name: 'Sample 08', status: 'Needs review' }, { name: 'Sample 09', status: 'Archived' }].filter((sample) => !filters.length || filters.includes(sample.status)) as sample (sample.name)}<li
					class="flex justify-between gap-4 py-3"
				>
					<span>{sample.name}</span><span class="text-muted-foreground">{sample.status}</span>
				</li>{/each}
		</ul>
	</div>
</section>
