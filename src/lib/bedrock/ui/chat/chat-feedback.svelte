<script lang="ts">
	import { Icon } from '#lib/bedrock/ui/icon';
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import { cn } from '#lib/utils.js';

	let {
		message = '',
		tone = 'info',
		busy = false,
		role,
		class: className
	}: {
		message?: string;
		busy?: boolean;
		role?: 'status' | 'alert';
		tone?: 'success' | 'info' | 'warning' | 'error' | 'neutral';
		class?: string;
	} = $props();
</script>

<!-- Keep the live region mounted while idle; announce text changes without an empty icon. -->
<FieldStatus
	data-slot="chat-feedback"
	data-tone={tone}
	role={role ?? (tone === 'error' ? 'alert' : 'status')}
	status={tone === 'neutral' ? 'info' : tone}
	hideIcon={!message || busy}
	class={cn(
		'text-xs',
		tone === 'info' && 'text-sky-700 dark:text-sky-400',
		className,
		!message && 'sr-only'
	)}
	>{#if busy}<span class="inline-flex items-center gap-1.5"
			><Icon
				icon="loading"
				class="size-3.5 animate-spin motion-reduce:animate-none"
			/>{message}</span
		>{:else}{message}{/if}</FieldStatus
>
