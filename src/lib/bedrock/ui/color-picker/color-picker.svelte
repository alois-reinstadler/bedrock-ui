<script lang="ts" module>
	const defaultLabels = {
		saturation: 'Saturation and brightness',
		hue: 'Hue',
		alpha: 'Alpha',
		colorValue: 'Color value',
		format: 'Color format',
		swatch: (hex: string) => `Choose ${hex}`,
		invalid: 'Enter a valid HEX, RGB, or HSL color.',
		valueText: (s: number, v: number) => `Saturation ${s}%, brightness ${v}%`
	};

	export type ColorPickerLabels = Partial<typeof defaultLabels>;
	export type ColorPickerFormat = 'hex' | 'rgb' | 'hsl';
	export type ColorPickerVariant = 'panel' | 'swatches';
</script>

<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import ColorArea from '../color-area/color-area.svelte';
	import ColorSlider from '../color-slider/color-slider.svelte';
	import ColorField from '../color-field/color-field.svelte';
	import ColorSwatch from '../color-swatch/color-swatch.svelte';
	import ColorSwatchPicker from '../color-swatch-picker/color-swatch-picker.svelte';
	import { createColorState, provideColorState, defaultSwatches } from './color-state.svelte.js';
	export type ColorPickerProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: string;
		onValueChange?: (value: string) => void;
		alpha?: boolean;
		format?: ColorPickerFormat;
		swatches?: string[];
		variant?: ColorPickerVariant;
		disabled?: boolean;
		labels?: ColorPickerLabels;
		name?: string;
	};
	let {
		value = $bindable('#6e56cf'),
		onValueChange,
		alpha = false,
		format = $bindable('hex'),
		swatches = defaultSwatches,
		variant = 'panel',
		disabled = false,
		labels: labelOverrides = {},
		name,
		children,
		ref = $bindable(null),
		class: className,
		...rest
	}: ColorPickerProps = $props();
	const l = $derived({ ...defaultLabels, ...labelOverrides });
	const state = createColorState(
		{
			value: () => value,
			alpha: () => alpha,
			disabled: () => disabled,
			change: (next) => {
				value = next;
				onValueChange?.(next);
			}
		},
		false
	);
	provideColorState(state);
</script>

<div
	{@attach (node) => {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}}
	data-slot="color-picker"
	data-variant={variant}
	class={cn('grid w-full max-w-80 gap-4', className)}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else if variant === 'swatches'}
		<ColorSwatchPicker {swatches} swatchLabel={l.swatch} data-slot="color-picker-swatches" />
	{:else}
		<ColorArea label={l.saturation} valueText={l.valueText} data-slot="color-picker-area" />
		<ColorSlider channel="hue" label={l.hue} data-slot="color-picker-hue" />
		{#if alpha}<ColorSlider channel="alpha" label={l.alpha} data-slot="color-picker-alpha" />{/if}
		<div class="grid grid-cols-[auto_1fr_auto] items-center gap-2" data-slot="color-picker-input">
			<ColorSwatch aria-hidden="true" />
			<ColorField
				{format}
				label={l.colorValue}
				invalidMessage={l.invalid}
				class="h-9 min-w-0 text-xs"
			/>
			<Button
				type="button"
				variant="ghost"
				size="sm"
				class="w-12 px-0 font-code text-xs"
				{disabled}
				aria-label={l.format}
				onclick={() => (format = format === 'hex' ? 'rgb' : format === 'rgb' ? 'hsl' : 'hex')}
				>{format.toUpperCase()}</Button
			>
		</div>
		{#if swatches.length}<ColorSwatchPicker
				{swatches}
				swatchLabel={l.swatch}
				data-slot="color-picker-swatches"
			/>{/if}
	{/if}
	{#if name}<input type="hidden" {name} value={state.value} {disabled} />{/if}
</div>
