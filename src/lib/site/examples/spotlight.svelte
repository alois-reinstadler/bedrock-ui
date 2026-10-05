<script lang="ts">
	import { Spotlight, SpotlightGroup } from '#lib/bedrock/ui/spotlight';
</script>

<SpotlightGroup class="w-full max-w-2xl sm:grid-cols-2"
	>{#each [{ title: 'Shared light', body: 'Move across the grid to illuminate nearby borders.' }, { title: 'Independent surfaces', body: 'The glow stays inside each card, leaving the gaps clear.' }] as card (card.title)}<Spotlight
			><div class="min-h-44 p-6">
				<h3 class="font-semibold">{card.title}</h3>
				<p class="mt-3 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
			</div></Spotlight
		>{/each}</SpotlightGroup
>
