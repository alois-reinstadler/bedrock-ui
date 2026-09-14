<script lang="ts">
	import * as Form from '#lib/bedrock/ui/form';
	import { Input } from '#lib/bedrock/ui/input';
	import { onMount } from 'svelte';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';

	type Profile = { email: string };

	const initial: SuperValidated<Profile> = {
		id: 'docs-profile',
		valid: true,
		posted: false,
		errors: {},
		data: { email: 'ada@example.com' },
		constraints: { email: { required: true } }
	};
	let form = $state<SuperForm<Profile>>();
	let email = $state(initial.data.email);

	onMount(() => {
		form = superForm(initial, { SPA: true, validators: false });
	});

	let saved = $state(false);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Account recovery email</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Keep field-level guidance next to the control, then confirm the submitted value without
			leaving the settings page.
		</p>
	</header>

	{#if form}
		<form
			class="w-full max-w-sm space-y-5"
			onsubmit={(event) => {
				event.preventDefault();
				saved = true;
			}}
		>
			<Form.Field {form} name="email">
				{#snippet children({ constraints })}
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email address</Form.Label>
							<Input
								{...props}
								{...constraints}
								type="email"
								value={email}
								oninput={(event) => (email = event.currentTarget.value)}
							/>
						{/snippet}
					</Form.Control>
					<Form.Description>Used for account alerts and recovery.</Form.Description>
					<Form.FieldErrors />
				{/snippet}
			</Form.Field>
			<Form.Button>Save recovery email</Form.Button>
			<p role="status" class="text-sm">
				{saved ? `Recovery email updated to ${email} in this local demo.` : ''}
			</p>
		</form>
	{:else}
		<div class="h-32 w-full max-w-sm rounded-lg bg-muted" aria-label="Loading form"></div>
	{/if}
</section>
