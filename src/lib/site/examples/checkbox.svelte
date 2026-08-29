<script lang="ts">
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Label } from '#lib/bedrock/ui/label';

	let checked = $state(false);
</script>

<div class="flex items-center gap-2">
	<Checkbox id="logged" bind:checked />
	<Label for="logged">Mark as logged</Label>
</div>
