<script lang="ts">
	import { Separator } from '#lib/bedrock/ui/separator';
</script>

<article class="max-w-sm rounded-xl border p-5">
	<h3 class="font-medium">Order summary</h3>
	<p class="mt-1 text-sm text-muted-foreground">Studio notebook · Quantity 2</p>
	<Separator class="my-4" />
	<dl class="space-y-2 text-sm">
		<div class="flex justify-between">
			<dt>Subtotal</dt>
			<dd>$48.00</dd>
		</div>
		<div class="flex justify-between">
			<dt>Shipping</dt>
			<dd>Free</dd>
		</div>
	</dl>
	<Separator class="my-4" />
	<div class="flex justify-between font-medium"><span>Total</span><span>$48.00</span></div>
	<p class="mt-4 text-xs text-muted-foreground">
		Separators group line items and totals without adding extra headings.
	</p>
</article>
