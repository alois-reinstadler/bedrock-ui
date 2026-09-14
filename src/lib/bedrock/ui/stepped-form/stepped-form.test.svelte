<script lang="ts">
	import * as SteppedForm from './index.js';
	import type { SteppedFormStepDefinition } from './index.js';

	let {
		validateStep,
		onSubmit,
		canNavigate,
		persistence,
		keepDetailsMounted = false,
		onValueChange
	}: {
		validateStep?: SteppedForm.SteppedFormValidator;
		onSubmit?: SteppedForm.SteppedFormProps['onSubmit'];
		canNavigate?: SteppedForm.SteppedFormProps['canNavigate'];
		persistence?: SteppedForm.SteppedFormPersistence;
		keepDetailsMounted?: boolean;
		onValueChange?: SteppedForm.SteppedFormProps['onValueChange'];
	} = $props();

	let value = $state<string>();
	let disableDetails = $state(false);
	let includeDetails = $state(true);
	let steps = $derived<SteppedFormStepDefinition[]>([
		{ id: 'account', title: 'Account' },
		...(includeDetails ? [{ id: 'details', title: 'Details', disabled: disableDetails }] : []),
		{ id: 'review', title: 'Review' }
	]);
</script>

<button data-testid="remove-details" onclick={() => (includeDetails = false)}>Remove details</button
>
<button data-testid="disable-details" onclick={() => (disableDetails = true)}
	>Disable details</button
>
<button data-testid="enable-details" onclick={() => (disableDetails = false)}>Enable details</button
>
<button data-testid="control-review" onclick={() => (value = 'review')}>Control review</button>
<output data-testid="controlled-value">{value}</output>
<SteppedForm.Root
	bind:value
	{onValueChange}
	{steps}
	{validateStep}
	{onSubmit}
	{canNavigate}
	{persistence}
	nonlinear
>
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
	{#if includeDetails || keepDetailsMounted}
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
