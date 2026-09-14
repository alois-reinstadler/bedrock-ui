<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { ClickableCard } from '#lib/bedrock/ui/clickable-card';
	import { Button } from '#lib/bedrock/ui/button';
	let opened = $state(false);
	let pinned = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">A project library</h3>
		<p class="text-sm text-muted-foreground">
			The main card opens a project; its separate pin action must not accidentally open it.
		</p>
	</header>
	<ClickableCard label="Open Field journal project" onclick={() => (opened = true)}
		><Card.Header
			><Card.Title>Field journal</Card.Title><Card.Description
				>Updated today · 8 documents · Design research</Card.Description
			></Card.Header
		><Card.Content
			><p class="text-sm text-muted-foreground">
				Interview plans, observations, and decisions for the autumn release.
			</p></Card.Content
		><Card.Footer
			><Button variant="outline" size="sm" aria-pressed={pinned} onclick={() => (pinned = !pinned)}
				>{pinned ? 'Unpin project' : 'Pin project'}</Button
			></Card.Footer
		></ClickableCard
	>
	<p role="status" class="text-sm">
		{opened ? 'Field journal is open in this demo.' : 'Select the card to open the project.'}
		{pinned ? 'Pinned to your library.' : ''}
	</p>
</section>
