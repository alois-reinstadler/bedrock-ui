<script lang="ts">
	import { LightRays } from '#lib/bedrock/ui/light-rays';
	import { Button } from '#lib/bedrock/ui/button';
	let paused = $state(false);
</script>

<div class="w-full space-y-3">
	<LightRays
		{paused}
		backgroundColor="var(--background)"
		class="flex min-h-[500px] w-full items-center justify-center md:min-h-[350px]"
	>
		<div class="flex flex-wrap justify-center gap-2 text-primary">
			<p class="text-4xl font-semibold tracking-tighter">Beautiful</p>
			<p class="font-serif text-4xl font-medium italic">Light Rays</p>
		</div>
	</LightRays>
	<div class="flex justify-end">
		<Button variant="outline" size="sm" onclick={() => (paused = !paused)}
			>{paused ? 'Play animation' : 'Pause animation'}</Button
		>
	</div>
</div>
