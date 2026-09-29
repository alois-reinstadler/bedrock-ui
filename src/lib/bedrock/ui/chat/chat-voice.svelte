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
	import { IconButton } from '#lib/bedrock/ui/icon-button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
	import MicOff from '@lucide/svelte/icons/mic-off';
	import Feedback from './chat-feedback.svelte';
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
	const expanded = $derived(voiceState !== 'idle' || !!failure);
	const bars = [
		0.2, 0.35, 0.6, 0.45, 0.8, 0.55, 0.95, 0.7, 0.4, 0.65, 1, 0.75, 0.5, 0.85, 0.6, 0.35, 0.7, 0.95,
		0.55, 0.8, 0.45, 0.65, 0.3, 0.2
	];
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
	data-expanded={expanded || undefined}
	class={cn(
		'min-w-0',
		expanded ? 'space-y-3 rounded-xl bg-muted/50 p-3' : 'inline-flex items-center',
		className
	)}
>
	{#if !expanded}
		<IconButton
			icon={Mic}
			label={text.start}
			tooltip={text.start}
			size="sm"
			class="rounded-full text-muted-foreground hover:text-foreground"
			disabled={disabled || pending || !onStart}
			onclick={() => invoke(onStart)}
		/>
	{:else if active}
		<div class="flex items-center justify-between gap-3">
			<div class="flex min-w-0 items-center gap-2">
				{#if voiceState === 'recording'}<StatusDot
						status="destructive"
						size="sm"
						pulse
					/>{:else}<Icon
						icon="loading"
						class="size-3.5 animate-spin text-muted-foreground motion-reduce:animate-none"
					/>{/if}
				<span role="status" class="text-xs leading-relaxed font-medium">{text[voiceState]}</span>
			</div>
			{#if voiceState === 'recording'}<span
					role="timer"
					aria-label={text.duration}
					class="shrink-0 rounded-md bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground tabular-nums"
					>{duration}</span
				>
			{:else if onCancel}<IconButton
					icon={X}
					label={text.cancel}
					tooltip={text.cancel}
					size="sm"
					class="shrink-0 rounded-full"
					{disabled}
					onclick={() => invoke(onCancel, true)}
				/>{/if}
		</div>
		{#if voiceState === 'recording'}
			<div class="flex items-center gap-3">
				<div
					class="flex h-10 min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden"
					aria-hidden="true"
				>
					{#each bars as height, i (i)}<span
							class="w-1 min-w-0 rounded-full bg-foreground/60 transition-[height] duration-100 motion-reduce:transition-none"
							style:height={`${level === undefined ? 4 : 4 + height * volume * 30}px`}
						></span>{/each}
				</div>
				{#if level !== undefined}<meter
						min="0"
						max="1"
						value={volume}
						aria-label={text.level}
						class="sr-only"
					></meter>{/if}
				<div class="flex shrink-0 items-center gap-1">
					{#if onCancel}<IconButton
							icon={X}
							label={text.cancel}
							tooltip={text.cancel}
							size="sm"
							class="rounded-full text-muted-foreground"
							{disabled}
							onclick={() => invoke(onCancel, true)}
						/>{/if}
					<IconButton
						icon={Square}
						label={text.stop}
						tooltip={text.stop}
						size="sm"
						variant="default"
						class="rounded-full [&_svg]:size-3 [&_svg]:fill-current"
						disabled={disabled || pending || !onStop}
						onclick={() => invoke(onStop)}
					/>
				</div>
			</div>
		{/if}
	{:else if voiceState === 'unsupported'}
		<div role="status" class="flex items-center gap-2 text-xs text-muted-foreground">
			<Icon icon={MicOff} class="size-4" />{text.unsupported}
		</div>
	{/if}
	{#if voiceState === 'error' || failure}
		<div class="flex items-start gap-2">
			<Feedback tone="error" message={failure || error || text.error} class="min-w-0 flex-1" />
			{#if !active}<IconButton
					icon={Mic}
					label={voiceState === 'error' ? text.retry : text.start}
					tooltip={text.retry}
					size="sm"
					class="shrink-0 rounded-full"
					disabled={disabled || pending || !onStart}
					onclick={() => invoke(onStart)}
				/>{/if}
		</div>
	{/if}
</div>
