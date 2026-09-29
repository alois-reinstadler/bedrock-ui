<script module lang="ts">
	export type ChatVoiceState =
		'idle' | 'requesting' | 'recording' | 'processing' | 'error' | 'unsupported';
	export interface ChatVoiceLabels {
		start: string;
		stop: string;
		cancel: string;
		retry: string;
		idle: string;
		requesting: string;
		recording: string;
		processing: string;
		error: string;
		unsupported: string;
		level: string;
		duration: string;
	}
	export interface ChatVoiceOptions {
		/** App-owned state. The app owns microphone permissions, capture, transcription, and cleanup. */
		state?: ChatVoiceState;
		/** Recording duration in seconds. */
		elapsed?: number;
		/** Live microphone level between 0 and 1; omitted levels render no meter. */
		level?: number;
		error?: string;
		disabled?: boolean;
		labels?: Partial<ChatVoiceLabels>;
		onStart?: () => void | Promise<void>;
		onStop?: () => void | Promise<void>;
		onCancel?: () => void | Promise<void>;
	}
</script>

<script lang="ts">
	import Mic from '@lucide/svelte/icons/mic';
	import Square from '@lucide/svelte/icons/square';
	import X from '@lucide/svelte/icons/x';
	import { onDestroy } from 'svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import { cn } from '#lib/utils.js';
	let {
		state: voiceState = 'idle',
		elapsed = 0,
		level,
		error = '',
		disabled = false,
		labels = {},
		onStart,
		onStop,
		onCancel,
		class: className
	}: ChatVoiceOptions & { class?: string } = $props();
	let pending = $state(false);
	let failure = $state('');
	let operation = 0;
	onDestroy(() => {
		operation++;
	});
	const text = $derived({
		start: 'Start voice input',
		stop: 'Finish recording',
		cancel: 'Cancel voice input',
		retry: 'Retry voice input',
		idle: 'Voice input',
		requesting: 'Waiting for microphone access…',
		recording: 'Recording',
		processing: 'Processing audio…',
		error: 'Voice input failed. Try again.',
		unsupported: 'Voice input is unavailable.',
		level: 'Microphone level',
		duration: 'Recording duration',
		...labels
	});
	const active = $derived(['requesting', 'recording', 'processing'].includes(voiceState));
	const seconds = $derived(Number.isFinite(elapsed) ? Math.max(0, Math.floor(elapsed)) : 0);
	const duration = $derived(`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`);
	const volume = $derived(Number.isFinite(level) ? Math.max(0, Math.min(1, level!)) : 0);
	async function invoke(callback: ChatVoiceOptions['onStart'], cancel = false) {
		if (disabled || !callback || (pending && !cancel)) return;
		const current = ++operation;
		pending = true;
		failure = '';
		try {
			await callback();
		} catch {
			if (current === operation) failure = text.error;
		} finally {
			if (current === operation) pending = false;
		}
	}
</script>

<div
	data-slot="chat-voice"
	data-state={voiceState}
	class={cn('flex min-w-0 flex-wrap items-center gap-2', className)}
>
	{#if voiceState === 'idle' || voiceState === 'error'}
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={voiceState === 'error' ? text.retry : text.start}
			disabled={disabled || pending || !onStart}
			onclick={() => invoke(onStart)}><Mic class="size-4" /></Button
		>
	{/if}
	{#if active || voiceState === 'unsupported'}
		<span role="status" class="text-sm text-muted-foreground">{text[voiceState]}</span>
	{/if}
	{#if voiceState === 'recording'}
		<span role="timer" aria-label={text.duration} class="font-mono text-sm tabular-nums"
			>{duration}</span
		>
		{#if level !== undefined}
			<meter
				min="0"
				max="1"
				value={volume}
				aria-label={text.level}
				class="h-2 w-16 overflow-hidden rounded-full [&::-webkit-meter-bar]:border-0 [&::-webkit-meter-bar]:bg-muted [&::-webkit-meter-optimum-value]:bg-primary"
			></meter>
		{/if}
		<Button
			type="button"
			variant="outline"
			size="icon-sm"
			aria-label={text.stop}
			disabled={disabled || pending || !onStop}
			onclick={() => invoke(onStop)}><Square class="size-3 fill-current" /></Button
		>
	{/if}
	{#if active && onCancel}
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={text.cancel}
			{disabled}
			onclick={() => invoke(onCancel, true)}><X class="size-4" /></Button
		>
	{/if}
	{#if voiceState === 'error' || failure}
		<p role="alert" class="basis-full text-sm text-destructive">{failure || error || text.error}</p>
	{/if}
</div>
