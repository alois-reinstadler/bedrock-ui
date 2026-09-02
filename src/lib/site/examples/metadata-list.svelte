<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { MetadataList, MetadataListItem } from '#lib/bedrock/ui/metadata-list';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';

	const created = new Date('2026-03-12T09:30:00');
	const updated = new Date(Date.now() - 2 * 60 * 60 * 1000);
</script>

<MetadataList maxItems={4} labelWidth="7rem" class="max-w-md">
	<MetadataListItem label="Status" icon="info">
		<Badge variant="secondary">Active</Badge>
	</MetadataListItem>
	<MetadataListItem label="Owner">Jane Doe</MetadataListItem>
	<MetadataListItem label="Created" icon="calendar">
		<Timestamp date={created} mode="absolute" />
	</MetadataListItem>
	<MetadataListItem label="Updated" icon="clock">
		<Timestamp date={updated} mode="relative" />
	</MetadataListItem>
	<MetadataListItem label="Reference">DOC-2026-0142</MetadataListItem>
	<MetadataListItem label="Fax" />
</MetadataList>
