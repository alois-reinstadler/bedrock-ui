<script lang="ts">
	import { Collapsible as CollapsiblePrimitive } from 'bits-ui';
	import { reveal } from '#lib/bedrock/motion/presence.js';
	import { disclosureProse, disclosureExit } from '#lib/bedrock/motion/disclosure-prose.js';

	let {
		ref = $bindable(null),
		children,
		child,
		forceMount = false,
		textMotion = 'none',
		...restProps
	}: CollapsiblePrimitive.ContentProps & {
		/** Early sharpening for brief, noninteractive prose only. */
		textMotion?: 'none' | 'prose';
	} = $props();
</script>

{#if child}
	<CollapsiblePrimitive.Content
		bind:ref
		{forceMount}
		{child}
		{children}
		data-slot="collapsible-content"
		{...restProps}
	/>
{:else}
	<CollapsiblePrimitive.Content bind:ref forceMount data-slot="collapsible-content" {...restProps}>
		{#snippet child({ props, open })}
			{#if open || forceMount}
				<div
					{...props}
					inert={!open && !forceMount}
					transition:reveal
					{@attach disclosureProse(textMotion === 'prose')}
					{@attach disclosureExit(!forceMount)}
				>
					<div>{@render children?.()}</div>
				</div>
			{/if}
		{/snippet}
	</CollapsiblePrimitive.Content>
{/if}
