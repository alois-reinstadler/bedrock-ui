<script lang="ts">
	import ExampleCard from './ExampleCard.svelte';
	import { Button } from '#lib/bedrock/ui/button';
	let { kind }: { kind: 'authentication-panel' | 'data-toolbar' | 'settings-section' } = $props();
	const loaders = {
		'authentication-panel': () => import('./block-examples/authentication-panel.svelte'),
		'data-toolbar': () => import('./block-examples/data-toolbar.svelte'),
		'settings-section': () => import('./block-examples/settings-section.svelte')
	};
	let attempt = $state(0);
	let example = $derived.by(() => {
		void attempt;
		return loaders[kind]();
	});
</script>

{#key kind}
	<ExampleCard
		label={`${kind} example`}
		sourceUrl={`/docs/examples/block-examples/${kind}/source.json`}
	>
		{#await example}
			<p role="status" class="py-8 text-sm text-muted-foreground">Loading interactive example…</p>
		{:then module}
			<module.default />
		{:catch}
			<p role="alert" class="text-sm">
				The interactive example could not load. Check your connection and try again.
			</p>
			<Button variant="outline" onclick={() => (attempt += 1)}>Retry loading example</Button>
		{/await}
	</ExampleCard>
{/key}
