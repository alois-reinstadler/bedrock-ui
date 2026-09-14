<script lang="ts">
	import * as Popover from '#lib/bedrock/ui/popover';
	import { Button } from '#lib/bedrock/ui/button';

	import { NumberInput } from '#lib/bedrock/ui/number-input';
	let rows = $state<number | null>(3);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Report display settings</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Put optional display controls near the report they affect; the underlying content stays
			visible.
		</p>
	</header>

	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline">Display options</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-64 space-y-3 text-sm">
			<p class="font-medium">Display options</p>
			<p class="mt-1 text-muted-foreground">
				Choose how many recent entries appear in this report.
			</p>
			<NumberInput
				bind:value={rows}
				steppers
				min={1}
				max={5}
				aria-label="Visible report entries"
			/></Popover.Content
		>
	</Popover.Root>
	<ul class="divide-y text-sm">
		{#each ['Design review completed', 'Pilot team invited', 'Navigation labels approved', 'Billing copy reviewed', 'Release notes drafted'].slice(0, rows ?? 1) as entry (entry)}<li
				class="py-3"
			>
				{entry}
			</li>{/each}
	</ul>
</section>
