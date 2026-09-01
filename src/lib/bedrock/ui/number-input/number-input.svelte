<script lang="ts" module>
	const defaultLabels = {
		increment: 'Increase',
		decrement: 'Decrease',
		clear: 'Clear'
	};

	export type NumberInputLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as InputGroup from '#lib/bedrock/ui/input-group';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { formatNumber, parseLocaleNumber } from './number-format.js';

	export type NumberInputProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: number | null;
		onValueChange?: (value: number | null) => void;
		locale?: string;
		formatOptions?: Intl.NumberFormatOptions;
		min?: number;
		max?: number;
		step?: number;
		steppers?: boolean;
		integer?: boolean;
		unit?: string;
		clearable?: boolean;
		disabled?: boolean;
		readonly?: boolean;
		placeholder?: string;
		id?: string;
		name?: string;
		'aria-label'?: string;
		'aria-labelledby'?: string;
		labels?: NumberInputLabels;
	};

	let {
		value = $bindable(null),
		onValueChange,
		locale = 'en-US',
		formatOptions,
		min,
		max,
		step = 1,
		steppers = false,
		integer = false,
		unit,
		clearable = false,
		disabled = false,
		readonly = false,
		placeholder,
		id,
		name,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		labels: labelOverrides = {},
		ref = $bindable(null),
		class: className,
		...restProps
	}: NumberInputProps = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	let inputRef = $state<HTMLInputElement | null>(null);
	let focused = $state(false);

	function formatted(current: number | null): string {
		return current === null ? '' : formatNumber(current, locale, formatOptions);
	}

	let text = $derived(formatted(value));

	function constrain(next: number): number {
		let constrained = integer ? Math.round(next) : next;
		if (min !== undefined) constrained = Math.max(min, constrained);
		if (max !== undefined) constrained = Math.min(max, constrained);
		return constrained;
	}

	function updateValue(next: number | null): void {
		if (Object.is(value, next)) return;
		value = next;
		onValueChange?.(next);
	}

	function commit(): void {
		const empty = text.trim() === '';
		const parsed = parseLocaleNumber(text, locale);
		if (empty) updateValue(null);
		else if (parsed !== null) updateValue(constrain(parsed));
		text = formatted(value);
		if (inputRef) inputRef.value = text;
	}

	function stepValue(direction: 1 | -1, multiplier = 1): void {
		if (disabled || readonly) return;
		const base = value ?? 0;
		updateValue(constrain(base + direction * step * multiplier));
		text = focused ? String(value ?? '') : formatted(value);
	}

	function handleFocus(event: FocusEvent): void {
		inputRef = event.currentTarget as HTMLInputElement;
		focused = true;
		text = value === null ? '' : String(value);
	}

	function handleInput(event: Event): void {
		text = (event.currentTarget as HTMLInputElement).value;
	}

	function handleBlur(): void {
		commit();
		focused = false;
		text = formatted(value);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			event.preventDefault();
			commit();
			inputRef?.select();
		} else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
			event.preventDefault();
			stepValue(event.key === 'ArrowUp' ? 1 : -1, event.shiftKey ? 10 : 1);
		}
	}

	function keepInputFocus(event: MouseEvent): void {
		event.preventDefault();
		inputRef ??= (event.currentTarget as HTMLElement)
			.closest('[data-slot="number-input"]')
			?.querySelector('input') as HTMLInputElement | null;
		inputRef?.focus();
	}

	function clear(): void {
		if (disabled || readonly) return;
		updateValue(null);
		text = '';
		inputRef?.focus();
	}

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<InputGroup.Root {@attach setRef} class={cn(className)} data-slot="number-input" {...restProps}>
	<InputGroup.Input
		value={text}
		{id}
		type="text"
		inputmode={integer ? 'numeric' : 'decimal'}
		{disabled}
		{readonly}
		{placeholder}
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby}
		onfocus={handleFocus}
		oninput={handleInput}
		onblur={handleBlur}
		onkeydown={handleKeydown}
	/>
	{#if unit}
		<InputGroup.Addon align="inline-end" class="motion-state">{unit}</InputGroup.Addon>
	{/if}
	{#if clearable && value !== null}
		<InputGroup.Addon align="inline-end" class="motion-state">
			<InputGroup.Button
				size="icon-xs"
				aria-label={labels.clear}
				class="tap-target"
				disabled={disabled || readonly}
				onmousedown={keepInputFocus}
				onclick={clear}
			>
				<Icon icon="close" />
			</InputGroup.Button>
		</InputGroup.Addon>
	{/if}
	{#if steppers}
		<InputGroup.Addon align="inline-end" class="gap-0 motion-state">
			<InputGroup.Button
				size="icon-xs"
				aria-label={labels.increment}
				class="tap-target"
				disabled={disabled || readonly}
				onmousedown={keepInputFocus}
				onclick={() => stepValue(1)}
			>
				<Icon icon="chevronUp" />
			</InputGroup.Button>
			<InputGroup.Button
				size="icon-xs"
				aria-label={labels.decrement}
				class="tap-target"
				disabled={disabled || readonly}
				onmousedown={keepInputFocus}
				onclick={() => stepValue(-1)}
			>
				<Icon icon="chevronDown" />
			</InputGroup.Button>
		</InputGroup.Addon>
	{/if}
</InputGroup.Root>

{#if name}
	<input type="hidden" {name} value={value ?? ''} {disabled} />
{/if}
