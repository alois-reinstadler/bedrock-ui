<script lang="ts">
	import CodeBlock from './code-block.svelte';
	const javascript = 'const answer = 42;\nconsole.log(answer);';
</script>

<CodeBlock
	code={javascript}
	language="javascript"
	title="answer.js"
	lineNumbers
	wrap
	maxHeight={120}
/>
<CodeBlock code="plain text" language="plaintext" copyButton={false} />
