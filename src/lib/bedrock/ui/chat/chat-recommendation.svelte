<script lang="ts">
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

<section
	data-slot="chat-recommendation"
	aria-label={title}
	aria-busy={action.pending}
	class={cn('space-y-3 rounded-xl border bg-background p-4', className)}
>
	<fieldset disabled={disabled || action.pending || !!outcome} class="space-y-2">
		<legend class="mb-2 font-medium">{title}</legend>
		{#each options as option (option.id)}<label
				class="flex cursor-pointer items-start gap-2 rounded-lg border p-3"
			>
				<input type="radio" name={uid} value={option.id} bind:group={value} class="mt-1" />
				<span class="min-w-0 space-y-1 text-sm break-words"
					><span class="block font-medium">{option.title}</span>{#if option.description}<span
							class="block text-muted-foreground">{option.description}</span
						>{/if}{#if option.confidence}<span class="block text-xs text-muted-foreground"
							>{option.confidence}</span
						>{/if}</span
				>
			</label>{:else}<p class="text-sm text-muted-foreground">{text.empty}</p>{/each}
	</fieldset>
	{#if !outcome}<div class="flex flex-wrap gap-2">
			<Button size="sm" disabled={disabled || action.pending || !selected} onclick={accept}
				>{text.accept}</Button
			>{#if onDismiss}<Button
					size="sm"
					variant="outline"
					disabled={disabled || action.pending}
					onclick={dismiss}>{text.dismiss}</Button
				>{/if}
		</div>{/if}
	<p role="status" class="text-sm text-muted-foreground">{outcome ? text[outcome] : ''}</p>
	{#if action.failed}<p role="alert" class="text-sm text-destructive">{text.error}</p>{/if}
</section>
