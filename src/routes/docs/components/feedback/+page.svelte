<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	const destination = '/docs/tools/page-annotations';
	onMount(() => {
		void goto(`${destination}${page.url.search}${page.url.hash}`, { replace: true });
	});
</script>

<svelte:head>
	<title>Page annotations — Bedrock</title>
	<link rel="canonical" href={destination} />
	<meta name="robots" content="noindex" />
</svelte:head>

<article class="mx-auto max-w-3xl px-4 py-10 md:px-8">
	<h1 class="text-2xl font-semibold">Page annotations has moved</h1>
	<p class="mt-4">
		Find the inspection and review tool in <a
			class="underline underline-offset-4"
			href={destination}>Tools → Page annotations</a
		>.
	</p>
</article>
