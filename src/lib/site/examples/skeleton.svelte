<script lang="ts">
	import { Skeleton } from '#lib/bedrock/ui/skeleton';
</script>

<div class="flex max-w-sm items-center gap-3">
	<Skeleton class="size-8 rounded-full" />
	<div class="grid flex-1 gap-2">
		<Skeleton class="h-3 w-2/5" />
		<Skeleton class="h-3 w-4/5" />
	</div>
</div>
