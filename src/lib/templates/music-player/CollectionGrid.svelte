<script lang="ts">
	import { collections, type Collection } from './data.js';
	let { items = collections }: { items?: Collection[] } = $props();
</script>

<div class="collection-grid">
	{#each items as collection (collection.id)}<a
			href={`/templates/music-player/album/${collection.id}`}
			class="collection-card"
			><div class="art">
				<img src={collection.artwork} alt={`${collection.title} collection cover`} /><span
					class="play-hint"
					aria-hidden="true">↗</span
				>
			</div>
			<strong>{collection.title}</strong><span>{collection.genre} · NCS</span></a
		>{/each}
</div>

<style>
	.collection-grid {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 22px;
	}
	.collection-card {
		min-width: 0;
		display: grid;
		gap: 7px;
	}
	.art {
		position: relative;
		margin-bottom: 5px;
		overflow: hidden;
		border-radius: 9px;
	}
	.art img {
		width: 100%;
		aspect-ratio: 1;
		object-fit: cover;
		transition: transform 350ms ease;
	}
	.collection-card:hover img {
		transform: scale(1.04);
	}
	.collection-card strong {
		font-size: 13px;
		font-weight: 600;
		line-height: 1.4;
		min-height: 2.8em;
	}
	.collection-card > span {
		font-size: 10px;
		line-height: 1.5;
		min-height: 3em;
		color: var(--music-muted);
	}
	.play-hint {
		position: absolute;
		right: 12px;
		bottom: 12px;
		width: 32px;
		height: 32px;
		display: grid;
		place-items: center;
		background: #fffe;
		color: #222;
		border-radius: 50%;
		opacity: 0;
		transition: opacity 180ms;
	}
	.collection-card:hover .play-hint,
	.collection-card:focus-visible .play-hint {
		opacity: 1;
	}
	@media (max-width: 950px) {
		.collection-grid {
			gap: 16px;
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.art img,
		.play-hint {
			transition: none;
		}
		.collection-card:hover img {
			transform: none;
		}
	}
</style>
