<script lang="ts">
	import { cn } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getSteppedFormStepContext, getSteppedFormContext } from './context.js';
	let {
		class: className,
		children,
		...restProps
	}: HTMLAttributes<HTMLHeadingElement> & { children?: Snippet } = $props();
	const context = getSteppedFormContext();
	const getStep = getSteppedFormStepContext();
</script>

<h2
	id={context.getTitleId(getStep())}
	tabindex="-1"
	data-slot="stepped-form-title"
	class={cn('text-xl font-semibold tracking-tight outline-none', className)}
	{...restProps}
>
	{@render children?.()}
</h2>
