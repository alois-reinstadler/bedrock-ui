<script lang="ts">
	import ColorPicker from './color-picker.svelte';
	import ColorArea from '../color-area/color-area.svelte';
	import ColorSlider from '../color-slider/color-slider.svelte';
	import ColorField from '../color-field/color-field.svelte';
	import ColorSwatch from '../color-swatch/color-swatch.svelte';
	import ColorSwatchPicker from '../color-swatch-picker/color-swatch-picker.svelte';
	let { standalone = false, disabled = false }: { standalone?: boolean; disabled?: boolean } =
		$props();
	let value = $state('#ff000080');
</script>

<form>
	{#if standalone}
		<ColorField bind:value alpha name="color" />
		<ColorSlider bind:value alpha channel="hue" />
		<ColorArea bind:value alpha />
	{:else}
		<ColorPicker bind:value alpha {disabled} name="color">
			<ColorArea />
			<ColorSlider channel="hue" />
			<ColorSlider channel="alpha" />
			<ColorField format="rgb" />
			<ColorSwatch />
			<ColorSwatchPicker swatches={['#ff000080', '#00ff00', '#00f', '#00f']} />
		</ColorPicker>
	{/if}
	<button type="button" data-external="blue" onclick={() => (value = '#0000ff80')}
		>External blue</button
	>
	<button type="button" data-external="gray" onclick={() => (value = '#80808080')}
		>External gray</button
	>
	<button type="button" data-external="black" onclick={() => (value = '#00000080')}
		>External black</button
	>
	<output>{value}</output>
</form>
