<script lang="ts">
	import { onDestroy } from 'svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';

	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	let loadingState = $state<'idle' | 'loading' | 'done'>('idle');
	let loadingTimer = 0;
	function startLoading() {
		clearTimeout(loadingTimer);
		loadingState = 'loading';
		loadingTimer = window.setTimeout(() => (loadingState = 'done'), 900);
	}
	onDestroy(() => clearTimeout(loadingTimer));
</script>

<Benchmark
	id="async-control"
	title="Asynchroner Button ohne Größenflackern"
	summary="Idle → Loading → Erfolg innerhalb einer stabilen 9.5-rem-Fläche. Eine neue Anfrage darf Erfolg sofort unterbrechen."
	hardCase="Während Erfolg sichtbar wird, sofort erneut starten. Icon und Text wechseln, aber die Button-Geometrie bleibt unverändert."
	verdict="beobachten"
	metadata={{
		role: 'Zustandswechsel',
		duration: 'motionPresets.state wäre 175 ms; Komponente verwendet Utility-Default',
		easing: 'nicht semantisch gebunden',
		properties: 'color, transform; Spinner-Schleife',
		layout: 'Nein',
		loop: 'Ja',
		reduced: 'Spinner sollte zu statischem Statussymbol werden.'
	}}
>
	<div class="async-stage">
		<Button class="w-40" onclick={startLoading} disabled={loadingState === 'loading'}>
			{#if loadingState === 'loading'}<LoaderCircleIcon class="lab-loop animate-spin" /> Wird geprüft
				…
			{:else if loadingState === 'done'}<CheckIcon /> Erfolgreich
			{:else}Prüfung starten{/if}
		</Button>
		<Button variant="outline" onclick={startLoading}>Neu starten</Button>
	</div>
</Benchmark>

<style>
	.async-stage {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.5rem;
		min-height: 5rem;
	}
</style>
