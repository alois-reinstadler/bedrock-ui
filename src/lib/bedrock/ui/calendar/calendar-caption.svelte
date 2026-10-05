<script lang="ts" module>
	export * from '#lib/shadcn/ui/calendar/calendar-caption.svelte';
</script>

<script lang="ts">
	import CalendarCaption from '#lib/shadcn/ui/calendar/calendar-caption.svelte';
	import type { ComponentProps } from 'svelte';

	let { placeholder = $bindable(), ...props }: ComponentProps<typeof CalendarCaption> = $props();
</script>

<CalendarCaption bind:placeholder {...props} />
