<script lang="ts">
	import * as Tabs from '../ui/tabs/index.js';
	import * as Accordion from '../ui/accordion/index.js';
	import Calendar from '../ui/calendar/calendar.svelte';
	import { CalendarDate } from '@internationalized/date';
	import MotionProvider from './MotionProvider.svelte';
	let { initialOpen = false }: { initialOpen?: boolean } = $props();
	let reduced = $state(false);
</script>

<MotionProvider {reduced}>
	<button onclick={() => (reduced = !reduced)}>Reduce motion</button>
	<Accordion.Root type="single" value={initialOpen ? 'prose' : ''}>
		<Accordion.Item value="prose">
			<Accordion.Trigger>Prose</Accordion.Trigger>
			<Accordion.Content textMotion="prose"
				><p style="height: 80px">Brief prose.</p></Accordion.Content
			>
		</Accordion.Item>
	</Accordion.Root>
	<Tabs.Root value="one" motion="panel">
		<Tabs.List
			><Tabs.Trigger value="one">One</Tabs.Trigger><Tabs.Trigger value="two">Two</Tabs.Trigger
			></Tabs.List
		>
		<Tabs.Content value="one"><div style="height: 50px">First panel</div></Tabs.Content>
		<Tabs.Content value="two"><div style="height: 120px">Second panel</div></Tabs.Content>
	</Tabs.Root>
	<div data-testid="calendar">
		<Calendar type="single" motion="panel" placeholder={new CalendarDate(2026, 10, 1)} />
	</div>
</MotionProvider>
