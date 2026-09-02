<script lang="ts">
	// Internal to PowerSearch: renders one active filter as a compact Token chip.
	import { Token, type TokenSize } from '#lib/bedrock/ui/token';
	import { operatorsForField, type PowerSearchField, type PowerSearchFilter } from './types.js';

	let {
		filter,
		field,
		size = 'md',
		disabled = false,
		labels,
		onEdit,
		onRemove
	}: {
		filter: PowerSearchFilter;
		/** Resolved field config; missing fields fall back to the raw key. */
		field?: PowerSearchField;
		size?: TokenSize;
		disabled?: boolean;
		labels: { edit: (label: string) => string; remove: (label: string) => string };
		onEdit: () => void;
		onRemove: () => void;
	} = $props();

	const MAX_VALUE_CHARS = 40;

	const fieldLabel = $derived(field?.label ?? filter.field);
	const operatorLabel = $derived(
		field
			? (operatorsForField(field).find((entry) => entry.key === filter.operator)?.label ??
					filter.operator)
			: filter.operator
	);

	function enumLabel(value: string): string {
		return field?.values?.find((candidate) => candidate.value === value)?.label ?? value;
	}

	const valueText = $derived.by(() => {
		const value = filter.value;
		switch (value.type) {
			case 'string':
				return value.value;
			case 'number':
				return String(value.value);
			case 'date':
				return value.value;
			case 'enum':
				return enumLabel(value.value);
			case 'enumList': {
				const entries = value.value.map(enumLabel);
				const shown = entries.slice(0, 2).join(', ');
				return entries.length > 2 ? `${shown} +${entries.length - 2}` : shown;
			}
		}
	});
	const truncatedValue = $derived(
		valueText.length > MAX_VALUE_CHARS ? `${valueText.slice(0, MAX_VALUE_CHARS - 1)}…` : valueText
	);
</script>

<Token
	label={`${fieldLabel} ${operatorLabel} ${truncatedValue}`}
	color="neutral"
	{size}
	{disabled}
	data-slot="power-search-token"
	aria-label={labels.edit(fieldLabel)}
	title={`${fieldLabel} ${operatorLabel} ${valueText}`}
	onclick={onEdit}
	onRemove={disabled ? undefined : onRemove}
	labels={{ remove: () => labels.remove(fieldLabel) }}
/>
