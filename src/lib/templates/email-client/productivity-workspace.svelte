<script lang="ts">
	import type { Snippet } from 'svelte';
	import WorkspaceShell from '../../../routes/templates/email-client/WorkspaceShell.svelte';
	let { children }: { children: Snippet } = $props();
</script>

<WorkspaceShell {children} />
