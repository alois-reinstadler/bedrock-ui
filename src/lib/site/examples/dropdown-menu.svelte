<script lang="ts">
	import * as DropdownMenu from '#lib/bedrock/ui/dropdown-menu';
	import { Button } from '#lib/bedrock/ui/button';
	let pinned = $state(false);
	let status = $state('');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Actions on a project row</h3>
		<p class="text-sm text-muted-foreground">
			Keep secondary actions in a menu with explicit names and visible feedback.
		</p>
	</header>
	<div class="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5">
		<div>
			<p class="font-medium">Field journal {pinned ? '· Pinned' : ''}</p>
			<p class="text-sm text-muted-foreground">8 documents · Updated today</p>
		</div>
		<DropdownMenu.Root
			><DropdownMenu.Trigger
				>{#snippet child({ props })}<Button {...props} variant="outline">Project actions</Button
					>{/snippet}</DropdownMenu.Trigger
			><DropdownMenu.Content align="end"
				><DropdownMenu.Label>Field journal</DropdownMenu.Label><DropdownMenu.Separator
				/><DropdownMenu.Item
					onSelect={() => {
						pinned = !pinned;
						status = pinned ? 'Project pinned to your library.' : 'Project unpinned.';
					}}>{pinned ? 'Unpin project' : 'Pin project'}</DropdownMenu.Item
				><DropdownMenu.Item
					onSelect={() => (status = 'A local copy named Field journal (copy) was created.')}
					>Duplicate project</DropdownMenu.Item
				><DropdownMenu.Item
					onSelect={() => (status = 'Project summary prepared in this local demo.')}
					>Prepare summary</DropdownMenu.Item
				></DropdownMenu.Content
			></DropdownMenu.Root
		>
	</div>
	<p role="status" class="text-sm">{status}</p>
</section>
