<script lang="ts">
	import * as SteppedForm from '#lib/bedrock/ui/stepped-form';
	const steps = [
		{ id: 'start', title: 'Details' },
		{ id: 'confirm', title: 'Confirm' }
	];
</script>

<SteppedForm.Root {steps} class="max-w-lg rounded-xl border p-5"
	><SteppedForm.Progress /><SteppedForm.Step id="start"
		><SteppedForm.Title>Details</SteppedForm.Title><SteppedForm.Description
			>A step contains its own content and navigation.</SteppedForm.Description
		><SteppedForm.Actions><SteppedForm.Next /></SteppedForm.Actions></SteppedForm.Step
	><SteppedForm.Step id="confirm"
		><SteppedForm.Title>Confirm</SteppedForm.Title><SteppedForm.Description
			>Move backward or submit the completed flow.</SteppedForm.Description
		><SteppedForm.Actions><SteppedForm.Previous /><SteppedForm.Submit /></SteppedForm.Actions
		></SteppedForm.Step
	><SteppedForm.Status /></SteppedForm.Root
>
