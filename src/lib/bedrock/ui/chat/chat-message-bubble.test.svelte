<script lang="ts">
	import MessageBubble from './chat-message-bubble.svelte';
	import Message from './chat-message.svelte';
</script>

<Message role="assistant">
	<MessageBubble group="first">First</MessageBubble>
	<MessageBubble group="middle">Middle</MessageBubble>
	<MessageBubble group="last">Last</MessageBubble>
	<MessageBubble variant="ghost">Ghost</MessageBubble>
</Message>

<Message role="user">
	<MessageBubble group="first">User first</MessageBubble>
</Message>
