<script lang="ts">
	import * as Table from '#lib/bedrock/ui/table';
	import { Button } from '#lib/bedrock/ui/button';
	let requested = $state(false);
</script>

<section class="max-w-xl space-y-4 rounded-xl border p-5">
	<h3 class="font-medium">Warehouse replenishment</h3>
	<p class="text-sm text-muted-foreground">
		Compare stock against the reorder level. The action belongs to the low-stock row, so its effect
		stays clear.
	</p>
	<Table.Root
		><Table.Caption>Current stock · North warehouse</Table.Caption><Table.Header
			><Table.Row
				><Table.Head>Item</Table.Head><Table.Head class="text-right">On hand</Table.Head><Table.Head
					class="text-right">Reorder at</Table.Head
				><Table.Head>Action</Table.Head></Table.Row
			></Table.Header
		><Table.Body
			><Table.Row
				><Table.Cell>Pallet straps</Table.Cell><Table.Cell class="text-right tabular-nums"
					>412</Table.Cell
				><Table.Cell class="text-right tabular-nums">100</Table.Cell><Table.Cell
					>Stock healthy</Table.Cell
				></Table.Row
			><Table.Row
				><Table.Cell>Shipping labels</Table.Cell><Table.Cell class="text-right tabular-nums"
					>88</Table.Cell
				><Table.Cell class="text-right tabular-nums">100</Table.Cell><Table.Cell
					><Button
						size="sm"
						variant="outline"
						disabled={requested}
						onclick={() => (requested = true)}>{requested ? 'Requested' : 'Restock labels'}</Button
					></Table.Cell
				></Table.Row
			></Table.Body
		></Table.Root
	>
	<p role="status" class="text-sm">
		{requested
			? 'A sample restock request for shipping labels has been added.'
			: '1 item below its reorder level.'}
	</p>
</section>
