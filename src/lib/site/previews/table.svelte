<script lang="ts">
	import * as Table from '#lib/bedrock/ui/table';
</script>

<Table.Root class="max-w-md">
	<Table.Caption>Warehouse stock</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>Item</Table.Head>
			<Table.Head class="text-right">On hand</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		<Table.Row>
			<Table.Cell>Pallet straps</Table.Cell>
			<Table.Cell class="text-right tabular-nums">412</Table.Cell>
		</Table.Row>
		<Table.Row>
			<Table.Cell>Labels, roll</Table.Cell>
			<Table.Cell class="text-right tabular-nums">88</Table.Cell>
		</Table.Row>
	</Table.Body>
</Table.Root>
