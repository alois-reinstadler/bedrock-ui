<script lang="ts">
	import * as Breadcrumb from '#lib/bedrock/ui/breadcrumb';
	import { Button } from '#lib/bedrock/ui/button';
	let location = $state('Research plan');
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">A nested document workspace</h3>
		<p class="text-sm text-muted-foreground">
			Breadcrumbs show location; the current document stays plain text instead of linking to itself.
		</p>
	</header>
	<div class="space-y-5 rounded-xl border bg-card p-5">
		<Breadcrumb.Root
			><Breadcrumb.List
				><Breadcrumb.Item
					><Breadcrumb.Link href="#example-workspace" onclick={() => (location = 'Workspace')}
						>Workspace</Breadcrumb.Link
					></Breadcrumb.Item
				><Breadcrumb.Separator /><Breadcrumb.Item
					><Breadcrumb.Link href="#example-workspace" onclick={() => (location = 'Autumn release')}
						>Autumn release</Breadcrumb.Link
					></Breadcrumb.Item
				><Breadcrumb.Separator /><Breadcrumb.Item
					><Breadcrumb.Page>{location}</Breadcrumb.Page></Breadcrumb.Item
				></Breadcrumb.List
			></Breadcrumb.Root
		>
		<div id="example-workspace">
			<h4 class="text-xl font-semibold">{location}</h4>
			<p class="mt-2 text-sm text-muted-foreground">
				Interview goals, participant notes, and decisions for the next release.
			</p>
		</div>
		<Button variant="outline" size="sm" onclick={() => (location = 'Research plan')}
			>Open research plan</Button
		>
	</div>
</section>
