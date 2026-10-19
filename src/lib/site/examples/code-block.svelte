<script lang="ts">
	import { CodeBlock, CodeSource, CodeLine } from '#lib/bedrock/ui/code-block';
	const request = `const response = await fetch('/api/activity?limit=10');
if (!response.ok) throw new Error('Activity could not be loaded');
const activity = await response.json();`;
	const response = `{
  "items": [{ "id": "event-42", "title": "Review completed" }],
  "nextCursor": null
}`;
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Connect an activity feed</h3>
		<p class="text-sm text-muted-foreground">
			A compact integration recipe keeps the copyable request beside its expected response.
		</p>
	</header>
	<div class="space-y-4">
		<p class="text-sm text-muted-foreground">
			Illustrative API contract: handle a failed response before rendering the activity list.
		</p>
		<CodeBlock
			code={request}
			language="typescript"
			title="load-activity.ts"
			lineNumbers
		/><CodeBlock code={response} language="json" title="Example response" />
	</div>
	<div class="space-y-2">
		<h4 class="text-sm font-medium">Compose code into your own layout</h4>
		<p class="text-sm text-muted-foreground">
			Source and Line reuse the same syntax highlighting without a card or toolbar.
		</p>
		<CodeSource code={request} language="typescript">
			{#snippet children(lines)}
				<ol class="space-y-1 border-l pl-4 font-code text-xs">
					{#each lines as line, index (index)}
						<li class="flex gap-3">
							<span class="text-muted-foreground select-none" aria-hidden="true">{index + 1}</span
							><code class="min-w-0 [overflow-wrap:anywhere] whitespace-pre-wrap"
								><CodeLine {line} /></code
							>
						</li>
					{/each}
				</ol>
			{/snippet}
		</CodeSource>
	</div>
</section>
