<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	import { toast } from 'svelte-sonner';
	let archived = $state(false);
</script>

<Card.Root class="block max-w-md gap-0 space-y-4 p-5">
	<h3 class="font-medium">Project inbox</h3>
	<p class="text-sm text-muted-foreground">
		Archive a completed conversation without interrupting your place. Undo is available in the
		notification.
	</p>
	<p role="status" class="text-sm">
		{archived ? 'Conversation archived.' : 'Mara Chen · Launch checklist approved'}
	</p>
	<Button
		variant="outline"
		disabled={archived}
		onclick={() => {
			archived = true;
			toast('Conversation archived', {
				action: {
					label: 'Undo',
					onClick: () => {
						archived = false;
					}
				}
			});
		}}>Archive conversation</Button
	>
</Card.Root>
