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

	/** Tailwind palette: red-500, orange-500, amber-400, emerald-500, sky-500,
	 * violet-500, pink-500, slate-700. */
	const defaultSwatches = [
		'#ef4444',
		'#f97316',
		'#fbbf24',
		'#10b981',
		'#0ea5e9',
		'#8b5cf6',
		'#ec4899',
		'#334155'
	];
</script>

<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { hsvToHex, hsvToHsl, hsvToRgb, parseColor, type HsvColor } from './hsv.js';

	export type ColorPickerProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** Canonical `#rrggbb` value (`#rrggbbaa` when `alpha` is on). */
		value?: string;
		onValueChange?: (value: string) => void;
		/** Shows the alpha rail and emits 8-digit hex values. */
		alpha?: boolean;
		/** Presentation of the text input; cycled by the format button. */
		format?: ColorPickerFormat;
		swatches?: string[];
		/** `panel` = SV area + rails + input + swatch row; `swatches` = swatch grid only. */
		variant?: ColorPickerVariant;
		disabled?: boolean;
		/** Overrides for the built-in UI strings. */
		labels?: ColorPickerLabels;
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
		ref = $bindable(null),
		class: className,
		...restProps
	}: ColorPickerProps = $props();

	const uid = $props.id();
	const l = $derived({ ...defaultLabels, ...labelOverrides });

	let hsv = $state<HsvColor>(parseColor(value) ?? { h: 220, s: 0.8, v: 1, a: 1 });
	let textValue = $state(value);
	let invalid = $state(false);

	const hex = $derived(hsvToHex(hsv, alpha));
	const opaqueHex = $derived(hsvToHex({ ...hsv, a: 1 }));
	const hueColor = $derived(hsvToHex({ h: hsv.h, s: 1, v: 1, a: 1 }));
	const displayText = $derived.by(() => {
		if (format === 'rgb') {
			const rgb = hsvToRgb(hsv);
			return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
		}
		if (format === 'hsl') return hsvToHsl(hsv);
		return hex;
	});

	// Re-parse external value changes, preserving the current hue for greys.
	// Compares canonical hex output (not the raw string) so a 6-digit value
	// with `alpha` on cannot re-trigger the effect forever.
	$effect(() => {
		const next = parseColor(value, hsv.h);
		if (!next || hsvToHex(next, alpha) === hex) return;
		hsv = next;
		textValue = hsvToHex(next, alpha);
		invalid = false;
	});

	/** Single state funnel: every change routes through here. */
	function commit(next: HsvColor) {
		hsv = next;
		const output = hsvToHex(next, alpha);
		value = output;
		textValue = output;
		invalid = false;
		onValueChange?.(output);
	}

	/** Pointer-capture attachment factory: click-to-jump plus clamped 0..1 dragging. */
	function pointer(node: HTMLElement, update: (x: number, y: number) => void) {
		const move = (event: PointerEvent) => {
			const rect = node.getBoundingClientRect();
			update(
				Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
				Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height))
			);
		};
		const down = (event: PointerEvent) => {
			if (disabled) return;
			try {
				node.setPointerCapture(event.pointerId);
			} catch {
				// Synthetic events carry no active pointer; click-to-jump still applies.
			}
			move(event);
		};
		const drag = (event: PointerEvent) => {
			if (node.hasPointerCapture(event.pointerId)) move(event);
		};
		const up = (event: PointerEvent) => {
			if (node.hasPointerCapture(event.pointerId)) node.releasePointerCapture(event.pointerId);
		};
		node.addEventListener('pointerdown', down);
		node.addEventListener('pointermove', drag);
		node.addEventListener('pointerup', up);
		node.addEventListener('pointercancel', up);
		return () => {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointermove', drag);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', up);
		};
	}

	function key(event: KeyboardEvent, axis: 'h' | 's' | 'v' | 'a') {
		if (disabled) return;
		const wrap = axis === 'h';
		const max = wrap ? 359 : 100;
		const current = wrap ? hsv.h : hsv[axis] * 100;
		const step = event.shiftKey ? 10 : 1;
		let next: number;
		switch (event.key) {
			case 'ArrowRight':
			case 'ArrowUp':
				next = current + step;
				break;
			case 'ArrowLeft':
			case 'ArrowDown':
				next = current - step;
				break;
			case 'PageUp':
				next = current + 10;
				break;
			case 'PageDown':
				next = current - 10;
				break;
			case 'Home':
				next = 0;
				break;
			case 'End':
				next = max;
				break;
			default:
				return;
		}
		event.preventDefault();
		const absolute = event.key === 'Home' || event.key === 'End';
		const resolved = wrap
			? absolute
				? next
				: ((next % 360) + 360) % 360
			: Math.min(max, Math.max(0, next));
		commit({ ...hsv, [axis]: wrap ? resolved : resolved / 100 });
	}

	function textChange(event: Event) {
		textValue = (event.currentTarget as HTMLInputElement).value;
		const parsed = parseColor(textValue, hsv.h);
		if (!parsed) {
			invalid = true;
			return;
		}
		commit(parsed);
	}

	function selectSwatch(swatch: string) {
		const next = parseColor(swatch, hsv.h);
		if (next) commit(next);
	}

	const railClass =
		'tap-target relative h-3 w-full cursor-pointer rounded-full border border-input select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden';
	const thumbClass =
		'pointer-events-none absolute size-4 rounded-full border border-input shadow-sm ring-2 ring-background';
