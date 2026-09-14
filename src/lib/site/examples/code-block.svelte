<script lang="ts">
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
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
</section>
