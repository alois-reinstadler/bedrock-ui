<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp-slot.svelte';
</script>

<script lang="ts">
	import InputOtpSlot from '#lib/shadcn/ui/input-otp/input-otp-slot.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputOtpSlot> = $props();
</script>

<InputOtpSlot {...props} />
