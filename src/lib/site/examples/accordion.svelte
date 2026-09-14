<script lang="ts">
	import * as Accordion from '#lib/bedrock/ui/accordion';
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Before your workshop</h3>
		<p class="text-sm text-muted-foreground">
			Single expansion keeps booking questions easy to scan without hiding the main booking details.
		</p>
	</header>
	<div class="rounded-xl border bg-card p-5">
		<p class="font-medium">Field notes workshop · September 18</p>
		<p class="mb-4 text-sm text-muted-foreground">Studio 4 · 10:00–12:30 · Materials included</p>
		<Accordion.Root type="single" value="materials"
			><Accordion.Item value="materials"
				><Accordion.Trigger>What should I bring?</Accordion.Trigger><Accordion.Content
					>Bring a notebook and a charged laptop. We provide drawing materials and a printed
					workbook.</Accordion.Content
				></Accordion.Item
			><Accordion.Item value="access"
				><Accordion.Trigger>Is the studio accessible?</Accordion.Trigger><Accordion.Content
					>The entrance is step-free. A lift reaches Studio 4, and a quiet room is available beside
					reception.</Accordion.Content
				></Accordion.Item
			><Accordion.Item value="cancel"
				><Accordion.Trigger>Can I change my booking?</Accordion.Trigger><Accordion.Content
					>You can move your place to another session up to 48 hours before the workshop.</Accordion.Content
				></Accordion.Item
			></Accordion.Root
		>
	</div>
</section>
