<script lang="ts">
	import type { SelectorOption } from '#lib/bedrock/ui/selector';
	import { Tokenizer } from '#lib/bedrock/ui/tokenizer';

	const people: SelectorOption[] = [
		{ value: 'ada', label: 'Ada Lovelace', description: 'Analytical engines' },
		{ value: 'grace', label: 'Grace Hopper', description: 'Compilers' },
		{ value: 'edsger', label: 'Edsger Dijkstra', description: 'Algorithms' },
		{ value: 'barbara', label: 'Barbara Liskov', description: 'Abstraction' },
		{ value: 'donald', label: 'Donald Knuth', description: 'Typesetting' }
	];

	let reviewers = $state(['ada']);
	let tags = $state<string[]>([]);
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Request a design review</h3>
		<p class="text-sm text-muted-foreground">
			Select reviewers from known teammates and create free-form topic tags separately. These fields
			represent different data contracts.
		</p>
	</div>

	<div class="flex w-full max-w-md flex-col gap-4 rounded-xl border p-5">
		<p class="text-sm font-medium" id="reviewers-label">Reviewers</p>
		<Tokenizer
			aria-labelledby="reviewers-label"
			options={people}
			bind:value={reviewers}
			placeholder="Add reviewers…"
		/>
		<p class="text-sm font-medium" id="topics-label">Topics</p>
		<Tokenizer
			aria-labelledby="topics-label"
			options={[]}
			bind:value={tags}
			create
			placeholder="Add tags…"
		/>
	</div>

	<p role="status" class="text-sm">
		{reviewers.length} reviewers selected · {tags.length} topics added
	</p>
</section>
