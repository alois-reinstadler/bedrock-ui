<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { MetadataList, MetadataListItem } from '#lib/bedrock/ui/metadata-list';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';

	const created = new Date('2026-03-12T09:30:00');
	const updated = new Date(Date.now() - 2 * 60 * 60 * 1000);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Support case details</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep the most important facts visible and put secondary identifiers behind the built-in
			overflow disclosure.
		</p>
	</header>

	<p class="text-sm">
		The customer cannot accept a workspace invitation. Confirm the destination email before sending
		another link.
	</p>
	<MetadataList maxItems={4} labelWidth="7rem" class="max-w-md">
		<MetadataListItem label="Status" icon="info">
			<Badge variant="secondary">Awaiting customer</Badge>
		</MetadataListItem>
		<MetadataListItem label="Owner">Mira Chen</MetadataListItem>
		<MetadataListItem label="Created" icon="calendar">
			<Timestamp date={created} mode="absolute" />
		</MetadataListItem>
		<MetadataListItem label="Updated" icon="clock">
			<Timestamp date={updated} mode="relative" />
		</MetadataListItem>
		<MetadataListItem label="Reference">CASE-2026-0142</MetadataListItem>
		<MetadataListItem label="Escalation" />
	</MetadataList>
</section>
