<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
</script>

<div class="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
	<Card.Root class="block gap-0 p-5">
		<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
			For developers
		</p>
		<h3 class="mt-3 font-semibold">Point to the exact change</h3>
		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
			Select an element and capture its selector, styles, and your note in a portable feedback
			document.
		</p>
		<code class="mt-4 block rounded-md bg-muted p-3 text-xs corner-theme"
			>[data-feedback-id="hero"]</code
		>
	</Card.Root>
	<Card.Root class="block gap-0 p-5">
		<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">For customers</p>
		<h3 class="mt-3 font-semibold">Leave a note, right on the page</h3>
		<p class="mt-2 text-sm leading-relaxed text-muted-foreground">
			A simple review panel for requested changes, with local drafts and resolve/reopen controls.
		</p>
		<p class="mt-4 rounded-md bg-muted p-3 text-xs corner-theme">
			“Could we use the new studio photo here?”
		</p>
	</Card.Root>
</div>
