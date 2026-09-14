<script lang="ts">
	import FolderIcon from '@lucide/svelte/icons/folder';
	import LayoutDashboardIcon from '@lucide/svelte/icons/layout-dashboard';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import * as Sidebar from '#lib/bedrock/ui/sidebar';
	let section = $state('Overview');
</script>

<section class="w-full min-w-0 space-y-4">
	<div class="space-y-1">
		<h3 class="font-medium">Project workspace navigation</h3>
		<p class="text-sm text-muted-foreground">
			Switch workspace sections without losing the persistent project navigation.
		</p>
	</div>

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
									<Sidebar.MenuButton
										isActive={section === 'Overview'}
										onclick={() => (section = 'Overview')}
									>
										<LayoutDashboardIcon />
										<span>Overview</span>
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton
										isActive={section === 'Projects'}
										onclick={() => (section = 'Projects')}
									>
										<FolderIcon />
										<span>Projects</span>
									</Sidebar.MenuButton>
									<Sidebar.MenuBadge>12</Sidebar.MenuBadge>
								</Sidebar.MenuItem>
								<Sidebar.MenuItem>
									<Sidebar.MenuButton
										isActive={section === 'Settings'}
										onclick={() => (section = 'Settings')}
									>
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

	<p role="status" class="text-sm">
		{section}: {section === 'Projects'
			? '12 projects, 3 active this week.'
			: section === 'Settings'
				? 'Manage workspace members and billing.'
				: 'Your team has completed 8 tasks this week.'}
	</p>
</section>
