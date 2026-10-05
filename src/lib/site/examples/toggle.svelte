<script lang="ts">
	import { Toggle } from '#lib/bedrock/ui/toggle';
	import Bookmark from '@lucide/svelte/icons/bookmark';
	let saved = $state(false);
</script>

<article class="w-full max-w-md rounded-xl border bg-card p-6 corner-theme">
	<div class="mb-6 flex items-center justify-between gap-4">
		<span class="text-xs font-medium text-muted-foreground">FIELD NOTES / 004</span>
		<Toggle bind:pressed={saved} aria-label="Save article" variant="outline"
			><Bookmark class="size-4" fill={saved ? 'currentColor' : 'none'} />{saved
				? 'Saved'
				: 'Save'}</Toggle
		>
	</div>
	<h3 class="text-xl font-semibold tracking-tight">A little less, but better.</h3>
	<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
		Good interfaces leave room for the things that matter. Notes on clarity, craft, and making
		thoughtful choices.
	</p>
	<div class="mt-6 flex justify-between border-t pt-4 text-xs text-muted-foreground">
		<span>Alex Morgan</span><span>5 min read</span>
	</div>
	<p role="status" class="mt-4 text-xs">
		{saved ? 'Added to your reading list.' : 'Save this article to read it later.'}
	</p>
</article>
