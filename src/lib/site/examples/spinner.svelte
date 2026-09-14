<script lang="ts">
	import { Spinner } from '#lib/bedrock/ui/spinner';
	import { Button } from '#lib/bedrock/ui/button';
	let pending = $state(false);
	let complete = $state(false);
</script>

<section class="max-w-md space-y-4 rounded-xl border p-5">
	<h3 class="font-medium">Export customer list</h3>
	<p class="text-sm text-muted-foreground">
		Keep the button label visible while work is pending and announce completion separately.
	</p>
	<Button
		disabled={pending}
		onclick={async () => {
			pending = true;
			complete = false;
			await new Promise((resolve) => setTimeout(resolve, 1200));
			pending = false;
			complete = true;
		}}
		>{#if pending}<Spinner aria-hidden="true" />{/if}{pending
			? 'Preparing export…'
			: 'Prepare export'}</Button
	>
	<p role="status" class="text-sm">
		{complete
			? 'Demo export prepared. No customer data was downloaded.'
			: pending
				? 'Preparing the sample export.'
				: 'Ready to export 24 sample contacts.'}
	</p>
</section>
