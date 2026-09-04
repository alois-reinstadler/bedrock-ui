<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';

	let open = $state(false);
</script>

<Collapsible.Root {open} onOpenChange={(next) => (open = next)} class="max-w-sm space-y-2">
	<Collapsible.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm">
				Delivery details
				<Icon icon={open ? 'chevronUp' : 'chevronDown'} />
			</Button>
		{/snippet}
	</Collapsible.Trigger>
	<Collapsible.Content class="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
		Two parcels, carrier pickup on Friday, signature required.
	</Collapsible.Content>
</Collapsible.Root>
