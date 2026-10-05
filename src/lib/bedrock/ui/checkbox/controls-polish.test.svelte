<script lang="ts">
	import Checkbox from './checkbox.svelte';
	import Slider from '../slider/slider.svelte';
	import CheckboxIndicator from '../indicator/checkbox-indicator.svelte';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';

	let checked = $state(false);
	let reduced = $state(false);
	let scalar = $state(40);
	let range = $state([20, 80]);
	let vertical = $state(30);
</script>

<MotionProvider {reduced}>
	<button onclick={() => (reduced = !reduced)}>Toggle reduced motion</button>
	<form>
		<Checkbox bind:checked aria-label="Consent" name="consent" />
		<Checkbox aria-label="Mixed checkbox" indeterminate />
		<Checkbox aria-label="Disabled checkbox" disabled />
		<CheckboxIndicator state={checked ? 'checked' : 'unchecked'} />
		<div data-testid="scalar"><Slider type="single" bind:value={scalar} /></div>
		<div data-testid="range"><Slider type="multiple" bind:value={range} /></div>
		<div data-testid="vertical" style="height: 200px">
			<Slider type="single" orientation="vertical" bind:value={vertical} />
		</div>
		<div data-testid="disabled"><Slider type="single" value={50} disabled /></div>
	</form>
</MotionProvider>
