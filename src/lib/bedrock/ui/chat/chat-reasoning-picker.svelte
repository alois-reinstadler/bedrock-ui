<script lang="ts" module>
	const defaultLabels = { reasoning: 'Reasoning', serviceTier: 'Service tier', default: 'Default' };
	export type ChatReasoningPickerLabels = Partial<typeof defaultLabels>;
</script>

<script lang="ts">
	import * as Menu from '#lib/bedrock/ui/dropdown-menu';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { cn } from '#lib/utils.js';
	import {
		defaultReasoningOptions,
		type ChatReasoningOption,
		type ChatServiceTierOption
	} from './composer-types';
	let {
		value = $bindable(''),
		options = defaultReasoningOptions,
		serviceTier = $bindable(''),
		serviceTiers = [],
		disabled = false,
		onValueChange,
		onServiceTierChange,
		labels: overrides,
		class: className
	}: {
		value?: string;
		options?: ChatReasoningOption[];
		serviceTier?: string;
		serviceTiers?: ChatServiceTierOption[];
		disabled?: boolean;
		onValueChange?: (value: string) => void;
		onServiceTierChange?: (value: string) => void;
		labels?: ChatReasoningPickerLabels;
		class?: string;
	} = $props();
	const labels = $derived({ ...defaultLabels, ...overrides });
	const selected = $derived(options.find((option) => option.value === value));
</script>

<Menu.Root>
	<Menu.Trigger {disabled}>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="sm"
				{disabled}
				data-slot="chat-reasoning-picker"
				aria-label={`${labels.reasoning}: ${selected?.label ?? labels.reasoning}`}
				class={cn('gap-1.5 text-muted-foreground', className)}
				>{selected?.label ?? labels.reasoning}<Icon icon="chevronDown" class="size-3" /></Button
			>
		{/snippet}
	</Menu.Trigger>
	<Menu.Content side="top" align="start" class="w-56" data-slot="chat-reasoning-picker-content">
		<Menu.Label>{labels.reasoning}</Menu.Label>
		<Menu.RadioGroup
			{value}
			aria-label={labels.reasoning}
			onValueChange={(next) => {
				if (!disabled && options.some((option) => option.value === next && !option.disabled)) {
					value = next;
					onValueChange?.(next);
				}
			}}
		>
			{#each options as option (option.value)}
				<Menu.RadioItem value={option.value} disabled={option.disabled}>
					<span class="flex flex-col gap-0.5"
						><span
							>{option.label}{#if option.default}<span
									class="ml-1.5 rounded bg-muted px-1 text-[10px] text-muted-foreground"
									>{labels.default}</span
								>{/if}</span
						>{#if option.description}<span class="text-xs text-muted-foreground"
								>{option.description}</span
							>{/if}</span
					>
				</Menu.RadioItem>
			{/each}
		</Menu.RadioGroup>
		{#if serviceTiers.length}
			<Menu.Separator /><Menu.Label>{labels.serviceTier}</Menu.Label>
			<Menu.RadioGroup
				value={serviceTier}
				aria-label={labels.serviceTier}
				onValueChange={(next) => {
					if (
						!disabled &&
						serviceTiers.some((option) => option.value === next && !option.disabled)
					) {
						serviceTier = next;
						onServiceTierChange?.(next);
					}
				}}
			>
				{#each serviceTiers as option (option.value)}
					<Menu.RadioItem value={option.value} disabled={option.disabled}
						><span class="flex flex-col gap-0.5"
							><span
								>{option.label}{#if option.default}<span
										class="ml-1.5 rounded bg-muted px-1 text-[10px] text-muted-foreground"
										>{labels.default}</span
									>{/if}</span
							>{#if option.description}<span class="text-xs text-muted-foreground"
									>{option.description}</span
								>{/if}</span
						></Menu.RadioItem
					>
				{/each}
			</Menu.RadioGroup>
		{/if}
	</Menu.Content>
</Menu.Root>
