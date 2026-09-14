<script lang="ts">
	import { Progress } from '#lib/bedrock/ui/progress';
</script>

<div class="grid max-w-sm gap-3">
	<Progress aria-label="In-progress example" value={47} />
	<Progress aria-label="Nearly complete example" value={82} />
</div>
