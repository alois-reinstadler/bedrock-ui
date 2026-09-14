<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Item from '#lib/bedrock/ui/item';
	import { Icon } from '#lib/bedrock/ui/icon';

	let opened = $state(false);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Project handoff files</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep file metadata scannable while a row action reveals the next level of detail.
		</p>
	</header>

	<Item.Group class="max-w-md rounded-lg border">
		<Item.Root>
			<Item.Media><Icon icon="file" class="size-5 text-muted-foreground" /></Item.Media>
			<Item.Content>
				<Item.Title>Quarterly report</Item.Title>
				<Item.Description>Updated 2 days ago</Item.Description>
			</Item.Content>
			<Item.Actions><Badge variant="secondary">PDF</Badge></Item.Actions>
		</Item.Root>
		<Item.Separator />
		<Item.Root>
			<Item.Media><Icon icon="image" class="size-5 text-muted-foreground" /></Item.Media>
			<Item.Content>
				<Item.Title>Site photos</Item.Title>
				<Item.Description>14 files</Item.Description>
			</Item.Content>
			<Item.Actions
				><Button variant="ghost" size="sm" aria-expanded={opened} onclick={() => (opened = !opened)}
					>{opened ? 'Close' : 'Open'}</Button
				></Item.Actions
			>
		</Item.Root>
	</Item.Group>
	{#if opened}<div class="rounded-lg bg-muted p-4 text-sm">
			<h4 class="font-medium">Site photos · handoff notes</h4>
			<p class="mt-2">
				14 inspection images are ready for review. Check the entrance clearance and mark any missing
				signage before opening day.
			</p>
		</div>{/if}
</section>
