<script lang="ts" module>
	export type ComboboxItem = {
		value: string;
		label: string;
		disabled?: boolean;
	};
</script>

<script lang="ts">
	import { Selector } from '#lib/bedrock/ui/selector';

	let {
		value = $bindable(''),
		open = $bindable(false),
		items,
		placeholder = 'Select…',
		searchPlaceholder = 'Search…',
		emptyText = 'No results.',
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
</script>

<!-- Thin façade: the selection core lives in Selector; the Combobox public API is frozen. -->
<Selector
	bind:value
	bind:open
	{items}
	searchable
	{placeholder}
	{disabled}
	class={className}
	labels={{ search: searchPlaceholder, empty: emptyText }}
	{onValueChange}
	dataSlot="combobox"
/>
