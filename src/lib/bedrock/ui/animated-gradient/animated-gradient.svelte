<script lang="ts" module>
	import type { ShaderBackgroundProps } from '../backgrounds/shader-background.svelte';
	export type AnimatedGradientProps = Omit<
		ShaderBackgroundProps,
		'effect' | 'intensity' | 'density'
	>;
</script>

<script lang="ts">
	import ShaderBackground from '../backgrounds/shader-background.svelte';
	let props: AnimatedGradientProps = $props();
</script>

<ShaderBackground {...props} effect="gradient" />
