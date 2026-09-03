<script lang="ts">
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	let {
		code,
		label = 'Code',
		language = 'plaintext'
	}: { code: string; label?: string; language?: string } = $props();
</script>

<CodeBlock {code} title={label} {language} />
