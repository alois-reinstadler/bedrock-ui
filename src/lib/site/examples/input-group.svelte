<script lang="ts">
	import * as InputGroup from '#lib/bedrock/ui/input-group';
	import { Icon } from '#lib/bedrock/ui/icon';
</script>

<div class="grid max-w-sm gap-3">
	<InputGroup.Root>
		<InputGroup.Addon><Icon icon="search" /></InputGroup.Addon>
		<InputGroup.Input placeholder="Search orders…" aria-label="Search orders" />
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input placeholder="0.00" aria-label="Amount" />
		<InputGroup.Addon align="inline-end"><InputGroup.Text>EUR</InputGroup.Text></InputGroup.Addon>
	</InputGroup.Root>
</div>
