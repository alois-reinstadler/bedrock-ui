<script lang="ts">
	import MusicSidebar from './MusicSidebar.svelte';
	import MusicTopbar from './MusicTopbar.svelte';
	import PlayQueue from './PlayQueue.svelte';
	import PlayerBar from './PlayerBar.svelte';

	import { page } from '$app/state';

	import { onMount } from 'svelte';

	import { providePlayer } from '#lib/templates/music-player/player.svelte.js';

	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
	const player = providePlayer();
	let queueOpen = $state(false);
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
	const base = '/templates/music-player';
	const listeningScreen = $derived(
		page.url.pathname === `${base}/lyrics` || page.url.pathname === `${base}/visualizer`
	);
</script>

<div class="drift" data-music-shell data-ready={ready}>
	<audio
		{@attach player.connect}
		preload="metadata"
		onplay={() => player.handlePlay()}
		onpause={() => player.handlePause()}
		ontimeupdate={(e) => (player.elapsed = e.currentTarget.currentTime)}
		onloadedmetadata={(e) => (player.duration = e.currentTarget.duration)}
		onended={() => player.ended()}
		onerror={() => player.handleError()}
	></audio>
	<MusicSidebar />
	<div class="workspace">
		<MusicTopbar />
		<main id="music-main" class={[{ 'listening-screen': listeningScreen }]}>
			{@render children()}
		</main>
	</div>
	{#if queueOpen}<PlayQueue onClose={() => (queueOpen = false)} />{/if}
	<PlayerBar bind:queueOpen />
	<p class="status" role="status">{player.message}</p>
</div>

<style>
	main.listening-screen {
		padding: 0;
		overflow: hidden;
	}

	.drift {
		--music-muted: var(--muted-foreground);
		display: grid;
		grid-template-columns: 218px minmax(0, 1fr);
		grid-template-rows: minmax(0, 1fr) 92px;
		height: 100dvh;
		min-height: 500px;
		background: var(--background);
		color: var(--foreground);
		font-family: inherit;
	}

	.workspace {
		min-height: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	main {
		--music-gutter: 38px;
		--music-top-padding: 34px;
		overflow: auto;
		padding: var(--music-top-padding) var(--music-gutter) 64px;
		scroll-padding-top: 88px;
		flex: 1;
		min-height: 0;
	}

	.status {
		position: fixed;
		bottom: 100px;
		left: 50%;
		translate: -50% 0;
		font-size: 12px;
		background: var(--background);
		border-radius: 8px;
		padding: 8px 14px;
		z-index: 10;
	}
	.status:empty {
		display: none;
	}
	:global(.drift button),
	:global(.drift a),
	:global(.drift input),
	:global(.drift select) {
		-webkit-tap-highlight-color: transparent;
	}
	:global(.drift button) {
		cursor: pointer;
	}
	:global(.drift button:focus-visible),
	:global(.drift a:focus-visible),
	:global(.drift input:focus-visible),
	:global(.drift select:focus-visible) {
		outline: 2px solid #c46b78;
		outline-offset: 4px;
	}
	:global(.drift .icon-button) {
		display: inline-grid;
		place-items: center;
		flex: none;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		color: var(--music-muted);
	}
	:global(.drift .icon-button:hover) {
		background: var(--muted);
		color: var(--foreground);
	}
	:global(.drift .selected) {
		color: #c46b78 !important;
	}
	:global(.drift .eyebrow) {
		font-size: 10px;
		letter-spacing: 1.8px;
		font-weight: 650;
		color: var(--music-muted);
	}
	:global(.drift h1) {
		font-size: clamp(30px, 4vw, 55px);
		line-height: 1.07;
		letter-spacing: -2px;
		font-weight: 650;
	}
	:global(.drift h2) {
		font-size: 20px;
		font-weight: 620;
		letter-spacing: -0.6px;
	}
	:global(.drift .section-heading) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 21px;
	}
	:global(.drift .section-heading a) {
		font-size: 11px;
		color: var(--music-muted);
	}
	:global(.drift .primary-button) {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 9px;
		padding: 11px 21px;
		border-radius: 9999px;
		background: var(--foreground);
		color: var(--background);
		font-size: 12px;
		font-weight: 600;
	}
	:global(.drift .outline-button) {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		border: 1px solid var(--border);
		border-radius: 9999px;
		font-size: 12px;
	}
	:global(.drift .page-heading) {
		margin-bottom: 32px;
	}
	:global(.drift .page-heading h1) {
		margin: 8px 0 12px;
	}
	:global(.drift .page-heading p:last-child) {
		font-size: 13px;
		color: var(--music-muted);
	}
	@media (max-width: 1050px) {
		.drift {
			grid-template-columns: 185px minmax(0, 1fr);
		}

		main {
			--music-gutter: 24px;
			--music-top-padding: 26px;
			padding: var(--music-top-padding) var(--music-gutter) 50px;
		}
	}
	@media (max-width: 680px) {
		.drift {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 1fr 123px 58px;
			min-height: 400px;
		}

		main {
			--music-gutter: 18px;
			--music-top-padding: 24px;
			padding: var(--music-top-padding) var(--music-gutter) 40px;
		}

		.status {
			bottom: 190px;
		}
	}
</style>
