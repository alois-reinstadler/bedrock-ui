<script lang="ts">
	import { Outline } from '#lib/bedrock/ui/outline';

	const items = [
		{ id: 'introduction', label: 'Introduction', level: 1 },
		{ id: 'installation', label: 'Installation', level: 2 },
		{ id: 'usage', label: 'Usage', level: 2 },
		{ id: 'streaming', label: 'Streaming', level: 3 },
		{ id: 'api-reference', label: 'API reference', level: 1 }
	];
</script>

<!-- Static demo: scroll-spy is off and the active item is fixed. -->
<Outline {items} activeId="usage" scrollSpy={false} class="max-w-56" />
