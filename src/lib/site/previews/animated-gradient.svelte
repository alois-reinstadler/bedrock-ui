<script lang="ts">
	import { AnimatedGradient } from '#lib/bedrock/ui/animated-gradient';
	import { Button } from '#lib/bedrock/ui/button';
	let paused = $state(false);
</script>

<div class="w-full space-y-3">
	<AnimatedGradient
		{paused}
		class="flex min-h-64 flex-col items-center justify-center rounded-xl px-6 py-12 text-center text-white"
	>
		<div class="rounded-xl bg-black/65 p-6 shadow-lg">
			<p class="text-xs font-medium tracking-widest uppercase">Made for a moment</p>
			<h3 class="mt-3 text-3xl font-semibold tracking-tight">Room to imagine.</h3>
			<p class="mt-3 max-w-xs text-sm text-white/85">
				A slow mesh of color, with a static fallback.
			</p>
		</div>
	</AnimatedGradient>
	<div class="flex flex-wrap items-center justify-between gap-3">
		<p class="text-xs text-muted-foreground">WebGL2 required · CSS gradient fallback</p>
		<Button variant="outline" size="sm" onclick={() => (paused = !paused)}
			>{paused ? 'Play animation' : 'Pause animation'}</Button
		>
	</div>
</div>
