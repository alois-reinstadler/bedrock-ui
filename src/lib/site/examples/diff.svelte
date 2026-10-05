<script lang="ts">
	import { Diff } from '#lib/bedrock/ui/diff';
	const before = `export async function loadActivity() {
  const response = await fetch('/api/activity');
  return response.json();
}
`;
	const after = `export async function loadActivity() {
  const response = await fetch('/api/activity?limit=10');
  if (!response.ok) {
    throw new Error('Activity could not be loaded');
  }
  return response.json();
}
`;
	const oldSettings = 'Request timeout: 10 seconds\nRetry failed requests: no\n';
	const newSettings = 'Request timeout: 30 seconds\nRetry failed requests: yes\n';
	const unchanged = 'version = 2\n';
</script>

<section class="w-full max-w-3xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Review an activity feed update</h3>
		<p class="text-sm text-muted-foreground">
			Compare a change in context, switch views, and copy the updated source.
		</p>
	</header>
	<Diff {before} {after} language="typescript" title="load-activity.ts" wrap />
	<div class="space-y-2">
		<h4 class="text-sm font-medium">A focused side-by-side comparison</h4>
		<Diff
			before={oldSettings}
			after={newSettings}
			view="split"
			viewToggle={false}
			copyButton={false}
			wrap
		/>
	</div>
	<div class="space-y-2">
		<h4 class="text-sm font-medium">Identical versions</h4>
		<Diff before={unchanged} after={unchanged} viewToggle={false} copyButton={false} />
	</div>
</section>
