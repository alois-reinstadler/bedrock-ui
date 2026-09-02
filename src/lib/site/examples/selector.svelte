<script lang="ts">
	import { ComplexSelector, Selector, type SelectorItem } from '#lib/bedrock/ui/selector';
	import { Button } from '#lib/bedrock/ui/button';
	import { Slider } from '#lib/bedrock/ui/slider';

	const environments: SelectorItem[] = [
		{
			type: 'group',
			label: 'Long-lived',
			items: [
				{
					value: 'production',
					label: 'Production',
					description: 'Customer-facing cluster',
					icon: 'success'
				},
				{ value: 'staging', label: 'Staging', description: 'Pre-release checks', icon: 'info' }
			]
		},
		{ type: 'separator' },
		{ value: 'preview', label: 'Preview', description: 'Per-branch deploys' },
		{ value: 'legacy', label: 'Legacy', disabled: true }
	];

	let environment = $state('staging');
	let threshold = $state<number | undefined>(undefined);
	let draft = $state(80);
</script>

<div class="flex flex-col items-start gap-4">
	<Selector items={environments} bind:value={environment} searchable clearable />

	<ComplexSelector bind:value={threshold} placeholder="Alert threshold">
		{#snippet triggerLabel(current)}
			{current === undefined ? 'Alert threshold' : `Above ${current}%`}
		{/snippet}
		{#snippet content({ commit, close })}
			<div class="flex w-56 flex-col gap-3">
				<Slider type="single" bind:value={draft} max={100} step={5} />
				<Button
					size="sm"
					onclick={() => {
						commit(draft);
						close();
					}}
				>
					Apply {draft}%
				</Button>
			</div>
		{/snippet}
	</ComplexSelector>
</div>
