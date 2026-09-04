<script lang="ts">
	import * as AlertDialog from '#lib/bedrock/ui/alert-dialog';
	import { Button } from '#lib/bedrock/ui/button';

	let confirmed = $state(false);
</script>

<div class="flex items-center gap-3">
	<AlertDialog.Root>
		<AlertDialog.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="destructive">Delete project</Button>
			{/snippet}
		</AlertDialog.Trigger>
		<AlertDialog.Content>
			<AlertDialog.Header>
				<AlertDialog.Title>Delete this project?</AlertDialog.Title>
				<AlertDialog.Description>
					This permanently removes the project and all of its data.
				</AlertDialog.Description>
			</AlertDialog.Header>
			<AlertDialog.Footer>
				<AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
				<AlertDialog.Action onclick={() => (confirmed = true)}>Delete</AlertDialog.Action>
			</AlertDialog.Footer>
		</AlertDialog.Content>
	</AlertDialog.Root>
	{#if confirmed}<p class="text-sm text-muted-foreground">Deleted (demo only).</p>{/if}
</div>
