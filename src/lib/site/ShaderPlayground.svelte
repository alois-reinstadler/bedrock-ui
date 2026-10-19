<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import { Shader } from '#lib/bedrock/shaders/index.js';
	import { shaders, shaderSampleImage, type ShaderId } from '#lib/bedrock/shaders/catalog.js';
	import presets from '#lib/bedrock/shaders/presets.json';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import DocsPageHeader from './DocsPageHeader.svelte';
	import CodeBlock from './CodeBlock.svelte';
	let { shader }: { shader: (typeof shaders)[number] } = $props();
	const controls: Record<
		ShaderId,
		{ key: string; label: string; min: number; max: number; step: number }
	> = {
		'mesh-gradient': { key: 'distortion', label: 'Distortion', min: 0, max: 1, step: 0.01 },
		warp: { key: 'swirl', label: 'Swirl', min: 0, max: 1, step: 0.01 },
		'grain-gradient': { key: 'noise', label: 'Grain', min: 0, max: 1, step: 0.01 },
		dithering: { key: 'size', label: 'Pixel size', min: 1, max: 8, step: 1 },
		'neuro-noise': { key: 'brightness', label: 'Brightness', min: 0, max: 1, step: 0.01 },
		'god-rays': { key: 'intensity', label: 'Intensity', min: 0, max: 1, step: 0.01 },
		'liquid-metal': { key: 'distortion', label: 'Distortion', min: 0, max: 1, step: 0.01 },
		heatmap: { key: 'contour', label: 'Contour', min: 0, max: 1, step: 0.01 },
		'fluted-glass': { key: 'size', label: 'Flute size', min: 0, max: 1, step: 0.01 },
		'image-dithering': { key: 'size', label: 'Pixel size', min: 1, max: 8, step: 1 },
		'halftone-dots': { key: 'size', label: 'Dot size', min: 0, max: 1, step: 0.01 },
		water: { key: 'waves', label: 'Waves', min: 0, max: 1, step: 0.01 }
	};
	const initial = untrack(() => presets[shader.slug]);
	const control = untrack(() => controls[shader.slug]);
	const initialAmount = Number((initial as Record<string, unknown>)[control.key]);
	let amount = $state(initialAmount);
	let scale = $state(initial.scale);
	let speed = $state(initial.speed);
	let paused = $state(false);
	let text = $state('Bedrock');
	let src = $state(shaderSampleImage);
	let uploadName = $state('Sample image');
	let uploadError = $state('');
	let uploadKey = $state(0);
	let objectUrl: string | undefined;
	let options = $derived({ scale, [control.key]: amount });
	let sourceCode = $derived(
		`<script lang="ts">\n  import { Shader } from '#lib/bedrock/shaders/index.js';\n${'</' + 'script>'}\n\n<Shader\n  effect="${shader.slug}"${shader.category === 'Text' ? `\n  text={${JSON.stringify(text)}}` : shader.category === 'Images' ? `\n  src="${src === shaderSampleImage ? shaderSampleImage : '/your-image.jpg'}"\n  alt="Green mountain ridges beneath mist and sunset clouds"` : ''}\n  options={{ scale: ${scale}, ${control.key}: ${amount} }}\n  speed={${speed}}${paused ? '\n  paused' : ''}\n  class="h-96 rounded-xl"\n/>`
	);
	function reset() {
		amount = initialAmount;
		scale = initial.scale;
		speed = initial.speed;
		paused = false;
		text = 'Bedrock';
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = undefined;
		src = shaderSampleImage;
		uploadName = 'Sample image';
		uploadError = '';
		uploadKey++;
	}
	function upload(event: Event) {
		const file = (event.currentTarget as HTMLInputElement).files?.[0];
		if (!file) return;
		if (!file.type.startsWith('image/')) {
			uploadError = 'Choose an image file.';
			return;
		}
		if (file.size > 15 * 1024 * 1024) {
			uploadError = 'Choose an image smaller than 15 MB.';
			return;
		}
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = URL.createObjectURL(file);
		src = objectUrl;
		uploadName = file.name;
		uploadError = '';
	}
	onDestroy(() => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	});
</script>

