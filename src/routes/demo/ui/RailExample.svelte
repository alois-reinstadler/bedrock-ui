<script lang="ts">
	import { drawer } from '#lib/bedrock/motion/index.js';
	import { LayoutGroup } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	let railOpen = $state(true);
</script>

<Scene index="12" title="Rail" hint="The main pane grows into the vacated column.">
	<button
		type="button"
		class="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
		aria-expanded={railOpen}
		aria-controls="motion-stand-rail"
		onclick={() => (railOpen = !railOpen)}
	>
		{railOpen ? 'Stow rail' : 'Show rail'}
	</button>
	<LayoutGroup class="flex min-h-48 overflow-hidden rounded-[1.6rem]">
		{#if railOpen}
			<aside
				id="motion-stand-rail"
				class="w-40 shrink-0 bg-muted p-4"
				aria-label="Stands"
				transition:drawer
			>
				<div class="w-32 shrink-0">
					<p class="font-mono text-[0.7rem] tracking-widest uppercase">Stands</p>
					<p class="mt-3 text-sm leading-relaxed text-muted-foreground">B12, B14, T3</p>
				</div>
			</aside>
		{/if}
		<div class="flex flex-1 flex-col justify-between bg-muted/40 p-5">
			<p class="font-mono text-[0.7rem] tracking-widest uppercase">Ground</p>
			<p class="text-lg tracking-tight">Pushback window is open on Bravo.</p>
		</div>
	</LayoutGroup>
</Scene>

<style>
</style>
