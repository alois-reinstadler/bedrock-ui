<script lang="ts">
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	let {
		code,
		label = 'Code',
		language = 'plaintext',
		lineNumbers = false,
		maxHeight
	}: {
		code: string;
		label?: string;
		language?: string;
		lineNumbers?: boolean;
		maxHeight?: number | string;
	} = $props();

	let repeatsLanguage = $derived(label.trim().toLowerCase() === language.trim().toLowerCase());
</script>

<CodeBlock
	{code}
	title={repeatsLanguage ? undefined : label}
	{language}
	{lineNumbers}
	{maxHeight}
	labels={repeatsLanguage ? { language: () => label } : undefined}
/>
