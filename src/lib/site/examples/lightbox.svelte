<script lang="ts">
	import { Lightbox, type LightboxItem } from '#lib/bedrock/ui/lightbox';
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';

	const items: LightboxItem[] = [
		{
			src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"%3E%3Crect width="160" height="120" fill="%23cbd5e1"/%3E%3Ccircle cx="52" cy="48" r="20" fill="%236366f1"/%3E%3Cpath d="M0 100 60 60l40 30 30-20 30 30v20H0z" fill="%2394a3b8"/%3E%3C/svg%3E',
			alt: 'Site photo, morning',
			caption: 'Morning inspection'
		},
		{ src: '/demo/beleg.pdf', alt: 'Invoice RE-2026-0815', type: 'pdf' }
	];
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Inspection evidence</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Review image and document attachments without losing the inspection summary.
		</p>
	</header>
	<div class="flex flex-wrap items-center justify-between gap-4">
		<div>
			<h4 class="font-medium">North entrance inspection</h4>
			<p class="text-sm text-muted-foreground">Two attachments · Ready for review</p>
		</div>

		<Lightbox {items}>
			<span class="inline-flex items-center gap-2 text-sm">
				<Thumbnail src={items[0].src} alt={items[0].alt} size="lg" />
				Open gallery (image + PDF)
			</span>
		</Lightbox>
	</div>
	<p class="text-sm text-muted-foreground">
		Open the evidence, move between attachments, then press Escape to return to the report.
	</p>
</section>
