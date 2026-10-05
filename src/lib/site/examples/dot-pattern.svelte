<script lang="ts">
	import { DotPattern } from '#lib/bedrock/ui/dot-pattern';
</script>

<div class="grid w-full gap-4 sm:grid-cols-2">
	<div
		class="relative isolate flex min-h-52 items-center justify-center overflow-hidden rounded-xl border bg-card p-6"
	>
		<DotPattern />
		<div class="relative rounded-lg bg-card/90 p-4 text-center">
			<p class="font-medium">A quiet foundation</p>
			<p class="mt-1 text-xs text-muted-foreground">Texture with room to breathe.</p>
		</div>
	</div>
	<div
		class="relative isolate flex min-h-52 items-center justify-center overflow-hidden rounded-xl border bg-primary/5 p-6"
	>
		<DotPattern opacity={0.3} />
		<div class="relative rounded-lg bg-card/90 p-4 text-center">
			<p class="font-medium">Make it your own</p>
			<p class="mt-1 text-xs text-muted-foreground">Static texture · No WebGL required</p>
		</div>
	</div>
</div>
