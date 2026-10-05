<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { FileInput } from '#lib/bedrock/ui/file-input';

	let files = $state<File[]>([]);

	import { Button } from '#lib/bedrock/ui/button';
	let submitted = $state(false);
</script>

<Card.Root class="block w-full gap-0 space-y-5 p-5">
	<header>
		<h3 class="text-lg font-semibold">Expense receipt attachments</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Attach up to three receipts before submitting an expense. Selection stays local; no files are
			uploaded.
		</p>
	</header>

	<div class="grid max-w-md gap-6">
		<FileInput
			bind:files
			mode="dropzone"
			accept="image/*,.pdf"
			multiple
			maxFiles={3}
			maxSize={5 * 1024 * 1024}
		/>
	</div>
	<p class="text-sm text-muted-foreground">Images or PDF, up to 5 MB each.</p>
	<Button disabled={!files.length} onclick={() => (submitted = true)}
		>Attach {files.length || ''} receipts</Button
	>
	<p role="status" class="text-sm">
		{submitted ? 'Receipts attached to the sample expense.' : `${files.length} receipts selected.`}
	</p>
</Card.Root>
