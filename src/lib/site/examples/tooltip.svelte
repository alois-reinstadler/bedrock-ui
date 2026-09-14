<script lang="ts">
	import * as Tooltip from '#lib/bedrock/ui/tooltip';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	let saved = $state(false);
</script>

<section class="max-w-md space-y-3 rounded-xl border p-5">
	<div class="flex items-center justify-between gap-3">
		<div>
			<h3 class="font-medium">Quarterly planning notes</h3>
			<p class="text-sm text-muted-foreground">Private document · Draft</p>
		</div>
		<Tooltip.Root
			><Tooltip.Trigger
				>{#snippet child({ props })}<Button
						variant="outline"
						size="icon"
						aria-label="Save document"
						onclick={() => (saved = true)}
						{...props}><Icon icon="check" /></Button
					>{/snippet}</Tooltip.Trigger
			><Tooltip.Content>Save your latest changes</Tooltip.Content></Tooltip.Root
		>
	</div>
	<p class="text-sm">
		Tooltips explain compact controls on hover and keyboard focus. The button keeps its own
		accessible name.
	</p>
	<p class="text-sm" role="status">
		{saved ? 'All changes saved in this demo.' : 'Unsaved changes'}
	</p>
</section>
