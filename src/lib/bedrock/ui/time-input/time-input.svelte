<script lang="ts" module>
	import type { Time } from '@internationalized/date';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '#lib/utils.js';
	const defaultLabels = { clear: 'Clear' };
	export type TimeInputLabels = Partial<typeof defaultLabels>;
	export type TimeInputValue = Time;
	export type TimeInputProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: TimeInputValue;
		onValueChange?: (value: TimeInputValue | undefined) => void;
		min?: TimeInputValue;
		max?: TimeInputValue;
		disabled?: boolean;
		readonly?: boolean;
		locale?: string;
		name?: string;
		labels?: TimeInputLabels;
		clearable?: boolean;
		hourCycle?: 12 | 24;
		granularity?: 'hour' | 'minute' | 'second';
	};
</script>

<script lang="ts">
	import { TimeField } from 'bits-ui';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn } from '#lib/utils.js';
	let {
		ref = $bindable(null),
		value = $bindable(),
		onValueChange,
		min,
		max,
		disabled = false,
		readonly = false,
		locale = 'en-US',
		name,
		class: className,
		labels: labelOverrides,
		clearable = false,
		hourCycle,
		granularity = 'minute',
		...restProps
	}: TimeInputProps = $props();
	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	function change(next: TimeInputValue | undefined) {
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

<TimeField.Root
	bind:value
	onValueChange={change}
	minValue={min}
	maxValue={max}
	{disabled}
	{readonly}
	{locale}
	{hourCycle}
	{granularity}
>
	<div
		{@attach setRef}
		data-slot="time-input"
		class={cn(
			'flex h-8 w-full items-center rounded-md border border-input bg-background text-sm shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:cursor-not-allowed has-disabled:opacity-50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:ring-3 has-[[aria-invalid=true]]:ring-destructive/20',
			className
		)}
		{...restProps}
	>
		<Icon icon="clock" class="ml-2 text-muted-foreground" />
		<TimeField.Input {name} class="flex min-w-0 flex-1 items-center px-2">
			{#snippet children({
				segments
			})}{#each segments as segment, index (`${segment.part}-${index}`)}<TimeField.Segment
						part={segment.part}
						class="rounded px-0.5 tabular-nums outline-none focus:bg-accent focus:text-accent-foreground"
					/>{/each}{/snippet}
		</TimeField.Input>
		{#if clearable && value}<button
				type="button"
				class="tap-target inline-flex size-7 items-center justify-center rounded-md motion-state hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label={labels.clear}
				{disabled}
				onclick={() => change(undefined)}><Icon icon="close" /></button
			>{/if}
	</div>
</TimeField.Root>
