<script lang="ts">
	import Benchmark from '#lib/site/motion-lab/Benchmark.svelte';

	import { Button } from '#lib/bedrock/ui/button';

	import * as Sheet from '#lib/bedrock/ui/sheet';
	import * as Drawer from '#lib/bedrock/ui/drawer';

	const placements = ['top', 'right', 'bottom', 'left'] as const;
</script>

<Benchmark
	id="edge-surfaces"
	title="Sheet und gestischer Drawer"
	summary="Sheets aus vier Kanten und ein Vaul-Drawer machen unterschiedliche Motion-Eigentümer sichtbar."
	hardCase="Fläche halb öffnen, schließen und vor Ende erneut öffnen. Beim Drawer während des Settlings erneut greifen; beim Sheet die Kante wechseln."
	verdict="problem"
	finding="Sheet nutzt 200 ms ease-in-out, Drawer besitzt extern 500 ms und persistentes will-change. Beide umgehen Bedrocks overlay/drawer-Token und Reduced-Motion-Policy."
	metadata={{
		role: 'Overlay / große Fläche',
		duration: 'Sheet 200 ms · Drawer extern 500 ms',
		easing: 'ease-in-out · Vaul intern',
		distance: 'Kantenbezogen / volle Drawer-Reise',
		origin: 'gewählte Kante',
		properties: 'transform, opacity, backdrop-filter',
		layout: 'Nein',
		loop: 'Nein',
		reduced: 'Lab-Override erreicht portalisierte Third-Party-Flächen nicht zuverlässig.'
	}}
>
	<div class="layer-row wrap">
		{#each placements as side (side)}
			<Sheet.Root>
				<Sheet.Trigger
					>{#snippet child({ props })}<Button size="sm" variant="outline" {...props}
							>Sheet {side}</Button
						>{/snippet}</Sheet.Trigger
				>
				<Sheet.Content {side}
					><Sheet.Header
						><Sheet.Title>Sheet von {side}</Sheet.Title><Sheet.Description
							>Richtung, Dauer und Backdrop-Timing prüfen.</Sheet.Description
						></Sheet.Header
					></Sheet.Content
				>
			</Sheet.Root>
		{/each}
		<Drawer.Root>
			<Drawer.Trigger
				>{#snippet child({ props })}<Button size="sm" {...props}>Bottom Drawer</Button
					>{/snippet}</Drawer.Trigger
			>
			<Drawer.Content
				><Drawer.Header
					><Drawer.Title>Gestischer Drawer</Drawer.Title><Drawer.Description
						>Ziehen, loslassen und während des Settlings wieder greifen.</Drawer.Description
					></Drawer.Header
				><Drawer.Footer
					><Drawer.Close
						>{#snippet child({ props })}<Button variant="outline" {...props}>Schließen</Button
							>{/snippet}</Drawer.Close
					></Drawer.Footer
				></Drawer.Content
			>
		</Drawer.Root>
	</div>
</Benchmark>

<style>
	.layer-row {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}
	.layer-row {
		margin-top: 0.75rem;
	}
	.layer-row.wrap {
		flex-wrap: wrap;
	}
</style>
