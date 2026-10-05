<script lang="ts">
	import { ScrollArea } from '#lib/bedrock/ui/scroll-area';
	import { Button } from '#lib/bedrock/ui/button';
	import { usePlayer } from '#lib/templates/music-player/player.svelte.js';
	import ListeningHeader from '#lib/templates/music-player/ListeningHeader.svelte';
	import { activeLyric, loadLyrics, type Lyrics } from '#lib/templates/music-player/lyrics.js';
	import { elementPrefersReducedMotion } from '#lib/bedrock/motion/policy.js';
	import { formatTime } from '#lib/templates/music-player/data.js';
	const player = usePlayer();
	let lyrics = $state<Lyrics | null>(null);
	let status = $state<'loading' | 'ready' | 'error'>('loading');
	let retry = $state(0);
	let following = $state(true);
	let viewport = $state<HTMLElement | null>(null);
	const active = $derived(activeLyric(lyrics?.lines ?? [], player.elapsed));
	function connectLyrics() {
		const track = player.current;
		void retry;
		const controller = new AbortController();
		lyrics = null;
		status = 'loading';
		following = true;
		loadLyrics(track, controller.signal)
			.then((result) => {
				if (!controller.signal.aborted) {
					lyrics = result;
					status = 'ready';
				}
			})
			.catch(() => {
				if (!controller.signal.aborted) status = 'error';
			});
		return () => controller.abort();
	}
	function followLine() {
		const line = viewport?.querySelector<HTMLElement>(`[data-line="${active}"]`);
		if (following && viewport && line) {
			viewport.scrollTo({
				top:
					viewport.scrollTop +
					line.getBoundingClientRect().top -
					viewport.getBoundingClientRect().top -
					viewport.clientHeight * 0.38,
				behavior: elementPrefersReducedMotion(viewport) ? 'instant' : 'smooth'
			});
		}
	}
</script>

<svelte:head><title>Lyrics · {player.current.title} — Drift</title></svelte:head>
<section {@attach connectLyrics} class="lyrics-screen" aria-label="Lyrics">
	<ListeningHeader
		label="Behind the words"
		detail={lyrics?.lines.length ? 'Tap a line to jump there' : 'Lyrics'}
	/>
	{#if status === 'loading'}
		<div class="empty-state" role="status">
			<h2>Finding the words…</h2>
			<p>Looking up lyrics for this recording.</p>
		</div>
	{:else if status === 'error'}
		<div class="empty-state" role="status">
			<h2>Lyrics couldn’t load</h2>
			<p>Check your connection and try again.</p>
			<Button variant="secondary" onclick={() => retry++}>Try again</Button>
		</div>
	{:else if lyrics?.instrumental}
		<div class="empty-state">
			<h2>Let the music speak.</h2>
			<p>This track is instrumental.</p>
			<Button variant="secondary" href="/templates/music-player/visualizer">Open visualizer</Button>
		</div>
	{:else if lyrics?.lines.length}
		<ScrollArea
			class="lyrics-scroll"
			bind:viewportRef={viewport}
			onwheel={() => (following = false)}
			ontouchstart={() => (following = false)}
			onkeydown={(event) => {
				if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key))
					following = false;
			}}
			role="region"
			aria-label="Synced lyrics"
		>
			<div class="lyric-lines" {@attach followLine}>
				{#each lyrics.lines as line, index (`${index}-${line.time}`)}
					<Button
						variant="ghost"
						class={['lyric-line', { current: index === active, past: index < active }]}
						data-line={index}
						aria-current={index === active ? 'true' : undefined}
						aria-label={`${line.text || 'Instrumental break'} — seek to ${formatTime(line.time)}`}
						onclick={() => {
							player.seek(line.time);
							following = true;
						}}>{line.text || '♪ · · ·'}</Button
					>
				{/each}
			</div>
		</ScrollArea>
	{:else if lyrics?.plain}
		<ScrollArea class="plain-lyrics">
			<p class="unsynced">Timing isn’t available for this recording.</p>
			<p>{lyrics.plain}</p>
		</ScrollArea>
	{:else}
		<div class="empty-state">
			<h2>No lyrics here yet.</h2>
			<p>We couldn’t find lyrics matching this recording.</p>
			<Button variant="secondary" href="/templates/music-player/visualizer"
				>Get lost in the sound</Button
			>
		</div>
	{/if}
	<footer>
		<a href="https://lrclib.net/" target="_blank" rel="noreferrer">Lyrics by LRCLIB ↗</a
		>{#if lyrics?.lines.length}<Button
				variant="ghost"
				size="sm"
				aria-pressed={following}
				onclick={() => (following = !following)}
				>{following ? 'Following the song' : 'Resume following'}</Button
			>{/if}
	</footer>
</section>

<style>
	.lyrics-screen {
		height: 100%;
		min-height: 0;
		display: flex;
		flex-direction: column;
		color: #fff4f5;
		background: radial-gradient(ellipse at 10% 0%, #70414e, transparent 80%), #392630;
	}
	:global(.lyrics-screen .lyrics-scroll) {
		position: relative;
		flex: 1;
		min-height: 0;
		overflow: auto;
		overscroll-behavior: contain;
		mask-image: linear-gradient(transparent, black 10%, black 85%, transparent);
	}
	.lyric-lines {
		padding: 14vh clamp(24px, 7vw, 110px) 30vh;
		display: grid;
		gap: 24px;
	}
	.lyric-lines :global(.lyric-line) {
		height: auto;
		min-height: 44px;
		padding: 0;
		justify-content: start;
		text-align: left;
		white-space: normal;
		font-size: clamp(26px, 3.7vw, 54px);
		font-weight: 750;
		letter-spacing: -1.2px;
		line-height: 1.3;
		color: #c9abb6;
		background: transparent;
		transition: color 220ms;
	}
	.lyric-lines :global(.lyric-line.current) {
		color: #fff;
	}
	.lyric-lines :global(.lyric-line.past) {
		color: #b598a3;
	}
	.lyric-lines :global(.lyric-line:hover) {
		color: #fff;
	}
	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		gap: 18px;
		padding: 32px clamp(24px, 7vw, 110px);
	}
	h2 {
		font-size: clamp(28px, 4vw, 52px);
		font-weight: 700;
		letter-spacing: -1px;
	}
	.empty-state p {
		opacity: 0.75;
		font-size: 14px;
	}
	:global(.lyrics-screen .plain-lyrics) {
		flex: 1;
		overflow: auto;
		padding: 32px clamp(24px, 7vw, 110px);
		white-space: pre-line;
		font-size: clamp(24px, 3vw, 40px);
		font-weight: 700;
		line-height: 1.65;
	}
	.unsynced {
		font-size: 13px;
		font-weight: 400;
		opacity: 0.7;
		margin-bottom: 24px;
	}
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 62px;
		gap: 12px;
		padding: 12px 24px;
		font-size: 11px;
	}
	footer a {
		opacity: 0.7;
	}
	@media (prefers-reduced-motion: reduce) {
		.lyric-lines :global(.lyric-line) {
			transition: none;
		}
	}
	:global([data-bedrock-motion='reduced']) .lyric-lines :global(.lyric-line) {
		transition: none;
	}
</style>
