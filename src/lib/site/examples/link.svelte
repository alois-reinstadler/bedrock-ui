<script lang="ts">
	import { Link } from '#lib/bedrock/ui/link';
</script>

<div class="flex flex-wrap items-center gap-4">
	<Link href="/docs">Internal link</Link>
	<Link href="https://svelte.dev" external>Svelte documentation</Link>
	<Link href="/docs/components" color="muted" underline={false}>Muted link</Link>
	<Link href="/docs/installation" disabled>Unavailable link</Link>
</div>
