<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		src,
		errorText = 'PDF konnte nicht geladen werden.',
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		src: string;
		errorText?: string;
	} = $props();

	let pages = $state<HTMLDivElement | null>(null);
	let failed = $state(false);
	let loading = $state(true);

	$effect(() => {
		if (!pages || !src) return;
		let cancelled = false;
		failed = false;
		loading = true;
		const host = pages;

		(async () => {
			// pdf.js is browser-only and heavy; load it lazily on demand.
			const pdfjs = await import('pdfjs-dist');
			pdfjs.GlobalWorkerOptions.workerSrc = new URL(
				'pdfjs-dist/build/pdf.worker.min.mjs',
				import.meta.url
			).toString();
			try {
				const document_ = await pdfjs.getDocument({ url: src }).promise;
				if (cancelled) return;
				host.replaceChildren();
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
					host.appendChild(canvas);
					await page.render({ canvas, viewport }).promise;
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
		};
	});
</script>

<div
	bind:this={ref}
	data-slot="pdf-viewer"
	class={cn('overflow-y-auto overscroll-contain bg-white', className)}
	{...restProps}
>
	{#if failed}
		<p class="p-6 text-center text-sm text-muted-foreground">{errorText}</p>
	{:else if loading}
		<div class="h-full w-full animate-pulse bg-muted motion-reduce:animate-none"></div>
	{/if}
	<div bind:this={pages} class="flex flex-col gap-2"></div>
</div>
