<script lang="ts">
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	let voiceState = $state<Chat.ChatVoiceState>('idle');
	let value = $state('');
	let elapsed = $state(0);
	let sent = $state('');
	let fail = $state(false);
	function start() {
		if (fail) {
			fail = false;
			throw new Error('Demo microphone failure');
		}
		elapsed = 0;
		voiceState = 'requesting';
	}
</script>

<section data-demo="chat-voice" class="w-full max-w-xl space-y-4">
	<p class="text-sm text-muted-foreground">
		Try the voice input states below. This simulation does not access your microphone. Finish
		recording, then insert the sample transcript to review it before sending.
	</p>
	<Chat.Composer
		bind:value
		voice={{
			state: voiceState,
			elapsed,
			level: 0.65,
			onStart: start,
			onStop: () => {
				voiceState = 'processing';
			},
			onCancel: () => {
				voiceState = 'idle';
			}
		}}
		onSend={(message) => {
			sent = message;
		}}
	/>
	<div class="flex flex-wrap gap-2">
		<Button
			size="sm"
			variant="outline"
			disabled={voiceState !== 'requesting'}
			onclick={() => {
				voiceState = 'recording';
			}}>Allow microphone (demo)</Button
		>
		<Button
			size="sm"
			variant="outline"
			disabled={voiceState !== 'recording'}
			onclick={() => {
				elapsed += 5;
			}}>Add 5 seconds</Button
		>
		<Button
			size="sm"
			variant="outline"
			disabled={voiceState !== 'processing'}
			onclick={() => {
				value = [value, 'Please summarize this conversation.'].filter(Boolean).join(' ');
				voiceState = 'idle';
			}}>Insert sample transcript</Button
		>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				voiceState = 'error';
			}}>Microphone denied</Button
		>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				voiceState = 'unsupported';
			}}>Unsupported browser</Button
		>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				voiceState = 'idle';
				fail = true;
			}}>Fail next start</Button
		>
		<Button
			size="sm"
			variant="outline"
			onclick={() => {
				voiceState = 'idle';
				fail = false;
			}}>Reset voice</Button
		>
	</div>
	<p role="status" class="text-sm text-muted-foreground">{sent ? `Sent: ${sent}` : ''}</p>
	<p class="text-sm text-muted-foreground">
		Pass voice to Composer or compose Chat.Voice separately. Your app supplies state, elapsed
		seconds, and an optional level from 0 to 1. onStart requests microphone access, onStop finishes
		capture, and onCancel releases capture and aborts processing. Update the draft with your
		transcript or add the recording to attachments. Handle permission failures with state="error"
		and an error message, and unavailable capture with state="unsupported". Release microphone
		tracks when the conversation unmounts; discard results from cancelled sessions. Voice controls
		never send a message automatically.
	</p>
</section>
