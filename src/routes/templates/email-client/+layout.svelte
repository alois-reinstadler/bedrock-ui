<script lang="ts">
	import Workspace from './WorkspaceShell.svelte';
	import { provideWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	let { children } = $props();
	provideWorkspace();
</script>

<Workspace>{@render children()}</Workspace>
