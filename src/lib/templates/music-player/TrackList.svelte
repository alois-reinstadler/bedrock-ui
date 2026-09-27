<script lang="ts">
	import { formatTime, type Track } from './data.js';
	import { usePlayer } from './player.svelte.js';
	import { albumMotion } from './motion.js';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Heart from '@lucide/svelte/icons/heart';
	import Plus from '@lucide/svelte/icons/plus';
	let {
		items,
		listKey = 'tracks',
		empty = 'No tracks here yet.'
	}: { items: Track[]; listKey?: string; empty?: string } = $props();
	const player = usePlayer();
</script>

<div class="tracks" data-track-list>
	<div class="table-heading">
		<span>#</span><span>Title</span><span>Genre</span><span>Time</span>
	</div>
	<div class="track-layers">
		{#key listKey}<div class="track-layer" data-track-layer={listKey}>
				{#each items as track, index (track.id)}<div
						data-song-row
						class="track"
						class:current={player.current.id === track.id}
						in:albumMotion|global={{ delay: 60 + index * 40 }}
						out:albumMotion|global={{ delay: index * 20, duration: 160 }}
					>
						<button
							class="track-play"
							aria-label={player.current.id === track.id && player.playing
								? `Pause ${track.title}`
								: `Play ${track.title}`}
							onclick={() =>
								player.current.id === track.id && player.playing
									? player.toggle()
									: player.play(track, items)}
							><span>{String(index + 1).padStart(2, '0')}</span
							>{#if player.current.id === track.id && player.playing}<Pause size={15} />{:else}<Play
									size={15}
								/>{/if}</button
						><button class="track-title" onclick={() => player.play(track, items)}
							><img src={track.artwork} alt="" /><span
								><strong>{track.title}</strong><small>{track.artist}</small></span
							></button
						><span class="genre">{track.genre}</span><button
							class="icon-button"
							class:selected={player.liked.includes(track.id)}
							aria-pressed={player.liked.includes(track.id)}
							aria-label={`${player.liked.includes(track.id) ? 'Unlike' : 'Like'} ${track.title}`}
							onclick={() => player.like(track.id)}><Heart size={16} /></button
						><time>{formatTime(track.duration)}</time><button
							class="icon-button"
							aria-label={`Add ${track.title} to queue`}
							onclick={() => player.enqueue(track.id)}><Plus size={16} /></button
						>
					</div>{:else}<p class="empty">{empty}</p>{/each}
			</div>{/key}
	</div>
</div>

<style>
	.table-heading {
		display: grid;
		grid-template-columns: 37px minmax(0, 1fr) 130px 70px 54px 35px;
		padding: 0 10px 14px;
		border-bottom: 1px solid var(--border);
		font-size: 9px;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--music-muted);
	}
	.table-heading span:last-child {
		grid-column: 5;
	}
	.track-layers {
		display: grid;
		position: relative;
	}
	.track-layer {
		grid-area: 1/1;
	}
	.track-layers :global(.track-layer:has(+ .track-layer)) {
		pointer-events: none;
	}
	.track {
		display: grid;
		grid-template-columns: 37px minmax(0, 1fr) 130px 70px 54px 35px;
		align-items: center;
		padding: 12px 10px;
		border-bottom: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
		border-radius: 5px;
		min-height: 72px;
	}
	.track:hover {
		background: var(--muted);
	}
	.track-play {
		width: 25px;
		height: 32px;
		display: grid;
		place-items: center;
		font-size: 10px;
		color: var(--music-muted);
	}
	.track-play :global(svg) {
		display: none;
	}
	.track:hover .track-play span,
	.track.current .track-play span {
		display: none;
	}
	.track:hover .track-play :global(svg),
	.track.current .track-play :global(svg) {
		display: block;
	}
	.track.current .track-title strong,
	.track.current .track-play {
		color: #c46b78;
	}
	.track-title {
		display: flex;
		align-items: center;
		gap: 13px;
		min-width: 0;
		text-align: left;
	}
	.track-title img {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		object-fit: cover;
		border-radius: 5px;
	}
	.track-title span {
		display: grid;
		gap: 4px;
		min-width: 0;
	}
	.track-title strong {
		font-size: 12px;
		font-weight: 600;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.track-title small,
	.genre {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.track-title small,
	.genre,
	time {
		font-size: 10px;
		color: var(--music-muted);
	}
	time {
		font-variant-numeric: tabular-nums;
	}
	.empty {
		padding: 45px 10px;
		color: var(--music-muted);
		font-size: 13px;
	}
	@media (max-width: 1050px) {
		.track,
		.table-heading {
			grid-template-columns: 30px minmax(0, 1fr) 75px 38px 42px 32px;
		}
	}
	@media (max-width: 680px) {
		.track,
		.table-heading {
			grid-template-columns: 23px minmax(0, 1fr) 32px 35px 30px;
			padding-inline: 0;
		}
		.genre,
		.table-heading span:nth-child(3) {
			display: none;
		}
		.table-heading span:last-child {
			grid-column: 4;
		}
		.track-title {
			gap: 9px;
		}
		.track-title img {
			width: 34px;
			height: 34px;
		}
		.track-title strong {
			font-size: 11px;
		}
		.track-title small {
			font-size: 9px;
		}
	}
</style>
