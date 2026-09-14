<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { Button } from '#lib/bedrock/ui/button';
</script>

<Button variant="ghost" size="icon" onclick={toggleMode} aria-label="Toggle color mode">
	<SunIcon class="size-4 dark:hidden" />
	<MoonIcon class="hidden size-4 dark:block" />
</Button>
