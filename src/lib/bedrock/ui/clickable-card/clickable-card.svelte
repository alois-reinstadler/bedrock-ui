<!--
	Whole-card navigation/action target built on the Bedrock Card.

	Stretched-link pattern: the card is `relative` and a visually hidden
	trigger (`<a>` or `<button>`) is stretched across it. Nested interactive
	elements inside the content are lifted to `position: relative` (see the
	style block) so they paint above the trigger and keep working on their own.

	Not for selection state — use SelectableCard for that.
-->
<script lang="ts">
	import type { HTMLAnchorAttributes, HTMLAttributes } from 'svelte/elements';
	import { Card } from '#lib/bedrock/ui/card';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		label,
		href,
		target,
		onclick,
		disabled = false,
		elevation = 'low',
		children,
		...restProps
	}: WithElementRef<Omit<HTMLAttributes<HTMLDivElement>, 'onclick'>> & {
		/** Required accessible name for the whole-card trigger. */
		label: string;
		/** Renders the trigger as a link instead of a button. */
		href?: string;
		target?: HTMLAnchorAttributes['target'];
		onclick?: (event: MouseEvent) => void;
		disabled?: boolean;
		/** `low` rests on shadow-sm and lifts to shadow-md on hover. */
		elevation?: 'none' | 'low';
	} = $props();

	function handleClick(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}

	const triggerClasses =
		'absolute inset-0 z-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-inset aria-disabled:cursor-not-allowed';
</script>

<Card
	{@attach setRef}
	data-slot="clickable-card"
	data-disabled={disabled ? true : undefined}
	class={cn(
		'relative motion-state',
		elevation === 'low' ? 'shadow-sm not-data-disabled:hover:shadow-md' : 'hover:bg-muted/40',
		disabled && 'opacity-60 hover:bg-card',
		className
	)}
	{...restProps}
>
	{#if href}
		<a
			data-slot="clickable-card-trigger"
			class={triggerClasses}
			href={disabled ? undefined : href}
			{target}
			aria-label={label}
			aria-disabled={disabled ? true : undefined}
			role={disabled ? 'link' : undefined}
			tabindex={disabled ? -1 : undefined}
			onclick={handleClick}
		></a>
	{:else}
		<button
			type="button"
			data-slot="clickable-card-trigger"
			class={triggerClasses}
			aria-label={label}
			{disabled}
			onclick={handleClick}
		></button>
	{/if}
	{@render children?.()}
</Card>

<style>
	/* Content stays static-positioned, so the absolute trigger (earlier in
	   the DOM) would otherwise paint above it and swallow clicks. Positioned
	   elements paint in DOM order, so lifting nested interactives puts them
	   back on top of the trigger. */
	:global(
		[data-slot='clickable-card']
			:is(a, button, input, select, textarea, label, [role='button'], [tabindex]):not(
				[data-slot='clickable-card-trigger']
			)
	) {
		position: relative;
	}

	/* Box shadows are suppressed in forced colors. Keep the native outline
	   inside the same clipped surface as the normal focus ring. */
	@media (forced-colors: active) {
		[data-slot='clickable-card-trigger']:focus-visible {
			outline: 2px solid Highlight;
			outline-offset: -2px;
		}
	}
</style>