</script>

{#snippet swatchGrid()}
	<div class="grid grid-cols-8 gap-1.5" data-slot="color-picker-swatches">
		{#each swatches as swatch (swatch)}
			<button
				type="button"
				class="aspect-square w-full cursor-pointer rounded-md border border-input motion-state focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden aria-pressed:ring-2 aria-pressed:ring-ring aria-pressed:ring-offset-2 aria-pressed:ring-offset-background"
				style={`background:${swatch}`}
				{disabled}
				aria-label={l.swatch(swatch)}
				aria-pressed={swatch.toLowerCase() === hex.slice(0, 7).toLowerCase()}
				onclick={() => selectSwatch(swatch)}
			></button>
		{/each}
	</div>
{/snippet}

<div
	bind:this={ref}
	data-slot="color-picker"
	data-variant={variant}
	class={cn('grid w-full max-w-64 gap-3', disabled && 'opacity-50', className)}
	{...restProps}
>
	{#if variant === 'swatches'}
		{@render swatchGrid()}
	{:else}
		<div
			data-slot="color-picker-area"
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-disabled={disabled}
			aria-label={l.saturation}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuenow={Math.round(hsv.s * 100)}
			aria-valuetext={l.valueText(Math.round(hsv.s * 100), Math.round(hsv.v * 100))}
			class="relative aspect-[4/3] w-full cursor-crosshair rounded-md border border-input select-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-hidden"
			style={`background:linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${hueColor}`}
			onkeydown={(event) => key(event, event.altKey ? 'v' : 's')}
			{@attach (node) => pointer(node, (x, y) => commit({ ...hsv, s: x, v: 1 - y }))}
		>
			<span
				class={cn(thumbClass, '-translate-x-1/2 -translate-y-1/2')}
				style={`left:${hsv.s * 100}%; top:${(1 - hsv.v) * 100}%; background:${opaqueHex}`}
				aria-hidden="true"
			></span>
		</div>

		<div
			data-slot="color-picker-hue"
			role="slider"
			tabindex={disabled ? -1 : 0}
			aria-disabled={disabled}
			aria-label={l.hue}
			aria-valuemin={0}
			aria-valuemax={359}
			aria-valuenow={Math.round(hsv.h)}
			class={railClass}
			style="background:linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
			onkeydown={(event) => key(event, 'h')}
			{@attach (node) => pointer(node, (x) => commit({ ...hsv, h: x * 359 }))}
		>
			<span
				class={cn(thumbClass, 'top-1/2 -translate-x-1/2 -translate-y-1/2')}
				style={`left:${(hsv.h / 359) * 100}%; background:${hueColor}`}
				aria-hidden="true"
			></span>
		</div>

		{#if alpha}
			<div
				data-slot="color-picker-alpha"
				role="slider"
				tabindex={disabled ? -1 : 0}
				aria-disabled={disabled}
				aria-label={l.alpha}
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={Math.round(hsv.a * 100)}
				class={railClass}
				style={`background:linear-gradient(to right, transparent, ${opaqueHex}), repeating-conic-gradient(var(--border) 0 25%, transparent 0 50%) 0 0 / 12px 12px`}
				onkeydown={(event) => key(event, 'a')}
				{@attach (node) => pointer(node, (x) => commit({ ...hsv, a: x }))}
			>
				<span
					class={cn(thumbClass, 'top-1/2 -translate-x-1/2 -translate-y-1/2')}
					style={`left:${hsv.a * 100}%; background:${opaqueHex}`}
					aria-hidden="true"
				></span>
			</div>
		{/if}

		<div class="grid grid-cols-[auto_auto_1fr] items-center gap-2" data-slot="color-picker-input">
			<Button
				type="button"
				variant="outline"
				size="sm"
				class="w-12 px-0 font-code text-xs"
				{disabled}
				aria-label={l.format}
				onclick={() => (format = format === 'hex' ? 'rgb' : format === 'rgb' ? 'hsl' : 'hex')}
			>
				{format.toUpperCase()}
			</Button>
			<span
				class="size-8 rounded-md border border-input motion-state"
				style={`background:${hex}`}
				aria-hidden="true"
			></span>
			<Input
				class="h-8 font-code"
				value={invalid ? textValue : displayText}
				{disabled}
				aria-label={l.colorValue}
				aria-invalid={invalid}
				aria-describedby={invalid ? `${uid}-invalid` : undefined}
				oninput={textChange}
			/>
			{#if invalid}
				<small id={`${uid}-invalid`} role="alert" class="col-span-full text-xs text-destructive">
					{l.invalid}
				</small>
			{/if}
		</div>

		{#if swatches.length}
			{@render swatchGrid()}
		{/if}
	{/if}
</div>
