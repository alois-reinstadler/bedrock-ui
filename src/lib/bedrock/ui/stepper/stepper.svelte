<script lang="ts" module>
	const defaultLabels = {
		optional: 'Optional',
		completed: 'Completed',
		current: 'Current step',
		statusSuccess: 'Success',
		statusWarning: 'Warning',
		statusError: 'Error'
	};

	export type StepperLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import type { HTMLOlAttributes } from 'svelte/elements';
	import { setStepperContext } from './context.js';

	/**
	 * Multi-step progress for document flows. An ordered list with an
	 * accessible label — deliberately not a nav landmark.
	 */
	let {
		ref = $bindable(null),
		class: className,
		activeStep,
		onStepClick,
		orientation = 'horizontal',
		label = 'Progress',
		labels: labelOverrides = {},
		children,
		...restProps
	}: WithElementRef<HTMLOlAttributes, HTMLOListElement> & {
		/** Zero-based current step; earlier steps count as completed. */
		activeStep: number;
		/** When set, non-disabled steps become buttons for non-linear nav. */
		onStepClick?: (index: number) => void;
		orientation?: 'horizontal' | 'vertical';
		/** Accessible name of the ordered list. */
		label?: string;
		labels?: StepperLabels;
		children?: Snippet;
	} = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });

	// Only an advance by exactly one step animates the newly covered segment.
	// Mount (lastActiveStep still null), going back, and jumps commit
	// instantly: any delta other than +1 clears the flag.
	let lastActiveStep: number | null = null;
	let animatedStep = $state<number | null>(null);
	$effect.pre(() => {
		const current = activeStep;
		if (current !== lastActiveStep) {
			animatedStep = lastActiveStep !== null && current === lastActiveStep + 1 ? current : null;
			lastActiveStep = current;
		}
	});

	const registeredSteps = new SvelteSet<number>();

	setStepperContext({
		register: (step) => {
			registeredSteps.add(step);
			return () => {
				registeredSteps.delete(step);
			};
		},
		getActiveStep: () => activeStep,
		getAnimatedStep: () => animatedStep,
		getOrientation: () => orientation,
		getOnStepClick: () => onStepClick,
		getLabels: () => labels
	});
</script>

<ol
	bind:this={ref}
	data-slot="stepper"
	data-orientation={orientation}
	aria-label={label}
	class={cn(
		'list-none text-sm',
		orientation === 'horizontal' ? 'flex w-full items-center' : 'flex flex-col',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</ol>
