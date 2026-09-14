<script lang="ts">
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Service health dashboard</h3>
		<p class="text-sm text-muted-foreground">
			Pair each color with a written status so an incident is understandable without color
			perception.
		</p>
	</div>

	<ul class="flex flex-col gap-1.5 text-sm">
		<li class="flex items-center gap-2">
			<StatusDot status="success" label="Operational" /> API — operational
		</li>
		<li class="flex items-center gap-2">
			<StatusDot status="warning" label="Degraded" /> Search — degraded
		</li>
		<li class="flex items-center gap-2">
			<StatusDot status="destructive" pulse label="Outage" /> Exports — outage
		</li>
		<li class="flex items-center gap-2">
			<StatusDot status="neutral" label="Maintenance" /> Reports — maintenance
		</li>
	</ul>
</section>
