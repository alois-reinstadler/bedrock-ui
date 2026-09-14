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

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Monitor a service budget</h3>
		<p class="text-sm text-muted-foreground">
			Pair the chart with a written trend and the underlying values so the report remains useful
			without visual interpretation.
		</p>
	</header>

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
	<details class="rounded-lg border p-3">
		<summary class="cursor-pointer text-sm font-medium">View source values</summary>
		<table class="mt-3 w-full text-left text-sm">
			<caption class="sr-only">Monthly API request totals</caption><thead
				><tr><th scope="col">Month</th><th scope="col">Requests</th></tr></thead
			><tbody
				>{#each data as row (row.month)}<tr
						><th scope="row" class="py-1 font-normal">{row.month}</th><td>{row.requests}</td></tr
					>{/each}</tbody
			>
		</table>
	</details>
</section>
