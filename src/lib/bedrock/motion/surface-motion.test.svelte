<script lang="ts">
	import '../styles.css';
	import MotionProvider from './MotionProvider.svelte';
	import * as DropdownMenu from '../ui/dropdown-menu/index.js';
	import * as Popover from '../ui/popover/index.js';
	import * as Dialog from '../ui/dialog/index.js';
	import * as NavigationMenu from '../ui/navigation-menu/index.js';

	let { motion = 'default' }: { motion?: 'default' | 'soft' | 'stagger' } = $props();
	let menuOpen = $state(false);
	let popoverOpen = $state(false);
	let dialogOpen = $state(false);
	let reduced = $state(false);
	let navigation = $state('');
	export function setNavigation(value: string) {
		navigation = value;
	}
	export function setOpen(value: boolean) {
		popoverOpen = value;
	}
	export function reduce() {
		reduced = true;
	}
</script>

<MotionProvider {reduced}>
	<DropdownMenu.Root bind:open={menuOpen}>
		<DropdownMenu.Trigger>Open motion menu</DropdownMenu.Trigger>
		<DropdownMenu.Content {motion}>
			{#each ['First action', 'Second action', 'Third action'] as label (label)}
				<DropdownMenu.Item>
					<svg aria-hidden="true" viewBox="0 0 16 16"><path d="M2 8h12" /></svg>
					{label}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Root>
	<Popover.Root bind:open={popoverOpen}>
		<Popover.Trigger>Open motion popover</Popover.Trigger>
		<Popover.Content onOpenAutoFocus={(event) => event.preventDefault()}>
			<p>Readable popover content</p>
			<button>Popover action</button>
		</Popover.Content>
	</Popover.Root>
	<Dialog.Root bind:open={dialogOpen}>
		<Dialog.Trigger>Open motion dialog</Dialog.Trigger>
		<Dialog.Content>
			<Dialog.Title>Motion dialog</Dialog.Title>
			<Dialog.Description>Sharp content and canonical backdrop timing.</Dialog.Description>
			<input aria-label="Dialog input" />
		</Dialog.Content>
	</Dialog.Root>
	<NavigationMenu.Root value={navigation} onValueChange={(value) => (navigation = value)}>
		<NavigationMenu.List>
			<NavigationMenu.Item value="first" openOnHover={false}>
				<NavigationMenu.Trigger>First motion navigation</NavigationMenu.Trigger>
				<NavigationMenu.Content
					><NavigationMenu.Link href="#first">First destination</NavigationMenu.Link
					></NavigationMenu.Content
				>
			</NavigationMenu.Item>
			<NavigationMenu.Item value="second" openOnHover={false}>
				<NavigationMenu.Trigger>Second motion navigation</NavigationMenu.Trigger>
				<NavigationMenu.Content
					><NavigationMenu.Link href="#second">Second destination</NavigationMenu.Link
					></NavigationMenu.Content
				>
			</NavigationMenu.Item>
		</NavigationMenu.List>
	</NavigationMenu.Root>
</MotionProvider>
