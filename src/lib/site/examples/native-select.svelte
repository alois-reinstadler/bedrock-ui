<script lang="ts">
	import * as NativeSelect from '#lib/bedrock/ui/native-select';

	let value = $state('pending');
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Order fulfillment</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Use the platform select for a short, predictable list. Changing status updates the next
			operational step.
		</p>
	</header>

	<div class="max-w-56">
		<NativeSelect.Root
			{value}
			onchange={(event) => (value = event.currentTarget.value)}
			aria-label="Order status"
		>
			<NativeSelect.Option value="pending">Pending</NativeSelect.Option>
			<NativeSelect.Option value="approved">Approved</NativeSelect.Option>
			<NativeSelect.Option value="shipped">Shipped</NativeSelect.Option>
		</NativeSelect.Root>
	</div>
	<p role="status" class="text-sm">
		{value === 'pending'
			? 'Waiting for payment review. Do not dispatch yet.'
			: value === 'approved'
				? 'Payment approved. Pack the order and print its shipping label.'
				: 'Order dispatched. The customer can now track delivery.'}
	</p>
</section>
