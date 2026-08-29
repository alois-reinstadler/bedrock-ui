<script lang="ts" module>
	export * from '#lib/shadcn/ui/input-otp/input-otp-group.svelte';
</script>

<script lang="ts">
	import InputOtpGroup from '#lib/shadcn/ui/input-otp/input-otp-group.svelte';
	import type { ComponentProps } from 'svelte';

	let props: ComponentProps<typeof InputOtpGroup> = $props();
</script>

<InputOtpGroup {...props} />
