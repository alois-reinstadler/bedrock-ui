<script lang="ts">
	import { List, ListItem } from '#lib/bedrock/ui/list';
</script>

<div class="grid gap-6 sm:grid-cols-2">
	<List>
		<ListItem>Accessible by default</ListItem>
		<ListItem>Designed for content</ListItem>
		<ListItem icon="success">Semantic icons can replace markers</ListItem>
	</List>
	<List variant="decimal" start={3}>
		<ListItem>Compose Bedrock primitives</ListItem>
		<ListItem>Localize application labels</ListItem>
	</List>
</div>
