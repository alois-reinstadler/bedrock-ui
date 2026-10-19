<script lang="ts" module>
	export * from '#lib/shadcn/ui/tooltip/tooltip-content.svelte';
</script>

<script lang="ts">
	import { surfacePresence } from '#lib/bedrock/motion/surface-interaction.js';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import TooltipContent from '#lib/shadcn/ui/tooltip/tooltip-content.svelte';
	import { Tooltip as TooltipPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';
	import type { ComponentProps } from 'svelte';

	const policy = useMotionPolicy();
	const uid = $props.id();

	let {
		ref = $bindable(null),
		id = `bedrock-tooltip-${uid}`,
		children,
		child: childSnippet,
		arrowClasses,
		class: className,
		...restProps
	}: ComponentProps<typeof TooltipContent> = $props();
</script>

<TooltipContent
	bind:ref
	{id}
	{@attach policy.attach}
	{@attach surfacePresence}
	class={cn('motion-hint', className)}
	{...restProps}
>
	{#snippet child({ props, wrapperProps, ...snippetProps })}
		<!-- Bits 2.19's popper consumes id and omits role. Restore both on the
		     semantic content while preserving its refs, events and presence. -->
		{@const contentProps = { ...props, id, role: 'tooltip' as const }}
		{#if childSnippet}
			{@render childSnippet({ props: contentProps, wrapperProps, ...snippetProps })}
		{:else}
			<div {...wrapperProps}>
				<div {...contentProps}>
					{@render children?.()}
					<TooltipPrimitive.Arrow>
						{#snippet child({ props: arrowProps })}
							<div
								class={cn(
									'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground',
									'data-[side=top]:translate-x-1/2 data-[side=top]:translate-y-[calc(-50%+2px)]',
									'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:-translate-y-[calc(-50%+1px)]',
									'data-[side=right]:translate-x-[calc(50%+2px)] data-[side=right]:translate-y-1/2',
									'data-[side=left]:-translate-y-[calc(50%-3px)]',
									arrowClasses
								)}
								{...arrowProps}
							></div>
						{/snippet}
					</TooltipPrimitive.Arrow>
				</div>
			</div>
		{/if}
	{/snippet}
</TooltipContent>
