<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import { Button } from '#lib/bedrock/ui/button';

	let { code, label = 'Code' }: { code: string; label?: string } = $props();

	let copied = $state(false);

	async function copy() {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1400);
	}
</script>

<div class="overflow-hidden rounded-xl ring-1 ring-foreground/10">
	<div class="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5">
		<p class="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
		<Button variant="ghost" size="icon-xs" onclick={copy} aria-label="Copy code">
			{#if copied}
				<CheckIcon />
			{:else}
				<CopyIcon />
			{/if}
		</Button>
	</div>
	<pre class="overflow-x-auto bg-card p-4 text-[13px] leading-relaxed text-foreground"><code>{code}</code></pre>
</div>
