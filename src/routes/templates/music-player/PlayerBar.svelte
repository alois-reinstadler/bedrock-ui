<script lang="ts">
	import { Slider } from '#lib/bedrock/ui/slider';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Button } from '#lib/bedrock/ui/button';
	import { page } from '$app/state';

	import { collections, formatTime } from '#lib/templates/music-player/data.js';

	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Next from '@lucide/svelte/icons/skip-forward';
	import Previous from '@lucide/svelte/icons/skip-back';
	import Heart from '@lucide/svelte/icons/heart';

	import Queue from '@lucide/svelte/icons/list-music';
	import Shuffle from '@lucide/svelte/icons/shuffle';
	import Repeat from '@lucide/svelte/icons/repeat-2';
	import Volume from '@lucide/svelte/icons/volume-2';
	import VolumeLow from '@lucide/svelte/icons/volume-1';
	import VolumeMuted from '@lucide/svelte/icons/volume-x';

	import Mic from '@lucide/svelte/icons/mic-2';
	import Visualizer from '@lucide/svelte/icons/orbit';

	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	const player = usePlayer();
	let { queueOpen = $bindable() }: { queueOpen: boolean } = $props();
	const VolumeIcon = $derived(
		player.volume === 0 ? VolumeMuted : player.volume < 0.5 ? VolumeLow : Volume
	);
	let seekPreview = $state<number | null>(null);
	const base = '/templates/music-player';
</script>

