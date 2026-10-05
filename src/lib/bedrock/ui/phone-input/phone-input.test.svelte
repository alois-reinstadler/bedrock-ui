<script lang="ts">
	import PhoneInput from './phone-input.svelte';
	import type { PhoneInputMetadata } from './phone.js';
	let { disabled = false, readonly = false, required = false, invalid = false } = $props();
	let value = $state('');
	let metadata = $state<PhoneInputMetadata>();
</script>

<form>
	<label for="test-phone">Phone number</label>
	<PhoneInput
		id="test-phone"
		name="phone"
		e164Name="phoneE164"
		defaultCountry="AT"
		bind:value
		{disabled}
		{readonly}
		{required}
		{invalid}
		onValueChange={(_, next) => (metadata = next)}
	/>
	<output data-testid="raw">{value}</output>
	<output data-testid="e164">{metadata?.e164 ?? ''}</output>
</form>
