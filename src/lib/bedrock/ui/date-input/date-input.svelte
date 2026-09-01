<script lang="ts" module>
	import type { CalendarDate, DateValue } from '@internationalized/date';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';

	const defaultLabels = { openCalendar: 'Open calendar', clear: 'Clear' };
	export type DateInputLabels = Partial<typeof defaultLabels>;
	export type DateInputValue = CalendarDate;
	export type DateInputProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: DateInputValue;
		onValueChange?: (value: DateInputValue | undefined) => void;
		open?: boolean;
		min?: DateInputValue;
		max?: DateInputValue;
		disabled?: boolean;
		readonly?: boolean;
		locale?: string;
		name?: string;
		labels?: DateInputLabels;
		clearable?: boolean;
		numberOfMonths?: 1 | 2;
	};
</script>

<script lang="ts">
	import { DatePicker } from 'bits-ui';
	import { Calendar } from '#lib/bedrock/ui/calendar';
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
		numberOfMonths = 1,
		...restProps
	}: DateInputProps = $props();
	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	function change(next: DateInputValue | undefined) {
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

<DatePicker.Root
	bind:value
	bind:open
	onValueChange={(next: DateValue | undefined) => change(next as DateInputValue | undefined)}
	minValue={min}
	maxValue={max}
	{disabled}
	{readonly}
	{locale}
	{numberOfMonths}
>
	<div
		{@attach setRef}
		data-slot="date-input"
		class={cn(
			'flex h-8 w-full items-center rounded-md border border-input bg-background text-sm shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-3 has-[[aria-invalid=true]]:ring-destructive/20',
			className
		)}
		{...restProps}
	>
		<DatePicker.Input {name} class="flex min-w-0 flex-1 items-center px-2">
			{#snippet children({ segments })}
				{#each segments as segment, index (`${segment.part}-${index}`)}<DatePicker.Segment
						part={segment.part}
						class="rounded px-0.5 tabular-nums outline-none focus:bg-accent focus:text-accent-foreground"
						>{segment.value}</DatePicker.Segment
					>{/each}
			{/snippet}
		</DatePicker.Input>
		{#if clearable && value}<button
				type="button"
				class="tap-target inline-flex size-7 items-center justify-center rounded-md motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label={labels.clear}
				{disabled}
				onclick={() => change(undefined)}><Icon icon="close" /></button
			>{/if}
		<DatePicker.Trigger
			class="tap-target inline-flex size-7 items-center justify-center rounded-md motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none"
			aria-label={labels.openCalendar}
			{disabled}><Icon icon="calendar" /></DatePicker.Trigger
		>
	</div>
	<DatePicker.Content
		class="z-50 motion-popover rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10"
	>
		<Calendar
			type="single"
			{value}
			minValue={min}
			maxValue={max}
			{disabled}
			{readonly}
			{locale}
			{numberOfMonths}
			onValueChange={(next: DateValue | undefined) => {
				change(next as DateInputValue | undefined);
				open = false;
			}}
		/>
	</DatePicker.Content>
</DatePicker.Root>
