<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	let saved = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Billing contact form</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Labels explain required and optional fields and remain clickable after values are entered.
		</p>
	</header>
	<form
		class="space-y-4"
		onsubmit={(event) => {
			event.preventDefault();
			saved = true;
		}}
	>
		<div class="space-y-2">
			<Label for="invoice-name"
				>Billing contact <span class="text-muted-foreground">(required)</span></Label
			><Input id="invoice-name" name="contact" required autocomplete="name" />
		</div>
		<div class="space-y-2">
			<Label for="invoice-reference"
				>Purchase order <span class="text-muted-foreground">(optional)</span></Label
			><Input id="invoice-reference" name="reference" aria-describedby="invoice-reference-help" />
			<p id="invoice-reference-help" class="text-xs text-muted-foreground">
				Printed on invoices so your finance team can match the expense.
			</p>
		</div>
		<Button type="submit">Save billing contact</Button>
		<p role="status">{saved ? 'Sample billing contact saved.' : ''}</p>
	</form>
</section>
