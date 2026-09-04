<script lang="ts">
	import { Label } from '#lib/bedrock/ui/label';
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';

	let value = $state('standard');
</script>

<RadioGroup.Root {value} onValueChange={(next) => (value = next)} class="gap-2">
	<div class="flex items-center gap-2">
		<RadioGroup.Item value="standard" id="ship-standard" />
		<Label for="ship-standard">Standard (3–5 days)</Label>
	</div>
	<div class="flex items-center gap-2">
		<RadioGroup.Item value="express" id="ship-express" />
		<Label for="ship-express">Express (next day)</Label>
	</div>
</RadioGroup.Root>
