<script lang="ts">
	import { AspectRatio } from '#lib/bedrock/ui/aspect-ratio';
	import * as Card from '#lib/bedrock/ui/card';
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">An editorial feature</h3>
		<p class="text-sm text-muted-foreground">
			Reserve the media footprint before content arrives so a reading list stays stable.
		</p>
	</header>
	<Card.Root class="overflow-hidden"
		><AspectRatio ratio={16 / 9}
			><div
				class="flex h-full items-end bg-gradient-to-br from-slate-700 via-slate-500 to-stone-300 p-6"
			>
				<p class="max-w-xs text-3xl font-semibold text-white">A quieter way to work.</p>
			</div></AspectRatio
		><Card.Header
			><Card.Title>Designing space for focus</Card.Title><Card.Description
				>Field journal · 6 minute read</Card.Description
			></Card.Header
		><Card.Content
			><p class="text-sm text-muted-foreground">
				A consistent 16:9 cover makes related stories feel connected, even when their artwork
				differs.
			</p></Card.Content
		></Card.Root
	>
</section>
