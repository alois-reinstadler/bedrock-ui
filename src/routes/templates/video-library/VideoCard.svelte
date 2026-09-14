<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import type { VideoItem } from './catalog.js';
	import PosterArt from './PosterArt.svelte';

	let {
		item,
		saved = false,
		progress,
		onOpen,
		onToggleSaved
	}: {
		item: VideoItem;
		saved?: boolean;
		progress?: number;
		onOpen: () => void;
		onToggleSaved: () => void;
	} = $props();
</script>

<article class="video-card group w-full min-w-0 shrink-0 snap-start">
	<div class="relative overflow-hidden rounded-xl border border-white/10 bg-card shadow-sm">
		<button
			type="button"
			class="block w-full overflow-hidden text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/60"
			onclick={onOpen}
			aria-label={`View details for ${item.title}`}
		>
			<PosterArt tone={item.tone} mark={item.mark} />
		</button>
		<div
			class="absolute top-2 right-2 transition-[opacity,transform] duration-(--motion-state) group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:transition-none"
		>
			<IconButton
				icon={saved ? 'check' : 'add'}
				label={saved ? `Remove ${item.title} from watchlist` : `Add ${item.title} to watchlist`}
				class="border border-white/25 bg-black/65 text-white hover:bg-black/80"
				onclick={onToggleSaved}
			/>
		</div>
		{#if progress !== undefined}
			<div class="absolute inset-x-0 bottom-0 h-1 bg-black/40" aria-hidden="true">
				<div class="h-full bg-white" style={`width: ${progress}%`}></div>
			</div>
		{/if}
	</div>
	<div class="mt-3 flex items-start justify-between gap-3 px-0.5">
		<div class="min-w-0">
			<Button variant="link" class="h-auto max-w-full justify-start p-0 text-left" onclick={onOpen}>
				<span class="truncate">{item.title}</span>
			</Button>
			<p class="mt-1 truncate text-xs text-muted-foreground">
				{item.year} · {item.duration} · {item.genres[0]}
			</p>
		</div>
		<Badge variant="outline" class="mt-0.5 shrink-0">{item.rating}</Badge>
	</div>
</article>

<style>
	:global(.flex) > .video-card {
		width: 17rem;
	}
	@media (min-width: 640px) {
		:global(.flex) > .video-card {
			width: 19rem;
		}
	}
	@media (min-width: 1024px) {
		:global(.flex) > .video-card {
			width: 20rem;
		}
	}
</style>
