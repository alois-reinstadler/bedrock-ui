<script lang="ts">
	import { PhoneInput } from '#lib/bedrock/ui/phone-input';
</script>

<div class="w-full max-w-xs space-y-3">
	<PhoneInput value="0664 1234567" defaultCountry="AT" aria-label="Phone number preview" />
	<PhoneInput value="+44 20 7946 0018" disabled aria-label="Disabled phone number preview" />
</div>
