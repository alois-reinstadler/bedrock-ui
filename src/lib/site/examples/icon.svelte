<script lang="ts">
	import { Icon, type IconName } from '#lib/bedrock/ui/icon';

	const names: IconName[] = [
		'search',
		'calendar',
		'clock',
		'funnel',
		'copy',
		'download',
		'attachment',
		'microphone'
	];
</script>

<div class="flex flex-col gap-3">
	<div class="flex flex-wrap items-center gap-3 text-muted-foreground">
		{#each names as name (name)}
			<span class="inline-flex items-center gap-1.5 text-xs"><Icon icon={name} />{name}</span>
		{/each}
	</div>
	<p class="text-sm">
		Labelled icons speak for themselves: <Icon
			icon="warning"
			label="Warning"
			class="inline text-amber-600"
		/>
	</p>
</div>
