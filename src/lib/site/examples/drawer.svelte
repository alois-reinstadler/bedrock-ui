<script lang="ts">
	import * as Drawer from '#lib/bedrock/ui/drawer';
	import { Button } from '#lib/bedrock/ui/button';
</script>

<Drawer.Root>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">Open drawer</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Filters</Drawer.Title>
			<Drawer.Description>Adjust what the list shows.</Drawer.Description>
		</Drawer.Header>
		<Drawer.Footer>
			<Drawer.Close>
				{#snippet child({ props })}
					<Button {...props}>Done</Button>
				{/snippet}
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
