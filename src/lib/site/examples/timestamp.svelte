<script lang="ts">
	import { Timestamp } from '#lib/bedrock/ui/timestamp';

	const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
	const lastMonth = new Date(Date.now() - 32 * 24 * 60 * 60 * 1000);
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Document activity history</h3>
		<p class="text-sm text-muted-foreground">
			Use relative timestamps for scanning recent activity and absolute dates when the exact event
			date matters.
		</p>
	</div>

	<ol class="max-w-md space-y-4 rounded-xl border p-5">
		<li>
			<p class="text-sm font-medium">Mara approved the final draft</p>
			<Timestamp date={twoHoursAgo} mode="relative" />
		</li>
		<li>
			<p class="text-sm font-medium">Ellis created the document</p>
			<Timestamp date={lastMonth} mode="absolute" locale="en-GB" />
		</li>
	</ol>
</section>
