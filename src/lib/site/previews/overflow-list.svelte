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
</script>

<div
	class="resize-x overflow-hidden rounded-lg border border-dashed p-3"
	style="max-width: 100%; width: 20rem;"
>
	<OverflowList items={tags}>
		{#snippet item(tag)}
			<Badge variant="secondary">{tag}</Badge>
		{/snippet}
	</OverflowList>
	<p class="mt-2 text-xs text-muted-foreground">
		Drag the container edge — hidden tags collapse behind a count.
	</p>
</div>
