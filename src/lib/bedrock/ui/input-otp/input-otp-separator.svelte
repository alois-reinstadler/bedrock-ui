<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp-separator.svelte';
</script>

<script lang="ts">
	import InputOtpSeparator from '#lib/shadcn/ui/input-otp/input-otp-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof InputOtpSeparator> = $props();
</script>

<InputOtpSeparator bind:ref {...props} />
