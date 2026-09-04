<script lang="ts">
	import { Icon, type IconType } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getMetadataListContext } from './context.js';

	let {
		ref = $bindable(null),
		class: className,
		label,
		icon,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		/** The `<dt>` text. */
		label: string;
		/** Decorative icon rendered before the label, hidden from AT. */
		icon?: IconType;
		/** The `<dd>` value. Omit it to show an en dash placeholder. */
		children?: Snippet;
	} = $props();

	const context = getMetadataListContext();
	const index = context.register();

	const collapsible = $derived(context.isCollapsible(index));
	const hidden = $derived(context.isHidden(index));
	const labelPosition = $derived(context.getLabelPosition());
	const labelWidth = $derived(context.getLabelWidth());
</script>

<!-- Collapsible rows are each a motion-reveal container: interpolate-size lets
	the inline height animate between 0 and auto. `inert` removes collapsed rows
	from AT and the tab order; expanding lifts it in the same tick, so
	interactivity is never delayed behind the animation. -->
<div
	bind:this={ref}
	data-slot="metadata-list-item"
	inert={hidden}
	class={cn(
		labelPosition === 'start' && 'grid grid-cols-[max-content_1fr] items-baseline gap-x-4',
		collapsible && 'overflow-hidden motion-reveal',
		className
	)}
	style:grid-template-columns={labelPosition === 'start' && labelWidth
		? `${labelWidth} 1fr`
		: undefined}
	style:height={collapsible ? (hidden ? '0' : 'auto') : undefined}
	style:opacity={hidden ? '0' : undefined}
	{...restProps}
>
	<dt
		class={cn(
			'flex items-center gap-1.5 text-sm text-muted-foreground',
			labelPosition === 'start' ? 'py-1' : 'pt-1'
		)}
	>
		{#if icon}
			<Icon {icon} />
		{/if}
		{label}
	</dt>
	<dd class={cn('bedrock-metadata-value text-sm', labelPosition === 'start' ? 'py-1' : 'pb-1')}>
		{#if children}
			{@render children()}
		{:else}
			–
		{/if}
	</dd>
</div>

<style>
	/* Fallback for consumers whose value snippet renders nothing at runtime:
	   Svelte block anchors are comments, which :empty ignores. */
	.bedrock-metadata-value:empty::before {
		content: '–';
	}
</style>
