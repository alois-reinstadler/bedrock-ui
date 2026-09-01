<script lang="ts">
	import Timestamp from './timestamp.svelte';

	let { locale }: { locale?: string } = $props();
	const fixedDate = new Date('2026-09-01T12:00:00.000Z');
</script>

<Timestamp date={fixedDate} mode="absolute" {locale} />
<Timestamp date="not-a-date" mode="absolute" {locale} />
