<script lang="ts">
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { setCheckboxListContext } from './context.js';

	/**
	 * A visible group of three to seven related choices. Use MultiSelector for long or searchable lists.
	 */
	export type CheckboxListProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value?: string[];
		onValueChange?: (value: string[]) => void;
		label: string;
		hideLabel?: boolean;
		dividers?: boolean;
		disabled?: boolean;
		children?: Snippet;
	};

	let {
		value = $bindable([]),
		onValueChange,
		label,
		hideLabel = false,
		dividers = false,
		disabled = false,
		children,
		class: className,
		ref = $bindable(null),
		...restProps
	}: CheckboxListProps = $props();

	const uid = $props.id();
	const labelId = `${uid}-label`;

	function toggle(itemValue: string) {
		value = value.includes(itemValue)
			? value.filter((current) => current !== itemValue)
			: [...value, itemValue];
		onValueChange?.(value);
	}

	setCheckboxListContext({
		getValue: () => value,
		toggle,
		isDisabled: () => disabled
	});

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<div
	{@attach setRef}
	data-slot="checkbox-list"
	role="group"
	aria-labelledby={labelId}
	class={cn('grid', dividers && 'divide-y divide-border', className)}
	{...restProps}
>
	<div
		id={labelId}
		data-slot="checkbox-list-label"
		class={cn('pb-2 text-sm font-medium', hideLabel && 'sr-only')}
	>
		{label}
	</div>
	{@render children?.()}
</div>
