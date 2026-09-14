<script lang="ts">
	import * as Stepper from '#lib/bedrock/ui/stepper';
	import { cn } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSteppedFormContext } from './context.js';

	let {
		label = 'Form progress',
		orientation = 'horizontal',
		class: className,
		...restProps
	}: HTMLAttributes<HTMLElement> & {
		label?: string;
		orientation?: 'horizontal' | 'vertical';
	} = $props();
	const context = getSteppedFormContext();
	const steps = $derived(context.getSteps());
	const currentIndex = $derived(
		Math.max(
			0,
			steps.findIndex((step) => step.id === context.getCurrent())
		)
	);
</script>

<div
	data-slot="stepped-form-progress"
	class={cn('stepped-progress w-full', className)}
	{...restProps}
>
	<Stepper.Root
		activeStep={currentIndex}
		{orientation}
		{label}
		onStepClick={(index) => void context.goTo(steps[index]?.id, 'progress')}
	>
		{#each steps as step, index (step.id)}
			<Stepper.Step
				step={index}
				label={step.title}
				description={step.description}
				optional={step.optional}
				disabled={step.disabled || context.getDisabled()}
			/>
		{/each}
	</Stepper.Root>
</div>

<style>
	.stepped-progress {
		container-type: inline-size;
	}
	@container (max-width: 28rem) {
		.stepped-progress :global([data-slot='stepper']) {
			flex-direction: column;
			align-items: stretch;
			gap: 0.75rem;
		}
		.stepped-progress :global([data-slot='stepper-step']) {
			flex: none;
		}
		.stepped-progress :global([data-slot='stepper-connector']) {
			display: none;
		}
	}
</style>