<article class="mx-auto max-w-6xl px-4 py-10 md:px-8">
	<DocsPageHeader
		eyebrow={`Shaders / ${shader.category}`}
		title={shader.title}
		description={shader.description}
	/>
	<div class="mt-8 grid overflow-hidden rounded-xl border lg:grid-cols-[minmax(0,1fr)_17rem]">
		<Shader
			effect={shader.slug}
			text={shader.category === 'Text' ? text : undefined}
			src={shader.category === 'Images' ? src : undefined}
			alt={uploadName === 'Sample image'
				? 'Green mountain ridges beneath mist and sunset clouds'
				: uploadName}
			{options}
			{speed}
			{paused}
			showStatus
			class="min-h-80 lg:min-h-[30rem]"
		>
			{#if shader.category === 'Backgrounds'}<div
					class="flex min-h-80 flex-col items-center justify-center p-8 text-center text-white lg:min-h-[30rem]"
				>
					<p class="text-xs tracking-[0.3em] uppercase drop-shadow-lg">Make room for wonder</p>
					<p class="mt-4 text-5xl font-semibold tracking-tighter drop-shadow-lg sm:text-6xl">
						Something<br />unexpected.
					</p>
				</div>{/if}
		</Shader>
		<div class="space-y-6 border-t bg-card p-6 lg:border-t-0 lg:border-l">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-medium">Playground</h2>
				<Button size="sm" variant="ghost" onclick={reset}>Reset</Button>
			</div>
			{#if shader.category === 'Text'}<div class="space-y-2">
					<label for="shader-text" class="text-xs font-medium">Your text</label><Input
						id="shader-text"
						bind:value={text}
						maxlength={32}
						placeholder="Type something"
					/>
					<p class="text-xs text-muted-foreground">Try a short word or a monogram.</p>
				</div>{/if}
			{#if shader.category === 'Images'}<div class="space-y-2">
					<label for="shader-image" class="text-xs font-medium">Your image</label
					>{#key uploadKey}<input
							id="shader-image"
							type="file"
							accept="image/*"
							onchange={upload}
							class="block w-full text-xs file:mr-2 file:rounded-md file:border file:bg-secondary file:px-3 file:py-2 file:text-foreground"
						/>{/key}
					<p class="truncate text-xs text-muted-foreground">{uploadName}</p>
					<p class="text-xs text-muted-foreground">Stays in your browser. Up to 15 MB.</p>
					{#if uploadError}<p role="alert" class="text-xs text-destructive">{uploadError}</p>{/if}
				</div>{/if}
			<div class="space-y-2">
				<label for="shader-amount" class="flex justify-between text-xs font-medium"
					>{control.label}<span class="font-mono text-muted-foreground">{amount}</span></label
				><input
					id="shader-amount"
					class="w-full accent-foreground"
					type="range"
					min={control.min}
					max={control.max}
					step={control.step}
					bind:value={amount}
				/>
			</div>
			<div class="space-y-2">
				<label for="shader-scale" class="flex justify-between text-xs font-medium"
					>Scale<span class="font-mono text-muted-foreground">{scale}</span></label
				><input
					id="shader-scale"
					class="w-full accent-foreground"
					type="range"
					min="0.2"
					max="3"
					step="0.05"
					bind:value={scale}
				/>
			</div>
			{#if initial.speed > 0}<div class="space-y-2">
					<label for="shader-speed" class="flex justify-between text-xs font-medium"
						>Speed<span class="font-mono text-muted-foreground">{speed}</span></label
					><input
						id="shader-speed"
						class="w-full accent-foreground"
						type="range"
						min="0"
						max="2"
						step="0.05"
						bind:value={speed}
					/>
				</div>
				<Button
					class="w-full"
					variant="outline"
					aria-pressed={paused}
					onclick={() => (paused = !paused)}>{paused ? 'Play animation' : 'Pause animation'}</Button
				>{:else}<p class="text-xs leading-relaxed text-muted-foreground">
					A still image effect. Adjust the controls to change the finish.
				</p>{/if}
		</div>
	</div>
	<div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
		<section class="min-w-0 space-y-4" aria-label="Svelte usage">
			<h2 class="text-xl font-medium tracking-tight">Make it yours.</h2>
			<CodeBlock code={sourceCode} language="svelte" label="Svelte" />
			<p class="text-sm leading-relaxed text-muted-foreground">
				Give the component a height. Use <code>options</code> for Paper’s original color, sizing,
				and effect parameters; <code>speed</code> and <code>paused</code> control animation. Place interface
				content inside the component to layer it over a background.
			</p>
		</section>
		<aside class="space-y-4 text-sm leading-relaxed text-muted-foreground">
			<h2 class="font-medium text-foreground">About this effect</h2>
			<p>
				Original Paper Shaders 0.0.81 program and default preset, with a Svelte lifecycle and
				editable controls.
			</p>
			{#if shader.category === 'Text'}<p>
					Text becomes a transparent image mask for Paper’s effect. Its accessible text stays in the
					HTML. You can also pass a transparent logo with <code>src</code>.
				</p>{/if}{#if shader.slug === 'god-rays'}<p>
					This is Paper’s God Rays. The Light Rays component in Components uses Spell UI’s separate
					shader.
				</p>{/if}<a
				class="inline-block underline underline-offset-4"
				href={`https://shaders.paper.design/${shader.slug}`}
				target="_blank"
				rel="noreferrer">Paper reference ↗</a
			>
			<p>
				WebGL2 required. Without it, the original text, image, or a static background stays visible.
				Reduced motion freezes animation.
			</p>
		</aside>
	</div>
	<nav class="mt-12 flex flex-wrap gap-2 border-t pt-6" aria-label="More shaders">
		{#each shaders as item (item.slug)}<Button
				href={`/docs/shaders/${item.slug}`}
				variant={item.slug === shader.slug ? 'secondary' : 'ghost'}
				size="sm"
				aria-current={item.slug === shader.slug ? 'page' : undefined}>{item.title}</Button
			>{/each}
	</nav>
</article>
