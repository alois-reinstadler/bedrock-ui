<script lang="ts">
	import { MultiSelector } from '#lib/bedrock/ui/multi-selector';
	import type { SelectorItem } from '#lib/bedrock/ui/selector';

	const regions: SelectorItem[] = [
		{ value: 'eu-central', label: 'EU Central', description: 'Frankfurt' },
		{ value: 'eu-west', label: 'EU West', description: 'Dublin' },
		{ value: 'us-east', label: 'US East', description: 'Virginia' },
		{ value: 'ap-south', label: 'AP South', description: 'Mumbai' },
		{ value: 'sa-east', label: 'SA East', description: 'São Paulo', disabled: true }
	];

	let counted = $state(['eu-central', 'eu-west']);
	let badged = $state(['eu-central', 'us-east', 'ap-south', 'eu-west']);
</script>

<div class="flex flex-col items-start gap-4">
	<MultiSelector items={regions} bind:value={counted} selectAll clearable placeholder="Regions" />
	<MultiSelector
		items={regions}
		bind:value={badged}
		triggerDisplay="badges"
		maxBadges={2}
		searchable
		class="w-72"
		placeholder="Regions"
	/>
</div>
