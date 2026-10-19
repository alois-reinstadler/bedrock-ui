<script lang="ts">
	import { Input } from './input';
	import { Textarea } from './textarea';
	import * as Dialog from './dialog';
	import * as Pagination from './pagination';
	import { Button } from './button';

	let value = $state('Before');
	let notes = $state('Initial notes');
	let open = $state(false);
	let page = $state(1);
	let ref = $state<HTMLElement | null>(null);
</script>

<Input aria-label="Name" bind:value bind:ref />
<Textarea aria-label="Notes" bind:value={notes} />
<output data-testid="name">{value}</output>
<output data-testid="notes">{notes}</output>
<output data-testid="ref">{ref?.tagName ?? 'none'}</output>
<output data-testid="open">{String(open)}</output>
<output data-testid="page">{page}</output>
<Button
	onclick={() => {
		value = 'Reset';
		notes = 'Reset notes';
		page = 1;
	}}>Reset</Button
>

<Dialog.Root bind:open>
	<Dialog.Trigger>Open editor</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Title>Bound dialog</Dialog.Title>
		<Dialog.Description>Closing the dialog updates its parent.</Dialog.Description>
		<Dialog.Close>Close editor</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>

<Pagination.Root count={30} perPage={10} bind:page>
	<Pagination.Content>
		<Pagination.Item><Pagination.PrevButton /></Pagination.Item>
		<Pagination.Item><Pagination.NextButton /></Pagination.Item>
	</Pagination.Content>
</Pagination.Root>
