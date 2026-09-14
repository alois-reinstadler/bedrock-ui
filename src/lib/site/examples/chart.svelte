<script lang="ts">
	import { LineChart } from 'layerchart';
	import * as Chart from '#lib/bedrock/ui/chart';
	import type { ChartConfig } from '#lib/bedrock/ui/chart';

	const data = [
		{ month: 'Apr', requests: 124 },
		{ month: 'May', requests: 168 },
		{ month: 'Jun', requests: 151 },
		{ month: 'Jul', requests: 219 },
		{ month: 'Aug', requests: 246 },
		{ month: 'Sep', requests: 288 }
	];

	const config = {
		requests: { label: 'Requests', color: 'var(--color-primary)' }
	} satisfies ChartConfig;
</script>

<figure class="w-full max-w-2xl space-y-3" aria-labelledby="chart-title chart-summary">
	<div>
		<p id="chart-title" class="text-sm font-medium">API requests</p>
		<p id="chart-summary" class="text-sm text-muted-foreground">
			Monthly requests rose from 124 in April to 288 in September.
		</p>
	</div>
	<Chart.Container {config} class="h-64 w-full" role="img" aria-label="API requests by month">
		<LineChart {data} x="month" y="requests" />
	</Chart.Container>
</figure>
