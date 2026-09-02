<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Step, Stepper } from '#lib/bedrock/ui/stepper';

	let activeStep = $state(1);
</script>

<div class="flex w-full max-w-xl flex-col gap-6">
	<Stepper {activeStep} label="Document flow">
		<Step step={0} label="Upload" description="Add the source files" />
		<Step step={1} label="Details" optional />
		<Step step={2} label="Review" />
		<Step step={3} label="Sign" />
	</Stepper>
	<div class="flex gap-2">
		<Button
			variant="outline"
			size="sm"
			disabled={activeStep === 0}
			onclick={() => (activeStep -= 1)}
		>
			Back
		</Button>
		<Button size="sm" disabled={activeStep === 3} onclick={() => (activeStep += 1)}>Next</Button>
	</div>
</div>
