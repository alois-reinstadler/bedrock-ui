<script lang="ts">
	import { Kbd } from '#lib/bedrock/ui/kbd';
	import { KbdGroup } from '#lib/bedrock/ui/kbd';

	import { Button } from '#lib/bedrock/ui/button';
	let help = $state(false);
	function toggleHelp(event: KeyboardEvent) {
		const target = event.target;
		if (
			event.key !== '?' ||
			event.ctrlKey ||
			event.metaKey ||
			event.altKey ||
			(target instanceof HTMLElement &&
				(target.isContentEditable || target.closest('input, textarea, select')))
		)
			return;
		event.preventDefault();
		help = !help;
	}
</script>

<svelte:window onkeydown={toggleHelp} />

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Keyboard shortcut reference</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Display shortcuts beside their actions. Buttons below implement the same local behavior so
			shortcuts never become the only route.
		</p>
	</header>
	<div class="flex items-center justify-between gap-4">
		<Button variant="outline" onclick={() => (help = !help)} aria-expanded={help}
			>Toggle shortcut help</Button
		><KbdGroup><Kbd>?</Kbd></KbdGroup>
	</div>
	<p class="text-sm text-muted-foreground">
		Press ? to toggle this help. The shortcut is ignored while editing a field.
	</p>
	{#if help}<dl class="grid grid-cols-2 gap-3 text-sm">
			<dt>Move between controls</dt>
			<dd><Kbd>Tab</Kbd></dd>
			<dt>Activate focused control</dt>
			<dd><Kbd>Enter</Kbd></dd>
			<dt>Dismiss an open dialog</dt>
			<dd><Kbd>Escape</Kbd></dd>
		</dl>{/if}
</section>
