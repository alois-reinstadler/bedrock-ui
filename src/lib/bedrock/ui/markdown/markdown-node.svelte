<script lang="ts">
	import { Blockquote } from '#lib/bedrock/ui/blockquote';
	import { Citation } from '#lib/bedrock/ui/citation';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { Link } from '#lib/bedrock/ui/link';
	import { List, ListItem } from '#lib/bedrock/ui/list';
	import { Separator } from '#lib/bedrock/ui/separator';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '#lib/bedrock/ui/table';
	import { Text } from '#lib/bedrock/ui/text';
	import type { Token, Tokens } from 'marked';
	import MarkdownNode from './markdown-node.svelte';
	import { clampHeadingLevel, isExternalHref, splitCitations } from './markdown-utils.js';
	import type { MarkdownContext } from './types.js';

	/**
	 * Recursive marked-token renderer. Every token maps onto a Bedrock component
	 * or a semantic element; raw `html` tokens are rendered as escaped plain text
	 * (never injected), so the output is XSS-safe by construction.
	 */
	let { tokens, context }: { tokens: Token[]; context: MarkdownContext } = $props();

	// Template expressions cannot use TS casts; these helpers narrow marked's token union.
	const asHeading = (token: Token) => token as Tokens.Heading;
	const asParagraph = (token: Token) => token as Tokens.Paragraph;
	const asText = (token: Token) => token as Tokens.Text;
	const asStrong = (token: Token) => token as Tokens.Strong;
	const asEm = (token: Token) => token as Tokens.Em;
	const asDel = (token: Token) => token as Tokens.Del;
	const asCodespan = (token: Token) => token as Tokens.Codespan;
	const asLink = (token: Token) => token as Tokens.Link;
	const asImage = (token: Token) => token as Tokens.Image;
	const asEscape = (token: Token) => token as Tokens.Escape;
	const asCode = (token: Token) => token as Tokens.Code;
	const asBlockquote = (token: Token) => token as Tokens.Blockquote;
	const asList = (token: Token) => token as Tokens.List;
	const asTable = (token: Token) => token as Tokens.Table;

	function alignClass(align: 'center' | 'left' | 'right' | null): string | undefined {
		if (align === 'center') return 'text-center';
		if (align === 'right') return 'text-right';
		return undefined;
	}

	function handleLinkClick(href: string) {
		return (event: MouseEvent) => {
			if (context.onLinkClick?.(href, event) === false) event.preventDefault();
		};
	}
</script>

<!-- Keyed by index so completed blocks keep their DOM while streaming appends content. -->
{#each tokens as token, index (index)}
	{#if token.type === 'space' || token.type === 'def'}
		<!-- No output. -->
	{:else if token.type === 'heading'}
		{@const heading = asHeading(token)}
		<Heading
			level={clampHeadingLevel(heading.depth, context.headingLevelStart)}
			id={context.headingIds.get(heading)}
			><MarkdownNode tokens={heading.tokens} {context} /></Heading
		>
	{:else if token.type === 'paragraph'}
		<Text as="p" type="body"><MarkdownNode tokens={asParagraph(token).tokens} {context} /></Text>
	{:else if token.type === 'text'}
		{@const text = asText(token)}
		{#if text.tokens}
			<MarkdownNode tokens={text.tokens} {context} />
		{:else}
			{#each splitCitations(text.text, context.sources) as segment, segmentIndex (segmentIndex)}
				{#if segment.type === 'citation'}<Citation
						number={context.citationNumbers.get(segment.id) ?? 1}
						source={context.sources[segment.id]}
						variant={context.citationStyle}
					/>{:else}{segment.text}{/if}
			{/each}
		{/if}
	{:else if token.type === 'strong'}
		<strong><MarkdownNode tokens={asStrong(token).tokens} {context} /></strong>
	{:else if token.type === 'em'}
		<em><MarkdownNode tokens={asEm(token).tokens} {context} /></em>
	{:else if token.type === 'del'}
		<del><MarkdownNode tokens={asDel(token).tokens} {context} /></del>
	{:else if token.type === 'codespan'}
		<code class="rounded-sm bg-muted px-1.5 py-0.5 font-code text-[0.9em]"
			>{asCodespan(token).text}</code
		>
	{:else if token.type === 'link'}
		{@const link = asLink(token)}
		<Link
			href={link.href}
			title={link.title ?? undefined}
			external={isExternalHref(link.href)}
			underline
			onclick={handleLinkClick(link.href)}><MarkdownNode tokens={link.tokens} {context} /></Link
		>
	{:else if token.type === 'image'}
		{@const image = asImage(token)}
		<img
			src={image.href}
			alt={image.text}
			title={image.title ?? undefined}
			class="max-w-full rounded-md"
		/>
	{:else if token.type === 'br'}
		<br />
	{:else if token.type === 'escape'}
		{asEscape(token).text}
	{:else if token.type === 'code'}
		{@const code = asCode(token)}
		<CodeBlock
			container="section"
			code={code.text}
			language={code.lang?.split(/\s+/)[0] || 'plaintext'}
		/>
	{:else if token.type === 'blockquote'}
		<Blockquote class="space-y-2"
			><MarkdownNode tokens={asBlockquote(token).tokens} {context} /></Blockquote
		>
	{:else if token.type === 'list'}
		{@const list = asList(token)}
		<List
			variant={list.ordered ? 'decimal' : 'disc'}
			start={list.ordered && typeof list.start === 'number' ? list.start : undefined}
		>
			{#each list.items as item, itemIndex (itemIndex)}
				{#if item.task}
					<ListItem class="flex list-none items-start gap-2">
						<!-- Non-interactive task glyph: GFM task state is read-only in rendered markdown. -->
						<span
							role="checkbox"
							aria-checked={item.checked === true}
							aria-disabled="true"
							class="mt-[0.2em] inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-border bg-muted/40"
						>
							{#if item.checked}<Icon icon="check" class="size-3" />{/if}
						</span>
						<span class="min-w-0"><MarkdownNode tokens={item.tokens} {context} /></span>
					</ListItem>
				{:else}
					<ListItem><MarkdownNode tokens={item.tokens} {context} /></ListItem>
				{/if}
			{/each}
		</List>
	{:else if token.type === 'table'}
		{@const table = asTable(token)}
		<Table>
			<TableHeader>
				<TableRow>
					{#each table.header as cell, cellIndex (cellIndex)}
						<TableHead class={alignClass(table.align[cellIndex])}
							><MarkdownNode tokens={cell.tokens} {context} /></TableHead
						>
					{/each}
				</TableRow>
			</TableHeader>
			<TableBody>
				{#each table.rows as row, rowIndex (rowIndex)}
					<TableRow>
						{#each row as cell, cellIndex (cellIndex)}
							<TableCell class={alignClass(table.align[cellIndex])}
								><MarkdownNode tokens={cell.tokens} {context} /></TableCell
							>
						{/each}
					</TableRow>
				{/each}
			</TableBody>
		</Table>
	{:else if token.type === 'hr'}
		<Separator />
	{:else if token.type === 'html'}
		<!-- XSS safety: raw HTML is deliberately rendered as escaped text, never injected. -->
		{token.raw}
	{:else}
		{token.raw}
	{/if}
{/each}
