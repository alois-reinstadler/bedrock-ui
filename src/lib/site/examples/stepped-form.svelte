<script lang="ts">
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import * as SteppedForm from '#lib/bedrock/ui/stepped-form';
	import type { SteppedFormStepDefinition } from '#lib/bedrock/ui/stepped-form';

	const steps: SteppedFormStepDefinition[] = [
		{ id: 'profile', title: 'Profile', description: 'Your basics' },
		{ id: 'workspace', title: 'Workspace', description: 'Team setup' },
		{ id: 'review', title: 'Review', description: 'Confirm details' }
	];
	let name = $state('');
	let workspace = $state('');
	let submitted = $state(false);
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Create a team workspace</h3>
		<p class="text-sm text-muted-foreground">
			Complete your profile, name the workspace, and review before submitting. Go back to correct
			details without losing earlier entries.
		</p>
	</div>

	<SteppedForm.Root
		{steps}
		class="w-full max-w-xl rounded-xl border bg-card p-5 shadow-sm sm:p-7"
		validateStep={({ step }) => {
			if (step.id === 'profile' && name.trim().length < 2)
				return { valid: false, message: 'Enter your full name.', field: '#onboarding-name' };
			if (step.id === 'workspace' && !workspace.trim())
				return { valid: false, message: 'Name your workspace.', field: '#workspace-name' };
			return true;
		}}
		onSubmit={async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			submitted = true;
		}}
	>
		<SteppedForm.Progress />

		<SteppedForm.Step id="profile">
			<div>
				<SteppedForm.Title>Create your profile</SteppedForm.Title><SteppedForm.Description
					>We will use this to personalize your workspace.</SteppedForm.Description
				>
			</div>
			<SteppedForm.Content>
				<div class="grid gap-2">
					<Label for="onboarding-name">Full name</Label><Input
						id="onboarding-name"
						name="name"
						value={name}
						oninput={(event) => (name = event.currentTarget.value)}
						autocomplete="name"
					/>
				</div>
			</SteppedForm.Content>
			<SteppedForm.Actions><span></span><SteppedForm.Next /></SteppedForm.Actions>
		</SteppedForm.Step>

		<SteppedForm.Step id="workspace">
			<div>
				<SteppedForm.Title>Name your workspace</SteppedForm.Title><SteppedForm.Description
					>You can invite teammates after setup.</SteppedForm.Description
				>
			</div>
			<SteppedForm.Content>
				<div class="grid gap-2">
					<Label for="workspace-name">Workspace name</Label><Input
						id="workspace-name"
						name="workspace"
						value={workspace}
						oninput={(event) => (workspace = event.currentTarget.value)}
					/>
				</div>
			</SteppedForm.Content>
			<SteppedForm.Actions><SteppedForm.Previous /><SteppedForm.Next /></SteppedForm.Actions>
		</SteppedForm.Step>

		<SteppedForm.Step id="review">
			<div>
				<SteppedForm.Title>Ready to go</SteppedForm.Title><SteppedForm.Description
					>Review your setup before creating the workspace.</SteppedForm.Description
				>
			</div>
			<SteppedForm.Content>
				<dl class="grid gap-3 rounded-lg bg-muted/50 p-4 text-sm">
					<div>
						<dt class="text-muted-foreground">Name</dt>
						<dd class="font-medium">{name}</dd>
					</div>
					<div>
						<dt class="text-muted-foreground">Workspace</dt>
						<dd class="font-medium">{workspace}</dd>
					</div>
				</dl>
			</SteppedForm.Content>
			<SteppedForm.Actions
				><SteppedForm.Previous /><SteppedForm.Submit>Create workspace</SteppedForm.Submit
				></SteppedForm.Actions
			>
		</SteppedForm.Step>

		<SteppedForm.Status />
		{#if submitted}<p class="text-sm font-medium text-foreground">
				Workspace created for {name}.
			</p>{/if}
	</SteppedForm.Root>
</section>
