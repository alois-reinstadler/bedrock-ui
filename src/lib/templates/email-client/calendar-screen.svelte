<script lang="ts">
	import CalendarScreen from '../../../routes/templates/email-client/calendar/CalendarScreen.svelte';
	let screen: CalendarScreen;
	export function composeEvent(subject: string, context: string) {
		screen.composeEvent(subject, context);
	}
</script>

<CalendarScreen bind:this={screen} />
