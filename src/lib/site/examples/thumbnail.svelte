<script lang="ts">
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';

	const image =
		'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"%3E%3Crect width="160" height="120" fill="%23cbd5e1"/%3E%3Ccircle cx="52" cy="48" r="20" fill="%236366f1"/%3E%3Cpath d="M0 100 60 60l40 30 30-20 30 30v20H0z" fill="%2394a3b8"/%3E%3C/svg%3E';
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Review incoming attachments</h3>
		<p class="text-sm text-muted-foreground">
			Use compact thumbnails beside file names so the image supports identification rather than
			replacing it.
		</p>
	</div>

	<ul class="max-w-md divide-y rounded-xl border px-4">
		<li class="flex items-center gap-3 py-4">
			<Thumbnail src={image} alt="Abstract landscape" size="lg" />
			<div>
				<p class="text-sm font-medium">retreat-cover.svg</p>
				<p class="text-xs text-muted-foreground">Cover artwork · 18 KB · Ready for review</p>
			</div>
		</li>
		<li class="flex items-center gap-3 py-4">
			<Thumbnail alt="" />
			<div>
				<p class="text-sm font-medium">venue-notes.txt</p>
				<p class="text-xs text-muted-foreground">Text document · No image preview available</p>
			</div>
		</li>
	</ul>
</section>
