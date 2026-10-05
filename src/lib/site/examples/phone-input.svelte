<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { PhoneInput, type PhoneInputMetadata } from '#lib/bedrock/ui/phone-input';
	let value = $state('');
	let metadata = $state<PhoneInputMetadata>();
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Stay in touch</h3>
		<p class="text-sm text-muted-foreground">
			Choose a country or paste a complete international number.
		</p>
	</div>
	<Card.Root class="block max-w-md gap-0 space-y-4 p-5">
		<div class="space-y-2">
			<label for="contact-phone" class="text-sm font-medium">Phone number</label>
			<PhoneInput
				id="contact-phone"
				name="phone"
				e164Name="phoneE164"
				bind:value
				defaultCountry="AT"
				placeholder="0664 1234567"
				aria-describedby="contact-phone-help"
				onValueChange={(_, next) => (metadata = next)}
			/>
			<p id="contact-phone-help" class="text-xs text-muted-foreground">
				Your formatting stays intact as you type.
			</p>
		</div>
		<div class="rounded-lg bg-muted/50 px-3 py-2.5 text-xs corner-theme">
			<span class="text-muted-foreground">International value</span>
			<p class="mt-1 font-mono">{metadata?.e164 ?? 'Enter a complete number'}</p>
		</div>
	</Card.Root>
	<div class="max-w-md space-y-2">
		<label for="readonly-phone" class="text-sm font-medium">Verified contact</label>
		<PhoneInput id="readonly-phone" value="+44 20 7946 0018" readonly />
	</div>
</section>
