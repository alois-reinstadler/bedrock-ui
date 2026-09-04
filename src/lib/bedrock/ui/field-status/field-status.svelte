<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type FieldStatusStatus = 'info' | 'success' | 'warning' | 'error';
	export type FieldStatusVariant = 'attached' | 'detached';
	export type FieldStatusProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		status: FieldStatusStatus;
		message?: string;
		children?: Snippet;
		variant?: FieldStatusVariant;
		hideIcon?: boolean;
	};

	let {
		status,
		message,
		children,
		variant = 'attached',
		hideIcon = false,
		class: className,
		ref = $bindable(null),
		...restProps
	}: FieldStatusProps = $props();

	const color = $derived(
		{
			info: 'text-muted-foreground',
			success: 'text-green-700 dark:text-green-400',
			warning: 'text-amber-700 dark:text-amber-400',
			error: 'text-destructive'
		}[status]
	);

	function setRef(element: HTMLDivElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

{#if children || message}
	<div
		{@attach setRef}
		data-slot="field-status"
		role={status === 'error' ? 'alert' : 'status'}
		class={cn(
			'flex items-start gap-1.5 text-sm',
			variant === 'detached' && 'mt-1',
			color,
			className
		)}
		{...restProps}
	>
		{#if !hideIcon}
			<Icon icon={status} class="mt-0.5 size-3.5" />
		{/if}
		<span
			>{#if children}{@render children()}{:else}{message}{/if}</span
		>
	</div>
{/if}
