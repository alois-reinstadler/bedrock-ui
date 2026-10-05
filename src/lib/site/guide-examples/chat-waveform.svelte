<script lang="ts">
	import { onDestroy } from 'svelte';
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Button } from '#lib/bedrock/ui/button';
	import { Icon } from '#lib/bedrock/ui/icon';
	import Mic from '@lucide/svelte/icons/mic';
	import Square from '@lucide/svelte/icons/square';
	import AudioLines from '@lucide/svelte/icons/audio-lines';
	let captureState = $state<'idle' | 'requesting' | 'recording' | 'processing'>('idle');
	let analyser = $state.raw<AnalyserNode>();
	let sensitivity = $state(2.2);
	let elapsed = $state(0);
	let error = $state('');
	let preview = $state(false);
	let previewLevel = $state(0);
	let recordingUrl = $state('');
	let recordingType = $state('');
	let recorder: MediaRecorder | undefined;
	let ticker: ReturnType<typeof setInterval> | undefined;
	let previewTicker: ReturnType<typeof setInterval> | undefined;
	let operation = 0;
	let release = () => {};
	const busy = $derived(captureState !== 'idle');
	const duration = $derived(`${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`);
	const status = $derived(
		preview
			? 'Quiet voice preview'
			: {
					idle: 'Ready when you are',
					requesting: 'Allow microphone access',
					recording: 'Listening',
					processing: 'Finishing recording'
				}[captureState]
	);
	function stopPreview() {
		clearInterval(previewTicker);
		preview = false;
		previewLevel = 0;
	}
	function togglePreview() {
		if (preview) return stopPreview();
		preview = true;
		const started = performance.now();
		previewLevel = 0.025;
		previewTicker = setInterval(() => {
			const t = (performance.now() - started) / 1000;
			previewLevel = Math.max(0, Math.sin(t * 2.4)) * (0.018 + 0.025 * Math.sin(t * 7) ** 2);
		}, 40);
	}
	function clearCapture() {
		operation++;
		clearInterval(ticker);
		release();
		release = () => {};
		recorder = undefined;
		analyser = undefined;
	}
	function cancel() {
		clearCapture();
		captureState = 'idle';
		elapsed = 0;
	}
	function clearRecording() {
		if (recordingUrl) URL.revokeObjectURL(recordingUrl);
		recordingUrl = '';
	}
	async function start() {
		if (busy) return;
		stopPreview();
		clearCapture();
		error = '';
		elapsed = 0;
		if (
			!navigator.mediaDevices?.getUserMedia ||
			typeof MediaRecorder === 'undefined' ||
			typeof AudioContext === 'undefined'
		) {
			error =
				'Audio recording is unavailable in this browser. Open this page over HTTPS or localhost.';
			return;
		}
		const current = operation;
		captureState = 'requesting';
		try {
			const context = new AudioContext();
			release = () => {
				void context.close().catch(() => {});
			};
			await context.resume();
			if (current !== operation) return;
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: { echoCancellation: true, noiseSuppression: true },
				video: false
			});
			if (current !== operation) {
				stream.getTracks().forEach((track) => track.stop());
				return;
			}
			// App-owned resources: the visualizer only reads this analyser.
			let source: MediaStreamAudioSourceNode | undefined;
			let capture: MediaRecorder | undefined;
			release = () => {
				if (capture) {
					capture.ondataavailable = capture.onstop = capture.onerror = null;
					if (capture.state !== 'inactive') capture.stop();
				}
				stream.getTracks().forEach((track) => {
					track.onended = null;
					track.stop();
				});
				source?.disconnect();
				void context.close().catch(() => {});
			};
			source = context.createMediaStreamSource(stream);
			const input = context.createAnalyser();
			input.fftSize = 1024;
			source.connect(input); // Never connect the microphone to speakers.
			analyser = input;
			capture = new MediaRecorder(stream);
			recorder = capture;
			const chunks: Blob[] = [];
			capture.ondataavailable = (event) => {
				if (event.data.size) chunks.push(event.data);
			};
			capture.onstop = () => {
				if (current !== operation) return;
				const type = capture!.mimeType;
				const blob = new Blob(chunks, { type });
				clearCapture();
				captureState = 'idle';
				if (!blob.size) {
					error = 'No audio was captured. Please try again.';
					return;
				}
				clearRecording();
				recordingType = type;
				recordingUrl = URL.createObjectURL(blob);
			};
			const interrupted = () => {
				if (current !== operation) return;
				cancel();
				error = 'The microphone disconnected or recording stopped unexpectedly. Please try again.';
			};
			capture.onerror = interrupted;
			stream.getAudioTracks().forEach((track) => {
				track.onended = interrupted;
			});
			capture.start();
			captureState = 'recording';
			const started = performance.now();
			ticker = setInterval(() => {
				elapsed = Math.floor((performance.now() - started) / 1000);
			}, 250);
		} catch (cause) {
			if (current !== operation) return;
			cancel();
			error =
				cause instanceof DOMException && cause.name === 'NotAllowedError'
					? 'Microphone access was denied. Allow access in your browser, then try again.'
					: 'Could not start the microphone. Check that it is connected and try again.';
		}
	}
	function finish() {
		if (recorder?.state !== 'recording') return;
		captureState = 'processing';
		clearInterval(ticker);
		recorder.stop();
	}
	onDestroy(() => {
		stopPreview();
		clearCapture();
		clearRecording();
	});
