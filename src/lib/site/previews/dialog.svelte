<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as Dialog from '#lib/bedrock/ui/dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<Button {...props}>Open dialog</Button>
		{/snippet}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Seal the core</Dialog.Title>
			<Dialog.Description>
				This writes sample 08 to the night log. You cannot undo the entry.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Cancel</Button>
				{/snippet}
			</Dialog.Close>
			<Button>Confirm</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
