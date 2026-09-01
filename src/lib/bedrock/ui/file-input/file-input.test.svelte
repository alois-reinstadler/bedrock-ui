<script lang="ts">
	import FileInput from './file-input.svelte';

	let multipleFiles = $state<File[]>([new File(['old'], 'old.txt', { type: 'text/plain' })]);
	let singleFiles = $state<File[]>([new File(['first'], 'first.txt', { type: 'text/plain' })]);
	let rejectionCount = $state(0);
</script>

<div data-testid="multiple">
	<FileInput
		bind:files={multipleFiles}
		multiple
		accept="image/*"
		maxSize={4}
		onReject={(items) => (rejectionCount += items.length)}
	/>
	<output data-testid="multiple-value">{multipleFiles.map((file) => file.name).join(',')}</output>
	<output data-testid="rejections">{rejectionCount}</output>
</div>

<div data-testid="single">
	<FileInput bind:files={singleFiles} />
	<output data-testid="single-value">{singleFiles.map((file) => file.name).join(',')}</output>
</div>

<div data-testid="dropzone">
	<FileInput mode="dropzone" />
</div>
