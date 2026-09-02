<script lang="ts">
	import MetadataListItem from './metadata-list-item.svelte';
	import MetadataList from './metadata-list.svelte';

	let {
		labelPosition = 'start',
		maxItems
	}: {
		labelPosition?: 'start' | 'top';
		maxItems?: number;
	} = $props();
</script>

<MetadataList {labelPosition} {maxItems}>
	<MetadataListItem label="Status" icon="info">Active</MetadataListItem>
	<MetadataListItem label="Owner">Jane Doe</MetadataListItem>
	<MetadataListItem label="Created">2026-03-12</MetadataListItem>
	<MetadataListItem label="Updated">2026-08-30</MetadataListItem>
	<MetadataListItem label="Reference" />
</MetadataList>
