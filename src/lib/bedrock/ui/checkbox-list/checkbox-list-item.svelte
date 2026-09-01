<script lang="ts">
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Label } from '#lib/bedrock/ui/label';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getCheckboxListContext } from './context.js';

	export type CheckboxListItemProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		value: string;
		label: string;
		description?: string;
		disabled?: boolean;
		endContent?: Snippet;
	};

	let {
		value,
		label,
		description,
		disabled = false,
		endContent,
		class: className,
		ref = $bindable(null),
		...restProps
	}: CheckboxListItemProps = $props();

	const context = getCheckboxListContext();
	const uid = $props.id();
	const id = `${uid}-checkbox`;
	const checked = $derived(context.getValue().includes(value));
	const isDisabled = $derived(disabled || context.isDisabled());

	function handleCheckedChange(next: boolean) {
		if (next !== checked && !isDisabled) context.toggle(value);
	}

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

<div
	{@attach setRef}
	data-slot="checkbox-list-item"
	class={cn('min-h-11 py-2', className)}
	{...restProps}
>
	<Label
		for={id}
		class={cn(
			'flex min-h-7 w-full cursor-pointer items-center gap-3 font-normal',
			isDisabled && 'cursor-not-allowed opacity-50'
		)}
	>
		<Checkbox {id} {checked} disabled={isDisabled} onCheckedChange={handleCheckedChange} />
		<span class="min-w-0 flex-1">
			<span class="block text-sm font-medium">{label}</span>
			{#if description}
				<span class="block text-sm text-muted-foreground">{description}</span>
			{/if}
		</span>
		{#if endContent}
			<span data-slot="checkbox-list-item-end" class="shrink-0">
				{@render endContent()}
			</span>
		{/if}
	</Label>
</div>
