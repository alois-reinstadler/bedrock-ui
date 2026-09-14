<script lang="ts">
	import { PdfViewer } from '#lib/bedrock/ui/pdf-viewer';

	import { Button } from '#lib/bedrock/ui/button';
	let approved = $state(false);
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Invoice review</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Inspect the original attachment alongside the approval context. The local PDF is a sample
			document.
		</p>
	</header>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h4 class="font-medium">Invoice attachment</h4>
			<p class="text-sm text-muted-foreground">Finance review · Original PDF</p>
		</div>
		<Button variant="outline" onclick={() => (approved = !approved)}
			>{approved ? 'Reopen review' : 'Mark reviewed'}</Button
		>
	</div>

	<PdfViewer src="/demo/beleg.pdf" class="h-96 rounded-lg border" />
	<p role="status" class="text-sm">
		{approved
			? 'Attachment reviewed in this demonstration.'
			: 'Check the document before marking it reviewed.'}
	</p>
</section>
