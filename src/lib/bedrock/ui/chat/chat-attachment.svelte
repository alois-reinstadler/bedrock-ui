<script lang="ts" module>
	export type ChatAttachmentType = 'image' | 'pdf' | 'file';

	const typeIcons: Record<ChatAttachmentType, IconName> = {
		image: 'image',
		pdf: 'file',
		file: 'attachment'
	};
</script>

<script lang="ts">
	import { type IconName, Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Lightbox } from '#lib/bedrock/ui/lightbox';
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';
	import { formatFileSize } from '#lib/bedrock/ui/file-input';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		name,
		type,
		src,
		size,
		onRemove,
		removeLabel = 'Remove',
		...restProps
	}: Omit<WithElementRef<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, 'children'> & {
		name: string;
		/** Defaults to `pdf`/`image` when `src` suggests one, otherwise `file`. */
		type?: ChatAttachmentType;
		/** Image/pdf attachments with a `src` open in a Lightbox on click. */
		src?: string;
		/** Byte count, formatted compactly. */
		size?: number;
		/** Renders a small close button — for composer usage. */
		onRemove?: () => void;
		/** Accessible label for the remove button. */
		removeLabel?: string;
	} = $props();

	const resolvedType = $derived(
		type ?? (src ? (src.toLowerCase().split('?')[0].endsWith('.pdf') ? 'pdf' : 'image') : 'file')
	);
	const previewable = $derived(Boolean(src) && resolvedType !== 'file');
</script>

{#snippet body()}
	<Thumbnail size="sm" src={resolvedType === 'image' ? src : undefined} alt="">
		<Icon icon={typeIcons[resolvedType]} aria-hidden="true" />
	</Thumbnail>
	<span class="flex min-w-0 flex-col items-start">
		<span class="max-w-40 truncate text-xs font-medium text-foreground">{name}</span>
		{#if size != null}
			<span class="text-[11px] text-muted-foreground tabular-nums">{formatFileSize(size)}</span>
		{/if}
	</span>
{/snippet}

<span
	bind:this={ref}
	data-slot="chat-attachment"
	data-type={resolvedType}
	class={cn(
		'inline-flex items-center gap-1.5 rounded-md border border-border bg-background p-1',
		onRemove ? 'pr-1' : 'pr-2.5',
		className
	)}
	{...restProps}
>
	{#if previewable && src}
		<Lightbox
			items={[{ src, alt: name, type: resolvedType === 'pdf' ? 'pdf' : 'image' }]}
			class="flex min-w-0 items-center gap-1.5 rounded-sm text-left motion-state focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
		>
			{@render body()}
		</Lightbox>
	{:else}
		<span class="flex min-w-0 items-center gap-1.5">
			{@render body()}
		</span>
	{/if}
	{#if onRemove}
		<IconButton icon="close" label={removeLabel} size="xs" onclick={() => onRemove?.()} />
	{/if}
</span>
