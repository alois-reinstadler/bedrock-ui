<script lang="ts">
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Input } from '#lib/bedrock/ui/input';
	import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';
	import * as Menu from '#lib/bedrock/ui/dropdown-menu';
	import * as Accordion from '#lib/bedrock/ui/accordion';
	import * as Tabs from '#lib/bedrock/ui/tabs';
	import * as Popover from '#lib/bedrock/ui/popover';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import * as Tooltip from '#lib/bedrock/ui/tooltip';
	import * as Select from '#lib/bedrock/ui/select';
	import { Marquee } from '#lib/bedrock/ui/marquee';
	import { Message } from '#lib/bedrock/ui/chat';
	import { Banner } from '#lib/bedrock/ui/banner';
	import { Button } from '#lib/bedrock/ui/button';
	import FileIcon from '@lucide/svelte/icons/file';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import ArchiveIcon from '@lucide/svelte/icons/archive';
	let reduced = $state(false);
	let messages = $state<number[]>([]);
	const triggerClass =
		'rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring';
</script>

<div class="space-y-8" data-testid="family-motion-example">
	<label for="family-reduced" class="flex items-center gap-2 text-sm">
		<Checkbox id="family-reduced" bind:checked={reduced} data-testid="family-reduced" /> Reduce motion
	</label>
	<MotionProvider {reduced}>
		<section class="space-y-4" aria-label="Menus and overlays">
			<h2 class="text-lg font-medium">Menus and overlays</h2>
			<div class="flex flex-wrap items-center gap-3">
				{#each ['default', 'soft', 'stagger'] as mode (mode)}
					<Menu.Root>
						<Menu.Trigger class={triggerClass}
							>{mode === 'default'
								? 'Standard menu'
								: mode === 'soft'
									? 'Soft menu'
									: 'Expressive menu'}</Menu.Trigger
						>
						<Menu.Content motion={mode as 'default' | 'soft' | 'stagger'} class="min-w-48">
							<Menu.Item><FileIcon aria-hidden="true" />Open document</Menu.Item>
							<Menu.Item><CopyIcon aria-hidden="true" />Duplicate</Menu.Item>
							<Menu.Item><ArchiveIcon aria-hidden="true" />Archive</Menu.Item>
						</Menu.Content>
					</Menu.Root>
				{/each}
				<Popover.Root>
					<Popover.Trigger class={triggerClass}>Soft preview</Popover.Trigger>
					<Popover.Content motion="soft"
						><p class="text-sm">
							A brief preview appears as one soft, readable block.
						</p></Popover.Content
					>
				</Popover.Root>
				<Dialog.Root>
					<Dialog.Trigger class={triggerClass}>Open dialog</Dialog.Trigger>
					<Dialog.Content>
						<Dialog.Header
							><Dialog.Title>Project details</Dialog.Title><Dialog.Description
								>The surface settles while the content stays clear and usable.</Dialog.Description
							></Dialog.Header
						>
						<label class="grid gap-2 text-sm"
							>Project name<Input
								class={['control-site-guide-examples-motion-families', 'rounded border p-2']}
								value="Bedrock"
							/></label
						>
					</Dialog.Content>
				</Dialog.Root>
				<Tooltip.Provider
					><Tooltip.Root
						><Tooltip.Trigger class={triggerClass}>Quick hint</Tooltip.Trigger><Tooltip.Content
							>Helpful context, without a long exit.</Tooltip.Content
						></Tooltip.Root
					></Tooltip.Provider
				>
				<Select.Root type="single"
					><Select.Trigger class="w-40">Choose a status</Select.Trigger><Select.Content
						><Select.Item value="draft">Draft</Select.Item><Select.Item value="ready"
							>Ready</Select.Item
						></Select.Content
					></Select.Root
				>
			</div>
		</section>
		<section class="mt-8 grid gap-8 md:grid-cols-2" aria-label="Disclosures and panels">
			<div class="space-y-3">
				<h2 class="text-lg font-medium">A little more detail</h2>
				<Accordion.Root type="single">
					<Accordion.Item value="prose"
						><Accordion.Trigger>Soft prose reveal</Accordion.Trigger><Accordion.Content
							textMotion="prose"
							><p>
								A short explanation sharpens early as the space opens. Everything below follows the
								panel.
							</p></Accordion.Content
						></Accordion.Item
					>
					<Accordion.Item value="controls"
						><Accordion.Trigger>Interactive content</Accordion.Trigger><Accordion.Content
							><label class="grid gap-2"
								>Your note<Input
									class={['control-site-guide-examples-motion-families', 'rounded border p-2']}
									placeholder="Ready to type"
								/></label
							></Accordion.Content
						></Accordion.Item
					>
				</Accordion.Root>
			</div>
			<div class="space-y-3">
				<h2 class="text-lg font-medium">Changing context</h2>
				<Tabs.Root value="overview" motion="panel"
					><Tabs.List
						><Tabs.Trigger value="overview">Overview</Tabs.Trigger><Tabs.Trigger value="activity"
							>Activity</Tabs.Trigger
						></Tabs.List
					><Tabs.Content value="overview"
						><p class="py-4 text-sm">
							A stable overview with a short panel entrance when selected.
						</p></Tabs.Content
					><Tabs.Content value="activity"
						><p class="py-4 text-sm">
							Recent changes appear together. Keyboard navigation stays immediate.
						</p></Tabs.Content
					></Tabs.Root
				>
			</div>
		</section>
		<section class="mt-8 space-y-4" aria-label="Messages and feedback">
			<h2 class="text-lg font-medium">Only new content enters</h2>
			<Banner>Existing feedback is readable immediately.</Banner>
			<Message
				><p class="rounded-lg bg-muted p-3 text-sm">
					Existing conversation history stays still.
				</p></Message
			>
			{#each messages as id (id)}<Message motion="enter"
					><p class="rounded-lg bg-muted p-3 text-sm">New message {id}</p></Message
				>{/each}
			<Button variant="outline" onclick={() => (messages = [...messages, messages.length + 1])}
				>Add a message</Button
			>
		</section>
		<section class="mt-8 space-y-3" aria-label="Decorative motion">
			<h2 class="text-lg font-medium">Motion with a pause</h2>
			<Marquee controls
				><span class="px-6">Design</span><span class="px-6">Build</span><span class="px-6"
					>Refine</span
				></Marquee
			>
		</section>
	</MotionProvider>
</div>
