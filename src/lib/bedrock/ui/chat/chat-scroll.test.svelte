<script lang="ts">
	import '../../styles.css';
	import MotionProvider from '../../motion/MotionProvider.svelte';
	import MessageList from './chat-message-list.svelte';
	let { reduced = false }: { reduced?: boolean } = $props();
</script>

<MotionProvider {reduced}>
	<MessageList style="height:160px;flex:none">
		{#each Array.from({ length: 40 }, (_, index) => index) as index (index)}
			<p style="height:32px;flex:none">Message {index}</p>
		{/each}
	</MessageList>
</MotionProvider>
