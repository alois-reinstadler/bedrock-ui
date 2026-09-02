<script lang="ts">
	import Step from './step.svelte';
	import Stepper from './stepper.svelte';

	let {
		onStepClick,
		orientation = 'horizontal'
	}: {
		onStepClick?: (index: number) => void;
		orientation?: 'horizontal' | 'vertical';
	} = $props();

	let activeStep = $state(1);
</script>

<button data-testid="advance" onclick={() => (activeStep += 1)}>advance</button>
<button data-testid="jump" onclick={() => (activeStep += 2)}>jump</button>
<button data-testid="back" onclick={() => (activeStep -= 1)}>back</button>

<Stepper {activeStep} {onStepClick} {orientation} label="Onboarding progress">
	<Step step={0} label="Account" />
	<Step step={1} label="Documents" description="Upload the signed forms" optional />
	<Step step={2} label="Review" status="warning" />
	<Step step={3} label="Done" disabled />
</Stepper>
