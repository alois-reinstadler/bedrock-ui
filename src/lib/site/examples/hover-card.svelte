<script lang="ts">
	import * as HoverCard from '#lib/bedrock/ui/hover-card';
	import { Link } from '#lib/bedrock/ui/link';
</script>

<p class="text-sm">
	Maintained by
	<HoverCard.Root>
		<HoverCard.Trigger>
			{#snippet child({ props })}
				<Link {...props} href="/docs">the Bedrock team</Link>
			{/snippet}
		</HoverCard.Trigger>
		<HoverCard.Content class="w-64 text-sm">
			<p class="font-medium">Bedrock</p>
			<p class="mt-1 text-muted-foreground">
				In-tree Svelte 5 design system: 76 families, one motion vocabulary.
			</p>
		</HoverCard.Content>
	</HoverCard.Root>
</p>
