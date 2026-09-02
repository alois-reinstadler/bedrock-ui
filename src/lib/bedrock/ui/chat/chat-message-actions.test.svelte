<script lang="ts">
	import MessageActions from './chat-message-actions.svelte';

	let copies = $state(0);
	let retries = $state(0);
	let feedback = $state('');
</script>

<div id="with-handlers">
	<MessageActions
		onCopy={() => {
			copies += 1;
		}}
		onRetry={() => {
			retries += 1;
		}}
		onFeedback={(kind) => (feedback = kind)}
	/>
</div>

<div id="without-handlers">
	<MessageActions />
</div>

<output id="copies">{copies}</output>
<output id="retries">{retries}</output>
<output id="feedback">{feedback}</output>
