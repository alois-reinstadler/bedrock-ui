<script lang="ts">
	import * as NavigationMenu from '#lib/bedrock/ui/navigation-menu';
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Product resource navigation</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Group related destinations while keeping the documentation entry directly reachable.
		</p>
	</header>
	<div class="flex flex-wrap items-center gap-4 rounded-lg border p-3">
		<span class="font-semibold">Workspace resources</span>

		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-56 gap-1 p-2 text-sm">
							<li><NavigationMenu.Link href="/docs/components">Components</NavigationMenu.Link></li>
							<li>
								<NavigationMenu.Link href="/docs/installation">Installation</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
	<p class="max-w-lg text-sm text-muted-foreground">
		Find the component reference or installation instructions from the Products menu. Docs remains a
		direct link for returning readers.
	</p>
</section>
