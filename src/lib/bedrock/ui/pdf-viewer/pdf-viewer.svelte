<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { Skeleton, SkeletonGroup } from '#lib/bedrock/ui/skeleton';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { PDFDocumentLoadingTask, RenderTask } from 'pdfjs-dist';

	let {
		ref = $bindable(null),
		class: className,
		src,
		errorText = 'Could not load PDF.',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		src: string;
		errorText?: string;
	} = $props();
	let failed = $state(false);
	let loading = $state(true);

	function loadPdf(host: HTMLDivElement) {
		const source = src;
		let cancelled = false;
		let task: PDFDocumentLoadingTask | undefined;
		let render: RenderTask | undefined;
		failed = false;
		loading = true;
		host.replaceChildren();
		(async () => {
			try {
				if (!source) throw new Error('Missing PDF source');
				const pdfjs = await import('pdfjs-dist');
				if (cancelled) return;
				pdfjs.GlobalWorkerOptions.workerSrc = new URL(
					'pdfjs-dist/build/pdf.worker.min.mjs',
					import.meta.url
				).toString();
				task = pdfjs.getDocument({ url: source });
				const document_ = await task.promise;
				if (cancelled) return;
				const width = host.clientWidth || 640;
				const ratio = Math.min(window.devicePixelRatio || 1, 2);
				for (let number = 1; number <= document_.numPages; number += 1) {
					const page = await document_.getPage(number);
					if (cancelled) return;
					const base = page.getViewport({ scale: 1 });
					const viewport = page.getViewport({ scale: (width / base.width) * ratio });
					const canvas = document.createElement('canvas');
					canvas.width = viewport.width;
					canvas.height = viewport.height;
					canvas.style.width = '100%';
					canvas.style.display = 'block';
					canvas.setAttribute('aria-label', `Page ${number}`);
					render = page.render({ canvas, viewport });
					await render.promise;
					if (cancelled) return;
					host.appendChild(canvas);
					if (number === 1) loading = false;
				}
			} catch {
				if (!cancelled) {
					failed = true;
					loading = false;
				}
			}
		})();
		return () => {
			cancelled = true;
			render?.cancel();
			void task?.destroy().catch(() => {});
		};
	}
	function attachRef(node: HTMLDivElement) {
		ref = node;
		return () => {
			if (ref === node) ref = null;
		};
	}
</script>

<div
	{@attach attachRef}
	data-slot="pdf-viewer"
	class={cn('relative overflow-y-auto overscroll-contain bg-muted/30', className)}
	{...restProps}
	aria-busy={loading}
>
	{#if failed}
		<p role="alert" class="p-6 text-center text-sm text-muted-foreground">{errorText}</p>
	{:else if loading}
		<div data-slot="pdf-viewer-loading" role="status" class="p-4 sm:p-6">
			<span class="sr-only">Loading PDF</span>
			<SkeletonGroup
				class="mx-auto aspect-[1/1.414] w-full space-y-6 rounded-sm border bg-background p-6 shadow-sm sm:p-10"
				aria-hidden="true"
			>
				<div class="flex items-start justify-between gap-8">
					<Skeleton class="h-8 w-1/3" /><Skeleton class="h-5 w-1/5" />
				</div>
				<div class="space-y-3 pt-6">
					<Skeleton class="h-5 w-2/3" /><Skeleton class="h-3 w-full" /><Skeleton
						class="h-3 w-5/6"
					/><Skeleton class="h-3 w-full" />
				</div>
				<Skeleton class="h-28 w-full" />
				<div class="space-y-3">
					<Skeleton class="h-3 w-full" /><Skeleton class="h-3 w-4/5" /><Skeleton
						class="h-3 w-1/2"
					/>
				</div>
			</SkeletonGroup>
		</div>
	{/if}
	<div
		{@attach loadPdf}
		class={cn('flex flex-col gap-2', loading && 'invisible absolute inset-x-0 top-0')}
		aria-hidden={loading || undefined}
	></div>
</div>
