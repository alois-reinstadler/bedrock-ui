<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { getStepperContext } from './context.js';

	let {
		ref = $bindable(null),
		class: className,
		step,
		label,
		description,
		optional = false,
		disabled = false,
		status,
		indicator,
		children,
		...restProps
	}: WithElementRef<HTMLLiAttributes, HTMLLIElement> & {
		/** Zero-based index of this step within the stepper. */
		step: number;
		label: string;
		description?: string;
		/** Renders a muted "Optional" suffix (localizable via stepper labels). */
		optional?: boolean;
		disabled?: boolean;
		/** Recolors the indicator only — never the connector. */
		status?: 'success' | 'warning' | 'error';
		/** Replaces the default mark inside the same fixed-size box. */
		indicator?: Snippet;
		/** Vertical orientation only: content below the label, indented. */
		children?: Snippet;
	} = $props();

	const context = getStepperContext();
	$effect(() => context.register(step));

	const activeStep = $derived(context.getActiveStep());
	const orientation = $derived(context.getOrientation());
	const labels = $derived(context.getLabels());
	const onStepClick = $derived(context.getOnStepClick());

	const completed = $derived(step < activeStep);
	const current = $derived(step === activeStep);
	/** The leading connector covers the segment from step - 1 to this step. */
	const filled = $derived(step <= activeStep);
	const animated = $derived(context.getAnimatedStep() === step);
	const clickable = $derived(onStepClick !== undefined && !disabled);

	const statusText = $derived(
		status === 'success'
			? labels.statusSuccess
			: status === 'warning'
				? labels.statusWarning
				: status === 'error'
					? labels.statusError
					: undefined
	);

	const indicatorClass = $derived(
		cn(
			'motion-state flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium tabular-nums',
			indicator === undefined && 'border',
			indicator === undefined &&
				status === undefined && [
					completed && 'border-primary bg-primary text-primary-foreground',
					current && 'border-primary text-primary',
					!completed && !current && 'border-border bg-background text-muted-foreground'
				],
			indicator === undefined && [
				status === 'success' && 'border-emerald-600 bg-emerald-600 text-white',
				status === 'warning' && 'border-amber-500 bg-amber-500 text-white',
				status === 'error' && 'border-destructive bg-destructive text-white'
			],
			current && 'ring-2 ring-ring ring-offset-2 ring-offset-background'
		)
	);
</script>

{#snippet connector()}
	<div
		data-slot="stepper-connector"
		aria-hidden="true"
		class={cn(
			'overflow-hidden rounded-full bg-muted',
			orientation === 'horizontal' ? 'h-1 min-w-6 flex-1' : 'ml-2.5 h-6 w-1'
		)}
	>
		<div
			data-animated={animated ? 'true' : undefined}
			class={cn(
				'h-full w-full bg-primary',
				orientation === 'horizontal'
					? [filled ? 'scale-x-100' : 'scale-x-0', 'origin-left']
					: [filled ? 'scale-y-100' : 'scale-y-0', 'origin-top'],
				animated && 'bedrock-step-fill'
			)}
		></div>
	</div>
{/snippet}

{#snippet mark()}
	<span data-slot="stepper-indicator" class={indicatorClass}>
		{#if indicator}
			{@render indicator()}
		{:else if completed}
			<Icon icon="check" class="size-3.5" />
		{:else}
			{step + 1}
		{/if}
	</span>
{/snippet}

{#snippet text()}
	<span class="flex min-w-0 flex-col text-left">
		<span class="flex items-baseline gap-1.5 text-sm font-medium">
			<span class="truncate">{label}</span>
			{#if optional}
				<span class="text-xs font-normal text-muted-foreground">{labels.optional}</span>
			{/if}
		</span>
		{#if description}
			<span class="text-xs text-muted-foreground">{description}</span>
		{/if}
	</span>
{/snippet}

<li
	bind:this={ref}
	data-slot="stepper-step"
	data-status={status}
	aria-current={current ? 'step' : undefined}
	class={cn(
		orientation === 'horizontal'
			? ['flex items-center gap-3', step > 0 && 'min-w-0 flex-1']
			: 'flex flex-col gap-2',
		className
	)}
	{...restProps}
>
	{#if step > 0}
		{@render connector()}
	{/if}
	{#if clickable}
		<button
			type="button"
			class="tap-target flex items-center gap-3 rounded-md motion-state"
			onclick={() => onStepClick?.(step)}
		>
			{@render mark()}
			{@render text()}
		</button>
	{:else}
		<div class={cn('flex items-center gap-3', disabled && 'opacity-50')}>
			{@render mark()}
			{@render text()}
		</div>
	{/if}
	{#if completed}
		<span class="sr-only">{labels.completed}</span>
	{:else if current}
		<span class="sr-only">{labels.current}</span>
	{/if}
	{#if statusText}
		<span class="sr-only">{statusText}</span>
	{/if}
	{#if orientation === 'vertical' && children}
		<div data-slot="stepper-step-content" class="pb-1 pl-9">
			{@render children()}
		</div>
	{/if}
</li>

<style>
	/* Single-step advances only: the fill sweeps along the track from the
	   start edge. The reveal token collapses to 0.01ms under
	   prefers-reduced-motion, so reduced motion commits instantly. */
	.bedrock-step-fill {
		transition-property: transform;
		transition-duration: var(--motion-reveal);
		transition-timing-function: var(--motion-ease-enter);
	}
</style>
