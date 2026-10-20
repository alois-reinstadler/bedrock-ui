<script lang="ts">
	import { appear, vanish } from '#lib/bedrock/motion/index.js';
	import XIcon from '@lucide/svelte/icons/x';

	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';

	type Toast = { id: number; title: string };
	let toastId = $state(3);
	let toasts = $state<Toast[]>([
		{ id: 3, title: 'Motion-Bericht bereit' },
		{ id: 2, title: 'Layout-Messung beendet' },
		{ id: 1, title: 'Reduced Mode geprüft' }
	]);
	const toastLayout = layout({ type: 'position', transition: motionPresets.layout });
	function addToast() {
		toastId += 1;
		toasts = [{ id: toastId, title: `Neue Meldung ${toastId}` }, ...toasts].slice(0, 5);
	}
	function dismissToast(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id);
	}
	function dismissSeveral() {
		toasts = toasts.filter((_, index) => index % 2 === 1);
		window.setTimeout(addToast, 70);
	}
</script>

<Benchmark
	id="toast-stack"
	title="Toast-Stack mit konkurrierendem Eintritt und Austritt"
	summary="Bis zu fünf Meldungen treten ein, verlassen den Stack und verschieben die verbleibenden Karten über Bedrocks Presence- und Layout-Primitives."
	hardCase="Mehrere Toasts manuell schließen, während ein neuer eintritt. Ein zeitgedachtes Dismiss überlappt mit dem manuellen Dismiss und der gesamte Stack packt neu."
	verdict="bestanden"
	metadata={{
		role: 'Layout-Bewegung',
		duration: 'enter 230 · exit 175 · layout 500 ms',
		easing: 'enter / exit / layout spring',
		distance: 'durch Stack-Reflow',
		properties: 'transform, opacity, clip-path',
		layout: 'Einmalige Messung',
		loop: 'Nein',
		reduced: 'Ein-/Austritt und Packing werden instant; aria-live und Reihenfolge bleiben.'
	}}
>
	{#snippet actions()}<Button size="sm" variant="outline" onclick={dismissSeveral}
			>Mehrere + neu</Button
		>{/snippet}
	<div class="toast-controls">
		<Button size="sm" onclick={addToast}>Toast hinzufügen</Button><span
			>{toasts.length} / 5 aktiv</span
		>
	</div>
	<LayoutGroup class="toast-stack" role="log" aria-live="polite" aria-relevant="additions">
		{#each toasts as toast (toast.id)}
			<article
				{@attach toastLayout}
				in:appear={{ duration: motionPresets.enter.duration }}
				out:vanish={{ duration: motionPresets.exit.duration }}
			>
				<div><small>Systemmeldung</small><strong>{toast.title}</strong></div>
				<button
					type="button"
					aria-label={`${toast.title} schließen`}
					onclick={() => dismissToast(toast.id)}><XIcon /></button
				>
			</article>
		{/each}
	</LayoutGroup>
</Benchmark>

<style>
	.toast-controls {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}
	.toast-controls span {
		color: var(--muted-foreground);
		font-size: 0.68rem;
	}
	:global(.toast-stack) {
		position: relative;
		display: grid;
		gap: 0.4rem;
		margin-top: 0.6rem;
	}
	:global(.toast-stack) article {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--background);
		padding: 0.65rem 0.75rem;
	}
	:global(.toast-stack) small,
	:global(.toast-stack) strong {
		display: block;
	}
	:global(.toast-stack) small {
		color: var(--muted-foreground);
		font-size: 0.58rem;
	}
	:global(.toast-stack) strong {
		margin-top: 0.12rem;
		font-size: 0.75rem;
	}
	:global(.toast-stack) button {
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 0.45rem;
		color: var(--muted-foreground);
	}
</style>
