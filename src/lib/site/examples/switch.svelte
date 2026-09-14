<script lang="ts">
	import { Switch } from '#lib/bedrock/ui/switch';
	import { Label } from '#lib/bedrock/ui/label';
	let checked = $state(true);
</script>

<section class="max-w-md space-y-5 rounded-xl border p-5">
	<h3 class="font-medium">Notification preferences</h3>
	<div class="flex items-start justify-between gap-4">
		<div class="space-y-1">
			<Label for="project-notifications">Project updates</Label>
			<p id="project-notifications-hint" class="text-sm text-muted-foreground">
				Receive an email when a teammate mentions you or changes a deadline.
			</p>
		</div>
		<Switch id="project-notifications" bind:checked aria-describedby="project-notifications-hint" />
	</div>
	<p class="border-t pt-4 text-sm" role="status">
		{checked
			? 'Project emails are enabled.'
			: 'Project emails are paused. You can still find updates in your inbox.'}
	</p>
</section>
