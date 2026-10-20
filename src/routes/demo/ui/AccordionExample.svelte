<script lang="ts">
	import { motionEasings, motionPresets, reveal } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	type Faq = { id: string; q: string; a: string };
	const faqs: Faq[] = [
		{
			id: 'slot',
			q: 'Why not animate left and width?',
			a: 'Those properties reflow every frame. FLIP measures the new box, then only animates transform so the compositor can hold 60fps.'
		},
		{
			id: 'id',
			q: 'When do I need a shared id?',
			a: 'When the moving piece is a different DOM node (unmount here, mount there). The same node changing place only needs layout().'
		},
		{
			id: 'nest',
			q: 'Can I nest layout nodes?',
			a: 'Yes for axis-aligned layout. The child removes its parent projection so inherited movement is applied once. Keep corrected content wrappers separate from nested layout nodes.'
		}
	];
	let openFaq = $state<string | null>('slot');
</script>

<Scene
	index="05"
	title="Accordion"
	hint="Height is a presence transition. Siblings follow the reflow natively — no layout() here at all."
>
	<div class="flex flex-col gap-2">
		{#each faqs as item (item.id)}
			<article class="overflow-hidden rounded-2xl bg-muted/80">
				<button
					type="button"
					class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
					aria-expanded={openFaq === item.id}
					aria-controls={`motion-faq-${item.id}`}
					onclick={() => (openFaq = openFaq === item.id ? null : item.id)}
				>
					{item.q}
					<span class="font-mono text-xs text-muted-foreground" aria-hidden="true"
						>{openFaq === item.id ? '–' : '+'}</span
					>
				</button>
				{#if openFaq === item.id}
					<div
						id={`motion-faq-${item.id}`}
						in:reveal={{
							duration: motionPresets.reveal.duration,
							easing: motionEasings.enter
						}}
						out:reveal={{
							duration: motionPresets.reveal.duration,
							easing: motionEasings.enter
						}}
					>
						<p class="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
					</div>
				{/if}
			</article>
		{/each}
	</div>
</Scene>

<style>
</style>
