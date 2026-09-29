<script lang="ts">
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import { cn } from '#lib/utils.js';

	let {
		message = '',
		tone = 'info',
		class: className
	}: {
		message?: string;
		tone?: 'success' | 'info' | 'warning' | 'error' | 'neutral';
		class?: string;
	} = $props();
</script>

<!-- Keep the live region mounted while idle; announce text changes without an empty icon. -->
<FieldStatus
	data-slot="chat-feedback"
	data-tone={tone}
	status={tone === 'neutral' ? 'info' : tone}
	hideIcon={!message}
	class={cn(
		'text-xs',
		tone === 'info' && 'text-sky-700 dark:text-sky-400',
		className,
		!message && 'sr-only'
	)}>{message}</FieldStatus
>
