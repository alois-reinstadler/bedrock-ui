<script lang="ts">
	import ColorPicker, { type ColorPickerProps } from './color-picker.svelte';

	let {
		value = $bindable('#6e56cf'),
		format = $bindable('hex'),
		...restProps
	}: ColorPickerProps = $props();
</script>

<ColorPicker bind:value bind:format {...restProps} />
<output data-testid="bound-value">{value}</output>
