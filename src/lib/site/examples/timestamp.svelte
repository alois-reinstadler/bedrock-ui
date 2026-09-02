<script lang="ts">
	import { Timestamp } from '#lib/bedrock/ui/timestamp';

	const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
	const lastMonth = new Date(Date.now() - 32 * 24 * 60 * 60 * 1000);
</script>

<div class="grid max-w-sm grid-cols-[max-content_1fr] items-baseline gap-x-6 gap-y-2 text-sm">
	<span class="text-muted-foreground">Absolute</span>
	<Timestamp date={lastMonth} mode="absolute" />
	<span class="text-muted-foreground">Relative</span>
	<Timestamp date={twoHoursAgo} mode="relative" />
	<span class="text-muted-foreground">de-AT override</span>
	<Timestamp date={lastMonth} mode="absolute" locale="de-AT" />
</div>
