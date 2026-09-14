<script lang="ts">
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	const code = `type Greeting = {
  name: string;
};

const greeting: Greeting = { name: 'Bedrock' };`;
</script>

<CodeBlock {code} language="typescript" title="greeting.ts" lineNumbers />
