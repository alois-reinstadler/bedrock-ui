<script lang="ts">
	import { Combobox } from '#lib/bedrock/ui/combobox';
	import { Button } from '#lib/bedrock/ui/button';
	const items = [
		{ value: 'mara', label: 'Mara Vale · Design' },
		{ value: 'kai', label: 'Kai Holt · Engineering' },
		{ value: 'ari', label: 'Ari Lane · Content' },
		{ value: 'noor', label: 'Noor Reed · Research' }
	];
	let value = $state('');
	let assigned = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Assign a review owner</h3>
		<p class="text-sm text-muted-foreground">
			Search a growing team list, then confirm the assignment in a separate action.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<p class="font-medium">Review: onboarding prototype</p>
		<p class="text-sm text-muted-foreground">Choose one teammate who will coordinate feedback.</p>
		<Combobox {items} bind:value placeholder="Find a reviewer…" /><Button
			disabled={!value}
			onclick={() => (assigned = items.find((item) => item.value === value)?.label ?? '')}
			>Assign review</Button
		>
		<p role="status" class="text-sm">
			{assigned ? `Review assigned to ${assigned}.` : 'No reviewer assigned yet.'}
		</p>
	</div>
</section>
