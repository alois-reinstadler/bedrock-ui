<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import FilmCard from './FilmCard.svelte';
	import type { Film } from './catalog.js';
	let {
		title,
		items,
		resume = false,
		href
	}: { title: string; items: Film[]; resume?: boolean; href?: string } = $props();
	let rail: HTMLDivElement;
</script>

<section class="film-section" aria-label={title}>
	<div class="rail-heading">
		<h2>{title}</h2>
		<div>
			{#if href}<a {href}>View all →</a>{/if}<Button
				variant="ghost"
				type="button"
				class={['control-templates-video-library-filmrail h-auto whitespace-normal']}
				aria-label={`Scroll ${title} left`}
				onclick={() =>
					rail.scrollBy({
						left: -rail.clientWidth * 0.75,
						behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
							? 'instant'
							: 'smooth'
					})}>‹</Button
			><Button
				variant="ghost"
				type="button"
				class={['control-templates-video-library-filmrail h-auto whitespace-normal']}
				aria-label={`Scroll ${title} right`}
				onclick={() =>
					rail.scrollBy({
						left: rail.clientWidth * 0.75,
						behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
							? 'instant'
							: 'smooth'
					})}>›</Button
			>
		</div>
	</div>
	<div
		class="film-rail"
		{@attach (element) => {
			rail = element;
		}}
	>
		{#each items as film (film.slug)}<FilmCard {film} {resume} />{/each}
	</div>
</section>
