<script lang="ts">
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	let open = $state(false);
	let name = $state('Field journal');
	let draft = $state('Field journal');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Rename a project</h3>
		<p class="text-sm text-muted-foreground">
			A dialog is useful for a short focused edit. Preserve the current name until the user saves.
		</p>
	</header>
	<div class="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5">
		<div>
			<p class="font-medium">{name}</p>
			<p class="text-sm text-muted-foreground">8 documents · Private workspace</p>
		</div>
		<Dialog.Root
			{open}
			onOpenChange={(next) => {
				open = next;
				if (next) {
					draft = name;
				}
			}}
			><Dialog.Trigger
				>{#snippet child({ props })}<Button {...props} variant="outline">Rename project</Button
					>{/snippet}</Dialog.Trigger
			><Dialog.Content
				><Dialog.Header
					><Dialog.Title>Rename project</Dialog.Title><Dialog.Description
						>The new name appears for everyone in this workspace.</Dialog.Description
					></Dialog.Header
				>
				<form
					class="space-y-4"
					onsubmit={(event) => {
						event.preventDefault();
						if (draft.trim()) {
							name = draft.trim();
							open = false;
						}
					}}
				>
					<label class="block space-y-2"
						><span class="text-sm font-medium">Project name</span><Input
							value={draft}
							oninput={(event) => (draft = event.currentTarget.value)}
							required
							maxlength={80}
						/></label
					><Dialog.Footer
						><Dialog.Close
							>{#snippet child({ props })}<Button {...props} type="button" variant="outline"
									>Cancel</Button
								>{/snippet}</Dialog.Close
						><Button type="submit" disabled={!draft.trim()}>Save name</Button></Dialog.Footer
					>
				</form></Dialog.Content
			></Dialog.Root
		>
	</div>
	<p role="status" class="text-sm text-muted-foreground">Current project: {name}</p>
</section>
