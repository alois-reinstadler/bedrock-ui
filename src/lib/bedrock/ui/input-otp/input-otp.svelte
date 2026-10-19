<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp.svelte';
</script>

<script lang="ts">
	import InputOtp from '#lib/shadcn/ui/input-otp/input-otp.svelte';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(''),
		...props
	}: ComponentProps<typeof InputOtp> = $props();
</script>

<InputOtp bind:ref bind:value {...props} />
