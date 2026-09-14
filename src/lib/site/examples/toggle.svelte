<script lang="ts">
	import { Toggle } from '#lib/bedrock/ui/toggle';
	let pressed = $state(false);
</script>

<section class="max-w-md space-y-4 rounded-xl border p-5">
	<div class="flex items-center justify-between gap-4">
		<h3 class="font-medium">Review queue</h3>
		<Toggle
			{pressed}
			onPressedChange={(next) => (pressed = next)}
			variant="outline"
			aria-label="Show only items assigned to me">Assigned to me</Toggle
		>
	</div>
	<p class="text-sm text-muted-foreground">
		A toggle applies a reversible filter; it does not submit the review.
	</p>
	<ul class="divide-y text-sm">
		<li class="py-3">Homepage copy · Assigned to you</li>
		{#if !pressed}<li class="py-3">Billing settings · Assigned to Ellis</li>{/if}
		<li class="py-3">Welcome email · Assigned to you</li>
	</ul>
	<p role="status" class="text-xs text-muted-foreground">Showing {pressed ? 2 : 3} review items</p>
</section>
