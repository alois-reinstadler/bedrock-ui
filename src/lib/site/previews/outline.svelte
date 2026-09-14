<script lang="ts">
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Outline } from '#lib/bedrock/ui/outline';
	import { Text } from '#lib/bedrock/ui/text';

	const items = [
		{ id: 'preview-outline-introduction', label: 'Introduction', level: 1 },
		{ id: 'preview-outline-installation', label: 'Installation', level: 2 },
		{ id: 'preview-outline-usage', label: 'Usage', level: 2 }
	];
</script>

<div class="flex gap-8">
	<Outline {items} class="w-44 shrink-0" />
	<div class="min-w-0 space-y-4">
		<Heading level={2} visual={4} id="preview-outline-introduction">Introduction</Heading>
		<Text as="p">The outline tracks these headings as you scroll.</Text>
		<Heading level={3} visual={5} id="preview-outline-installation">Installation</Heading>
		<Text as="p">Each item id must match a heading id on the page.</Text>
		<Heading level={3} visual={5} id="preview-outline-usage">Usage</Heading>
		<Text as="p">Clicking an item scrolls to its heading and updates the hash.</Text>
	</div>
</div>
