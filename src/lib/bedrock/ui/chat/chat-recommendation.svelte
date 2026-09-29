<script lang="ts">
	import Feedback from './chat-feedback.svelte';
	import * as Card from '#lib/bedrock/ui/card';
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';
	import { Label } from '#lib/bedrock/ui/label';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import { Button } from '#lib/bedrock/ui/button';
	import { createChatAction } from './agent-action.svelte';
	import type { ChatRecommendationOption } from './agent-types';
	import { cn } from '#lib/utils.js';
	let {
		title,
		options,
		value = $bindable(''),
		onAccept,
		onDismiss,
		disabled = false,
		labels = {},
		class: className
	}: {
		title: string;
		options: ChatRecommendationOption[];
		value?: string;
		onAccept: (option: ChatRecommendationOption) => void | Promise<void>;
		onDismiss?: () => void | Promise<void>;
		disabled?: boolean;
		labels?: Partial<{
			accept: string;
			dismiss: string;
			accepted: string;
			dismissed: string;
			empty: string;
			error: string;
		}>;
		class?: string;
	} = $props();
	const uid = $props.id();
	const action = createChatAction();
	let outcome = $state<'accepted' | 'dismissed' | null>(null);
	const selected = $derived(options.find((option) => option.id === value));
	const text = $derived({
		accept: 'Accept recommendation',
		dismiss: 'Dismiss',
		accepted: 'Recommendation accepted',
		dismissed: 'Recommendation dismissed',
		empty: 'No recommendations.',
		error: 'Could not save this choice. Try again.',
		...labels
	});
	async function accept() {
		if (disabled || !selected || outcome) return;
		const choice = selected;
		if (await action.run(() => onAccept(choice))) outcome = 'accepted';
	}
	async function dismiss() {
		if (disabled || !onDismiss || outcome) return;
		if (await action.run(onDismiss)) outcome = 'dismissed';
	}
</script>

<Card.Root
	data-slot="chat-recommendation"
	role="region"
	aria-label={title}
	aria-busy={action.pending}
	class={cn('min-w-0 gap-0 bg-background py-0 shadow-sm', className)}
>
	<Card.Header class="flex items-center gap-2 p-4"
		><Icon icon={SparklesIcon} class="text-muted-foreground" /><Card.Title
			id={`${uid}-title`}
			class="text-sm">{title}</Card.Title
		></Card.Header
	>
	<Card.Content class="px-3 pb-3">
		<RadioGroup.Root
			{value}
			onValueChange={(next) => {
				value = next;
			}}
			disabled={disabled || action.pending || !!outcome}
			aria-labelledby={`${uid}-title`}
			class="gap-2"
		>
			{#each options as option, i (option.id)}
				<Label
					for={`${uid}-${i}`}
					class={cn(
						'flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-3 font-normal transition-colors hover:bg-muted/50 has-focus-visible:ring-2 has-focus-visible:ring-ring',
						value === option.id && 'border-border bg-muted/50'
					)}
				>
					<RadioGroup.Item id={`${uid}-${i}`} value={option.id} class="mt-0.5" />
					<span class="min-w-0 space-y-1 text-sm break-words"
						><span class="block font-medium">{option.title}</span>
						{#if option.description}<span
								class="block text-xs leading-relaxed text-muted-foreground"
								>{option.description}</span
							>{/if}
						{#if option.confidence}<span class="mt-2 block text-[11px] text-muted-foreground"
								>{option.confidence}</span
							>{/if}
					</span>
				</Label>
			{:else}<p class="p-1 text-sm text-muted-foreground">{text.empty}</p>{/each}
		</RadioGroup.Root>
	</Card.Content>
	<Card.Footer class="flex-wrap gap-2 px-4 py-3">
		{#if !outcome}<Button
				data-slot="chat-recommendation-accept"
				size="sm"
				class="rounded-full"
				disabled={disabled || action.pending || !selected}
				onclick={accept}>{text.accept}</Button
			>
			{#if onDismiss}<Button
					size="sm"
					variant="ghost"
					class="rounded-full"
					disabled={disabled || action.pending}
					onclick={dismiss}>{text.dismiss}</Button
				>{/if}{/if}
		<Feedback
			tone={outcome === 'accepted' ? 'success' : 'neutral'}
			message={outcome ? text[outcome] : ''}
		/>
	</Card.Footer>
	{#if action.failed}<Feedback tone="error" message={text.error} class="px-4 pb-3" />{/if}
</Card.Root>
