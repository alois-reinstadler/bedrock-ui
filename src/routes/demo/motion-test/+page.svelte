<script lang="ts">
	import MotionStressFixture from '#lib/bedrock/motion/motion-stress-fixture.svelte';
</script>

<svelte:head>
	<title>Bedrock Bewegungstest</title>
</svelte:head>

<main>
	<h1>Bedrock Bewegungstest</h1>
	<MotionStressFixture />
</main>

<style>
	main {
		padding: 1rem;
	}

	h1 {
		margin-bottom: 1rem;
		font-size: 1.25rem;
	}
</style>
