<script lang="ts" generics="T">
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as Popover from '#lib/bedrock/ui/popover';
	import PopoverRoot from '#lib/shadcn/ui/popover/popover.svelte';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import { tick, type Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import {
		selectorTriggerVariants,
		type SelectorSize,
		type SelectorVariant
	} from './selector.svelte';

	let {
		ref = $bindable(null),
		value = $bindable(undefined),
		open = $bindable(false),
		content,
		triggerLabel,
		onValueChange,
		placeholder = 'Select…',
		disabled = false,
		size = 'md',
		variant = 'input',
		class: className,
		...restProps
	}: WithElementRef<Omit<HTMLButtonAttributes, 'value' | 'disabled'>, HTMLButtonElement> & {
		/** Committed value; controlled/bindable. */
		value?: T;
		open?: boolean;
		/** Popover body. `commit` sets the value, `close` closes and refocuses the trigger. */
		content: Snippet<[{ value: T | undefined; commit: (next: T) => void; close: () => void }]>;
		/** Closed trigger content. Default: the placeholder or `String(value)`. */
		triggerLabel?: Snippet<[T | undefined]>;
		onValueChange?: (value: T) => void;
		placeholder?: string;
		disabled?: boolean;
		size?: SelectorSize;
		variant?: SelectorVariant;
	} = $props();

	function commit(next: T) {
		value = next;
		onValueChange?.(next);
	}

	function close() {
		open = false;
		// Return focus to the trigger so keyboard users keep their place.
		tick().then(() => ref?.focus());
	}
</script>

<PopoverRoot bind:open>
	<Popover.Trigger {disabled}>
		{#snippet child({ props })}
			<button
				{...restProps}
				{...props}
				bind:this={ref}
				type="button"
				aria-expanded={open}
				data-slot="complex-selector-trigger"
				data-size={size}
				data-variant={variant}
				class={cn(
					selectorTriggerVariants({ size, variant }),
					value === undefined && 'text-muted-foreground',
					className
				)}
			>
				<span class="flex min-w-0 flex-1 items-center gap-2">
					{#if triggerLabel}
						{@render triggerLabel(value)}
					{:else}
						<span class="truncate">{value === undefined ? placeholder : String(value)}</span>
					{/if}
				</span>
				<Icon icon="arrowsUpDown" class="text-muted-foreground/70" />
			</button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		data-slot="complex-selector-content"
		class="min-w-(--bits-popover-anchor-width)"
		align="start"
	>
		{@render content({ value, commit, close })}
	</Popover.Content>
</PopoverRoot>
