<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Card from '#lib/bedrock/ui/card';
	import { Button } from '#lib/bedrock/ui/button';
	let {
		title,
		description,
		dirty = false,
		onSave,
		children
	}: {
		title: string;
		description?: string;
		dirty?: boolean;
		onSave: () => void | Promise<void>;
		children: Snippet;
	} = $props();
	let pending = $state(false);
	let message = $state('');
	let failed = $state(false);
	async function save() {
		if (pending) return;
		pending = true;
		message = '';
		failed = false;
		try {
			await onSave();
			message = 'Preferences saved.';
		} catch {
			failed = true;
			message = 'Could not save. Your changes are preserved; try again.';
		} finally {
			pending = false;
		}
	}
</script>

<Card.Root>
	<Card.Header
		><Card.Title>{title}</Card.Title>{#if description}<Card.Description
				>{description}</Card.Description
			>{/if}</Card.Header
	>
	<Card.Content
		><fieldset disabled={pending} class="min-w-0 space-y-4">
			<legend class="sr-only">{title}</legend>{@render children()}
		</fieldset></Card.Content
	>
	<Card.Footer class="flex-wrap justify-between gap-3"
		><p role="status" class="text-sm text-muted-foreground">
			{pending ? 'Saving preferences…' : message || (dirty ? 'Unsaved changes' : 'Up to date')}
		</p>
		<Button disabled={pending || (!dirty && !failed)} onclick={save}
			>{pending ? 'Saving…' : failed ? 'Try again' : 'Save preferences'}</Button
		></Card.Footer
	>
</Card.Root>
