<script lang="ts">
	import * as Field from '#lib/bedrock/ui/field';
	import { Input } from '#lib/bedrock/ui/input';
	import { Button } from '#lib/bedrock/ui/button';
	let saved = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Delivery instructions</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Group each label, control, and explanation so the reason for collecting personal information
			stays clear.
		</p>
	</header>
	<form
		class="space-y-4"
		onsubmit={(event) => {
			event.preventDefault();
			saved = true;
		}}
	>
		<Field.Field
			><Field.Label for="shipping-contact">Delivery contact</Field.Label><Input
				id="shipping-contact"
				name="contact"
				required
				autocomplete="name"
				placeholder="Alex Morgan"
			/><Field.Description>The courier will ask for this person at reception.</Field.Description
			></Field.Field
		><Field.Field
			><Field.Label for="shipping-phone">Phone number</Field.Label><Input
				id="shipping-phone"
				name="phone"
				type="tel"
				autocomplete="tel"
				required
			/><Field.Description>Only used if the courier cannot find the entrance.</Field.Description
			></Field.Field
		><Button type="submit">Save delivery details</Button>
		<p role="status" class="text-sm">
			{saved ? 'Delivery details saved in this demonstration.' : ''}
		</p>
	</form>
</section>
