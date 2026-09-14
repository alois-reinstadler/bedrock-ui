<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	let reserved = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">A workshop reservation</h3>
		<p class="text-sm text-muted-foreground">
			Use the footer for a clear next action and show the resulting reservation in the same card.
		</p>
	</header>
	<Card.Root class="max-w-md"
		><Card.Header
			><Card.Title>Field notes workshop</Card.Title><Card.Description
				>September 18 · Studio 4 · 10:00–12:30</Card.Description
			></Card.Header
		><Card.Content class="space-y-3"
			><p class="text-sm">
				Practice observation, sketching, and synthesis with a small group. Materials and a workbook
				are included.
			</p>
			<p class="text-sm text-muted-foreground">
				{reserved
					? 'Your demo place is reserved.'
					: '4 places available · No payment required for this demo'}
			</p></Card.Content
		><Card.Footer class="flex-wrap gap-2"
			><Button onclick={() => (reserved = !reserved)} variant={reserved ? 'outline' : 'default'}
				>{reserved ? 'Cancel reservation' : 'Reserve a place'}</Button
			><span role="status" class="text-sm">{reserved ? 'Reservation confirmed' : ''}</span
			></Card.Footer
		></Card.Root
	>
</section>
