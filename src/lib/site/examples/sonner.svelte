<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { toast } from 'svelte-sonner';
	let archived = $state(false);
</script>

<section class="max-w-md space-y-4 rounded-xl border p-5">
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
</section>
