<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import { VisuallyHidden } from '#lib/bedrock/ui/visually-hidden';
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Download a monthly statement</h3>
		<p class="text-sm text-muted-foreground">
			Keep the link concise while including the file type and size in its accessible name.
		</p>
	</div>

	<p class="text-sm">
		This link reads “Download report (PDF, 2.4 MB)” to assistive technology:
		<a
			href="/demo/beleg.pdf"
			class="ml-1 inline-flex items-center gap-1 text-primary underline underline-offset-3"
		>
			<Icon icon="download" />Download report<VisuallyHidden>(PDF, 2.4 MB)</VisuallyHidden>
		</a>
	</p>
</section>
