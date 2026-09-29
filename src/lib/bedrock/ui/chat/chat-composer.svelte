<script lang="ts">
	import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
	import PaperclipIcon from '@lucide/svelte/icons/paperclip';
	import { onDestroy, tick, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Swap } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import TextareaPrimitive from '#lib/shadcn/ui/textarea/textarea.svelte';
	import { cn } from '#lib/utils.js';
	import ModelPicker from './chat-model-picker.svelte';
	import ReasoningPicker from './chat-reasoning-picker.svelte';
	import ComposerFile from './chat-composer-file.svelte';
	import { selectComposerFiles } from './composer-files';
	import type {
		ChatComposerSubmission,
		ChatUpload,
		ChatModelOption,
		ChatReasoningOption,
		ChatServiceTierOption,
		ChatFileRejection
	} from './composer-types';

	let {
		value = $bindable(''),
		class: className,
		placeholder = 'Write a message…',
		disabled = false,
		busy = false,
		sendLabel = 'Send',
		stopLabel = 'Stop',
		maxRows = 8,
		models = [],
		model = $bindable(''),
		favoriteModels = $bindable<string[]>([]),
		reasoningOptions = [],
		reasoning = $bindable(''),
		serviceTiers = [],
		serviceTier = $bindable(''),
		attachments = false,
		files = $bindable<File[]>([]),
		uploads = [],
		onCancelUpload,
		onRetryUpload,
		cancelUploadLabel = 'Cancel upload',
		retryUploadLabel = 'Retry upload',

		multiple = true,
		accept,
		maxFiles,
		maxFileSize,
		attachLabel = 'Attach files',
		removeFileLabel = 'Remove file',
		sendErrorLabel = 'Message could not be sent. Your draft is saved. Try again.',
		rejectedFilesLabel = 'Some files could not be added. Check the allowed file types, size, and count.',
		onSend,
		onStop,
		onFiles,
		onFilesChange,
		onFilesRejected,
		onSendError,
		onModelChange,
		onReasoningChange,
		onServiceTierChange,
		onFavoriteModelsChange,
		actions,
		headerActions,
		drawer,
		...restProps
	}: Omit<HTMLAttributes<HTMLFormElement>, 'onsubmit'> & {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		/** Generation state: show Stop while allowing the next draft to be typed. */
		busy?: boolean;
		sendLabel?: string;
		stopLabel?: string;
		maxRows?: number;
		/** Optional model choices. Omit to hide the picker. */
		models?: ChatModelOption[];
		model?: string;
		favoriteModels?: string[];
		/** Pass supported reasoning levels to show the reasoning picker. */
		reasoningOptions?: ChatReasoningOption[];
		reasoning?: string;
		serviceTiers?: ChatServiceTierOption[];
		serviceTier?: string;
		/** Enable the native file picker and a removable attachment queue. */
		attachments?: boolean;
		files?: File[];
		/** Optional app-owned upload progress, matched by File identity. Incomplete uploads prevent sending. */
		uploads?: ChatUpload[];
		onCancelUpload?: (file: File) => void;
		onRetryUpload?: (file: File) => void;
		cancelUploadLabel?: string;
		retryUploadLabel?: string;
		multiple?: boolean;
		accept?: string;
		maxFiles?: number;
		/** Maximum bytes per file. */ maxFileSize?: number;
		attachLabel?: string;
		removeFileLabel?: string;
		sendErrorLabel?: string;
		rejectedFilesLabel?: string;
		/** Receives the draft and files/settings. Clears only when this callback succeeds. The app owns upload transport. */
		onSend?: (message: string, submission: ChatComposerSubmission) => void | Promise<void>;
		onStop?: () => void;
		/** Newly accepted files from picker, paste, or drop. Also works without the built-in attachment queue. */
		onFiles?: (files: File[]) => void;
		onFilesChange?: (files: File[]) => void;
		onFilesRejected?: (rejections: ChatFileRejection[]) => void;
		onSendError?: (error: unknown) => void;
		onModelChange?: (model: string) => void;
		onReasoningChange?: (reasoning: string) => void;
		onServiceTierChange?: (tier: string) => void;
		onFavoriteModelsChange?: (favorites: string[]) => void;
		actions?: Snippet;
		headerActions?: Snippet;
		drawer?: Snippet;
	} = $props();

	const uid = $props.id();
	let textarea = $state<HTMLTextAreaElement | null>(null);
	let fileInput: HTMLInputElement;
	let submitting = $state(false);
	let error = $state('');
	let destroyed = false;
	onDestroy(() => {
		destroyed = true;
	});
	const locked = $derived(disabled || submitting);
	const toolbar = $derived(
		attachments || models.length > 0 || reasoningOptions.length > 0 || serviceTiers.length > 0
	);
	const maxHeight = $derived(`${maxRows * 1.25 + 0.75}rem`);
	const blockedUploads = $derived(
		attachments &&
			uploads.some(
				(upload) => files.includes(upload.file) && !['queued', 'complete'].includes(upload.status)
			)
	);
	const canSend = $derived(
		!blockedUploads && (value.trim().length > 0 || (attachments && files.length > 0))
	);

	async function submit() {
		if (!canSend || locked || busy) return;
		const draft = value;
		const sentFiles = attachments ? [...files] : [];
		submitting = true;
		error = '';
		try {
			await onSend?.(draft.trim(), {
				files: sentFiles,
				model: models.length ? model || undefined : undefined,
				reasoning: reasoningOptions.length ? reasoning || undefined : undefined,
				serviceTier: serviceTiers.length ? serviceTier || undefined : undefined
			});
			if (destroyed) return;
			if (value === draft) value = '';
			if (sentFiles.length) {
				files = files.filter((file) => !sentFiles.includes(file));
				onFilesChange?.(files);
			}
		} catch (cause) {
			if (destroyed) return;
			error = sendErrorLabel;
			onSendError?.(cause);
		} finally {
			if (!destroyed) {
				submitting = false;
				await tick();
				if (!destroyed) textarea?.focus();
			}
		}
	}
	function intake(incoming: File[]) {
		if (locked || !incoming.length) return;
		const result = selectComposerFiles(incoming, attachments ? files : [], {
			multiple,
			accept,
			maxFiles,
			maxFileSize
		});
		error = result.rejected.length ? rejectedFilesLabel : '';
		if (attachments && result.accepted.length) {
			files = result.files;
			onFilesChange?.(files);
		}
		if (result.accepted.length) onFiles?.(result.accepted);
		if (result.rejected.length) onFilesRejected?.(result.rejected);
	}
	function remove(file: File) {
		if (locked) return;
		files = files.filter((item) => item !== file);
		error = '';
		onFilesChange?.(files);
	}
	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			void submit();
		}
	}
	function onpaste(event: ClipboardEvent) {
		if (!attachments && !onFiles) return;
		const incoming = [...(event.clipboardData?.files ?? [])];
		if (!incoming.length) return;
		event.preventDefault();
		intake(incoming);
	}
	function ondragover(event: DragEvent) {
		if ((attachments || onFiles) && event.dataTransfer?.types.includes('Files'))
			event.preventDefault();
	}
	function ondrop(event: DragEvent) {
		if (!attachments && !onFiles) return;
		const incoming = [...(event.dataTransfer?.files ?? [])];
		if (!incoming.length) return;
		event.preventDefault();
		intake(incoming);
	}
