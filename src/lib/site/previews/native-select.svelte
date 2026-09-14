<script lang="ts">
	import * as NativeSelect from '#lib/bedrock/ui/native-select';

	let value = $state('pending');
</script>

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
