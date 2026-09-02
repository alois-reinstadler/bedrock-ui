<script lang="ts">
	import ToolCalls, { type ChatToolCall } from './chat-tool-calls.svelte';

	const single: ChatToolCall[] = [
		{
			name: 'read_file',
			status: 'complete',
			target: 'src/app.ts',
			duration: '0.2s',
			detail: 'payload {}'
		}
	];

	const group: ChatToolCall[] = [
		{ key: 'a', name: 'grep', status: 'running', target: 'depends(' },
		{ key: 'b', name: 'read_file', status: 'complete', duration: '0.4s' },
		{ key: 'c', name: 'run_check', status: 'error', error: 'Exited with code 1.' }
	];
</script>

<ToolCalls calls={single} id="single" />
<ToolCalls calls={group} id="group" />
