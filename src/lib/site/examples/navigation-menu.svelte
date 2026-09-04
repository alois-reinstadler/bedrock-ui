<script lang="ts">
	import * as NavigationMenu from '#lib/bedrock/ui/navigation-menu';
</script>

<NavigationMenu.Root>
	<NavigationMenu.List>
		<NavigationMenu.Item>
			<NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
			<NavigationMenu.Content>
				<ul class="grid w-56 gap-1 p-2 text-sm">
					<li><NavigationMenu.Link href="/docs/components">Components</NavigationMenu.Link></li>
					<li><NavigationMenu.Link href="/docs/installation">Installation</NavigationMenu.Link></li>
				</ul>
			</NavigationMenu.Content>
		</NavigationMenu.Item>
		<NavigationMenu.Item>
			<NavigationMenu.Link href="/docs">Docs</NavigationMenu.Link>
		</NavigationMenu.Item>
	</NavigationMenu.List>
</NavigationMenu.Root>
