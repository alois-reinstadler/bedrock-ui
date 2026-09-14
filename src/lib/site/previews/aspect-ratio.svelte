<script lang="ts">
	import { AspectRatio } from '#lib/bedrock/ui/aspect-ratio';
</script>

<div class="grid grid-cols-2 items-start gap-4">
	<div>
		<AspectRatio ratio={16 / 9}
			><div class="flex h-full items-center justify-center rounded-lg bg-muted text-sm">
				16:9 · Video
			</div></AspectRatio
		>
	</div>
	<div>
		<AspectRatio ratio={1}
			><div class="flex h-full items-center justify-center rounded-lg bg-muted text-sm">
				1:1 · Square
			</div></AspectRatio
		>
	</div>
</div>
