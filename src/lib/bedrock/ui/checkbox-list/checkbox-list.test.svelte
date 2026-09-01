<script lang="ts">
	import CheckboxListItem from './checkbox-list-item.svelte';
	import CheckboxList from './checkbox-list.svelte';

	let value = $state<string[]>([]);
</script>

<CheckboxList bind:value label="Sample contents" dividers>
	<CheckboxListItem value="photos" label="Photos" description="Marked face images" />
	<CheckboxListItem value="notes" label="Notes" />
	<CheckboxListItem value="survey" label="Survey" disabled />
</CheckboxList>

<output data-testid="value">{value.join(',')}</output>
