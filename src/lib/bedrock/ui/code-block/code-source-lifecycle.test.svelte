<script lang="ts">
	import CodeBlock from './code-block.svelte';
	let { route }: { route: { code: string; language: string; revision: number; visible: boolean } } =
		$props();
</script>

{#if route.visible}
	{#key route.revision}
		<CodeBlock code={route.code} language={route.language} copyButton={false} />
	{/key}
{/if}
