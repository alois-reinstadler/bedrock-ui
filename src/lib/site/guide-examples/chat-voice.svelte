<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Icon } from '#lib/bedrock/ui/icon';
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import AudioLines from '@lucide/svelte/icons/audio-lines';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { onDestroy } from 'svelte';
	let voiceState = $state<Chat.ChatVoiceState>('idle');
	let value = $state('');
	let elapsed = $state(0);
	let sent = $state('');
	let fail = $state(false);
	let manual = $state(false);
	let level = $state(0.65);
	let timer: ReturnType<typeof setTimeout> | undefined;
	let ticker: ReturnType<typeof setInterval> | undefined;
	function clearTimers() {
		clearTimeout(timer);
		clearInterval(ticker);
	}
	onDestroy(clearTimers);
	function setVoiceState(next: Chat.ChatVoiceState) {
		clearTimers();
		voiceState = next;
		if (next === 'recording' && !manual) {
			const started = Date.now();
			ticker = setInterval(() => {
				elapsed = Math.floor((Date.now() - started) / 1000);
				level = 0.45 + Math.sin((Date.now() - started) / 350) * 0.25;
			}, 100);
		}
	}
	function insertTranscript() {
		value = [value, 'Please summarize this conversation.'].filter(Boolean).join(' ');
		setVoiceState('idle');
	}
	function start() {
		if (fail) {
			fail = false;
			throw new Error('Demo microphone failure');
		}
		elapsed = 0;
		level = 0.65;
		setVoiceState('requesting');
		if (!manual) timer = setTimeout(() => setVoiceState('recording'), 650);
	}
	function stop() {
		setVoiceState('processing');
		if (!manual) timer = setTimeout(insertTranscript, 900);
	}
</script>

<section data-demo="chat-voice" class="mx-auto w-full max-w-xl space-y-4">
	<Card.Root class="gap-0 bg-background py-0 shadow-sm">
		<Card.Header class="flex items-center gap-3 p-4">
			<span class="flex size-9 items-center justify-center rounded-xl bg-muted"
				><Icon icon={AudioLines} class="size-5" /></span
			>
			<div class="space-y-1">
				<Card.Title class="text-sm">Speak your next message</Card.Title><Card.Description
					class="text-xs"
					>Record a thought. Review the words. Send when you’re ready.</Card.Description
				>
			</div>
		</Card.Header>
		<Card.Content class="px-4 pb-4">
			<Chat.Composer
				bind:value
				voice={{
					state: voiceState,
					elapsed,
					level,
					onStart: start,
					onStop: stop,
					onCancel: () => {
						setVoiceState('idle');
					}
				}}
				onSend={(message) => {
					sent = message;
				}}
			/>
		</Card.Content>
		<Card.Footer class="px-4 py-3"
			><p class="text-xs text-muted-foreground">
				Interactive simulation · no microphone access
			</p></Card.Footer
		>
	</Card.Root>
	<FieldStatus status="success" message={sent ? `Sent: ${sent}` : ''} class="text-xs" />
	<Collapsible.Root
		class="group/voice-demo"
		open={manual}
		onOpenChange={(open) => {
			manual = open;
			clearTimers();
			level = 0.65;
		}}
	>
		<Collapsible.Trigger
			class="flex items-center gap-2 rounded-md px-1 py-2 text-xs text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
			>Demo controls<Icon
				icon={ChevronDown}
				class="size-3 transition-transform group-data-[state=open]/voice-demo:rotate-180"
			/></Collapsible.Trigger
		>
		<Collapsible.Content class="space-y-3 pt-2">
			<div class="flex flex-wrap gap-2">
				<Button
					size="sm"
					variant="ghost"
					disabled={voiceState !== 'requesting'}
					onclick={() => {
						setVoiceState('recording');
					}}>Allow microphone (demo)</Button
				>
				<Button
					size="sm"
					variant="ghost"
					disabled={voiceState !== 'recording'}
					onclick={() => {
						elapsed += 5;
					}}>Add 5 seconds</Button
				>
				<Button
					size="sm"
					variant="ghost"
					disabled={voiceState !== 'processing'}
					onclick={() => {
						insertTranscript();
					}}>Insert sample transcript</Button
				>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => {
						setVoiceState('error');
					}}>Microphone denied</Button
				>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => {
						setVoiceState('unsupported');
					}}>Unsupported browser</Button
				>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => {
						setVoiceState('idle');
						fail = true;
					}}>Fail next start</Button
				>
				<Button
					size="sm"
					variant="ghost"
					onclick={() => {
						setVoiceState('idle');
						fail = false;
					}}>Reset voice</Button
				>
			</div>
			<p class="text-sm text-muted-foreground">
				Pass voice to Composer or compose Chat.Voice separately. Your app supplies state, elapsed
				seconds, and an optional level from 0 to 1. onStart requests microphone access, onStop
				finishes capture, and onCancel releases capture and aborts processing. Update the draft with
				your transcript or add the recording to attachments. Handle permission failures with
				state="error" and an error message, and unavailable capture with state="unsupported".
				Release microphone tracks when the conversation unmounts; discard results from cancelled
				sessions. Voice controls never send a message automatically.
			</p>
		</Collapsible.Content>
	</Collapsible.Root>
</section>
