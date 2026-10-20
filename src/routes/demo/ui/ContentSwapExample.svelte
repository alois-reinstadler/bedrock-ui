<script lang="ts">
	import { onDestroy } from 'svelte';

	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	import UploadIcon from '@lucide/svelte/icons/upload';

	import { LayoutGroup, Swap, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	const layoutTransition = motionPresets.layout;
	const uploadShell = layout({ transition: layoutTransition });
	type UploadState = 'idle' | 'busy' | 'done';
	let uploadState = $state<UploadState>('idle');
	let uploadEffect = $state<'fade' | 'slide-up'>('slide-up');
	let uploadTimer = 0;
	function startUpload() {
		if (uploadState !== 'idle') return;
		uploadState = 'busy';
		clearTimeout(uploadTimer);
		uploadTimer = window.setTimeout(() => {
			uploadState = 'done';
			uploadTimer = window.setTimeout(() => (uploadState = 'idle'), 1600);
		}, 1800);
	}
	const uploadStatusMessage = $derived(
		uploadState === 'busy'
			? 'Uploading manifest.'
			: uploadState === 'done'
				? 'Manifest uploaded.'
				: 'Ready to upload manifest.'
	);
	onDestroy(() => clearTimeout(uploadTimer));
</script>

<Scene
	index="13"
	title="Content swap"
	hint="Swap can fade through or roll crisp single-line content upward; the shell still sees one clean resize."
>
	<div class="flex gap-1" role="group" aria-label="Swap effect">
		{#each [['fade', 'Fade'], ['slide-up', 'Slide up']] as option (option[0])}
			<button
				type="button"
				class="rounded-full bg-muted px-3 py-1.5 text-xs font-medium aria-pressed:bg-foreground aria-pressed:text-background"
				aria-pressed={uploadEffect === option[0]}
				onclick={() => (uploadEffect = option[0] as 'fade' | 'slide-up')}
			>
				{option[1]}
			</button>
		{/each}
	</div>
	<LayoutGroup class="flex min-h-14 items-center">
		<button
			type="button"
			class="relative rounded-full text-sm font-medium text-background"
			aria-disabled={uploadState !== 'idle'}
			aria-label="Upload manifest"
			aria-describedby="motion-upload-status"
			aria-busy={uploadState === 'busy'}
			onclick={startUpload}
		>
			<span
				{@attach uploadShell}
				class="pointer-events-none absolute inset-0 rounded-full bg-foreground"
				aria-hidden="true"
			></span>
			<span class="relative z-10 flex items-center justify-center px-5 py-2.5" aria-hidden="true">
				<Swap key={uploadState} effect={uploadEffect} class="whitespace-nowrap">
					{#if uploadState === 'idle'}
						<UploadIcon class="size-4" />
						Upload manifest
					{:else if uploadState === 'busy'}
						<LoaderCircleIcon class="size-4 animate-spin motion-reduce:animate-none" />
						Uploading…
					{:else}
						<CheckIcon class="size-4" />
						Done
					{/if}
				</Swap>
			</span>
		</button>
		<span id="motion-upload-status" class="sr-only" role="status">
			{uploadStatusMessage}
		</span>
	</LayoutGroup>
</Scene>

<style>
</style>
