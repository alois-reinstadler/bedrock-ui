<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Switch } from '#lib/bedrock/ui/switch';

	let checked = $state(true);
</script>

<div class="flex items-center gap-2">
	<Switch id="alerts" bind:checked />
	<Label for="alerts">Shift alerts {checked ? 'on' : 'off'}</Label>
</div>
