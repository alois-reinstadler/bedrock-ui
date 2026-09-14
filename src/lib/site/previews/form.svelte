<script lang="ts">
	import * as Form from '#lib/bedrock/ui/form';
	import { Input } from '#lib/bedrock/ui/input';
	import { onMount } from 'svelte';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';

	type Profile = { email: string };

	const initial: SuperValidated<Profile> = {
		id: 'preview-docs-profile',
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
</script>

{#if form}
	<form class="w-full max-w-sm space-y-5" onsubmit={(event) => event.preventDefault()}>
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
		<Form.Button>Save profile</Form.Button>
	</form>
{:else}
	<div
		class="h-32 w-full max-w-sm animate-pulse rounded-lg bg-muted"
		aria-label="Loading form"
	></div>
{/if}
