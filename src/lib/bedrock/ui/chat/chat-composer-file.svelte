<script lang="ts">
	import * as Attachment from '#lib/bedrock/ui/attachment';
	import type { ChatUpload } from './composer-types';
	import RotateIcon from '@lucide/svelte/icons/rotate-cw';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { formatFileSize } from '#lib/bedrock/ui/file-input';
	let {
		file,
		upload,
		onCancel,
		onRetry,
		uploadDisabled = false,
		cancelLabel = 'Cancel upload',
		retryLabel = 'Retry upload',
		disabled,
		removeLabel,
		onRemove
	}: {
		file: File;
		disabled?: boolean;
		removeLabel: string;
		onRemove: () => void;
		upload?: ChatUpload;
		onCancel?: () => void;
		onRetry?: () => void;
		uploadDisabled?: boolean;
		cancelLabel?: string;
		retryLabel?: string;
	} = $props();
	const active = $derived(upload?.status === 'uploading' || upload?.status === 'processing');
	const failed = $derived(upload?.status === 'error' || upload?.status === 'cancelled');
	const progress = $derived(
		upload?.progress !== undefined && Number.isFinite(upload.progress)
			? Math.min(100, Math.max(0, upload.progress))
			: undefined
	);
	const state = $derived(
		upload?.status === 'queued' || upload?.status === 'cancelled'
			? 'idle'
			: upload?.status === 'complete' || !upload
				? 'done'
				: upload.status
	);
	const image = $derived(file.type.startsWith('image/'));
	function preview(source: File) {
		return (element: HTMLImageElement) => {
			const url = URL.createObjectURL(source);
			element.src = url;
			return () => URL.revokeObjectURL(url);
		};
	}
</script>

<Attachment.Root
	size="sm"
	{state}
	data-upload-status={upload?.status}
	orientation={image ? 'vertical' : 'horizontal'}
	class={image ? 'w-32' : 'max-w-56'}
	data-slot="chat-composer-file"
>
	<Attachment.Media variant={image ? 'image' : 'icon'}
		>{#if image}<img {@attach preview(file)} alt={file.name} />{:else}<Icon
				icon="file"
			/>{/if}</Attachment.Media
	>
	<Attachment.Content
		><Attachment.Title>{file.name}</Attachment.Title><Attachment.Description
			>{upload
				? {
						queued: 'Ready to upload',
						uploading: progress === undefined ? 'Uploading…' : `Uploading ${Math.round(progress)}%`,
						processing: 'Processing…',
						complete: 'Uploaded',
						error: upload.error || 'Upload failed',
						cancelled: 'Upload cancelled'
					}[upload.status]
				: formatFileSize(file.size, 'de-AT')}</Attachment.Description
		></Attachment.Content
	>
	{#if upload?.status === 'uploading'}
		<progress
			aria-label={`Uploading ${file.name}`}
			max="100"
			value={progress}
			class="h-1 w-full appearance-none overflow-hidden rounded bg-muted [&::-moz-progress-bar]:bg-primary [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-primary"
		></progress>
	{/if}
	<Attachment.Actions>
		{#if active && onCancel}<Attachment.Action
				aria-label={`${cancelLabel}: ${file.name}`}
				disabled={uploadDisabled}
				onclick={onCancel}><Icon icon="stop" /></Attachment.Action
			>{/if}
		{#if failed && onRetry}<Attachment.Action
				aria-label={`${retryLabel}: ${file.name}`}
				disabled={uploadDisabled}
				onclick={onRetry}><RotateIcon class="size-3" /></Attachment.Action
			>{/if}
		<Attachment.Action
			aria-label={removeLabel}
			disabled={disabled || active}
			onclick={onRemove}
			class="bg-background/90"><Icon icon="close" /></Attachment.Action
		></Attachment.Actions
	>
</Attachment.Root>
