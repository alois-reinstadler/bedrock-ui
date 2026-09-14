<script lang="ts">
	import * as HoverCard from '#lib/bedrock/ui/hover-card';
	import { Link } from '#lib/bedrock/ui/link';
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Decision ownership</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep essential author information visible. The hover card adds optional context and also opens
			on keyboard focus.
		</p>
	</header>

	<p class="text-sm">
		Navigation redesign · Owned by
		<HoverCard.Root>
			<HoverCard.Trigger>
				{#snippet child({ props })}
					<Link {...props} href="/docs">Mira Chen</Link>
				{/snippet}
			</HoverCard.Trigger>
			<HoverCard.Content class="w-64 text-sm">
				<p class="font-medium">Mira Chen · Product designer</p>
				<p class="mt-1 text-muted-foreground">
					Owns navigation research and information architecture. Working hours: 09:00–17:00 UTC.
				</p>
			</HoverCard.Content>
		</HoverCard.Root>
	</p>
	<p class="text-sm text-muted-foreground">
		Next decision: agree on the mobile navigation labels by Thursday.
	</p>
</section>
