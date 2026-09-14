<script lang="ts">
	import FolderIcon from '@lucide/svelte/icons/folder';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
</script>

<div class="h-72 w-full max-w-sm overflow-hidden rounded-xl border">
	<Sidebar.Provider class="min-h-0!" style="--sidebar-width: 100%;">
		<Sidebar.Root collapsible="none" class="w-full">
			<Sidebar.Header>
				<p class="px-2 text-sm font-medium">Northstar</p>
			</Sidebar.Header>
			<Sidebar.Content>
				<Sidebar.Group>
					<Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive>
									<LayoutDashboardIcon />
									<span>Overview</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									<FolderIcon />
									<span>Projects</span>
								</Sidebar.MenuButton>
								<Sidebar.MenuBadge>12</Sidebar.MenuBadge>
							</Sidebar.MenuItem>
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									<SettingsIcon />
									<span>Settings</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						</Sidebar.Menu>
					</Sidebar.GroupContent>
				</Sidebar.Group>
			</Sidebar.Content>
			<Sidebar.Footer
				><p class="px-2 text-xs text-muted-foreground">3 active projects</p></Sidebar.Footer
			>
		</Sidebar.Root>
	</Sidebar.Provider>
</div>
