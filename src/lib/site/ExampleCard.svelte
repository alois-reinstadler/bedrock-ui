<script lang="ts">
	import { onDestroy, onMount, type Snippet } from 'svelte';
	import * as Tabs from '#lib/bedrock/ui/tabs';
	import { Button } from '#lib/bedrock/ui/button';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { copyText } from './copy-text';

	let {
		children,
		label = 'Example',
		sourceUrl,
		code,
		language = 'svelte'
	}: {
		children: Snippet;
		label?: string;
		sourceUrl?: string;
		code?: string;
		language?: string;
	} = $props();
	let active = $state('preview');
	let mounted = $state(false);
	onMount(() => {
		mounted = true;
	});
	let loaded = $state<{ code: string; html?: string }>();
	let loading = $state(false);
	let loadFailed = $state(false);
	let feedback = $state('');
	let copying = $state(false);
	let disposed = false;
	let request: Promise<{ code: string; html?: string }> | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;
	const controller = new AbortController();
	const source = $derived(code !== undefined ? { code, html: undefined } : loaded);

	async function loadSource() {
		if (source) return source;
		if (request) return request;
		loading = true;
		loadFailed = false;
		request = (async () => {
			try {
				if (!sourceUrl) throw new Error('Missing example source');
				const response = await fetch(sourceUrl, { signal: controller.signal });
				if (!response.ok) throw new Error('Source unavailable');
				const result = await response.json();
				if (typeof result.code !== 'string') throw new Error('Invalid example source');
				if (!disposed) loaded = result;
				return result as { code: string; html?: string };
			} catch (error) {
				if (!disposed) loadFailed = true;
				throw error;
			} finally {
				if (!disposed) loading = false;
				request = undefined;
			}
		})();
		return request;
	}
	function selectTab(value: string) {
		active = value;
		if (value === 'code') void loadSource().catch(() => {});
	}
	async function copy() {
		if (copying) return;
		clearTimeout(timer);
		feedback = '';
		copying = true;
		try {
			const current = await loadSource();
			if (disposed) return;
			await copyText(current.code);
			if (disposed) return;
			feedback = 'Code copied to clipboard.';
			timer = setTimeout(() => (feedback = ''), 2500);
		} catch {
			if (!disposed) feedback = 'Copy failed. Open Code and select the text to copy it manually.';
		} finally {
			if (!disposed) copying = false;
		}
	}
	onDestroy(() => {
		disposed = true;
		controller.abort();
		clearTimeout(timer);
	});
</script>

<div data-slot="example-card" class="min-w-0 overflow-hidden rounded-xl border bg-background">
	<Tabs.Root value={active} onValueChange={selectTab} class="gap-0">
		<div class="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b px-3 py-2">
			<Tabs.List variant="line" aria-label={`${label} view`}
				><Tabs.Trigger value="preview" disabled={!mounted}>Preview</Tabs.Trigger><Tabs.Trigger
					value="code"
					disabled={!mounted}>Code</Tabs.Trigger
				></Tabs.List
			>
			<Button
				variant="ghost"
				size="sm"
				onclick={copy}
				disabled={!mounted}
				aria-busy={copying}
				aria-label={`Copy code for ${label}`}
				><Icon icon={feedback === 'Code copied to clipboard.' ? 'checkDouble' : 'copy'} />{copying
					? 'Copying…'
					: feedback === 'Code copied to clipboard.'
						? 'Copied!'
						: 'Copy code'}</Button
			>
		</div>
		<Tabs.Content value="preview" class="h-96 flex-none overflow-auto p-4 sm:p-6 md:h-[28rem]">
			{@render children()}
		</Tabs.Content>
		<Tabs.Content value="code" class="h-96 flex-none overflow-auto md:h-[28rem]">
			{#if source}
				{#if source.html}
					<div class="example-source font-code text-[13px] leading-relaxed">
						<!-- Generated and escaped by the server-only Shiki highlighter. -->
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html source.html}
					</div>
				{:else}<CodeBlock
						code={source.code}
						{language}
						copyButton={false}
						container="section"
					/>{/if}
			{:else if loadFailed}
				<div class="space-y-3 p-6">
					<p role="alert">Code could not load. Check your connection and try again.</p>
					<Button variant="outline" onclick={() => void loadSource().catch(() => {})}
						>Retry loading code</Button
					>
				</div>
			{:else if loading}<p role="status" class="p-6 text-sm text-muted-foreground">
					Loading code…
				</p>{/if}
		</Tabs.Content>
	</Tabs.Root>
	<p
		role="status"
		aria-live="polite"
		aria-atomic="true"
		class={feedback ? 'border-t px-4 py-2 text-sm text-muted-foreground' : 'sr-only'}
	>
		{feedback}
	</p>
</div>

<style>
	.example-source :global(pre) {
		margin: 0;
		padding: 1.5rem;
		background: transparent !important;
	}
	.example-source :global(.shiki),
	.example-source :global(.shiki span) {
		color: var(--shiki-light);
	}
	:global(.dark) .example-source :global(.shiki),
	:global(.dark) .example-source :global(.shiki span) {
		color: var(--shiki-dark);
	}
</style>
