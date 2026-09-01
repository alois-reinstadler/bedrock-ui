<script lang="ts" module>
	import { type VariantProps, tv } from 'tailwind-variants';

	export const tokenVariants = tv({
		base: 'inline-flex max-w-full items-center rounded-md font-medium',
		variants: {
			color: {
				neutral: 'bg-secondary text-secondary-foreground',
				red: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300',
				orange: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300',
				yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
				green: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300',
				teal: 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300',
				blue: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
				purple: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
				pink: 'bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300',
				gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
			},
			size: {
				sm: 'h-5 gap-1 px-1.5 text-xs',
				md: 'h-6 gap-1.5 px-2 text-xs',
				lg: 'h-7 gap-1.5 px-2.5 text-sm'
			}
		},
		defaultVariants: { color: 'neutral', size: 'md' }
	});

	export type TokenColor = NonNullable<VariantProps<typeof tokenVariants>['color']>;
	export type TokenSize = NonNullable<VariantProps<typeof tokenVariants>['size']>;

	const defaultLabels = { remove: (label: string) => `Remove ${label}` };
	export type TokenLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import { Icon, type IconType } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type TokenProps = WithElementRef<HTMLAttributes<HTMLElement>, HTMLElement> & {
		label: string;
		icon?: IconType;
		color?: TokenColor;
		size?: TokenSize;
		onRemove?: () => void;
		onclick?: (event: MouseEvent) => void;
		href?: string;
		disabled?: boolean;
		endContent?: Snippet;
		labels?: TokenLabels;
	};

	let {
		label,
		icon,
		color = 'neutral',
		size = 'md',
		onRemove,
		onclick,
		href,
		disabled = false,
		endContent,
		labels: labelOverrides = {},
		class: className,
		ref = $bindable(null),
		...restProps
	}: TokenProps = $props();

	const labels = $derived({ ...defaultLabels, ...labelOverrides });
	const bodyClass = $derived(
		cn(
			tokenVariants({ color, size }),
			(onclick || href) &&
				'motion-state focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
			disabled && 'pointer-events-none opacity-50',
			className
		)
	);

	function activate(event: MouseEvent) {
		if (disabled) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}

	function setRef(element: HTMLElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

{#snippet content()}
	{#if icon}<Icon {icon} class="size-3.5" />{/if}
	<span class="truncate">{label}</span>
	{@render endContent?.()}
{/snippet}

<span data-slot="token" class="inline-flex max-w-full items-center">
	{#if href}
		<a
			{@attach setRef}
			href={disabled ? undefined : href}
			aria-disabled={disabled || undefined}
			tabindex={disabled ? -1 : undefined}
			class={bodyClass}
			onclick={activate}
			{...restProps}>{@render content()}</a
		>
	{:else if onclick}
		<button
			{@attach setRef}
			type="button"
			{disabled}
			class={bodyClass}
			onclick={activate}
			{...restProps}>{@render content()}</button
		>
	{:else}
		<span {@attach setRef} class={bodyClass} aria-disabled={disabled || undefined} {...restProps}
			>{@render content()}</span
		>
	{/if}
	{#if onRemove}
		<button
			type="button"
			class="tap-target -ml-1 inline-flex size-5 items-center justify-center rounded-md motion-state focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
			aria-label={labels.remove(label)}
			{disabled}
			onclick={onRemove}
		>
			<Icon icon="close" class="size-3" />
		</button>
	{/if}
</span>
