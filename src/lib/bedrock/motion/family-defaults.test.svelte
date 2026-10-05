<script lang="ts">
	import '../styles.css';
	import MotionProvider from './MotionProvider.svelte';
	import Banner from '../ui/banner/banner.svelte';
	import Message from '../ui/chat/chat-message.svelte';
	import Checkbox from '../ui/checkbox/checkbox.svelte';
	let { reduced = false }: { reduced?: boolean } = $props();
	let added = $state(false);
</script>

<MotionProvider {reduced}>
	<Banner>Persistent notice</Banner>
	<Banner variant="destructive" motion="enter">Urgent notice</Banner>
	<Message>Existing history</Message>
	<Checkbox checked aria-label="Initially checked" />
	<Checkbox aria-label="Interactive checkbox" />
	<button onclick={() => (added = true)}>Add message</button>
	{#if added}<Message motion="enter">New message</Message>{/if}
</MotionProvider>
