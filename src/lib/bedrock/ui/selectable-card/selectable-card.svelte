<!--
	Toggleable card with checkbox semantics, built on the Bedrock Card.

	Uses the same stretched-control pattern as ClickableCard: a visually
	hidden `<button role="checkbox">` stretched across the card carries the
	name, focus, and toggling (Space and Enter both activate a native
	button); nested interactive content is lifted above it and keeps working.

	Selection state is owned by the consumer: bind `selected` per card for
	multi-select, or drive `selected` from a single value in
	`onSelectedChange` for single-select groups.
-->
<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { Card } from '#lib/bedrock/ui/card';
	import { cn, type WithElementRef } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		selected = $bindable(false),
		onSelectedChange,
		label,
		disabled = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		selected?: boolean;
		onSelectedChange?: (selected: boolean) => void;
		/** Required accessible name for the card's checkbox control. */
		label: string;
		disabled?: boolean;
	} = $props();

	function toggle() {
		if (disabled) return;
		selected = !selected;
		onSelectedChange?.(selected);
	}

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<Card
	{@attach setRef}
	data-slot="selectable-card"
	data-selected={selected ? true : undefined}
	data-disabled={disabled ? true : undefined}
	class={cn(
		// The selected inset ring composes with the resting shadow instead of
		// replacing the elevation; motion-state transitions both.
		'relative shadow-sm motion-state',
		selected && 'ring-2 ring-primary ring-inset',
		disabled && 'opacity-60',
		className
	)}
	{...restProps}
>
	<button
		type="button"
		role="checkbox"
		data-slot="selectable-card-trigger"
		class="absolute inset-0 z-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 disabled:cursor-not-allowed"
		aria-checked={selected}
		aria-label={label}
		{disabled}
		onclick={toggle}
	></button>
	{@render children?.()}
</Card>

<style>
	/* See ClickableCard: lift nested interactives above the stretched
	   trigger so they keep working independently. */
	:global(
		[data-slot='selectable-card']
			:is(a, button, input, select, textarea, label, [role='button'], [tabindex]):not(
				[data-slot='selectable-card-trigger']
			)
	) {
		position: relative;
	}
</style>
