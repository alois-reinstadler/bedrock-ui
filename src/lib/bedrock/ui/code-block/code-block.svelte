<script lang="ts" module>
	const defaultLabels = {
		copy: 'Copy code',
		copied: 'Copied',
		copyFailed: 'Copy failed. Select the code to copy it manually.',
		language: (lang: string) => lang
	};

	export type CodeBlockLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import CodeSource from './code-source.svelte';
	import CodeLine from './code-line.svelte';
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
	const newline = '\n';
	const maxHeightStyle = $derived(
		maxHeight == null ? undefined : typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight
	);
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
		style:--code-gutter={`${String(code.split('\n').length).length}ch`}
	>
		<CodeSource {code} {language}>
			{#snippet children(lines)}
				<pre
					class={cn(
						'm-0 p-4',
						lines[0]?.tokens && 'shiki',
						wrap ? 'break-words whitespace-pre-wrap' : 'whitespace-pre'
					)}><code
						>{#each lines as line, index (index)}<CodeLine
								{line}
							/>{#if index < lines.length - 1}{newline}{/if}{/each}</code
					></pre>
			{/snippet}
		</CodeSource>
	</div>
</div>

<style>
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
		width: var(--code-gutter);
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
