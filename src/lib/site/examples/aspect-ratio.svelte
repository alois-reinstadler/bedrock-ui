<script lang="ts">
	import { AspectRatio } from '#lib/bedrock/ui/aspect-ratio';
</script>

<div class="max-w-sm">
	<AspectRatio ratio={16 / 9}>
		<div
			class="flex h-full w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground"
		>
			16 : 9
		</div>
	</AspectRatio>
</div>
