<script lang="ts">
	import * as Sheet from '#lib/bedrock/ui/sheet';
	import { Button } from '#lib/bedrock/ui/button';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { Label } from '#lib/bedrock/ui/label';
	let note = $state('');
	let saved = $state('');
	let open = $state(false);
</script>

<section class="max-w-md space-y-3 rounded-xl border p-5">
	<h3 class="font-medium">Customer delivery notes</h3>
	<p class="text-sm text-muted-foreground">
		Keep the order visible while editing details in a side panel.
	</p>
	<p class="text-sm" role="status">{saved || 'No delivery instructions added.'}</p>
	<Sheet.Root {open} onOpenChange={(next) => (open = next)}
		><Sheet.Trigger
			>{#snippet child({ props })}<Button variant="outline" {...props}>Edit delivery notes</Button
				>{/snippet}</Sheet.Trigger
		><Sheet.Content
			><Sheet.Header
				><Sheet.Title>Delivery instructions</Sheet.Title><Sheet.Description
					>These notes appear on the packing slip for order #1048.</Sheet.Description
				></Sheet.Header
			>
			<form
				class="space-y-4 p-4"
				onsubmit={(event) => {
					event.preventDefault();
					saved = note;
					open = false;
				}}
			>
				<Label for="delivery-note">Instructions for the courier</Label><Textarea
					id="delivery-note"
					value={note}
					oninput={(event) => (note = event.currentTarget.value)}
					placeholder="Leave the parcel with reception."
				/><Button type="submit">Save notes</Button>
			</form></Sheet.Content
		></Sheet.Root
	>
</section>
