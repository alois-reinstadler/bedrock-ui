<script lang="ts">
	import { Diff } from '#lib/bedrock/ui/diff';
	const before = [
		'# Bedrock UI',
		'',
		'Reusable interface components for Svelte.',
		'',
		'## Requirements',
		'',
		'- Svelte `^5.30.0`',
		'- TypeScript with strict mode enabled',
		'- pnpm `10`',
		'',
		'## Project setup',
		'',
		'Create a SvelteKit project before installing the components.',
		'Keep your application source in the src directory.',
		'Choose the adapter that matches your deployment target.',
		'',
		'### Styling',
		'',
		'Import the base stylesheet in your root layout.',
		'Use the shared tokens for spacing and color.',
		'Both light and dark themes are supported.',
		'',
		'## Installation',
		'',
		'Install the component package:',
		'',
		'```sh',
		'pnpm add bedrock-ui',
		'```',
		'',
		'Import components from their individual entry points.',
		''
	].join('\n');
	const after = before
		.replace('^5.30.0', '^5.57.0')
		.replace('pnpm `10`', 'pnpm `11`')
		.replace('pnpm add bedrock-ui', 'pnpm add bedrock-ui@1.2.0');
</script>

<Diff {before} {after} language="markdown" title="README.md" />
