<script lang="ts">
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
</script>

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
