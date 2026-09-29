<script lang="ts">
	import * as Attachment from '#lib/bedrock/ui/attachment';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { Button } from '#lib/bedrock/ui/button';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
	import CopyIcon from '@lucide/svelte/icons/copy';
	let uploadState = $state<Attachment.AttachmentState>('error');
	let open = $state(false);
	let notice = $state('');
	const descriptions = {
		idle: 'Ready to upload',
		uploading: 'Uploading · 64%',
		processing: 'Processing document',
		error: 'Upload failed. Try again.',
		done: 'PDF · 2,4 MB'
	};
</script>

<section class="w-full max-w-lg space-y-5" aria-label="Attachment example">
	<div>
		<h3 class="font-semibold">Project files</h3>
		<p class="text-sm text-muted-foreground">
			Retry the upload, then open the file or use its independent action.
		</p>
	</div>
	<Attachment.Root state={uploadState} class="w-full">
		<Attachment.Media><FileTextIcon /></Attachment.Media>
		<Attachment.Content
			><Attachment.Title>project-brief.pdf</Attachment.Title><Attachment.Description
				>{descriptions[uploadState]}</Attachment.Description
			></Attachment.Content
		>
		<Attachment.Actions>
			{#if uploadState === 'error'}
				<Attachment.Action
					aria-label="Retry upload"
					onclick={() => {
						uploadState = 'uploading';
						notice = 'Upload restarted.';
					}}><RefreshCwIcon /></Attachment.Action
				>
			{:else}
				<Attachment.Action
					aria-label="Show file details"
					onclick={() => (notice = 'project-brief.pdf · PDF document')}
					><CopyIcon /></Attachment.Action
				>
			{/if}
		</Attachment.Actions>
		<Attachment.Trigger aria-label="Preview project-brief.pdf" onclick={() => (open = true)} />
	</Attachment.Root>
	<div class="flex flex-wrap gap-2">
		<Button
			variant="outline"
			disabled={uploadState !== 'uploading'}
			onclick={() => {
				uploadState = 'processing';
				notice = 'Processing document.';
			}}>Process upload</Button
		>
		<Button
			variant="outline"
			disabled={uploadState !== 'processing'}
			onclick={() => {
				uploadState = 'done';
				notice = 'Upload complete.';
			}}>Complete upload</Button
		>
		<Button
			variant="ghost"
			onclick={() => {
				uploadState = 'error';
				notice = 'Demo reset.';
			}}>Reset</Button
		>
	</div>
	<p role="status" class="min-h-5 text-sm text-muted-foreground">{notice}</p>
	<Dialog.Root {open} onOpenChange={(value) => (open = value)}
		><Dialog.Content
			><Dialog.Header
				><Dialog.Title>project-brief.pdf</Dialog.Title><Dialog.Description
					>A preview of the project brief.</Dialog.Description
				></Dialog.Header
			>
			<p class="text-sm">
				Build a shared conversation workspace with clear file states and accessible actions.
			</p></Dialog.Content
		></Dialog.Root
	>
</section>
