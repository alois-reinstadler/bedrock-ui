<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp-separator.svelte';
</script>

<script lang="ts">
	import InputOtpSeparator from '#lib/shadcn/ui/input-otp/input-otp-separator.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputOtpSeparator> = $props();
</script>

<InputOtpSeparator {...props} />
