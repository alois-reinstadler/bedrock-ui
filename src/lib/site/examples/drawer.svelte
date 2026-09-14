<script lang="ts">
	import * as Drawer from '#lib/bedrock/ui/drawer';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Button } from '#lib/bedrock/ui/button';
	let open = $state(false);
	let mine = $state(false);
	let applied = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Filter a document library</h3>
		<p class="text-sm text-muted-foreground">
			A compact filter surface is useful on mobile. Applying filters updates the visible result
			summary.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<div class="flex items-center justify-between gap-3">
			<p class="font-medium">Documents</p>
			<Drawer.Root
				{open}
				onOpenChange={(next) => {
					open = next;
					if (next) {
						mine = applied;
					}
				}}
				><Drawer.Trigger
					>{#snippet child({ props })}<Button {...props} variant="outline">Filter documents</Button
						>{/snippet}</Drawer.Trigger
				><Drawer.Content
					><div class="mx-auto w-full max-w-md">
						<Drawer.Header
							><Drawer.Title>Document filters</Drawer.Title><Drawer.Description
								>Limit the library to work assigned to you.</Drawer.Description
							></Drawer.Header
						><label class="flex items-center gap-3 px-4 py-5"
							><Checkbox bind:checked={mine} />Assigned to me</label
						><Drawer.Footer
							><Button
								onclick={() => {
									applied = mine;
									open = false;
								}}>Apply filters</Button
							><Drawer.Close
								>{#snippet child({ props })}<Button {...props} variant="outline">Cancel</Button
									>{/snippet}</Drawer.Close
							></Drawer.Footer
						>
					</div></Drawer.Content
				></Drawer.Root
			>
		</div>
		<ul class="divide-y text-sm">
			<li class="py-3">Research plan · You</li>
			{#if !applied}<li class="py-3">Launch checklist · Kai Holt</li>
				<li class="py-3">Content outline · Ari Lane</li>{/if}
		</ul>
		<p role="status" class="text-sm text-muted-foreground">
			{applied ? '1 document assigned to you' : '3 documents in this workspace'}
		</p>
	</div>
</section>
