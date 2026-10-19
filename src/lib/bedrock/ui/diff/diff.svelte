<script lang="ts" module>
	const defaultLabels = {
		before: 'Before',
		after: 'After',
		unified: 'Unified',
		split: 'Side by side',
		view: 'Diff view',
		region: 'Text comparison',
		code: 'Code',
		added: 'Added',
		removed: 'Removed',
		unchanged: 'Unchanged',
		noChanges: 'No changes',
		showUnchanged: (count: number) => `Show ${count} unchanged lines`,
		noNewline: 'No newline at end of file',
		copy: 'Copy updated text',
		copied: 'Copied',
		copyFailed: 'Copy failed. Select the text to copy it manually.'
	};
	export type DiffLabels = Partial<typeof defaultLabels>;
	export type DiffView = 'unified' | 'split';
</script>

<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { CodeSource, CodeLine, type CodeLineData } from '#lib/bedrock/ui/code-block';
	import { Button } from '#lib/bedrock/ui/button';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { createDiff, splitDiff, diffSections, inlineChanges, type DiffLine } from './lines';

	type Props = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		before: string;
		after: string;
		language?: string;
		view?: DiffView;
		/** Unchanged lines around each hunk; null shows the entire file. */
		contextLines?: number | null;
		/** Emphasize changed words within replacement lines. */
		wordHighlight?: boolean;
		title?: string;
		lineNumbers?: boolean;
		wrap?: boolean;
		maxHeight?: number | string;
		copyButton?: boolean;
		viewToggle?: boolean;
		container?: 'card' | 'section';
		labels?: DiffLabels;
	};

	let {
		ref = $bindable(null),
		before,
		after,
		language = 'plaintext',
		view = $bindable('unified'),
		contextLines = 3,
		wordHighlight = true,
		title,
		lineNumbers = true,
		wrap = false,
		maxHeight,
		copyButton = true,
		viewToggle = true,
		container = 'card',
		labels: labelOverrides = {},
		class: className,
		...restProps
	}: Props = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const lines = $derived(createDiff(before, after));
	const sections = $derived(diffSections(lines, contextLines));
	const highlights = $derived(wordHighlight ? inlineChanges(lines) : undefined);
	let expanded = $state.raw<{ sections: typeof sections; gaps: number[] }>();
	const expandedGaps = $derived(expanded?.sections === sections ? expanded.gaps : []);
	function expandGap(start: number) {
		expanded = { sections, gaps: [...expandedGaps, start] };
	}
	const columnCount = $derived(view === 'unified' ? (lineNumbers ? 3 : 1) : lineNumbers ? 4 : 2);
	const added = $derived(lines.filter((line) => line.kind === 'added').length);
	const removed = $derived(lines.filter((line) => line.kind === 'removed').length);
	const height = $derived(typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight);
	let copyState = $state<'idle' | 'copied' | 'failed'>('idle');
	let timer: ReturnType<typeof setTimeout> | undefined;
	let disposed = false;

	async function copy() {
		clearTimeout(timer);
		try {
			await navigator.clipboard.writeText(after);
			if (disposed) return;
			copyState = 'copied';
			timer = setTimeout(() => (copyState = 'idle'), 1400);
		} catch {
			if (!disposed) copyState = 'failed';
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
		clearTimeout(timer);
	});
</script>

