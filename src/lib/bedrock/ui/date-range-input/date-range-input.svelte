<script lang="ts" module>
	import type { DateRange } from 'bits-ui';
	import type { DateValue } from '@internationalized/date';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';
	const defaultLabels = { openCalendar: 'Open calendar', clear: 'Clear' };
	export type DateRangeInputLabels = Partial<typeof defaultLabels>;
	export type DateRangeInputValue = DateRange;
	export type DateRangePreset = { label: string; range: () => DateRange };
	export type DateRangeInputProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: DateRange;
		onValueChange?: (value: DateRange | undefined) => void;
		open?: boolean;
		min?: DateValue;
		max?: DateValue;
		disabled?: boolean;
		readonly?: boolean;
		locale?: string;
		name?: string;
		labels?: DateRangeInputLabels;
		clearable?: boolean;
		numberOfMonths?: 1 | 2;
		presets?: DateRangePreset[];
	};
</script>

<script lang="ts">
	import { DateRangePicker } from 'bits-ui';
	import { RangeCalendar } from '#lib/bedrock/ui/range-calendar';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn } from '#lib/utils.js';
	let {
		ref = $bindable(null),
		value = $bindable(),
		onValueChange,
		open = $bindable(false),
		min,
		max,
		disabled = false,
		readonly = false,
		locale = 'en-US',
		name,
		class: className,
		labels: labelOverrides,
		clearable = false,
		numberOfMonths = 2,
		presets = [],
		...restProps
	}: DateRangeInputProps = $props();
	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	function change(next: DateRange | undefined) {
		value = next;
		onValueChange?.(next);
	}
	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<DateRangePicker.Root
	bind:value
	bind:open
	onValueChange={change}
	minValue={min}
	maxValue={max}
	{disabled}
	{readonly}
	{locale}
	{numberOfMonths}
>
	<div
		{@attach setRef}
		data-slot="date-range-input"
		class={cn(
			'flex h-8 w-full items-center rounded-md border border-input bg-background text-sm shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-3 has-[[aria-invalid=true]]:ring-destructive/20',
			className
		)}
		{...restProps}
	>
		<DateRangePicker.Input type="start" {name} class="flex min-w-0 flex-1 items-center pl-2">
			{#snippet children({
				segments
			})}{#each segments as segment, index (`${segment.part}-${index}`)}<DateRangePicker.Segment
						part={segment.part}
						class="rounded px-0.5 tabular-nums outline-none focus:bg-accent focus:text-accent-foreground"
					/>{/each}{/snippet}
		</DateRangePicker.Input><span aria-hidden="true" class="text-muted-foreground">–</span>
		<DateRangePicker.Input type="end" class="flex min-w-0 flex-1 items-center pr-2">
			{#snippet children({
				segments
			})}{#each segments as segment, index (`${segment.part}-${index}`)}<DateRangePicker.Segment
						part={segment.part}
						class="rounded px-0.5 tabular-nums outline-none focus:bg-accent focus:text-accent-foreground"
					/>{/each}{/snippet}
		</DateRangePicker.Input>
		{#if clearable && value}<button
				type="button"
				class="tap-target inline-flex size-7 items-center justify-center rounded-md motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label={labels.clear}
				{disabled}
				onclick={() => change(undefined)}><Icon icon="close" /></button
			>{/if}
		<DateRangePicker.Trigger
			class="tap-target inline-flex size-7 items-center justify-center rounded-md motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none"
			aria-label={labels.openCalendar}
			{disabled}><Icon icon="calendar" /></DateRangePicker.Trigger
		>
	</div>
	<DateRangePicker.Content
		class="z-50 flex motion-popover rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
	>
		{#if presets.length}<div class="flex min-w-28 flex-col gap-1 border-r border-border p-1">
				{#each presets as preset (preset.label)}<button
						type="button"
						class="rounded-md px-2 py-1.5 text-left text-sm motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						onclick={() => {
							change(preset.range());
							open = false;
						}}>{preset.label}</button
					>{/each}
			</div>{/if}
		<RangeCalendar
			minValue={min}
			maxValue={max}
			{disabled}
			{readonly}
			{locale}
			{numberOfMonths}
			onValueChange={(next) => change(next)}
		/>
	</DateRangePicker.Content>
</DateRangePicker.Root>
