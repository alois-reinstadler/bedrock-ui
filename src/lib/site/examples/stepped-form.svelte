<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
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
	const uid = $props.id();
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Create a team workspace</h3>
		<p class="text-sm text-muted-foreground">
			Complete your profile, name the workspace, and review before submitting. Go back to correct
			details without losing earlier entries.
		</p>
	</div>

	{#if submitted}
		<div
			role="status"
			class="w-full max-w-xl rounded-xl border bg-card p-8 text-center corner-theme"
		>
			<p class="text-xs font-medium text-muted-foreground">ALL SET</p>
			<h3 class="mt-3 text-2xl font-semibold">Welcome to {workspace}</h3>
			<p class="mt-3 text-sm text-muted-foreground">
				Your workspace is ready, {name}. Invite your team and start your first project.
			</p>
			<Button
				class="mt-6"
				variant="outline"
				onclick={() => {
					submitted = false;
					name = '';
					workspace = '';
				}}>Start again</Button
			>
		</div>
	{:else}
		<SteppedForm.Root
			{steps}
			class="w-full max-w-xl rounded-xl border bg-card p-5 corner-theme sm:p-7"
			validateStep={({ step }) => {
				if (step.id === 'profile' && name.trim().length < 2)
					return {
						valid: false,
						message: 'Enter your full name.',
						field: `#${CSS.escape(uid)}-name`
					};
				if (step.id === 'workspace' && !workspace.trim())
					return {
						valid: false,
						message: 'Name your workspace.',
						field: `#${CSS.escape(uid)}-workspace`
					};
				return true;
			}}
			onSubmit={async () => {
				await new Promise((resolve) => setTimeout(resolve, 500));
				submitted = true;
			}}
		>
			<SteppedForm.Progress class="border-b pb-6" />

			<SteppedForm.Step id="profile">
				<div>
					<SteppedForm.Title>Create your profile</SteppedForm.Title><SteppedForm.Description
						>We will use this to personalize your workspace.</SteppedForm.Description
					>
				</div>
				<SteppedForm.Content class="min-h-28">
					<div class="grid gap-2">
						<Label for={`${uid}-name`}>Full name</Label><Input
							id={`${uid}-name`}
							name="name"
							value={name}
							oninput={(event) => (name = event.currentTarget.value)}
							autocomplete="name"
							placeholder="Alex Morgan"
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
				<SteppedForm.Content class="min-h-28">
					<div class="grid gap-2">
						<Label for={`${uid}-workspace`}>Workspace name</Label><Input
							id={`${uid}-workspace`}
							name="workspace"
							placeholder="Studio North"
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
				<SteppedForm.Content class="min-h-28">
					<dl class="grid gap-3 rounded-lg bg-muted/50 p-4 text-sm corner-theme">
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
		</SteppedForm.Root>
	{/if}
</section>
