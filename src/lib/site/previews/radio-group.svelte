<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';

	let value = $state('standard');
</script>

<RadioGroup.Root {value} onValueChange={(next) => (value = next)} class="gap-2">
	<div class="flex items-center gap-2">
		<RadioGroup.Item value="standard" id="preview-ship-standard" />
		<Label for="preview-ship-standard">Standard (3–5 days)</Label>
	</div>
	<div class="flex items-center gap-2">
		<RadioGroup.Item value="express" id="preview-ship-express" />
		<Label for="preview-ship-express">Express (next day)</Label>
	</div>
	<div class="flex items-center gap-2">
		<RadioGroup.Item value="unavailable" id="preview-ship-unavailable" disabled /><Label
			for="preview-ship-unavailable">Unavailable</Label
		>
	</div></RadioGroup.Root
>
