<script lang="ts">
	import { Slider as SliderPrimitive } from 'bits-ui';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import { cn, type WithoutChildrenOrChild } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		orientation = 'horizontal',
		thumbVisibility = 'always',
		class: className,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		'aria-valuetext': ariaValueText,
		...restProps
	}: WithoutChildrenOrChild<SliderPrimitive.RootProps> & {
		/** Reveal thumbs on hover, keyboard focus, or drag; touch devices keep them visible. */
		thumbVisibility?: 'always' | 'hover';
	} = $props();

	const policy = useMotionPolicy();
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<SliderPrimitive.Root
	bind:ref
	bind:value={value as never}
	data-slot="slider"
	data-thumb-visibility={thumbVisibility}
	data-reduced={policy.reduced || undefined}
	{orientation}
	class={cn(
		'bedrock-slider relative flex min-h-6 w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:min-w-6 data-vertical:flex-col',
		className
	)}
	{...restProps}
>
	{#snippet children({ thumbItems })}
		<span
			data-slot="slider-track"
			data-orientation={orientation}
			class={cn(
				'relative grow overflow-hidden rounded-full bg-muted data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1'
			)}
		>
			<SliderPrimitive.Range
				data-slot="slider-range"
				class={cn(
					'absolute rounded-full bg-primary select-none data-horizontal:h-full data-vertical:w-full'
				)}
			/>
		</span>
		{#each thumbItems as thumb (thumb.index)}
			<SliderPrimitive.Thumb
				data-slot="slider-thumb"
				index={thumb.index}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				aria-valuetext={ariaValueText}
				class="relative block size-3.5 shrink-0 rounded-full border border-primary/70 bg-background shadow-xs ring-ring/30 select-none after:absolute after:-inset-2 hover:border-primary hover:ring-3 focus-visible:border-ring focus-visible:ring-3 focus-visible:outline-hidden disabled:pointer-events-none data-active:border-primary data-active:ring-3"
			/>
		{/each}
	{/snippet}
</SliderPrimitive.Root>

<style>
	:global(.bedrock-slider:not([data-disabled])) {
		cursor: pointer;
	}

	:global(.bedrock-slider:not([data-disabled]) [data-slot='slider-thumb']) {
		cursor: grab;
	}

	:global(.bedrock-slider:not([data-disabled]):has([data-slot='slider-thumb'][data-active])),
	:global(
		.bedrock-slider:not([data-disabled]):has([data-slot='slider-thumb'][data-active])
			[data-slot='slider-thumb']
	) {
		cursor: grabbing;
	}

	:global(.bedrock-slider[data-disabled]) {
		cursor: not-allowed;
	}

	:global(.bedrock-slider [data-slot='slider-thumb']) {
		transition-property: scale, box-shadow, border-color, opacity;
		transition-duration: var(--motion-press, 130ms);
		transition-timing-function: var(--motion-ease-enter, ease-out);
	}

	/* Bits owns thumb positions. The independent scale property keeps them exact. */
	:global(
		.bedrock-slider:not([data-disabled]):not([data-reduced]) [data-slot='slider-thumb'][data-active]
	) {
		scale: 1.12;
	}

	@media (hover: hover) and (pointer: fine) {
		:global(.bedrock-slider[data-thumb-visibility='hover'] [data-slot='slider-thumb']) {
			opacity: 0;
		}

		:global(
			.bedrock-slider[data-thumb-visibility='hover']:not([data-disabled]):hover
				[data-slot='slider-thumb']
		),
		:global(
			.bedrock-slider[data-thumb-visibility='hover'] [data-slot='slider-thumb']:focus-visible
		),
		:global(
			.bedrock-slider[data-thumb-visibility='hover'] [data-slot='slider-thumb'][data-active]
		) {
			opacity: 1;
		}
	}

	:global(.bedrock-slider[data-reduced] [data-slot='slider-thumb']),
	:global(.bedrock-slider[data-reduced] [data-slot='slider-track']) {
		scale: 1;
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.bedrock-slider [data-slot='slider-thumb']),
		:global(.bedrock-slider [data-slot='slider-track']) {
			scale: 1 !important;
			transition: none;
		}
	}
</style>
