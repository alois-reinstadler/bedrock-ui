<script lang="ts">
	import * as AlertDialog from '#lib/bedrock/ui/alert-dialog';
	import { Button } from '#lib/bedrock/ui/button';
	let removed = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Remove a workspace member</h3>
		<p class="text-sm text-muted-foreground">
			Name the affected person and consequences, and keep the safe cancellation action explicit.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<p class="font-medium">Workspace access</p>
		<div class="flex flex-wrap items-center justify-between gap-3">
			<div>
				<p>Kai Holt</p>
				<p class="text-sm text-muted-foreground">
					{removed ? 'Access removed in this demo' : 'Editor · 3 active projects'}
				</p>
			</div>
			<AlertDialog.Root
				><AlertDialog.Trigger
					>{#snippet child({ props })}<Button {...props} variant="destructive" disabled={removed}
							>Remove access</Button
						>{/snippet}</AlertDialog.Trigger
				><AlertDialog.Content
					><AlertDialog.Header
						><AlertDialog.Title>Remove Kai Holt?</AlertDialog.Title><AlertDialog.Description
							>Kai will lose access to all three workspace projects. Their previous comments and
							files will remain.</AlertDialog.Description
						></AlertDialog.Header
					><AlertDialog.Footer
						><AlertDialog.Cancel>Keep access</AlertDialog.Cancel><AlertDialog.Action
							onclick={() => (removed = true)}>Remove access</AlertDialog.Action
						></AlertDialog.Footer
					></AlertDialog.Content
				></AlertDialog.Root
			>
		</div>
		<p role="status" class="text-sm text-muted-foreground">
			{removed ? 'Kai no longer has workspace access in this local example.' : ''}
		</p>
		{#if removed}<Button variant="outline" size="sm" onclick={() => (removed = false)}
				>Reset example</Button
			>{/if}
	</div>
</section>
