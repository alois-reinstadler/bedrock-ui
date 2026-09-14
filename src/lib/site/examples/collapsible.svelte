<script lang="ts">
	import * as Collapsible from '#lib/bedrock/ui/collapsible';
	import { Button } from '#lib/bedrock/ui/button';
	let open = $state(false);
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">Track a delivery</h3>
		<p class="text-sm text-muted-foreground">
			Keep the useful summary visible and reveal lower-priority tracking details on demand.
		</p>
	</header>
	<div class="space-y-4 rounded-xl border bg-card p-5">
		<div>
			<p class="font-medium">Order FN-2048 is on its way</p>
			<p class="text-sm text-muted-foreground">Estimated arrival: Friday, September 18</p>
		</div>
		<Collapsible.Root {open} onOpenChange={(next) => (open = next)}
			><Collapsible.Trigger
				>{#snippet child({ props })}<Button {...props} variant="outline" size="sm"
						>{open ? 'Hide tracking details' : 'Show tracking details'}</Button
					>{/snippet}</Collapsible.Trigger
			><Collapsible.Content class="pt-4"
				><ol class="space-y-3 border-l pl-4 text-sm">
					<li>
						<p class="font-medium">Handed to carrier</p>
						<p class="text-muted-foreground">Thursday, 09:20 · Central depot</p>
					</li>
					<li>
						<p class="font-medium">Packed and checked</p>
						<p class="text-muted-foreground">Wednesday, 16:45 · Studio warehouse</p>
					</li>
				</ol></Collapsible.Content
			></Collapsible.Root
		>
	</div>
</section>
