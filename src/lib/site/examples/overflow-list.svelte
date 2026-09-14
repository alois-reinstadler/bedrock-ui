<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { OverflowList } from '#lib/bedrock/ui/overflow-list';

	const tags = [
		'Logistics',
		'Priority',
		'Q3 review',
		'Vendor',
		'Draft',
		'Approved',
		'Archived',
		'Finance'
	];

	import { Button } from '#lib/bedrock/ui/button';
	let width = $state(320);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Issue labels in a narrow sidebar</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep the issue title readable while secondary labels collapse. Resize the panel or use the
			width controls.
		</p>
	</header>
	<div class="flex gap-2">
		<Button variant="outline" size="sm" onclick={() => (width = 240)}>Narrow panel</Button><Button
			variant="outline"
			size="sm"
			onclick={() => (width = 480)}>Wide panel</Button
		>
	</div>

	<div
		class="resize-x overflow-hidden rounded-lg border border-dashed p-3"
		style:max-width="100%"
		style:width={`${width}px`}
	>
		<h4 class="mb-3 font-medium">Improve shipment tracking</h4>
		<OverflowList items={tags}>
			{#snippet item(tag)}
				<Badge variant="secondary">{tag}</Badge>
			{/snippet}
		</OverflowList>
		<p class="mt-2 text-xs text-muted-foreground">
			Drag the container edge — hidden tags collapse behind a count.
		</p>
	</div>
</section>
