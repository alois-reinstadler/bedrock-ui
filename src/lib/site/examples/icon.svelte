<script lang="ts">
	import * as Card from '#lib/bedrock/ui/card';
	import { Icon } from '#lib/bedrock/ui/icon';
</script>

<Card.Root class="block w-full max-w-2xl gap-0 space-y-5 p-5">
	<header>
		<h3 class="text-lg font-semibold">Backup activity</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Pair decorative icons with explicit text so status never depends on shape or color alone.
		</p>
	</header>
	<ul class="divide-y text-sm">
		<li class="flex items-start gap-3 py-3">
			<Icon icon="success" class="mt-0.5 shrink-0" />
			<div>
				<p class="font-medium">Backup completed</p>
				<p class="text-muted-foreground">All 248 documents are protected.</p>
			</div>
		</li>
		<li class="flex items-start gap-3 py-3">
			<Icon icon="warning" class="mt-0.5 shrink-0" />
			<div>
				<p class="font-medium">Storage is almost full</p>
				<p class="text-muted-foreground">Archive older files before the next backup.</p>
			</div>
		</li>
		<li class="flex items-start gap-3 py-3">
			<Icon icon="clock" class="mt-0.5 shrink-0" />
			<div>
				<p class="font-medium">Next backup tomorrow</p>
				<p class="text-muted-foreground">Scheduled for 09:00.</p>
			</div>
		</li>
	</ul>
</Card.Root>
