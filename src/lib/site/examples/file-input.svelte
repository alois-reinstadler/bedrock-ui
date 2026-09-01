<script lang="ts">
	import { FileInput } from '#lib/bedrock/ui/file-input';

	let files = $state<File[]>([]);
</script>

<div class="grid max-w-md gap-6">
	<FileInput bind:files accept="image/*,.pdf" multiple maxFiles={3} maxSize={5 * 1024 * 1024} />
	<FileInput bind:files mode="dropzone" accept="image/*,.pdf" multiple maxFiles={3} />
</div>
