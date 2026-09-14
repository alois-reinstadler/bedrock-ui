<script lang="ts">
	import { Link } from '#lib/bedrock/ui/link';
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Project handoff note</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Use descriptive destinations in prose; reserve quieter styling for secondary navigation.
		</p>
	</header>
	<div class="space-y-4 text-sm leading-relaxed">
		<p>
			Start with the <Link href="/docs/installation">installation guide</Link>, then adapt the <Link
				href="/docs/theming">theme tokens</Link
			> to your product.
		</p>
		<p>
			For framework behavior, consult the <Link href="https://svelte.dev/docs" external
				>official Svelte documentation</Link
			>.
		</p>
		<div class="border-t pt-3">
			<Link href="/docs/components" color="muted" underline={false}
				>Browse the complete component reference</Link
			>
		</div>
	</div>
</section>
