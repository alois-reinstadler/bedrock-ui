<script lang="ts">
	import * as Dialog from '#lib/bedrock/ui/dialog';
	let { open = $bindable(false) }: { open?: boolean } = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content
		><Dialog.Header
			><Dialog.Title>Launch checklist</Dialog.Title><Dialog.Description
				>Illustrative attachment preview · No download required</Dialog.Description
			></Dialog.Header
		>
		<ul class="list-disc space-y-3 py-4 pl-5">
			<li>Approve the final migration banner copy.</li>
			<li>Confirm the support handoff at 09:00.</li>
			<li>Check the rollout dashboard before opening traffic.</li>
		</ul></Dialog.Content
	>
</Dialog.Root>
