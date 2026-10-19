<script lang="ts">
	import '../bedrock/styles.css';
	import MotionProvider from '../bedrock/motion/MotionProvider.svelte';
	import HeroPlayground from './HeroPlayground.svelte';
	let reduced = $state(false);
	export function reduce(value: boolean) {
		reduced = value;
	}
</script>

<MotionProvider {reduced}><HeroPlayground /></MotionProvider>