</script>

{#snippet sendControls()}
	{@render actions?.()}
	<Swap key={busy} effect="fade" class="shrink-0">
		{#if busy}
			<Button
				type="button"
				size="icon-sm"
				aria-label={stopLabel}
				{disabled}
				onclick={() => onStop?.()}
				data-slot="chat-stop-button"
				class="tap-target shrink-0 rounded-full motion-press motion-state"
				><Icon icon="stop" class="size-4" /></Button
			>
		{:else}
			<Button
				type="submit"
				size="icon-sm"
				aria-label={sendLabel}
				disabled={locked || !canSend}
				data-slot="chat-send-button"
				class="tap-target shrink-0 rounded-full motion-press motion-state"
				><ArrowUpIcon class="size-4" /></Button
			>
		{/if}
	</Swap>
{/snippet}

<form
	data-slot="chat-composer"
	class={cn(
		'flex min-w-0 flex-col gap-2 rounded-xl border border-input bg-background p-2 shadow-xs motion-state focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
		className
	)}
	onsubmit={(event) => {
		event.preventDefault();
		void submit();
	}}
	{...restProps}
	aria-busy={submitting}
	{onpaste}
	{ondragover}
	{ondrop}
>
	{#if drawer}<div data-slot="chat-composer-drawer" class="w-full">{@render drawer()}</div>{/if}
	{#if attachments}
		<input
			{@attach (node) => {
				fileInput = node;
			}}
			data-slot="chat-file-input"
			type="file"
			class="hidden"
			tabindex="-1"
			aria-label={attachLabel}
			{multiple}
			{accept}
			disabled={locked}
			onchange={(event) => {
				intake([...(event.currentTarget.files ?? [])]);
				event.currentTarget.value = '';
			}}
		/>
		{#if files.length}
			<div
				data-slot="chat-composer-files"
				class="flex max-h-48 flex-wrap gap-2 overflow-y-auto p-1"
				aria-label="Attachments"
			>
				{#each files as file (file)}<ComposerFile
						{file}
						upload={uploads.find((upload) => upload.file === file)}
						onCancel={onCancelUpload ? () => onCancelUpload?.(file) : undefined}
						onRetry={onRetryUpload ? () => onRetryUpload?.(file) : undefined}
						uploadDisabled={disabled}
						cancelLabel={cancelUploadLabel}
						retryLabel={retryUploadLabel}
						disabled={locked}
						removeLabel={`${removeFileLabel}: ${file.name}`}
						onRemove={() => remove(file)}
					/>{/each}
			</div>
		{/if}
	{/if}
	{#if headerActions}<div
			data-slot="chat-composer-header"
			class="flex items-center gap-1 self-start"
		>
			{@render headerActions()}
		</div>{/if}
	<div class="flex items-end gap-2">
		<TextareaPrimitive
			bind:ref={textarea}
			bind:value
			id="{uid}-message"
			name="message"
			{placeholder}
			disabled={locked}
			{onkeydown}
			rows={1}
			aria-label={placeholder}
			aria-describedby={error ? `${uid}-error` : undefined}
			style="max-height: {maxHeight}"
			class="[field-sizing:content] min-h-8 min-w-0 flex-1 resize-none border-0 bg-transparent px-2 py-1.5 text-sm shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
		/>
		{#if !toolbar}{@render sendControls()}{/if}
	</div>
	{#if toolbar}
		<div
			data-slot="chat-composer-toolbar"
			class="flex flex-wrap items-center justify-between gap-1"
		>
			<div class="flex min-w-0 flex-wrap items-center gap-1">
				{#if attachments}<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label={attachLabel}
						disabled={locked}
						onclick={() => fileInput?.click()}><PaperclipIcon class="size-4" /></Button
					>{/if}
				{#if models.length}<ModelPicker
						{models}
						bind:value={model}
						bind:favorites={favoriteModels}
						disabled={locked}
						onValueChange={onModelChange}
						onFavoritesChange={onFavoriteModelsChange}
					/>{/if}
				{#if reasoningOptions.length || serviceTiers.length}<ReasoningPicker
						options={reasoningOptions}
						bind:value={reasoning}
						{serviceTiers}
						bind:serviceTier
						disabled={locked}
						onValueChange={onReasoningChange}
						{onServiceTierChange}
					/>{/if}
			</div>
			<div class="ml-auto flex items-center gap-1">{@render sendControls()}</div>
		</div>
	{/if}
	{#if error}<p id="{uid}-error" role="alert" class="px-2 text-sm text-destructive">{error}</p>{/if}
</form>
