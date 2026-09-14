<script lang="ts">
	import * as ToggleGroup from '#lib/bedrock/ui/toggle-group';

	let value = $state('list');
</script>

<ToggleGroup.Root type="single" {value} onValueChange={(next) => (value = next)} variant="outline">
	<ToggleGroup.Item value="list" aria-label="List view">List</ToggleGroup.Item>
	<ToggleGroup.Item value="board" aria-label="Board view">Board</ToggleGroup.Item>
	<ToggleGroup.Item value="timeline" aria-label="Timeline view">Timeline</ToggleGroup.Item>
</ToggleGroup.Root>
