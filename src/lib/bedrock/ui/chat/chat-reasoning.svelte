<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn, type WithElementRef } from '#lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		open = $bindable(false),
		label = 'Reasoning',
		working = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		open?: boolean;
		label?: string;
		/** While true a spinner marks the surface busy — the label itself never animates. */
		working?: boolean;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="chat-reasoning"
	aria-busy={working || undefined}
	class={cn('text-sm', className)}
	{...restProps}
>
	<Collapsible.Root {open} onOpenChange={(value) => (open = value)}>
		<Collapsible.Trigger
			data-slot="chat-reasoning-trigger"
			class="flex items-center gap-1.5 rounded-md py-1 text-xs text-muted-foreground motion-state hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
		>
			{#if working}
				<Icon
					icon="loading"
					aria-hidden="true"
					class="size-3.5 shrink-0 animate-spin motion-reduce:animate-none"
				/>
			{/if}
			<span>{label}</span>
			<Icon
				icon="chevronDown"
				aria-hidden="true"
				class={cn('size-3.5 shrink-0 motion-state', open && 'rotate-180')}
			/>
		</Collapsible.Trigger>
		<Collapsible.Content>
			<div
				data-slot="chat-reasoning-content"
				class="mt-1 border-l-2 border-border pl-3 text-sm text-muted-foreground"
			>
				{@render children?.()}
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
</div>
