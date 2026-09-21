<script lang="ts" module>
	export * from '#lib/shadcn/ui/button/button.svelte';
</script>

<script lang="ts">
	import Button from '#lib/shadcn/ui/button/button.svelte';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		ref = $bindable(null),
		disabled,
		class: className,
		...props
	}: ComponentProps<typeof Button> = $props();
</script>

<Button
	{...props}
	bind:ref
	{disabled}
	class={cn(disabled && props.href && 'pointer-events-none opacity-50', className)}
	tabindex={disabled && props.href ? -1 : props.tabindex}
	aria-disabled={disabled && props.href ? true : props['aria-disabled']}
	onclick={(event) => {
		// An anchor has no native disabled state; removing href alone still
		// allows pointer/programmatic clicks to invoke the consumer action.
		if (disabled) {
			event.preventDefault();
			return;
		}
		// Both public overloads receive the unchanged native click event.
		(props.onclick as ((event: MouseEvent) => void) | undefined)?.(event);
	}}
/>
