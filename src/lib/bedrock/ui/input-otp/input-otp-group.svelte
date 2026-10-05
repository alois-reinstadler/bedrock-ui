<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp-group.svelte';
</script>

<script lang="ts">
	import InputOtpGroup from '#lib/shadcn/ui/input-otp/input-otp-group.svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...props }: ComponentProps<typeof InputOtpGroup> = $props();
</script>

<InputOtpGroup bind:ref {...props} />
