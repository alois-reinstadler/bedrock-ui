<script lang="ts">
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

<section
	data-slot="chat-questions"
	aria-label={text.title}
	aria-busy={action.pending}
	class={cn('space-y-3 rounded-xl border bg-background p-4', className)}
>
	{#if complete}<p role="status">{text.done}</p>
	{:else if current}
		{#key current.id}
			<fieldset disabled={disabled || action.pending} class="space-y-3">
				<legend class="font-medium">{current.label}</legend>
				{#if current.description}<p class="text-sm text-muted-foreground">
						{current.description}
					</p>{/if}
				{#each current.options as option (option.value)}
					<label class="flex cursor-pointer items-center gap-2 rounded-lg border p-2 text-sm"
						><input
							type="radio"
							name={`${uid}-${current.id}`}
							value={option.value}
							checked={answers[current.id] === option.value}
							onchange={() => answer(option.value)}
						/>{option.label}</label
					>
				{/each}
				{#if current.allowCustom}<label class="grid gap-1 text-sm"
						>{text.custom}<input
							class="rounded-md border bg-background px-3 py-2"
							value={current.options.some((o) => o.value === answers[current.id])
								? ''
								: (answers[current.id] ?? '')}
							oninput={(e) => answer(e.currentTarget.value)}
						/></label
					>{/if}
			</fieldset>
		{/key}
		<p role="status" class="text-xs text-muted-foreground">{step + 1} / {questions.length}</p>
		<div class="flex flex-wrap gap-2">
			<Button
				size="sm"
				variant="outline"
				disabled={disabled || action.pending || step === 0}
				onclick={() => {
					index = step - 1;
				}}>{text.back}</Button
			>
			{#if current.required === false}<Button
					size="sm"
					variant="ghost"
					disabled={disabled || action.pending}
					onclick={() => next(true)}>{text.skip}</Button
				>{/if}
			<Button
				size="sm"
				disabled={disabled ||
					action.pending ||
					(current.required !== false && !answers[current.id]?.trim())}
				onclick={() => next()}>{step === questions.length - 1 ? text.submit : text.next}</Button
			>
		</div>
	{:else}<p class="text-sm text-muted-foreground">{text.empty}</p>{/if}
	{#if action.failed}<p role="alert" class="text-sm text-destructive">{text.error}</p>{/if}
</section>
