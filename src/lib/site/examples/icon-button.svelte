<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import StarIcon from '@lucide/svelte/icons/star';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	let starred = $state(false);
	let archived = $state(false);
</script>

<Card.Root class="block w-full max-w-2xl gap-0 space-y-5 p-5">
	<header>
		<h3 class="text-lg font-semibold">Document row actions</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep compact actions individually named and expose toggle state to assistive technology.
		</p>
	</header>
	<div class="flex items-center gap-3 rounded-lg border p-3 corner-theme">
		<div class="min-w-0 flex-1">
			<p class="truncate font-medium">Launch checklist</p>
			<p class="text-sm text-muted-foreground">
				{archived ? 'Archived' : 'Project document'} · {starred
					? 'Saved to favorites'
					: 'Updated today'}
			</p>
		</div>
		<IconButton
			icon={StarIcon}
			label={starred
				? 'Remove launch checklist from favorites'
				: 'Save launch checklist to favorites'}
			aria-pressed={starred}
			variant={starred ? 'secondary' : 'ghost'}
			onclick={() => (starred = !starred)}
		/><IconButton
			icon={ArchiveIcon}
			label={archived ? 'Restore launch checklist' : 'Archive launch checklist'}
			onclick={() => (archived = !archived)}
		/>
	</div>
	<p role="status" class="text-sm">
		{archived
			? 'Document archived. Activate the archive action again to restore it.'
			: 'Document is in the project.'}
	</p>
</Card.Root>
