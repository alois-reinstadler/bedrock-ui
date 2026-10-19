<script lang="ts">
	import type { Snippet } from 'svelte';
	import { createCodeSource, plainLines, type CodeLineData } from './highlight';

	type Props = {
		/** Complete source text, including unchanged lines needed by the grammar. */
		code: string;
		language?: string;
		/** Own the layout while reusing CodeBlock's highlighter and line renderer. */
		children: Snippet<[lines: readonly CodeLineData[]]>;
	};

	let { code, language = 'plaintext', children }: Props = $props();
	let highlighted = $state.raw<{
		code: string;
		language: string;
		lines: readonly CodeLineData[];
	}>();
	// Plaintext is synchronous even in SSR and speculative route forks, where
	// subscription effects have not started. Never expose a previous source's tokens.
	const lines = $derived(
		highlighted?.code === code && highlighted.language === language
			? highlighted.lines
			: plainLines(code)
	);
	// The external store owns async work; the effect owns its unsubscribe lifecycle.
	function subscribeSource() {
		const currentCode = code;
		const currentLanguage = language;
		return createCodeSource(currentCode, currentLanguage).subscribe((lines) => {
			highlighted = { code: currentCode, language: currentLanguage, lines };
		});
	}
	$effect(subscribeSource);
</script>

{@render children(lines)}
