<script lang="ts">
	import { Slider } from '#lib/bedrock/ui/slider';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Button } from '#lib/bedrock/ui/button';

	import { tracks } from '#lib/templates/music-player/data.js';

	import Icon from '@lucide/svelte/icons/audio-lines';

	import X from '@lucide/svelte/icons/x';

	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	const player = usePlayer();
	let { onClose }: { onClose: () => void } = $props();
</script>

<aside class="queue-panel" aria-label="Play queue">
	<div class="section-heading">
		<h2>Up next</h2>
		<IconButton
			type="button"
			icon={X}
			label="Close queue"
			class={['control-templates-music-player-layout', 'icon-button']}
			onclick={onClose}
		/>
	</div>
	<div class="queue-volume">
		Volume<Slider
			type="single"
			min={0}
			max={1}
			step={0.01}
			value={player.volume}
			onValueChange={(value) => player.setVolume(value)}
			aria-label="Queue volume"
			aria-valuetext={`${Math.round(player.volume * 100)}%`}
		/>
	</div>
	<p class="eyebrow">PLAYING FROM YOUR QUEUE</p>
	{#each player.queue as id, index (`${id}-${index}`)}{@const track = tracks.find(
			(t) => t.id === id
		)!}<Button
			variant="ghost"
			type="button"
			class={[
				'control-templates-music-player-layout h-auto whitespace-normal',
				'queue-track min-w-0 justify-start whitespace-normal',
				{ current: player.current.id === id }
			]}
			onclick={() => player.play(track)}
			><img src={track.artwork} alt="" /><span
				><strong>{track.title}</strong><small>{track.artist}</small></span
			>{#if player.current.id === id}<Icon size={18} />{/if}</Button
		>{/each}
</aside>

<style>
	.queue-volume {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 11px;
		margin: 10px 0 20px;
	}
	.queue-volume :global([data-slot='slider']) {
		width: 100%;
	}

	.queue-panel {
		position: absolute;
		right: 0;
		top: 77px;
		bottom: 92px;
		width: min(330px, 100vw);
		background: var(--background);
		padding: 25px;
		z-index: 4;
		overflow: auto;
		box-shadow: -12px 0 40px #0002;
		border-left: 1px solid var(--border);
	}
	:global(.control-templates-music-player-layout.queue-track) {
		display: flex;
		width: 100%;
		align-items: center;
		gap: 12px;
		text-align: left;
		padding: 12px 0;
		border-bottom: 1px solid var(--border);
	}
	:global(.control-templates-music-player-layout.queue-track) img {
		width: 42px;
		border-radius: 5px;
	}
	:global(.control-templates-music-player-layout.queue-track) span {
		display: grid;
		gap: 4px;
		flex: 1;
	}
	:global(.control-templates-music-player-layout.queue-track) strong {
		font-size: 12px;
	}
	:global(.control-templates-music-player-layout.queue-track) small {
		font-size: 10px;
		color: var(--music-muted);
	}
	:global(.control-templates-music-player-layout.queue-track.current) {
		color: #c46b78;
	}

	@media (max-width: 680px) {
		.queue-panel {
			bottom: 181px;
			top: 60px;
		}
	}
</style>
