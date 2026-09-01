<script lang="ts">
	import { NumberInput } from '#lib/bedrock/ui/number-input';

	let quantity = $state<number | null>(12.5);
	let price = $state<number | null>(1234.5);
	let storage = $state<number | null>(64);
</script>

<div class="grid max-w-sm gap-4">
	<NumberInput bind:value={quantity} aria-label="Quantity" />
	<NumberInput
		bind:value={price}
		locale="de-AT"
		formatOptions={{ style: 'currency', currency: 'EUR' }}
		aria-label="Price"
	/>
	<NumberInput bind:value={storage} steppers unit="GB" min={0} aria-label="Storage" />
</div>
