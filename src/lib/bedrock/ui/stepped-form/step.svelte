<script lang="ts">
	import { cn } from '#lib/utils.js';
	import { type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
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
	}: HTMLAttributes<HTMLElement> & {
		id: string;
		validate?: SteppedFormValidator;
		children?: Snippet;
	} = $props();

	const context = getSteppedFormContext();
	setSteppedFormStepContext(() => id);
	const active = $derived(context.getCurrent() === id);
	const direction = $derived(context.getDirection());
</script>

<section
	{@attach () => context.registerValidator(id, validate)}
	data-slot="stepped-form-step"
	data-stepped-form-step={id}
	data-direction={active ? direction : undefined}
	aria-labelledby={context.getTitleId(id)}
	aria-hidden={!active}
	inert={!active}
	hidden={!active}
	class={cn(active && 'bedrock-stepped-form-enter flex flex-col gap-5', className)}
	{...restProps}
>
	{@render children?.()}
</section>

<style>
	.bedrock-stepped-form-enter[data-direction='forward'] {
		animation: stepped-form-forward var(--motion-reveal) var(--motion-ease-enter);
	}
	.bedrock-stepped-form-enter[data-direction='backward'] {
		animation: stepped-form-backward var(--motion-reveal) var(--motion-ease-enter);
	}
	@keyframes stepped-form-forward {
		from {
			opacity: 0;
			transform: translateX(0.75rem);
		}
	}
	@keyframes stepped-form-backward {
		from {
			opacity: 0;
			transform: translateX(-0.75rem);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bedrock-stepped-form-enter[data-direction] {
			animation: none;
		}
	}
</style>
