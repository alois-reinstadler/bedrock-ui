<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Heading } from '#lib/bedrock/ui/heading';
</script>

<Card.Root class="block w-full max-w-2xl gap-0 space-y-5 p-5">
	<header>
		<h3 class="text-lg font-semibold">Editorial hierarchy</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Choose semantic levels for the surrounding document, then use visual sizing to create an
			editorial rhythm.
		</p>
	</header>
	<article class="space-y-4">
		<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
			Field notes · 6 minute read
		</p>
		<Heading level={4} visual={2}>Make room for focused work</Heading>
		<p class="text-muted-foreground">
			A team agreement for quieter mornings and more deliberate collaboration.
		</p>
		<Heading level={5} visual={4}>Protect the first hour</Heading>
		<p class="text-sm leading-relaxed">
			Keep status updates asynchronous. Reserve meetings for decisions that benefit from a live
			conversation.
		</p>
		<Heading level={5} visual={4}>Leave a useful handoff</Heading>
		<p class="text-sm leading-relaxed">
			Write down the decision, its owner, and the next action before ending a discussion.
		</p>
	</article>
</Card.Root>
