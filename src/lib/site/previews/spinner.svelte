<script lang="ts">
	import { Spinner } from '#lib/bedrock/ui/spinner';
</script>

<div class="flex items-center gap-3 text-sm text-muted-foreground">
	<Spinner />
	Reading pumps
</div>

<div class="mt-4 flex items-center gap-4" aria-label="Spinner sizes">
	<Spinner class="size-3" /><Spinner class="size-5" /><Spinner class="size-8" />
</div>
