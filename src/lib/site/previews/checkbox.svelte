<script lang="ts">
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	let checked = $state(false);
</script>

<div class="flex flex-wrap gap-6">
	<label class="flex items-center gap-2 text-sm"><Checkbox bind:checked />Default</label><label
		class="flex items-center gap-2 text-sm"><Checkbox checked />Checked</label
	><label class="flex items-center gap-2 text-sm"><Checkbox indeterminate />Mixed</label><label
		class="flex items-center gap-2 text-sm"><Checkbox disabled />Disabled</label
	>
</div>