<footer class="player" data-music-player>
	<div class="playing">
		<a
			href={`${base}/album/${player.current.collection}`}
			aria-label={`Open ${collections.find((collection) => collection.id === player.current.collection)?.title ?? player.current.collection} collection`}
			><img src={player.current.artwork} alt="" /></a
		><span><strong>{player.current.title}</strong><small>{player.current.artist}</small></span
		><IconButton
			type="button"
			icon={Heart}
			label="Like current track"
			class={[
				'control-templates-music-player-layout',
				'icon-button',
				{ selected: player.liked.includes(player.current.id) }
			]}
			aria-pressed={player.liked.includes(player.current.id)}
			onclick={() => player.like(player.current.id)}
		/>
	</div>
	<div class="transport">
		<IconButton
			type="button"
			icon={Queue}
			label="Open queue"
			class={['control-templates-music-player-layout', 'mobile-queue icon-button']}
			onclick={() => (queueOpen = !queueOpen)}
		/>
		<div class="transport-buttons">
			<IconButton
				type="button"
				icon={Shuffle}
				label="Shuffle"
				class={[
					'control-templates-music-player-layout',
					'icon-button secondary-control',
					{ selected: player.shuffle }
				]}
				aria-pressed={player.shuffle}
				onclick={() => (player.shuffle = !player.shuffle)}
			/><IconButton
				type="button"
				icon={Previous}
				label="Previous track"
				class={['control-templates-music-player-layout', 'icon-button']}
				onclick={() => player.next(-1)}
			/><Button
				variant="ghost"
				type="button"
				class={['control-templates-music-player-layout h-auto whitespace-normal', 'play-button']}
				aria-label={player.playing ? 'Pause playback' : 'Play current track'}
				onclick={() => player.toggle()}
				>{#if player.playing}<Pause size={19} fill="currentColor" />{:else}<Play
						size={19}
						fill="currentColor"
					/>{/if}</Button
			><IconButton
				type="button"
				icon={Next}
				label="Next track"
				class={['control-templates-music-player-layout', 'icon-button']}
				onclick={() => player.next()}
			/><IconButton
				type="button"
				icon={Repeat}
				label="Repeat track"
				class={[
					'control-templates-music-player-layout',
					'icon-button secondary-control',
					{ selected: player.repeat }
				]}
				aria-pressed={player.repeat}
				onclick={() => (player.repeat = !player.repeat)}
			/>
		</div>
		<div class="timeline">
			<time>{formatTime(player.elapsed)}</time><Slider
				type="single"
				min={0}
				max={player.duration || player.current.duration}
				step={0.1}
				value={seekPreview ?? Math.round(player.elapsed * 10) / 10}
				onpointerdowncapture={() => (seekPreview = Math.round(player.elapsed * 10) / 10)}
				onpointercancel={() => (seekPreview = null)}
				onValueChange={(value) => {
					if (seekPreview !== null) seekPreview = value;
				}}
				onValueCommit={(value) => {
					// Slider also normalizes playback updates; only a user commit may seek audio.
					player.seek(value);
					seekPreview = null;
				}}
				aria-label="Seek"
			/><time>{formatTime(player.duration || player.current.duration)}</time>
		</div>
	</div>
	<div class="player-tools">
		<IconButton
			icon={Mic}
			label="Lyrics"
			tooltip="Lyrics"
			href={`${base}/lyrics`}
			aria-current={page.url.pathname === `${base}/lyrics` ? 'page' : undefined}
			class={['view-control', { selected: page.url.pathname === `${base}/lyrics` }]}
		/>
		<IconButton
			icon={Visualizer}
			label="Visualizer"
			tooltip="Visualizer"
			href={`${base}/visualizer`}
			aria-current={page.url.pathname === `${base}/visualizer` ? 'page' : undefined}
			class={['view-control', { selected: page.url.pathname === `${base}/visualizer` }]}
		/>
		<IconButton
			type="button"
			icon={Queue}
			label="Toggle queue"
			class={[
				'control-templates-music-player-layout',
				'icon-button desktop-queue',
				{ selected: queueOpen }
			]}
			aria-expanded={queueOpen}
			onclick={() => (queueOpen = !queueOpen)}
		/><VolumeIcon size={18} aria-hidden="true" /><Slider
			type="single"
			min={0}
			max={1}
			step={0.01}
			value={player.volume}
			onValueChange={(value) => player.setVolume(value)}
			aria-label="Volume"
			aria-valuetext={`${Math.round(player.volume * 100)}%`}
		/>
	</div>
</footer>

<style>
	.player :global(.view-control.selected) {
		color: #c46b78;
		background: var(--muted);
	}
	.player :global(.control-templates-music-player-layout.mobile-queue) {
		display: none !important;
	}

	.player {
		grid-column: 1/-1;
		border-top: 1px solid var(--border);
		display: grid;
		grid-template-columns: 1fr 1.25fr 1fr;
		align-items: center;
		gap: 30px;
		padding: 12px 25px;
		background: var(--background);
		z-index: 5;
	}
	.playing {
		display: flex;
		align-items: center;
		gap: 13px;
		min-width: 0;
	}
	.playing img {
		width: 50px;
		height: 50px;
		border-radius: 6px;
	}
	.playing > span {
		display: grid;
		gap: 4px;
		min-width: 0;
	}
	.playing strong {
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.playing small {
		font-size: 10px;
		color: var(--music-muted);
	}
	.transport-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 12px;
	}
	.timeline {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 8px;
	}
	.timeline time {
		font-size: 9px;
		font-variant-numeric: tabular-nums;
		color: var(--music-muted);
		width: 27px;
	}
	.timeline :global([data-slot='slider']) {
		width: 100%;
	}
	.player-tools {
		display: flex;
		justify-content: end;
		align-items: center;
		gap: 6px;
		color: var(--music-muted);
	}
	.player-tools :global([data-slot='slider']) {
		max-width: 85px;
		width: 100%;
	}
	.player :global(.control-templates-music-player-layout.play-button) {
		border-radius: 50%;
		background: var(--foreground);
		color: var(--background);
		width: 34px;
		height: 34px;
		display: grid;
		place-items: center;
	}

	@media (max-width: 1050px) {
		.player {
			grid-template-columns: 1fr 1.2fr auto;
			gap: 15px;
			padding-inline: 15px;
		}
		.player-tools > :global([data-slot='slider']),
		.player-tools > :global(svg) {
			display: none;
		}
	}
	@media (max-width: 680px) {
		.player {
			grid-row: 2;
			grid-template-columns: 1fr auto;
			gap: 10px;
			padding: 10px 15px;
		}
		.playing img {
			width: 40px;
			height: 40px;
		}
		.playing :global(.control-templates-music-player-layout.icon-button) {
			display: none;
		}
		.transport {
			width: 154px;
			position: relative;
			padding-right: 26px;
		}
		.player :global(.control-templates-music-player-layout.mobile-queue) {
			display: grid !important;
			position: absolute;
			right: -5px;
			top: 3px;
		}
		.transport-buttons {
			gap: 6px;
		}
		.player :global(.control-templates-music-player-layout.secondary-control),
		.player-tools :global(.desktop-queue) {
			display: none;
		}
		.player-tools {
			display: flex;
			grid-column: 1 / -1;
			justify-content: center;
			gap: 20px;
		}
		.timeline {
			margin-top: 6px;
		}
		.timeline time {
			display: none;
		}
	}
</style>