{#snippet content(line: DiffLine, source: CodeLineData)}
	<span class="sr-only">{labels[line.kind]}: </span>
	<span class="diff-marker" aria-hidden="true"
		>{line.kind === 'added' ? '+' : line.kind === 'removed' ? '−' : ' '}</span
	>
	<code class="diff-text"
		><CodeLine line={source} highlights={highlights?.get(line)} />{#if line.noNewline}<span
				class="diff-eof">{labels.noNewline}</span
			>{/if}</code
	>
{/snippet}

{#snippet renderRows(
	visibleLines: DiffLine[],
	oldLines: readonly CodeLineData[],
	newLines: readonly CodeLineData[]
)}
	{#if view === 'unified'}
		{#each visibleLines as line, index (index)}
			<tr data-kind={line.kind}>
				{#if lineNumbers}<td class="diff-number" data-kind={line.kind}>{line.before ?? ''}</td><td
						class="diff-number"
						data-kind={line.kind}>{line.after ?? ''}</td
					>{/if}
				<td class="diff-code"
					>{@render content(
						line,
						line.kind === 'removed' ? oldLines[line.before! - 1] : newLines[line.after! - 1]
					)}</td
				>
			</tr>
		{/each}
	{:else}
		{#each splitDiff(visibleLines) as row, index (index)}
			<tr>
				{#each ['before', 'after'] as side (side)}
					{@const line = row[side as 'before' | 'after']}
					{#if lineNumbers}<td class="diff-number" data-kind={line?.kind}
							>{line?.[side as 'before' | 'after'] ?? ''}</td
						>{/if}
					<td
						class="diff-code"
						class:diff-divider={side === 'before'}
						data-kind={line?.kind ?? 'empty'}
						>{#if line}{@render content(
								line,
								side === 'before' ? oldLines[line.before! - 1] : newLines[line.after! - 1]
							)}{/if}</td
					>
				{/each}
			</tr>
		{/each}
	{/if}
{/snippet}

<div
	{@attach attachRef}
	data-slot="diff"
	data-view={view}
	class={cn(
		'min-w-0 overflow-hidden',
		container === 'card' && 'rounded-md border bg-background',
		className
	)}
	{...restProps}
>
	<div
		data-slot="diff-header"
		class={cn(
			'flex flex-wrap items-center justify-between gap-2 px-3 py-2',
			container === 'card' && 'border-b bg-muted/30'
		)}
	>
		<div class="min-w-0 font-code text-xs text-foreground">
			<span class="truncate">{title ?? labels.region}</span>
		</div>
		<div class="flex flex-wrap items-center gap-3">
			<div class="flex items-center gap-1.5 font-code text-xs">
				{#if added || removed}
					<span
						class="text-emerald-700 dark:text-emerald-400"
						aria-label={`${labels.added}: ${added}`}>+{added}</span
					>
					<span class="text-destructive-ink" aria-label={`${labels.removed}: ${removed}`}
						>−{removed}</span
					>
				{:else}<span class="text-muted-foreground">{labels.noChanges}</span>{/if}
			</div>
			{#if viewToggle}
				<div role="group" aria-label={labels.view} class="flex gap-1">
					<Button
						size="xs"
						variant={view === 'unified' ? 'secondary' : 'ghost'}
						aria-pressed={view === 'unified'}
						onclick={() => (view = 'unified')}>{labels.unified}</Button
					>
					<Button
						size="xs"
						variant={view === 'split' ? 'secondary' : 'ghost'}
						aria-pressed={view === 'split'}
						onclick={() => (view = 'split')}>{labels.split}</Button
					>
				</div>
			{/if}
			{#if copyButton}<IconButton
					icon={copyState === 'copied' ? 'checkDouble' : 'copy'}
					label={copyState === 'copied' ? labels.copied : labels.copy}
					size="xs"
					onclick={copy}
				/>{/if}
		</div>
	</div>
	<p role="status" class={copyState === 'failed' ? 'px-3 py-2 text-xs' : 'sr-only'}>
		{copyState === 'copied' ? labels.copied : copyState === 'failed' ? labels.copyFailed : ''}
	</p>
	<!-- Keyboard focus lets users scroll the comparison in both directions. -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		data-slot="diff-content"
		role="region"
		aria-label={title ?? labels.region}
		tabindex="0"
		class="overflow-auto focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
		style:max-height={height}
	>
		<CodeSource code={before} {language}>
			{#snippet children(oldLines)}
				<CodeSource code={after} {language}>
					{#snippet children(newLines)}
						<table class:wrapped={wrap} class:split={view === 'split'} class="diff-table">
							<colgroup>
								{#if lineNumbers}<col style:width="2.75rem" />{/if}
								{#if view === 'split'}<col />{/if}
								{#if lineNumbers}<col style:width="2.75rem" />{/if}
								<col />
							</colgroup>
							<thead>
								<tr>
									{#if view === 'split'}
										<th colspan={lineNumbers ? 2 : 1} scope="colgroup">{labels.before}</th>
										<th colspan={lineNumbers ? 2 : 1} scope="colgroup">{labels.after}</th>
									{:else}
										{#if lineNumbers}
											<th scope="col" class="diff-hidden-heading"
												><span class="sr-only">{labels.before}</span></th
											>
											<th scope="col" class="diff-hidden-heading"
												><span class="sr-only">{labels.after}</span></th
											>
										{/if}
										<th scope="col" class="diff-hidden-heading"
											><span class="sr-only">{labels.code}</span></th
										>
									{/if}
								</tr>
							</thead>
							<tbody>
								{#each sections as section (section.start)}
									{#if section.kind === 'gap' && !expandedGaps.includes(section.start)}
										<tr data-slot="diff-gap"
											><td colspan={columnCount} class="diff-gap"
												><button type="button" onclick={() => expandGap(section.start)}
													>{labels.showUnchanged(section.lines.length)}</button
												></td
											></tr
										>
									{:else}
										{#if section.header}<tr data-slot="diff-hunk"
												><td colspan={columnCount} class="diff-hunk">{section.header}</td></tr
											>{/if}
										{@render renderRows(section.lines, oldLines, newLines)}
									{/if}
								{/each}
							</tbody>
						</table>
					{/snippet}
				</CodeSource>
			{/snippet}
		</CodeSource>
	</div>
</div>

<style>
	.diff-table {
		width: 100%;
		border-collapse: collapse;
		font-family: var(--font-code);
		font-size: 12px;
		line-height: 1.75;
	}
	th {
		padding: 0.375rem 0.75rem;
		text-align: left;
		font-size: 11px;
		font-weight: 500;
		color: var(--muted-foreground);
		background: var(--muted);
	}
	.diff-hidden-heading {
		padding: 0;
		height: 0;
		line-height: 0;
	}
	td {
		vertical-align: top;
	}
	.diff-number {
		width: 1%;
		min-width: 2.75rem;
		padding: 0 0.625rem;
		font-variant-numeric: lining-nums tabular-nums;
		text-align: right;
		color: var(--muted-foreground);
		user-select: none;
	}
	.diff-code {
		padding: 0 0.75rem 0 0;
		white-space: nowrap;
	}
	.diff-marker {
		display: inline-block;
		width: 1.5rem;
		text-align: center;
		user-select: none;
	}
	.diff-text {
		white-space: pre;
		font: inherit;
		tab-size: 4;
	}
	.diff-eof {
		display: block;
		padding-left: 2rem;
		font-size: 11px;
		font-style: italic;
		color: var(--muted-foreground);
	}
	.diff-divider {
		border-right: 1px solid var(--border);
	}
	.split .diff-code {
		width: 50%;
	}
	.wrapped {
		table-layout: fixed;
	}
	.wrapped .diff-number {
		width: 2.75rem;
	}
	.wrapped .diff-code {
		white-space: normal;
		overflow-wrap: anywhere;
	}
	.wrapped .diff-text {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.wrapped.split .diff-code {
		width: auto;
	}
	[data-kind='added'] {
		--code-highlight-bg: color-mix(in oklch, var(--color-emerald-500) 32%, transparent);
		background: color-mix(in oklch, var(--color-emerald-500) 12%, transparent);
	}
	[data-kind='removed'] {
		--code-highlight-bg: color-mix(in oklch, var(--destructive) 32%, transparent);
		background: color-mix(in oklch, var(--destructive) 10%, transparent);
	}
	[data-kind='empty'] {
		background: var(--muted);
	}
	.diff-number[data-kind='added'] {
		background: color-mix(in oklch, var(--color-emerald-500) 22%, transparent);
		color: var(--foreground);
		font-weight: 600;
	}
	.diff-number[data-kind='removed'] {
		background: color-mix(in oklch, var(--destructive) 22%, transparent);
		color: var(--foreground);
		font-weight: 600;
	}
	.diff-hunk,
	.diff-gap {
		background: color-mix(in oklab, var(--color-blue-500) 10%, var(--background));
		color: var(--muted-foreground);
		font-size: 11px;
	}
	.diff-hunk {
		padding: 0.25rem 1rem;
	}
	.diff-gap {
		padding: 0;
	}
	.diff-gap button {
		width: 100%;
		padding: 0.25rem 1rem;
		text-align: left;
		cursor: pointer;
	}
	.diff-gap button:hover {
		background: color-mix(in oklch, var(--color-blue-500) 12%, transparent);
	}
	.diff-gap button:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: -2px;
	}
</style>
