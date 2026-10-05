<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Slider } from '#lib/bedrock/ui/slider';
	import { Input } from '#lib/bedrock/ui/input';
	import { shapeCatalog, serializeShape } from '#lib/site/shapes-gallery.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { copyText } from '#lib/site/copy-text.js';
	let selected = $state(shapeCatalog[0]);
	let preview = $state<SVGSVGElement | null>(null);
	let color = $state('#8870dd');
	let rotation = $state(0);
	let feedback = $state('');
	function download() {
		const svg = serializeShape(preview, color, rotation);
		const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
		const link = document.createElement('a');
		link.href = url;
		link.download = `${selected.id}.svg`;
		link.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
	async function copy() {
		try {
			await copyText(serializeShape(preview, color, rotation));
			feedback = `${selected.label} SVG copied.`;
		} catch {
			feedback = 'Copy unavailable. Use Download SVG instead.';
		}
	}
</script>

<div class="w-full space-y-5">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div>
			<h3 class="font-medium">A shape for every idea.</h3>
			<p class="mt-1 text-sm text-muted-foreground">72 SVG shapes. Pick one and make it yours.</p>
		</div>
		<a
			class="text-sm text-muted-foreground underline underline-offset-4"
			href="https://www.shapes.gallery/"
			target="_blank"
			rel="noreferrer">Shapes by Mo ↗</a
		>
	</div>
	<div class="grid gap-5 md:grid-cols-[minmax(0,1fr)_15rem]">
		<div
			class="grid max-h-[30rem] grid-cols-3 gap-2 overflow-y-auto rounded-xl border p-3 corner-theme sm:grid-cols-4"
			role="group"
			aria-label="Choose a shape"
		>
			{#each shapeCatalog as shape (shape.id)}
				<Button
					variant="ghost"
					type="button"
					aria-label={shape.label}
					aria-pressed={selected.id === shape.id}
					class={[
						'control-site-examples-shapes h-auto whitespace-normal',
						'flex min-w-0 flex-col items-center justify-center rounded-lg border border-transparent bg-muted/30 p-2 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-primary/10'
					]}
					onclick={() => {
						selected = shape;
						feedback = '';
					}}
				>
					<shape.component class="h-auto w-full max-w-20 p-3" />
					<span class="mt-1 font-mono text-[10px] text-muted-foreground">{shape.id.slice(-2)}</span>
				</Button>
			{/each}
		</div>
		<Card.Root class="block gap-0 space-y-4 p-4">
			<div class="flex aspect-square items-center justify-center rounded-lg bg-muted/40">
				<selected.component
					bind:ref={preview}
					label={selected.label}
					viewBox="-54 -54 364 364"
					class="h-auto w-full"
					style={`color: ${color}; transform: rotate(${rotation}deg)`}
				/>
			</div>
			<p class="font-medium">{selected.label}</p>
			<label class="flex items-center justify-between gap-3 text-sm"
				>Color
				<Input
					type="color"
					bind:value={color}
					oninput={() => (feedback = '')}
					class={[
						'control-site-examples-shapes',
						'h-9 w-12 cursor-pointer rounded border bg-transparent p-1'
					]}
				/>
			</label>
			<div class="grid gap-2 text-sm">
				<span class="flex justify-between"
					>Rotation <span class="font-mono text-muted-foreground">{rotation}°</span></span
				>
				<Slider
					type="single"
					aria-label="Rotation"
					min={0}
					max={360}
					step={15}
					bind:value={rotation}
					onValueChange={() => (feedback = '')}
					class="w-full"
				/>
			</div>
			<div class="grid gap-2">
				<Button onclick={copy}>Copy SVG</Button>
				<Button variant="outline" onclick={download} disabled={!preview}>Download SVG</Button>
			</div>
			<p class="min-h-10 text-xs text-muted-foreground" role="status">{feedback}</p>
		</Card.Root>
	</div>
</div>
