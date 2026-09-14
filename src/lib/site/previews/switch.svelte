<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import { Switch } from '#lib/bedrock/ui/switch';

	let checked = $state(true);
</script>

<div class="flex items-center gap-2">
	<Switch id="preview-alerts" bind:checked />
	<Label for="preview-alerts">Shift alerts {checked ? 'on' : 'off'}</Label>
</div>

<div class="mt-4 flex items-center gap-2">
	<Switch id="preview-switch-disabled" disabled /><Label for="preview-switch-disabled"
		>Disabled</Label
	>
</div>
