<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import * as Field from '#lib/bedrock/ui/field';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	let {
		title = 'Sign in',
		pending = false,
		onSubmit,
		recoveryHref
	}: {
		title?: string;
		pending?: boolean;
		onSubmit: (values: { email: string; password: string }) => void | Promise<void>;
		recoveryHref?: string;
	} = $props();
	const id = $props.id();
	let email = $state('');
	let password = $state('');
	let working = $state(false);
	let message = $state('');
	let failed = $state(false);
	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (pending || working) return;
		working = true;
		message = '';
		failed = false;
		try {
			await onSubmit({ email, password });
			password = '';
			message = 'Signed in successfully.';
		} catch {
			failed = true;
			message = 'Sign-in failed. Check your credentials and try again.';
		} finally {
			working = false;
		}
	}
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header
		><Card.Title>{title}</Card.Title><Card.Description
			>Use your workspace credentials to continue.</Card.Description
		></Card.Header
	>
	<Card.Content>
		<form onsubmit={submit} aria-busy={pending || working} class="space-y-4">
			<Field.Field
				><Field.Label for={`${id}-email`}>Email</Field.Label><Input
					id={`${id}-email`}
					name="email"
					type="email"
					autocomplete="username"
					required
					value={email}
					oninput={(event) => (email = event.currentTarget.value)}
				/></Field.Field
			>
			<Field.Field
				><Field.Label for={`${id}-password`}>Password</Field.Label><Input
					id={`${id}-password`}
					name="password"
					type="password"
					autocomplete="current-password"
					required
					value={password}
					oninput={(event) => (password = event.currentTarget.value)}
				/></Field.Field
			>
			<Button type="submit" disabled={pending || working} class="w-full"
				>{pending || working ? 'Signing in…' : failed ? 'Try again' : 'Sign in'}</Button
			>
			<p role="status" class="text-sm text-muted-foreground">{message}</p>
		</form>
	</Card.Content>
	{#if recoveryHref}<Card.Footer
			><Button href={recoveryHref} variant="link">Forgot your password?</Button></Card.Footer
		>{/if}
</Card.Root>
