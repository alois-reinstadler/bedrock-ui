<script lang="ts">
	import Link from './link.svelte';
</script>

<Link href="https://example.com" external rel="author">External resource</Link>
<Link href="/disabled" disabled>Disabled resource</Link>
<Link href="/hover" underline={false}>Hover underline</Link>
