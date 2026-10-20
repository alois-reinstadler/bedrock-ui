<script lang="ts">
	import { appear, vanish } from '#lib/bedrock/motion/index.js';
	import XIcon from '@lucide/svelte/icons/x';

	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';
	import { LayoutGroup, layout, motionPresets } from '#lib/bedrock/motion/index.js';
	import { Button } from '#lib/bedrock/ui/button';

	type ListItem = { id: number; label: string };
	let listId = $state(6);
	let items = $state<ListItem[]>(
		Array.from({ length: 6 }, (_, index) => ({ id: index + 1, label: `Signal ${index + 1}` }))
	);
	let filtered = $state(false);
	let restoreSnapshot = $state<ListItem[]>([]);
	const listLayout = layout({ type: 'position', transition: motionPresets.layout });
	function insertItem() {
		listId += 1;
		items = [{ id: listId, label: `Signal ${listId}` }, ...items];
	}
	function deleteItem(id: number) {
		items = items.filter((item) => item.id !== id);
	}
	function reorderItems() {
		items = [...items].reverse();
	}
	function filterItems() {
		filtered = !filtered;
	}
	function clearItems() {
		restoreSnapshot = items;
		items = [];
	}
	function restoreItems() {
		items = restoreSnapshot.length
			? restoreSnapshot
			: Array.from({ length: 6 }, (_, index) => ({ id: index + 1, label: `Signal ${index + 1}` }));
	}
</script>

<Benchmark
	id="dynamic-list"
	title="Dynamische Liste: insert, delete, reorder, filter, clear, restore"
	summary="Presence erklärt Hinzufügen und Entfernen; Layout hält bestehende Identitäten über Umordnung und Filterung verfolgbar."
	hardCase="Löschen, sofort einfügen und umordnen; während alles läuft filtern. Danach leeren und wiederherstellen, ohne veraltete Animationen."
	verdict="bestanden"
	metadata={{
		role: 'Layout-Bewegung',
		duration: 'enter 230 · exit 175 · layout 500 ms',
		easing: 'enter / exit / layout spring',
		distance: 'durch neue Listengeometrie',
		properties: 'transform, opacity, clip-path',
		layout: 'Einmalige Messung',
		loop: 'Nein',
		reduced: 'Liste aktualisiert instant; Identität bleibt über Labels und Reihenfolge erkennbar.'
	}}
>
	<div class="list-actions">
		<Button size="sm" onclick={insertItem}>Einfügen</Button><Button
			size="sm"
			variant="outline"
			onclick={reorderItems}>Umordnen</Button
		><Button size="sm" variant="outline" onclick={filterItems}>Filtern</Button><Button
			size="sm"
			variant="outline"
			onclick={clearItems}>Leeren</Button
		><Button size="sm" variant="ghost" onclick={restoreItems}>Wiederherstellen</Button>
	</div>
	<LayoutGroup class="dynamic-list">
		{#each filtered ? items.filter((item) => item.id % 2 === 0) : items as item (item.id)}
			<div {@attach listLayout} in:appear out:vanish>
				<span>{item.label}</span><button
					type="button"
					aria-label={`${item.label} löschen`}
					onclick={() => deleteItem(item.id)}><XIcon /></button
				>
			</div>
		{:else}<p>Keine Ergebnisse. Hier wird nichts animiert, nur weil Daten fehlen.</p>{/each}
	</LayoutGroup>
</Benchmark>

<style>
	.list-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}

	:global(.dynamic-list) button {
		width: 1.8rem;
		height: 1.8rem;
		border-radius: 0.45rem;
		color: var(--muted-foreground);
	}

	:global(.dynamic-list) {
		position: relative;
		display: grid;
		gap: 0.35rem;
		margin-top: 0.7rem;
	}
	:global(.dynamic-list) > div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 0.7rem;
		background: var(--background);
		padding: 0.55rem 0.7rem;
		font-size: 0.72rem;
	}
	:global(.dynamic-list) > p {
		color: var(--muted-foreground);
		font-size: 0.72rem;
	}
</style>
