<script lang="ts" module>
	export type ComboboxItem = {
		value: string;
		label: string;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import CheckIcon from '@lucide/svelte/icons/check';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import ButtonPrimitive from '#lib/shadcn/ui/button/button.svelte';
	import PopoverRoot from '#lib/shadcn/ui/popover/popover.svelte';
	import * as Command from '#lib/bedrock/ui/command';
	import * as Popover from '#lib/bedrock/ui/popover';
	import { cn } from '#lib/utils.js';
	import { tick } from 'svelte';

	let {
		value = $bindable(''),
		open = $bindable(false),
		items,
		placeholder = 'Auswählen…',
		searchPlaceholder = 'Suchen…',
		emptyText = 'Keine Ergebnisse.',
		disabled = false,
		class: className,
		onValueChange
	}: {
		/** Selected item value; controlled/bindable. */
		value?: string;
		open?: boolean;
		items: ComboboxItem[];
		placeholder?: string;
		searchPlaceholder?: string;
		emptyText?: string;
		disabled?: boolean;
		class?: string;
		onValueChange?: (value: string) => void;
	} = $props();

	let triggerRef = $state<HTMLButtonElement | null>(null);

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);

	function select(next: string) {
		value = next;
		onValueChange?.(value);
		open = false;
		// Return focus to the trigger so keyboard users keep their place.
		tick().then(() => triggerRef?.focus());
	}
</script>

<PopoverRoot bind:open>
	<Popover.Trigger {disabled}>
		{#snippet child({ props })}
			<ButtonPrimitive
				{...props}
				bind:ref={triggerRef}
				variant="outline"
				role="combobox"
				aria-expanded={open}
				data-slot="combobox-trigger"
				class={cn(
					'w-56 justify-between font-normal',
					!selectedLabel && 'text-muted-foreground',
					className
				)}
			>
				{selectedLabel ?? placeholder}
				<ChevronsUpDownIcon class="opacity-50" />
			</ButtonPrimitive>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content data-slot="combobox-content" class="w-56 p-0" align="start">
		<Command.Root>
			<Command.Input placeholder={searchPlaceholder} />
			<Command.List>
				<Command.Empty>{emptyText}</Command.Empty>
				<Command.Group>
					{#each items as item (item.value)}
						<Command.Item
							value={item.label}
							disabled={item.disabled}
							data-slot="combobox-item"
							onSelect={() => select(item.value)}
						>
							<CheckIcon class={cn('size-4', item.value !== value && 'text-transparent')} />
							{item.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</PopoverRoot>
