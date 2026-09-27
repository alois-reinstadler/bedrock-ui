<script lang="ts">
	import Workspace from '#lib/templates/email-client/productivity-workspace.svelte';
	import { provideWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	let { children } = $props();
	provideWorkspace();
</script>

<Workspace>{@render children()}</Workspace>
