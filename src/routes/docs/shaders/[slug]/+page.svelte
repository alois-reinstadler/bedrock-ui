<script lang="ts">
	import ShaderPlayground from '#lib/site/ShaderPlayground.svelte';
	let { data } = $props();
</script>

<svelte:head
	><title>{data.shader.title} Shader — Bedrock</title><meta
		name="description"
		content={data.shader.description}
	/></svelte:head
>
{#key data.shader.slug}<ShaderPlayground shader={data.shader} />{/key}
