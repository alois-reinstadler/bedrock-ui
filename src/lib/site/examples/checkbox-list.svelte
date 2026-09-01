<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { CheckboxList, CheckboxListItem } from '#lib/bedrock/ui/checkbox-list';

	let value = $state(['core-photos']);
</script>

<CheckboxList bind:value label="Include in the handover" dividers class="max-w-md">
	<CheckboxListItem
		value="core-photos"
		label="Core photos"
		description="Include the latest marked sample images."
	>
		{#snippet endContent()}<Badge variant="secondary">12 files</Badge>{/snippet}
	</CheckboxListItem>
	<CheckboxListItem
		value="shift-notes"
		label="Shift notes"
		description="Attach the signed notes from the current shift."
	/>
	<CheckboxListItem value="survey" label="Survey export" disabled />
</CheckboxList>
