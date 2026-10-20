<script lang="ts">
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';

	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	const tabs = ['Boarding', 'Hold', 'Taxi', 'Airborne'] as const;
	let tab = $state<(typeof tabs)[number]>('Boarding');
	let pillBox = $state({ x: 0, w: 0 });
	const layoutTransition = motionPresets.layout;
	const pill = layout({ transition: layoutTransition });
	function setPillBox(x: number, w: number) {
		if (pillBox.x === x && pillBox.w === w) return;
		pillBox = { x, w };
	}
	function selectTab(item: (typeof tabs)[number], button: HTMLButtonElement) {
		tab = item;
		setPillBox(button.offsetLeft, button.offsetWidth);
	}
	const trackPill: Attachment<HTMLElement> = (el) => {
		if (typeof requestAnimationFrame === 'undefined') return;
		let frame = 0;
		const update = () => {
			const active = el.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
			if (!active) return;
			untrack(() => setPillBox(active.offsetLeft, active.offsetWidth));
		};
		const scheduleUpdate = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		};
		const observer = new ResizeObserver(scheduleUpdate);
		observer.observe(el);
		scheduleUpdate();
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	};
</script>

<Scene index="01" title="Shared pill" hint="Same element, new box. Interrupt it mid-move.">
	<div class="rounded-[1.75rem] bg-muted/60 p-1.5">
		<LayoutGroup class="rounded-[calc(1.75rem-0.375rem)] bg-background p-1">
			<div class="relative flex flex-wrap gap-1" {@attach trackPill}>
				<span
					{@attach pill}
					class={[
						'pointer-events-none absolute top-0 bottom-0 rounded-full bg-foreground',
						pillBox.w === 0 && 'opacity-0'
					]}
					style:left="{pillBox.x}px"
					style:width="{pillBox.w}px"
				></span>
				{#each tabs as item (item)}
					<button
						type="button"
						class="relative z-10 rounded-full px-4 py-2.5 text-sm font-medium"
						aria-pressed={tab === item}
						onclick={(event) => selectTab(item, event.currentTarget)}
					>
						<span class={tab === item ? 'text-background' : 'text-muted-foreground'}>{item}</span>
					</button>
				{/each}
			</div>
		</LayoutGroup>
	</div>
</Scene>

<style>
</style>
