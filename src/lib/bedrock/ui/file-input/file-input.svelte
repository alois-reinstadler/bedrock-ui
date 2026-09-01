<script lang="ts" module>
	const defaultLabels = {
		browse: 'Choose file',
		browseMultiple: 'Choose files',
		dropPrompt: 'Drag and drop files here, or browse',
		remove: (name: string) => `Remove ${name}`,
		rejectedType: 'Some files have an unsupported type.',
		rejectedSize: 'Some files are too large.',
		rejectedCount: 'Too many files were selected.'
	};

	export type FileInputLabels = Partial<typeof defaultLabels>;
	export type FileRejection = { file: File; reason: 'type' | 'size' | 'count' };
</script>

<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { formatFileSize } from './file-size.js';

	/**
	 * Higher-level file selection with validation, file summaries, and an optional dropzone.
	 * Use the plain Input with `type="file"` for trivial file selection.
	 */
	export type FileInputProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		files?: File[];
		onFilesChange?: (files: File[]) => void;
		multiple?: boolean;
		accept?: string;
		maxFiles?: number;
		maxSize?: number;
		onReject?: (rejections: FileRejection[]) => void;
		mode?: 'input' | 'dropzone';
		disabled?: boolean;
		name?: string;
		labels?: FileInputLabels;
	};

	let {
		files = $bindable([]),
		onFilesChange,
		multiple = false,
		accept,
		maxFiles,
		maxSize,
		onReject,
		mode = 'input',
		disabled = false,
		name,
		labels: labelOverrides,
		class: className,
		ref = $bindable(null),
		...restProps
	}: FileInputProps = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	let inputRef: HTMLInputElement;
	let dragging = $state(false);
	let rejections = $state<FileRejection[]>([]);
	const rejectionMessage = $derived(
		[...new Set(rejections.map(({ reason }) => labels[`rejected${capitalize(reason)}`]))].join(' ')
	);

	function capitalize(value: FileRejection['reason']): 'Type' | 'Size' | 'Count' {
		return `${value[0].toUpperCase()}${value.slice(1)}` as 'Type' | 'Size' | 'Count';
	}

	function acceptsFile(file: File): boolean {
		if (!accept) return true;
		return accept.split(',').some((rule) => {
			const normalized = rule.trim().toLowerCase();
			const type = file.type.toLowerCase();
			const name = file.name.toLowerCase();
			if (normalized.startsWith('.')) return name.endsWith(normalized);
			if (normalized.endsWith('/*')) return type.startsWith(normalized.slice(0, -1));
			return type === normalized;
		});
	}

	function updateFiles(selected: File[]) {
		const rejected: FileRejection[] = [];
		const valid: File[] = [];
		const startingCount = multiple ? files.length : 0;

		for (const file of selected) {
			if (!acceptsFile(file)) rejected.push({ file, reason: 'type' });
			else if (maxSize !== undefined && file.size > maxSize)
				rejected.push({ file, reason: 'size' });
			else if (
				(!multiple && valid.length >= 1) ||
				(maxFiles !== undefined && startingCount + valid.length >= maxFiles)
			)
				rejected.push({ file, reason: 'count' });
			else valid.push(file);
		}

		rejections = rejected;
		if (rejected.length) onReject?.(rejected);
		if (valid.length) {
			files = multiple ? [...files, ...valid] : valid;
			onFilesChange?.(files);
		}
	}

	function handleChange(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		updateFiles(Array.from(input.files ?? []));
		input.value = '';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragging = false;
		if (!disabled) updateFiles(Array.from(event.dataTransfer?.files ?? []));
	}

	function removeFile(index: number) {
		files = files.filter((_, fileIndex) => fileIndex !== index);
		onFilesChange?.(files);
	}

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}

	function setInputRef(element: HTMLInputElement) {
		inputRef = element;
	}
</script>

<div {@attach setRef} data-slot="file-input" class={cn('grid gap-2', className)} {...restProps}>
	<input
		{@attach setInputRef}
		class="sr-only"
		type="file"
		{accept}
		{multiple}
		{disabled}
		{name}
		tabindex="-1"
		onchange={handleChange}
	/>

	{#if mode === 'dropzone'}
		<button
			type="button"
			data-slot="file-input-dropzone"
			class={cn(
				'flex min-h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center text-sm motion-state outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50',
				dragging
					? 'border-primary bg-primary/5 text-foreground'
					: 'border-input text-muted-foreground'
			)}
			{disabled}
			onclick={() => inputRef.click()}
			ondragenter={(event) => {
				event.preventDefault();
				if (!disabled) dragging = true;
			}}
			ondragover={(event) => event.preventDefault()}
			ondragleave={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) dragging = false;
			}}
			ondrop={handleDrop}
		>
			<Icon icon="attachment" class="size-6" />
			<span>{labels.dropPrompt}</span>
		</button>
	{:else}
		<Button
			data-slot="file-input-trigger"
			variant="outline"
			class="w-full justify-start"
			{disabled}
			onclick={() => inputRef.click()}
		>
			<Icon icon="attachment" />
			{multiple ? labels.browseMultiple : labels.browse}
		</Button>
	{/if}

	{#if rejections.length}
		<FieldStatus status="error" message={rejectionMessage} variant="detached" />
	{/if}

	{#if files.length}
		<ul data-slot="file-input-files" class="grid gap-1">
			{#each files as file, index (`${file.name}-${file.size}-${file.lastModified}-${index}`)}
				<li class="flex min-h-11 items-center gap-3 rounded-lg border px-3 py-1.5">
					<Icon
						icon={file.type.startsWith('image/') ? 'image' : 'file'}
						class="text-muted-foreground"
					/>
					<span class="min-w-0 flex-1">
						<span class="block truncate text-sm font-medium">{file.name}</span>
						<span class="block text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
					</span>
					<IconButton
						icon="close"
						label={labels.remove(file.name)}
						size="sm"
						{disabled}
						onclick={() => removeFile(index)}
					/>
				</li>
			{/each}
		</ul>
	{/if}
</div>
