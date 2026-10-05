<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { type Snippet } from 'svelte';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import {
		getSteppedFormContext,
		setSteppedFormStepContext,
		type SteppedFormValidator
	} from './context.js';

	let {
		id,
		validate,
		class: className,
		children,
		...restProps
	}: Omit<HTMLFieldsetAttributes, 'disabled'> & {
		id: string;
		validate?: SteppedFormValidator;
		children?: Snippet;
	} = $props();

	const context = getSteppedFormContext();
	setSteppedFormStepContext(() => id);
	const active = $derived(context.getCurrent() === id);
	const direction = $derived(context.getDirection());
</script>

<fieldset
	{@attach () => context.registerValidator(id, validate)}
	data-slot="stepped-form-step"
	data-stepped-form-step={id}
	data-direction={active ? direction : undefined}
	disabled={!context.getSteps().some((step) => step.id === id)}
	aria-labelledby={context.getTitleId(id)}
	aria-hidden={!active}
	inert={!active}
	hidden={!active}
	class={cn('m-0 min-w-0 border-0 p-0', active && 'flex flex-col gap-5', className)}
	{...restProps}
>
	{@render children?.()}
</fieldset>
