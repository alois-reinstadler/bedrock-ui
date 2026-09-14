<script lang="ts">
	import { MultiSelector } from '#lib/bedrock/ui/multi-selector';
	import type { SelectorOption } from '#lib/bedrock/ui/selector';

	const regions: SelectorOption[] = [
		{ value: 'eu-central', label: 'EU Central', description: 'Frankfurt' },
		{ value: 'eu-west', label: 'EU West', description: 'Dublin' },
		{ value: 'us-east', label: 'US East', description: 'Virginia' },
		{ value: 'ap-south', label: 'AP South', description: 'Mumbai' },
		{ value: 'sa-east', label: 'SA East', description: 'São Paulo', disabled: true }
	];

	let counted = $state(['eu-central', 'eu-west']);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Regional rollout audience</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Selecting multiple regions changes the rollout summary. Unavailable regions remain visible
			with a disabled state.
		</p>
	</header>

	<div class="flex flex-col items-start gap-4">
		<MultiSelector items={regions} bind:value={counted} selectAll clearable placeholder="Regions" />
		<p role="status" class="text-sm text-muted-foreground">
			{counted.length
				? `The pilot will be offered in ${counted.length} regions.`
				: 'Choose at least one region before scheduling the pilot.'}
		</p>
		<ul class="text-sm">
			{#each regions.filter((region) => counted.includes(region.value)) as region (region.value)}<li
				>
					{region.label} · {region.description}
				</li>{/each}
		</ul>
	</div>
</section>
