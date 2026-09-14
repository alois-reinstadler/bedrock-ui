<script lang="ts">
	import * as Avatar from '#lib/bedrock/ui/avatar';
</script>

<div class="flex flex-wrap items-end gap-6">
	{#each ['sm', 'default', 'lg'] as size (size)}<div class="grid justify-items-center gap-2">
			<Avatar.Root size={size as 'sm' | 'default' | 'lg'}
				><Avatar.Fallback>MV</Avatar.Fallback></Avatar.Root
			><span class="text-xs text-muted-foreground"
				>{size === 'default' ? 'Default' : size === 'sm' ? 'Small' : 'Large'}</span
			>
		</div>{/each}
</div>
