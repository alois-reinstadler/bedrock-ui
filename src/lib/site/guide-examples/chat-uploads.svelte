<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let files = $state<File[]>([]);
	let uploads = $state<Chat.ChatUpload[]>([]);
	let sent = $state('');
	function add(incoming: File[]) {
		uploads = [
			...uploads,
			...incoming.map((file): Chat.ChatUpload => ({ file, status: 'uploading', progress: 25 }))
		];
	}
	function change(file: File, status: Chat.ChatUpload['status']) {
		uploads = uploads.map((upload) =>
			upload.file === file
				? {
						...upload,
						status,
						progress: status === 'uploading' ? 25 : upload.progress,
						error: status === 'error' ? 'Connection lost. Retry the upload.' : undefined
					}
				: upload
		);
	}
</script>

<section data-demo="chat-uploads" class="w-full max-w-xl space-y-4">
	<p class="text-sm text-muted-foreground">
		Attach files, then use these demo controls to advance or fail uploads. Each file can be
		cancelled or retried. No files leave your browser.
	</p>
	<div class="flex flex-wrap gap-2">
		<Button
			size="sm"
			variant="outline"
			disabled={!files.length}
			onclick={() => {
				uploads = uploads.map((upload) => ({ ...upload, progress: 75 }));
			}}>Advance progress</Button
		>
		<Button
			size="sm"
			variant="outline"
			disabled={!files.length}
			onclick={() => {
				uploads = uploads.map((upload) => ({
					...upload,
					status: 'error',
					error: 'Connection lost. Retry the upload.'
				}));
			}}>Fail uploads</Button
		>
		<Button
			size="sm"
			variant="outline"
			disabled={!files.length}
			onclick={() => {
				uploads = uploads.map((upload) => ({ ...upload, status: 'complete', progress: 100 }));
			}}>Complete uploads</Button
		>
	</div>
	<Chat.Composer
		attachments
		bind:files
		{uploads}
		maxFiles={4}
		onFiles={add}
		onFilesChange={(next) => {
			uploads = uploads.filter((upload) => next.includes(upload.file));
		}}
		onCancelUpload={(file) => change(file, 'cancelled')}
		onRetryUpload={(file) => change(file, 'uploading')}
		onSend={(_text, submission) => {
			sent = `Sent ${submission.files.length} attachment(s).`;
		}}
	/>
	<p role="status" class="text-sm text-muted-foreground">{sent}</p>
</section>
