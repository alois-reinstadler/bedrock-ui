<script lang="ts">
	import * as SteppedForm from './index.js';
	import type { SteppedFormStepDefinition } from './index.js';

	let {
		validateStep,
		onSubmit,
		canNavigate,
		persistence
	}: {
		validateStep?: SteppedForm.SteppedFormValidator;
		onSubmit?: SteppedForm.SteppedFormProps['onSubmit'];
		canNavigate?: SteppedForm.SteppedFormProps['canNavigate'];
		persistence?: SteppedForm.SteppedFormPersistence;
	} = $props();

	let includeDetails = $state(true);
	let steps = $derived<SteppedFormStepDefinition[]>([
		{ id: 'account', title: 'Account' },
		...(includeDetails ? [{ id: 'details', title: 'Details' }] : []),
		{ id: 'review', title: 'Review' }
	]);
</script>

<button data-testid="remove-details" onclick={() => (includeDetails = false)}>Remove details</button
>
<SteppedForm.Root {steps} {validateStep} {onSubmit} {canNavigate} {persistence} nonlinear>
	<SteppedForm.Progress />
	<SteppedForm.Step id="account">
		<SteppedForm.Title>Account</SteppedForm.Title>
		<SteppedForm.Content
			><label for="email">Email</label><input
				id="email"
				name="email"
				required
			/></SteppedForm.Content
		>
		<SteppedForm.Actions><SteppedForm.Next /></SteppedForm.Actions>
	</SteppedForm.Step>
	{#if includeDetails}
		<SteppedForm.Step id="details">
			<SteppedForm.Title>Details</SteppedForm.Title>
			<SteppedForm.Content
				><label for="team">Team</label><input id="team" name="team" /></SteppedForm.Content
			>
			<SteppedForm.Actions><SteppedForm.Previous /><SteppedForm.Next /></SteppedForm.Actions>
		</SteppedForm.Step>
	{/if}
	<SteppedForm.Step id="review">
		<SteppedForm.Title>Review</SteppedForm.Title>
		<SteppedForm.Actions><SteppedForm.Previous /><SteppedForm.Submit /></SteppedForm.Actions>
	</SteppedForm.Step>
	<SteppedForm.Status />
</SteppedForm.Root>
