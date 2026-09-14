<script lang="ts">
	import { List, ListItem } from '#lib/bedrock/ui/list';
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Workspace setup guide</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Use numbered steps for sequence and unordered benefits when order does not matter.
		</p>
	</header>
	<div class="grid gap-6 sm:grid-cols-2">
		<div class="space-y-3">
			<h4 class="font-medium">Before inviting the team</h4>
			<List variant="decimal"
				><ListItem>Name your workspace.</ListItem><ListItem
					>Choose who can create projects.</ListItem
				><ListItem>Send a small pilot invitation.</ListItem></List
			>
		</div>
		<div class="space-y-3">
			<h4 class="font-medium">Included in every workspace</h4>
			<List
				><ListItem icon="success">Shared project documents</ListItem><ListItem icon="success"
					>Weekly activity summaries</ListItem
				><ListItem icon="success">Exportable account data</ListItem></List
			>
		</div>
	</div>
</section>
