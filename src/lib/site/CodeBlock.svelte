<script lang="ts">
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	let { code, label = 'Code' }: { code: string; label?: string } = $props();
</script>

<CodeBlock {code} title={label} />
