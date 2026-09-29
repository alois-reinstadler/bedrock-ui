<script lang="ts">
	import * as Attachment from '#lib/bedrock/ui/attachment';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	const states = ['idle', 'uploading', 'processing', 'error', 'done'] as const;
	const sizes = ['default', 'sm', 'xs'] as const;
</script>

<div class="w-full max-w-xl space-y-6">
	<div class="grid gap-3 sm:grid-cols-2">
		{#each states as state (state)}
			<Attachment.Root {state}
				><Attachment.Media><FileTextIcon /></Attachment.Media><Attachment.Content
					><Attachment.Title>{state}.pdf</Attachment.Title><Attachment.Description
						>{state === 'error' ? 'Upload failed. Retry available.' : state}</Attachment.Description
					></Attachment.Content
				></Attachment.Root
			>
		{/each}
	</div>
	<Attachment.Group tabindex={0} role="group" aria-label="Attachment sizes">
		{#each sizes as size (size)}<Attachment.Root {size}
				><Attachment.Media><FileTextIcon /></Attachment.Media><Attachment.Content
					><Attachment.Title>{size}.pdf</Attachment.Title><Attachment.Description
						>PDF · 1,2 MB</Attachment.Description
					></Attachment.Content
				></Attachment.Root
			>{/each}
	</Attachment.Group>
	<Attachment.Root orientation="vertical"
		><Attachment.Media variant="image"
			><img src="/demo/landscape.svg" alt="Mountain landscape" /></Attachment.Media
		><Attachment.Content
			><Attachment.Title>landscape.svg</Attachment.Title><Attachment.Description
				>Image · ready</Attachment.Description
			></Attachment.Content
		></Attachment.Root
	>
</div>
