<script lang="ts">
	import { appear } from '#lib/bedrock/motion/index.js';
	import SearchIcon from '@lucide/svelte/icons/search';

	import XIcon from '@lucide/svelte/icons/x';
	import { motionEasings, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	let searching = $state(false);
	let query = $state('');
	const searchTransitionDuration = `${motionPresets.overlay.duration}ms`;
	const searchTransitionTiming = `cubic-bezier(${motionPresets.drawer.easing.join(', ')})`;
</script>

<Scene index="07" title="Search morph" hint="A continuous shell keeps its content crisp.">
	<div class="flex min-h-14 items-center">
		<div
			class="motion-search-shell h-11 max-w-full overflow-hidden rounded-full bg-muted"
			style:width={searching ? 'min(28rem, 100%)' : '2.75rem'}
			style:--motion-search-duration={searchTransitionDuration}
			style:--motion-search-timing={searchTransitionTiming}
		>
			<span class="flex h-11 w-[28rem] max-w-full items-center gap-2 px-2">
				<button
					type="button"
					class="grid size-7 shrink-0 place-items-center rounded-full"
					aria-label={searching ? 'Close search' : 'Open search'}
					aria-expanded={searching}
					aria-controls="motion-search-field"
					onclick={() => {
						searching = !searching;
						if (!searching) query = '';
					}}
				>
					{#if searching}
						<XIcon class="size-3.5" />
					{:else}
						<SearchIcon class="size-3.5" />
					{/if}
				</button>
				{#if searching}
					<input
						id="motion-search-field"
						class="min-w-0 flex-1 rounded-sm bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
						aria-label="Search stands, gates, or flights"
						placeholder="Stand, gate, or flight"
						bind:value={query}
						in:appear={{
							delay: motionPresets.state.duration,
							duration: motionPresets.enter.duration,
							easing: motionEasings.enter,
							start: 1
						}}
					/>
				{/if}
			</span>
		</div>
	</div>
</Scene>

<style>
	.motion-search-shell {
		transition-property: width;
		transition-duration: var(--motion-search-duration);
		transition-timing-function: var(--motion-search-timing);
	}
	@media (prefers-reduced-motion: reduce) {
		.motion-search-shell {
			transition-duration: 0ms;
		}
	}
</style>
