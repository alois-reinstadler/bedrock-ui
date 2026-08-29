<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp.svelte';
</script>

<script lang="ts">
	import InputOtp from '#lib/shadcn/ui/input-otp/input-otp.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputOtp> = $props();
</script>

<InputOtp {...props} />
