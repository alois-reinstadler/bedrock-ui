<script lang="ts">
	import { appear, vanish } from '#lib/bedrock/motion/index.js';
	import {
		LayoutGroup,
		autoSize,
		layout,
		motionEasings,
		motionPresets
	} from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	const procedures = ['IFR', 'VFR', 'RNAV', 'ILS', 'SID', 'STAR', 'HOLD', 'DEICE'] as const;
	let activeTags = $state<string[]>(['IFR', 'ILS', 'HOLD']);
	const layoutTransition = motionPresets.layout;
	const tagChip = layout({ type: 'position', transition: layoutTransition });
	const wrapShell = autoSize({ duration: motionPresets.reveal.duration });
	function toggleTag(tag: string) {
		activeTags = activeTags.includes(tag)
			? activeTags.filter((item) => item !== tag)
			: [...activeTags, tag];
	}
</script>

<Scene index="11" title="Wrap" hint="Chips reflow onto the next line. Each tag keeps its node.">
	<div class="flex flex-wrap gap-2" role="group" aria-label="Active procedures">
		{#each procedures as tag (tag)}
			<button
				type="button"
				class={[
					'rounded-full px-3 py-1.5 text-xs font-medium',
					activeTags.includes(tag)
						? 'bg-foreground text-background'
						: 'bg-muted text-muted-foreground'
				]}
				aria-pressed={activeTags.includes(tag)}
				onclick={() => toggleTag(tag)}
			>
				{tag}
			</button>
		{/each}
	</div>
	<div
		{@attach wrapShell}
		class="box-border max-w-sm overflow-hidden rounded-[1.6rem] bg-muted/50 p-3"
	>
		<LayoutGroup class="relative flex flex-wrap gap-2">
			{#each activeTags as tag (tag)}
				<span
					{@attach tagChip}
					in:appear={{
						duration: motionPresets.enter.duration,
						easing: motionEasings.enter,
						start: 0.98
					}}
					out:vanish={{
						duration: motionPresets.exit.duration,
						easing: motionEasings.exit,
						end: 0.98
					}}
					class="rounded-full bg-background px-3 py-1.5 text-xs font-medium"
				>
					{tag}
				</span>
			{/each}
		</LayoutGroup>
	</div>
</Scene>

<style>
</style>
