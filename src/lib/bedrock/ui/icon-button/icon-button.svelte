<script lang="ts" module>
	export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg';
</script>

<script lang="ts">
	import { Button, type ButtonProps, type ButtonVariant } from '#lib/bedrock/ui/button';
	import { Icon, type IconType } from '#lib/bedrock/ui/icon';
	import * as Tooltip from '#lib/bedrock/ui/tooltip';
	import { cn } from '#lib/utils.js';
	import { mergeProps } from 'bits-ui';

	export type IconButtonProps = Omit<
		ButtonProps,
		'children' | 'size' | 'variant' | 'aria-label'
	> & {
		icon: IconType;
		label: string;
		size?: IconButtonSize;
		variant?: ButtonVariant;
		tooltip?: string;
	};

	let {
		icon,
		label,
		size = 'md',
		variant = 'ghost',
		tooltip,
		class: className,
		ref = $bindable(null),
		...restProps
	}: IconButtonProps = $props();

	const buttonSize = $derived(
		({ xs: 'icon-xs', sm: 'icon-sm', md: 'icon', lg: 'icon-lg' } as const)[size]
	);
	const buttonProps = $derived({
		...restProps,
		'data-slot': 'icon-button',
		'aria-label': label,
		class: cn('tap-target', className),
		size: buttonSize,
		variant
	});

	function setRef(element: HTMLButtonElement | HTMLAnchorElement) {
		ref = element;
		return () => {
			if (ref === element) ref = null;
		};
	}
</script>

{#snippet button({ props }: { props?: Record<string, unknown> })}
	{@const mergedProps = mergeProps(props, buttonProps)}
	<Button {@attach setRef} {...mergedProps}>
		<Icon {icon} />
	</Button>
{/snippet}

{#if tooltip}
	<Tooltip.Provider>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					{@render button({ props })}
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>{tooltip}</Tooltip.Content>
		</Tooltip.Root>
	</Tooltip.Provider>
{:else}
	{@render button({})}
{/if}
