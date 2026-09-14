<script lang="ts">
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Text } from '#lib/bedrock/ui/text';

	let {
		eyebrow = 'Docs',
		title,
		description
	}: { eyebrow?: string; title: string; description: string } = $props();
</script>

<header class="max-w-3xl">
	<Text type="supporting" class="tracking-wide uppercase" color="muted">{eyebrow}</Text>
	<Heading level={1} visual="display-3" class="mt-2">{title}</Heading>
	<Text color="muted" class="mt-4 max-w-[64ch] text-base leading-relaxed">{description}</Text>
</header>
