<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import SiteHeader from '#lib/site/SiteHeader.svelte';
	let { children } = $props();
</script>

<SiteHeader />
<div class="flex items-center justify-between gap-4 border-b bg-muted/30 px-4 py-2 text-xs md:px-8">
	<Button href="/docs/templates" variant="ghost" size="sm">Back to templates</Button>
	<p class="text-muted-foreground">Interactive demo · fictional local data</p>
</div>
{@render children()}
