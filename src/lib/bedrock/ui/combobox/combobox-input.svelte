<script lang="ts">
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import { Combobox as ComboboxPrimitive } from 'bits-ui';
	import { cn } from '#lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComboboxPrimitive.InputProps = $props();
</script>

<div data-slot="combobox-input-wrapper" class="relative w-full">
	<ComboboxPrimitive.Input
		bind:ref
		data-slot="combobox-input"
		class={cn(
			'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent py-1 pr-8 pl-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
			className
		)}
		{...restProps}
	/>
	<ComboboxPrimitive.Trigger
		data-slot="combobox-trigger"
		class="tap-target absolute inset-y-0 right-0 flex w-8 items-center justify-center text-muted-foreground hover:text-foreground"
		aria-label="Optionen anzeigen"
	>
		<ChevronsUpDownIcon class="size-4" />
	</ComboboxPrimitive.Trigger>
</div>
