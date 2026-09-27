<script lang="ts" module>
	import type { BundledLanguage, createHighlighter as CreateHighlighter } from 'shiki';

	const defaultLabels = {
		copy: 'Copy code',
		copied: 'Copied',
		copyFailed: 'Copy failed. Select the code to copy it manually.',
		language: (lang: string) => lang
	};

	export type CodeBlockLabels = Partial<typeof defaultLabels>;

	let shikiPromise: Promise<typeof import('shiki')> | undefined;
	function loadShiki() {
		return (shikiPromise ??= import('shiki'));
	}

	let highlighterPromise: ReturnType<typeof CreateHighlighter> | undefined;
	const highlightCache: Record<string, string> = Object.create(null);
	const highlightCacheKeys: string[] = [];
	const HIGHLIGHT_CACHE_LIMIT = 100;

	function cacheHighlight(key: string, html: string) {
		if (highlightCacheKeys.length >= HIGHLIGHT_CACHE_LIMIT) {
			const oldest = highlightCacheKeys.shift();
			if (oldest !== undefined) delete highlightCache[oldest];
		}
		highlightCacheKeys.push(key);
		highlightCache[key] = html;
	}

	function highlightCode(
		source: string,
		language: string
	): string | Promise<string | undefined> | undefined {
		if (typeof window === 'undefined') return undefined;
		const lang = language.trim().toLowerCase();
		if (!lang || lang === 'plaintext' || lang === 'text' || lang === 'txt') return undefined;
		const cacheKey = `${lang}\u0000${source}`;
		if (Object.hasOwn(highlightCache, cacheKey)) return highlightCache[cacheKey];

		return loadHighlight(source, lang, cacheKey);
	}

	async function loadHighlight(source: string, lang: string, cacheKey: string) {
		try {
			const shiki = await loadShiki();
			highlighterPromise ??= shiki.createHighlighter({
				themes: ['github-light-default', 'github-dark-default'],
				langs: []
			});
			const highlighter = await highlighterPromise;
			const bundledLanguage = lang as BundledLanguage;
			if (!highlighter.getLoadedLanguages().includes(lang)) {
				await highlighter.loadLanguage(bundledLanguage);
			}
			const html = highlighter.codeToHtml(source, {
				lang: bundledLanguage,
				themes: { light: 'github-light-default', dark: 'github-dark-default' },
				defaultColor: false
			});
			cacheHighlight(cacheKey, html);
			return html;
		} catch {
			// Unknown languages and loading failures deliberately keep the plain SSR-safe fallback.
			return undefined;
		}
	}
</script>

<script lang="ts">
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { onDestroy } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		code: string;
		language?: string;
		title?: string;
		lineNumbers?: boolean;
		wrap?: boolean;
		maxHeight?: number | string;
		copyButton?: boolean;
		container?: 'card' | 'section';
		labels?: CodeBlockLabels;
	};

	let {
		ref = $bindable(null),
		code,
		language = 'plaintext',
		title,
		lineNumbers = false,
		wrap = false,
		maxHeight,
		copyButton = true,
		container = 'card',
		labels: labelOverrides = {},
		class: className,
		...restProps
	}: Props = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const lines = $derived(code.split('\n'));
	const newline = '\n';
	const maxHeightStyle = $derived(
		maxHeight == null ? undefined : typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
	);
	const highlightedPromise = $derived(highlightCode(code, language));
	let copied = $state(false);
	let copyFailed = $state(false);
	let disposed = false;
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyCode() {
		copied = false;
		copyFailed = false;
		clearTimeout(copyTimer);
		try {
			await navigator.clipboard.writeText(code);
			if (disposed) return;
			copied = true;
			copyTimer = setTimeout(() => (copied = false), 1400);
		} catch {
			if (!disposed) copyFailed = true;
		}
	}

	function attachRef(node: HTMLDivElement) {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}

	onDestroy(() => {
		disposed = true;
		clearTimeout(copyTimer);
	});
</script>

{#snippet PlainCode()}
	<pre class={cn('m-0 p-4', wrap ? 'break-words whitespace-pre-wrap' : 'whitespace-pre')}><code
			>{#if lineNumbers}{#each lines as line, index (index)}<span class="line">{line}{newline}</span
					>{/each}{:else}{code}{/if}</code
		></pre>
{/snippet}

<div
	{@attach attachRef}
	data-slot="code-block"
	class={cn('overflow-hidden', container === 'card' && 'rounded-xl border bg-muted/30', className)}
	{...restProps}
>
	{#if title || copyButton || language !== 'plaintext'}
		<div
			data-slot="code-block-header"
			class={cn(
				'flex min-h-9 items-center justify-between gap-3 px-3 py-1.5',
				container === 'card' && 'border-b bg-muted/50'
			)}
		>
			<div class="min-w-0 font-code text-[11px] tracking-wide text-foreground/70">
				{#if title}<span class="truncate">{title}</span>{/if}
				<!-- The language label is meaningless noise for plaintext. -->
				{#if language !== 'plaintext'}
					<span class={cn(title && 'ml-2')}>{labels.language(language)}</span>
				{/if}
			</div>
			{#if copyButton}<IconButton
					icon={copied ? 'checkDouble' : 'copy'}
					label={copied ? labels.copied : labels.copy}
					size="xs"
					onclick={copyCode}
				/>{/if}
		</div>
	{/if}

	{#if copyFailed}<p role="status" class="px-3 py-2 text-xs">{labels.copyFailed}</p>{/if}
	<div
		data-slot="code-block-content"
		class={cn(
			'font-code text-[13px] leading-relaxed text-foreground',
			wrap ? 'overflow-y-auto' : 'overflow-auto',
			lineNumbers && 'line-numbers'
		)}
		style:max-height={maxHeightStyle}
	>
		{#await highlightedPromise}
			{@render PlainCode()}
		{:then highlighted}
			{#if highlighted}
				<!-- The only raw HTML here is generated by Shiki, which escapes consumer-provided code. -->
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html highlighted}
			{:else}
				{@render PlainCode()}
			{/if}
		{/await}
	</div>
</div>

<style>
	:global([data-slot='code-block-content'] .shiki span) {
		color: var(--shiki-light);
	}
	:global([data-slot='code-block-content'] .shiki) {
		margin: 0;
		padding: 1rem;
		background-color: transparent !important;
		color: var(--shiki-light);
	}
	:global(.dark [data-slot='code-block-content'] .shiki),
	:global(.dark [data-slot='code-block-content'] .shiki span) {
		color: var(--shiki-dark);
	}
	:global([data-slot='code-block-content'].line-numbers code) {
		counter-reset: code-line;
	}
	:global([data-slot='code-block-content'].line-numbers .line) {
		counter-increment: code-line;
		display: inline-block;
		min-width: 100%;
	}
	:global([data-slot='code-block-content'].line-numbers .line::before) {
		content: counter(code-line);
		display: inline-block;
		width: 2rem;
		margin-right: 1rem;
		color: var(--muted-foreground);
		text-align: right;
		user-select: none;
	}
	:global([data-slot='code-block-content'] pre.whitespace-pre-wrap),
	:global([data-slot='code-block-content'] pre.whitespace-pre-wrap code),
	:global([data-slot='code-block-content'] pre.whitespace-pre-wrap .line) {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
</style>
