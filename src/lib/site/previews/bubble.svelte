<script lang="ts">
	import * as Bubble from '#lib/bedrock/ui/bubble';
	const variants = [
		'default',
		'secondary',
		'muted',
		'tinted',
		'outline',
		'ghost',
		'destructive'
	] as const;
</script>

<Bubble.Group class="w-full max-w-lg gap-4">
	{#each variants as variant, index (variant)}<Bubble.Root
			{variant}
			align={index % 2 ? 'end' : 'start'}
			><Bubble.Content
				>{variant === 'ghost'
					? 'Ghost content flows without a filled surface.'
					: `${variant[0].toUpperCase()}${variant.slice(1)} bubble`}</Bubble.Content
			></Bubble.Root
		>{/each}
</Bubble.Group>
