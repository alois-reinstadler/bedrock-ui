<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Emoji } from '#lib/bedrock/ui/emoji';
	import { Button } from '#lib/bedrock/ui/button';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	let reaction = $state('❤️');
	const reactions = [
		{ value: '❤️', label: 'Love' },
		{ value: '👏🏽', label: 'Applause' },
		{ value: '🔥', label: 'Fire' },
		{ value: '🎉', label: 'Celebrate' },
		{ value: '👩🏽‍💻', label: 'Technologist' },
		{ value: '🇦🇹', label: 'Austria' }
	];
</script>

<div class="w-full max-w-xl space-y-6">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h3 class="font-medium">A little more expression</h3>
			<p class="text-sm text-muted-foreground">Apple emoji, ordinary text.</p>
		</div>
	</div>
	<Card.Root class="block gap-0 space-y-5 p-5">
		<p class="text-lg"><Emoji value="Looks great! Let's ship it 🚀✨" /></p>
		<div class="flex flex-wrap gap-2" role="group" aria-label="Choose a reaction">
			{#each reactions as item (item.value)}
				<Button
					variant={reaction === item.value ? 'secondary' : 'ghost'}
					size="icon"
					aria-label={item.label}
					aria-pressed={reaction === item.value}
					onclick={() => (reaction = item.value)}
				>
					<Emoji value={item.value} size={24} decorative />
				</Button>
			{/each}
		</div>
		<p class="flex items-center gap-2 text-sm text-muted-foreground" role="status">
			Your reaction <Emoji value={reaction} size={20} />
		</p>
	</Card.Root>
	<div class="flex items-end gap-5" aria-label="Emoji sizes">
		{#each [16, 24, 40, 64] as size (size)}
			<div class="space-y-2 text-center">
				<Emoji value="😊" {size} label="Smiling face" />
				<p class="text-xs text-muted-foreground">{size}px</p>
			</div>
		{/each}
	</div>
	<Card.Root class="block gap-0 space-y-3 p-4">
		<h4 class="text-sm font-medium">Select, copy, paste</h4>
		<p data-emoji-copy-example class="leading-relaxed">
			<Emoji value="Hello 👩🏽‍💻 🇦🇹 1️⃣ 👨‍👩‍👧‍👦" />
		</p>
		<Textarea
			aria-label="Paste copied text"
			placeholder="Copy any part of the message and paste it here."
		/>
	</Card.Root>
	<p class="text-xs text-muted-foreground">
		Apple artwork remains © Apple Inc. The public image source does not grant commercial usage
		rights. <a
			href="https://github.com/iamcal/emoji-data#image-sources"
			class="underline underline-offset-4">Image source and licensing</a
		>
	</p>
</div>
