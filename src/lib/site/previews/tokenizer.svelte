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

<div class="flex w-full max-w-80 flex-col gap-4">
	<Tokenizer
		aria-label="Preview reviewers"
		options={people}
		bind:value={reviewers}
		placeholder="Add reviewers…"
	/>
	<Tokenizer
		aria-label="Preview tags"
		options={[]}
		bind:value={tags}
		create
		placeholder="Add tags…"
	/>
</div>
