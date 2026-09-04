<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Item from '#lib/bedrock/ui/item';
	import { Icon } from '#lib/bedrock/ui/icon';
</script>

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
		<Item.Actions><Button variant="ghost" size="sm">Open</Button></Item.Actions>
	</Item.Root>
</Item.Group>
