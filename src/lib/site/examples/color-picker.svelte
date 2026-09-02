<script lang="ts">
	import { ColorPicker } from '#lib/bedrock/ui/color-picker';
	import { Text } from '#lib/bedrock/ui/text';

	let panelValue = $state('#6e56cf');
	let swatchValue = $state('#0ea5e9');
</script>

<div class="flex flex-wrap items-start gap-8">
	<div class="flex flex-col gap-3">
		<ColorPicker bind:value={panelValue} />
		<Text type="code" color="muted">{panelValue}</Text>
	</div>
	<div class="flex w-48 flex-col gap-3">
		<ColorPicker variant="swatches" bind:value={swatchValue} />
		<Text type="code" color="muted">{swatchValue}</Text>
	</div>
</div>
