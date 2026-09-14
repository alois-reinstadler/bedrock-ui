<script lang="ts">
	import { Citation } from '#lib/bedrock/ui/citation';
</script>

<p class="flex items-center gap-2">
	Bedrock components are designed for composable interfaces.
	<Citation
		number={1}
		source={{ title: 'Design system guidance', url: 'https://example.com', icon: 'externalLink' }}
	/>
	<Citation number={2} source={{ title: 'Internal research note' }} variant="number" />
</p>
