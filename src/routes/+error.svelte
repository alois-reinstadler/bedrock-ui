<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import * as Empty from '#lib/bedrock/ui/empty';
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Text } from '#lib/bedrock/ui/text';

	let { error }: { error: App.Error } = $props();
	const title = $derived(error.status === 404 ? 'Page not found' : 'Unable to load this page');
	const description = $derived(
		error.status === 404
			? 'This page may have moved, or the address may be incorrect. Browse the documentation or return to the home page.'
			: 'Something went wrong while loading this page. Try again, or return to the home page.'
	);
</script>

<svelte:head>
	<title>{error.status} · {title} — Bedrock</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto flex min-h-svh w-full max-w-3xl items-center px-4 py-12 sm:px-6">
	<Empty.Root class="border bg-card">
		<Empty.Header>
			<Text type="supporting" color="muted">Error {error.status}</Text>
			<Heading level={1} visual={2}>{title}</Heading>
			<Empty.Description>{description}</Empty.Description>
		</Empty.Header>
		<Empty.Content>
			<div class="flex flex-wrap justify-center gap-3">
				{#if error.status !== 404}
					<Button onclick={() => window.location.reload()}>Try again</Button>
				{/if}
				<Button
					href="/"
					variant={error.status === 404 ? 'default' : 'outline'}
					data-sveltekit-reload>Go home</Button
				>
				<Button href="/docs" variant="outline" data-sveltekit-reload>Browse documentation</Button>
			</div>
		</Empty.Content>
	</Empty.Root>
</main>
