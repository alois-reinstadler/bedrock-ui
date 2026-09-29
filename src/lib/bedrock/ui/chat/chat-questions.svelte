<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Icon } from '#lib/bedrock/ui/icon';
	import * as RadioGroup from '#lib/bedrock/ui/radio-group';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import MessageCircleIcon from '@lucide/svelte/icons/message-circle';
	import { Button } from '#lib/bedrock/ui/button';
	import type { ChatQuestion } from './agent-types';
	import { createChatAction } from './agent-action.svelte';
	import { cn } from '#lib/utils.js';
	let {
		questions,
		answers = $bindable<Record<string, string>>({}),
		onSubmit,
		disabled = false,
		labels = {},
		class: className
	}: {
		questions: ChatQuestion[];
		answers?: Record<string, string>;
		onSubmit: (answers: Record<string, string>) => void | Promise<void>;
		disabled?: boolean;
		labels?: Partial<{
			title: string;
			back: string;
			next: string;
			skip: string;
			submit: string;
			custom: string;
			done: string;
			empty: string;
			error: string;
		}>;
		class?: string;
	} = $props();
	const uid = $props.id();
	const action = createChatAction();
	let index = $state(0);
	let complete = $state(false);
	const step = $derived(Math.min(index, Math.max(0, questions.length - 1)));
	const current = $derived(questions[step]);
	const text = $derived({
		title: 'Questions',
		back: 'Back',
		next: 'Continue',
		skip: 'Skip',
		submit: 'Submit answers',
		custom: 'Custom answer',
		done: 'Answers submitted',
		empty: 'No questions.',
		error: 'Could not submit your answers. Try again.',
		...labels
	});
	const missing = $derived(
		questions.findIndex((q) => q.required !== false && !answers[q.id]?.trim())
	);
	function answer(value: string) {
		if (current) answers = { ...answers, [current.id]: value };
	}
	async function next(skip = false) {
		if (!current || disabled || action.pending || complete) return;
		if (skip && current.required === false) answer('');
		if (current.required !== false && !answers[current.id]?.trim()) return;
		if (step < questions.length - 1) {
			index = step + 1;
			return;
		}
		if (missing >= 0) {
			index = missing;
			return;
		}
		const submitted = Object.fromEntries(questions.map((q) => [q.id, answers[q.id]?.trim() ?? '']));
		if (await action.run(() => onSubmit(submitted))) complete = true;
	}
</script>

<Card.Root
	data-slot="chat-questions"
	role="region"
	aria-label={text.title}
	aria-busy={action.pending}
	class={cn('min-w-0 gap-0 bg-background py-0 shadow-sm', className)}
>
	{#if complete}<p role="status" class="p-4 text-sm">{text.done}</p>
	{:else if current}
		{#key current.id}
			<Card.Header class="flex items-start gap-3 p-4 pb-2">
				<Icon icon={MessageCircleIcon} class="mt-0.5 text-muted-foreground" />
				<div class="min-w-0 space-y-1">
					<Card.Title id={`${uid}-question`} class="text-sm leading-5">{current.label}</Card.Title>
					{#if current.description}<Card.Description class="text-xs leading-relaxed"
							>{current.description}</Card.Description
						>{/if}
				</div>
			</Card.Header>
			<Card.Content class="space-y-3 px-4 pb-4">
				<RadioGroup.Root
					value={current.options.some((o) => o.value === answers[current.id])
						? answers[current.id]
						: ''}
					onValueChange={answer}
					disabled={disabled || action.pending}
					aria-labelledby={`${uid}-question`}
					class="gap-1"
				>
					{#each current.options as option, i (option.value)}
						<Label
							for={`${uid}-${current.id}-${i}`}
							class={cn(
								'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-normal transition-colors hover:bg-muted/60 has-focus-visible:ring-2 has-focus-visible:ring-ring',
								answers[current.id] === option.value && 'bg-muted'
							)}
						>
							<RadioGroup.Item
								id={`${uid}-${current.id}-${i}`}
								value={option.value}
							/>{option.label}
						</Label>
					{/each}
				</RadioGroup.Root>
				{#if current.allowCustom}<div class="space-y-1.5">
						<Label for={`${uid}-custom`} class="text-xs text-muted-foreground">{text.custom}</Label>
						<Input
							id={`${uid}-custom`}
							disabled={disabled || action.pending}
							class="h-9 bg-muted/30 text-sm shadow-none"
							value={current.options.some((o) => o.value === answers[current.id])
								? ''
								: (answers[current.id] ?? '')}
							oninput={(e) => answer(e.currentTarget.value)}
						/>
					</div>{/if}
			</Card.Content>
		{/key}
		<Card.Footer class="flex-wrap justify-between gap-2 px-4 py-3">
			<div class="flex items-center gap-2">
				<Button
					size="sm"
					variant="ghost"
					class="rounded-full"
					disabled={disabled || action.pending || step === 0}
					onclick={() => {
						index = step - 1;
					}}>{text.back}</Button
				>
				<p role="status" class="text-xs text-muted-foreground tabular-nums">
					{step + 1} / {questions.length}
				</p>
			</div>
			<div class="flex gap-1">
				{#if current.required === false}<Button
						size="sm"
						variant="ghost"
						class="rounded-full"
						disabled={disabled || action.pending}
						onclick={() => next(true)}>{text.skip}</Button
					>{/if}
				<Button
					size="sm"
					class="rounded-full"
					disabled={disabled ||
						action.pending ||
						(current.required !== false && !answers[current.id]?.trim())}
					onclick={() => next()}>{step === questions.length - 1 ? text.submit : text.next}</Button
				>
			</div>
		</Card.Footer>
	{:else}<p class="p-4 text-sm text-muted-foreground">{text.empty}</p>{/if}
	{#if action.failed}<p role="alert" class="px-4 pb-3 text-xs text-destructive">
			{text.error}
		</p>{/if}
</Card.Root>
