<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { resolveIcon } from './registry.svelte.js';
	import type { IconProps, IconType } from './types.js';

	let {
		icon,
		label,
		class: className,
		...restProps
	}: IconProps & {
		/** Semantic registry name or a direct SVG/Svelte icon component. */
		icon: IconType;
		/** Accessible name. Omit for decorative icons (hidden from assistive
		 * technology) and when an interactive parent already names the control. */
		label?: string;
	} = $props();

	const Resolved = $derived(resolveIcon(icon));
</script>

<Resolved
	data-slot="icon"
	role={label ? 'img' : undefined}
	aria-label={label || undefined}
	aria-hidden={label ? undefined : true}
	class={cn('size-4 shrink-0', className)}
	{...restProps}
/>
