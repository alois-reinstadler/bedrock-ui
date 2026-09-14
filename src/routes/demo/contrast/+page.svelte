<script lang="ts">
	import { onMount } from 'svelte';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const;
	let ready = $state(false);
	onMount(() => {
		ready = true;
	});
</script>

<svelte:head><title>Rendered contrast fixtures — Bedrock</title></svelte:head>
<main id="fixture" data-ready={ready} class="p-8">
	<h1 class="mb-6 text-2xl font-medium">Rendered contrast fixtures</h1>
	<p class="mb-8">
		Badge and Button variants on page and card surfaces. This fixture supports the documented
		contrast audit.
	</p>
	{#each ['page', 'surface'] as surface (surface)}
		<section
			class={['mb-8 rounded-xl border p-6', surface === 'page' ? 'bg-background' : 'bg-card']}
		>
			<h2 class="mb-4 text-lg font-medium">{surface}</h2>
			<div class="flex flex-wrap items-center gap-6">
				{#each variants as variant (variant)}
					<div class="grid justify-items-start gap-4">
						<Badge {variant} href="#fixture" data-contrast={`badge-${surface}-${variant}`}
							>{variant} badge</Badge
						>
						<Button {variant} data-contrast={`button-${surface}-${variant}`}
							>{variant} button</Button
						>
					</div>
				{/each}
			</div>
		</section>
	{/each}
</main>
