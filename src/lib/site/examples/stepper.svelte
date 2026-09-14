<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { Step, Stepper } from '#lib/bedrock/ui/stepper';

	let activeStep = $state(1);
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Prepare a document for signature</h3>
		<p class="text-sm text-muted-foreground">
			Progress describes the document workflow. Navigation changes the current task; use Stepped
			Form when validation must coordinate form sections.
		</p>
	</div>

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

	<div class="rounded-lg border bg-card p-4">
		<h4 class="font-medium">
			{[
				'Upload the source document',
				'Add document details',
				'Review the agreement',
				'Send for signature'
			][activeStep]}
		</h4>
		<p class="mt-2 text-sm text-muted-foreground">
			{[
				'Accepted formats: PDF and DOCX, up to 10 MB.',
				'Add a descriptive name so recipients can identify the agreement.',
				'Check the recipient list and all document pages before sending.',
				'The document is ready for the recipients to sign.'
			][activeStep]}
		</p>
	</div>
</section>