</script>

<section data-demo="chat-waveform" class="mx-auto w-full max-w-xl space-y-4">
	<div class="overflow-hidden rounded-xl border bg-background shadow-xs">
		<div class="flex items-start justify-between gap-4 px-5 pt-5">
			<div class="space-y-1">
				<h4 class="text-sm font-medium">Every word, a little more alive.</h4>
				<p class="text-xs leading-relaxed text-muted-foreground">
					Speak naturally. Even a quiet voice has room to move.
				</p>
			</div>
			<Icon icon={AudioLines} class="mt-0.5 size-4 shrink-0 text-muted-foreground" />
		</div>
		<div class="px-5 py-4">
			<div class="flex items-center justify-between gap-2 text-xs">
				<span role="status" class="flex items-center gap-2 text-muted-foreground">
					<span
						class={captureState === 'recording'
							? 'size-1.5 rounded-full bg-destructive'
							: 'size-1.5 rounded-full bg-muted-foreground/40'}
					></span>{status}
				</span>
				<span
					role="timer"
					aria-label="Audio recording duration"
					class="font-mono text-muted-foreground tabular-nums">{duration}</span
				>
			</div>
			<Chat.Waveform
				{analyser}
				level={previewLevel}
				active={captureState === 'recording' || preview}
				{sensitivity}
				class="my-3 h-32"
			/>
			<div class="flex flex-wrap items-center justify-between gap-3">
				<Button
					size="sm"
					variant="ghost"
					disabled={busy}
					aria-pressed={preview}
					onclick={togglePreview}>{preview ? 'Stop preview' : 'Preview quiet voice'}</Button
				>
				<div class="flex items-center gap-2">
					{#if busy}<Button size="sm" variant="ghost" onclick={cancel}>Cancel</Button>{/if}
					{#if captureState === 'recording'}
						<Button size="sm" onclick={finish}
							><Icon icon={Square} class="size-3 fill-current" />Finish recording</Button
						>
					{:else}
						<Button size="sm" disabled={busy} onclick={start}
							><Icon icon={Mic} class="size-3.5" />{busy ? 'Please wait…' : 'Record audio'}</Button
						>
					{/if}
				</div>
			</div>
		</div>
		<div class="space-y-2 border-t bg-muted/20 px-5 py-4">
			<label class="flex items-center justify-between gap-4 text-xs">
				<span class="shrink-0 text-muted-foreground">Visual sensitivity</span>
				<input
					type="range"
					min="0.5"
					max="4"
					step="0.1"
					bind:value={sensitivity}
					class="h-1.5 w-32 min-w-0 cursor-pointer accent-foreground"
				/>
				<span class="w-9 shrink-0 text-right font-mono tabular-nums">{sensitivity.toFixed(1)}×</span
				>
			</label>
			<p class="text-[11px] leading-relaxed text-muted-foreground">
				Changes the wave’s response, not your recording’s volume.
			</p>
		</div>
	</div>
	{#if error}<p role="alert" class="text-sm text-destructive">{error}</p>{/if}
	{#if recordingUrl}
		<div class="space-y-3 rounded-xl border p-4">
			<div class="flex items-center justify-between gap-3">
				<span class="text-xs font-medium">Your recording</span><Button
					variant="ghost"
					size="sm"
					onclick={clearRecording}>Discard</Button
				>
			</div>
			<audio controls src={recordingUrl} aria-label="Recorded audio playback" class="h-10 w-full"
			></audio>
			<a
				href={recordingUrl}
				download={`voice-note.${recordingType.includes('mp4') ? 'm4a' : recordingType.includes('ogg') ? 'ogg' : 'webm'}`}
				class="text-xs underline underline-offset-4">Download recording</a
			>
		</div>
	{/if}
	<p class="text-center text-xs leading-relaxed text-muted-foreground">
		Microphone access starts when you press Record audio. Recordings stay in this browser.
	</p>
</section>
