<script lang="ts">
	import { onDestroy } from 'svelte';

	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { motionEasings, motionPresets, reveal } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';

	let requestState = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let requestTimer = 0;
	let email = $state('motion@');
	let touched = $state(false);
	const emailError = $derived(
		touched && !/^[^@]+@[^@]+\.[^@]+$/.test(email)
			? email.includes('@')
				? 'Die Domain ist unvollständig.'
				: 'Eine gültige E-Mail-Adresse eingeben.'
			: ''
	);
	function startRequest(result: 'success' | 'error') {
		clearTimeout(requestTimer);
		requestState = 'loading';
		requestTimer = window.setTimeout(() => (requestState = result), 650);
	}
	onDestroy(() => clearTimeout(requestTimer));
</script>

<Benchmark
	id="async-and-validation"
	title="Async Button und Live-Validierung"
	summary="Anfragezustand und Fehlermeldung können sich ändern, während der Nutzer bereits weiter tippt oder eine neue Anfrage startet."
	hardCase="Loading mit Erfolg starten, sofort Fehler anfordern und währenddessen die Fehlermeldung durch schnelles Tippen zweimal ändern. Buttonbreite und Formularlayout bleiben stabil."
	verdict="beobachten"
	metadata={{
		role: 'Zustandswechsel',
		duration: 'state 175 · reveal 310 / exit 175 ms',
		easing: 'state default · enter / exit',
		properties: 'opacity, height, padding; Spinner transform',
		layout: 'Pro Frame',
		loop: 'Ja',
		reduced: 'Statusicon und Text bleiben; Spinner stoppt; Meldung wechselt mit kurzer Opacity.'
	}}
>
	<div class="async-grid">
		<div class="request-card">
			<Button class="w-44" onclick={() => startRequest('success')}>
				{#if requestState === 'loading'}<LoaderCircleIcon class="lab-loop animate-spin" /> Lädt …
				{:else if requestState === 'success'}<CheckIcon /> Gespeichert
				{:else if requestState === 'error'}Fehlgeschlagen
				{:else}Erfolg anfordern{/if}
			</Button>
			<Button variant="outline" onclick={() => startRequest('error')}>Fehler anfordern</Button>
		</div>
		<label class="field"
			><span>E-Mail für Bericht</span><input
				bind:value={email}
				onblur={() => (touched = true)}
				oninput={() => (touched = true)}
				aria-invalid={emailError ? 'true' : undefined}
			/>
			{#if emailError}<div
					class="validation-message"
					in:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
					out:reveal={{ duration: motionPresets.exit.duration, easing: motionEasings.exit }}
				>
					{emailError}
				</div>{:else if touched}<div class="success-message">Format gültig.</div>{/if}
		</label>
	</div>
</Benchmark>

<style>
	.async-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}
	.request-card,
	.field {
		display: flex;
		min-height: 8rem;
		flex-wrap: wrap;
		align-content: center;
		gap: 0.5rem;
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.8rem;
	}
	.field {
		display: grid;
	}
	.field > span {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	.field input {
		height: 2.2rem;
		border: 1px solid var(--border);
		border-radius: 0.6rem;
		background: var(--card);
		padding: 0 0.65rem;
		font-size: 0.75rem;
		outline: none;
	}
	.field input:focus {
		border-color: var(--ring);
		box-shadow: 0 0 0 2px color-mix(in oklab, var(--ring), transparent 75%);
	}
	.validation-message,
	.success-message {
		color: #b42318;
		font-size: 0.7rem;
	}
	.success-message {
		color: #08752c;
	}

	@media (max-width: 42rem) {
		.async-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
