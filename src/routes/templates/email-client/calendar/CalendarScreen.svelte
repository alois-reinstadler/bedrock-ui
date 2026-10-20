<script lang="ts">
	import CalendarMonth from './CalendarMonth.svelte';
	import DayAgenda from './DayAgenda.svelte';
	import { useWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	const workspace = useWorkspace();
	const active = true;

	import { CalendarDate, parseDate, type DateValue } from '@internationalized/date';
	import Plus from '@lucide/svelte/icons/plus';

	import { onMount } from 'svelte';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { demoToday, type CalendarEvent } from '#lib/templates/email-client/productivity-data.js';
	let selected = $state<DateValue>(parseDate(workspace.selectedDate));
	let month = $state<DateValue>(parseDate(demoToday));
	let open = $state(false);
	let editing = $state<string | null>(null);
	let title = $state('');
	let date = $state<CalendarDate | undefined>(parseDate(demoToday));
	let start = $state('09:00');
	let end = $state('10:00');
	let location = $state('');
	let note = $state('');
	let category = $state<CalendarEvent['category']>('Team');
	let error = $state('');
	let announcement = $state('');
	const categories = ['Team', 'Focus', 'Personal'] as const;

	const visibleEvents = $derived(
		workspace.events.filter(
			(event) =>
				workspace.calendarCategories.includes(event.category) &&
				`${event.title} ${event.note}`.toLowerCase().includes(workspace.query.toLowerCase())
		)
	);
	function minutes(time: string) {
		const [hours, mins] = time.split(':').map(Number);
		return hours * 60 + mins;
	}
	function duration(value: number) {
		return value >= 60
			? `${Math.floor(value / 60)}h${value % 60 ? ` ${value % 60}m` : ''}`
			: `${value}m`;
	}
	function toggleCategory(kind: CalendarEvent['category']) {
		workspace.calendarCategories = workspace.calendarCategories.includes(kind)
			? workspace.calendarCategories.filter((item) => item !== kind)
			: [...workspace.calendarCategories, kind];
	}
	const dayEvents = $derived(
		visibleEvents
			.filter((event) => event.date === selected.toString())
			.sort((a, b) => a.start.localeCompare(b.start))
	);
	const scheduledMinutes = $derived(
		dayEvents.reduce((total, event) => total + minutes(event.end) - minutes(event.start), 0)
	);
	const focusMinutes = $derived(
		dayEvents
			.filter((event) => event.category === 'Focus')
			.reduce((total, event) => total + minutes(event.end) - minutes(event.start), 0)
	);
	const upcoming = $derived(
		visibleEvents
			.filter((event) => event.date > selected.toString())
			.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
			.slice(0, 3)
	);
	const selectedLabel = $derived(
		new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(
			selected.toDate('UTC')
		)
	);
	const monthLabel = $derived(
		new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(month.toDate('UTC'))
	);
	const monthDays = $derived.by(() => {
		const first = new CalendarDate(month.year, month.month, 1);
		const offset = (first.toDate('UTC').getUTCDay() + 6) % 7;
		return Array.from(
			{ length: 35 + (offset + first.calendar.getDaysInMonth(first) > 35 ? 7 : 0) },
			(_, i) => first.add({ days: i - offset })
		);
	});
	function dayLabel(day: DateValue) {
		return new Intl.DateTimeFormat('en-GB', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		}).format(day.toDate('UTC'));
	}
	function selectDay(day: DateValue) {
		selected = day;
		workspace.selectedDate = day.toString();
	}
	onMount(() => {
		if (workspace.eventDraft) {
			composeEvent(workspace.eventDraft.subject, workspace.eventDraft.note);
			workspace.eventDraft = null;
		}
	});

	export function composeEvent(subject: string, context: string) {
		edit();
		title = subject;
		note = context;
	}
	function edit(event?: CalendarEvent) {
		editing = event?.id ?? null;
		title = event?.title ?? '';
		date = parseDate(event?.date ?? selected.toString());
		start = event?.start ?? '09:00';
		end = event?.end ?? '10:00';
		location = event?.location ?? '';
		note = event?.note ?? '';
		category = event?.category ?? 'Team';
		error = '';
		open = true;
	}
	function save(event: SubmitEvent) {
		event.preventDefault();
		if (!date || !title.trim()) {
			error = 'Add an event title and date.';
			return;
		}
		if (end <= start) {
			error = 'End time must be later than start time.';
			return;
		}
		const conflict = workspace.events.find(
			(item) =>
				item.id !== editing &&
				item.date === date!.toString() &&
				start < item.end &&
				end > item.start
		);
		if (conflict) {
			error = `This overlaps with ${conflict.title} (${conflict.start}–${conflict.end}). Choose another time.`;
			return;
		}
		const item: CalendarEvent = {
			id: editing ?? `event-${Date.now()}`,
			title: title.trim(),
			date: date.toString(),
			start,
			end,
			location: location.trim(),
			note: note.trim(),
			category
		};
		workspace.events = editing
			? workspace.events.map((existing) => (existing.id === editing ? item : existing))
			: [...workspace.events, item];
		if (!workspace.calendarCategories.includes(category))
			workspace.calendarCategories = [...workspace.calendarCategories, category];
		selected = date;
		month = date;
		announcement = `${item.title} ${editing ? 'updated' : 'added'} on ${item.date}.`;
		open = false;
	}
	function remove() {
		const item = workspace.events.find((event) => event.id === editing);
		workspace.events = workspace.events.filter((event) => event.id !== editing);
		announcement = `${item?.title ?? 'Event'} deleted.`;
		open = false;
	}
	function today() {
		selected = parseDate(demoToday);
		month = selected;
		announcement = 'Showing the demo date, 14 September 2026.';
	}
</script>

<section class="calendar-screen">
	<header class="workspace-page-heading">
		<div>
			<h1 id="calendar-screen-heading" tabindex="-1">Calendar</h1>
			<p>{monthLabel} · Europe/Vienna</p>
		</div>
		<Button size="sm" onclick={() => edit()}><Plus class="size-4" />New event</Button>
	</header>
	<div class="calendar-layout">
		<CalendarMonth
			{monthLabel}
			bind:month
			{selected}
			{monthDays}
			{visibleEvents}
			{categories}
			{dayLabel}
			{selectDay}
			{today}
			{toggleCategory}
		/>
		<DayAgenda
			{selectedLabel}
			{dayEvents}
			{scheduledMinutes}
			{focusMinutes}
			{duration}
			{edit}
			{upcoming}
			onSelectUpcoming={(date) => {
				selectDay(parseDate(date));
				month = selected;
			}}
		/>
	</div>
	<p class="sr-only" role="status">{announcement}</p>
</section>

<Dialog.Root open={active && open} onOpenChange={(value) => (open = value)}
	><Dialog.Content
		onCloseAutoFocus={(event) => {
			event.preventDefault();
			document.getElementById('calendar-screen-heading')?.focus();
		}}
		class="max-h-[90svh] overflow-y-auto sm:max-w-lg"
		><Dialog.Header
			><Dialog.Title>{editing ? 'Edit event' : 'New event'}</Dialog.Title><Dialog.Description
				>Plan your day. Overlapping events are flagged before saving.</Dialog.Description
			></Dialog.Header
		>
		<form class="space-y-4" onsubmit={save}>
			<div class="space-y-1.5">
				<Label for="event-title">Event title</Label><Input
					id="event-title"
					required
					maxlength={100}
					value={title}
					oninput={(event) => (title = event.currentTarget.value)}
					placeholder="Design review"
				/>
			</div>
			<div class="space-y-1.5">
				<p id="event-date-label" class="text-sm font-medium">Date</p>
				<DateInput bind:value={date} aria-labelledby="event-date-label" locale="en-GB" />
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div class="space-y-1.5">
					<Label for="event-start">Start time</Label><Input
						id="event-start"
						type="time"
						required
						value={start}
						oninput={(event) => (start = event.currentTarget.value)}
					/>
				</div>
				<div class="space-y-1.5">
					<Label for="event-end">End time</Label><Input
						id="event-end"
						type="time"
						required
						value={end}
						oninput={(event) => (end = event.currentTarget.value)}
					/>
				</div>
			</div>
			<div class="space-y-1.5">
				<Label for="event-location">Location</Label><Input
					id="event-location"
					value={location}
					oninput={(event) => (location = event.currentTarget.value)}
					placeholder="Room or meeting link"
				/>
			</div>
			<fieldset>
				<legend class="mb-2 text-sm font-medium">Calendar</legend>
				<div class="flex gap-2">
					{#each ['Team', 'Focus', 'Personal'] as kind (kind)}<Button
							type="button"
							size="sm"
							variant={category === kind ? 'secondary' : 'outline'}
							aria-pressed={category === kind}
							onclick={() => (category = kind as CalendarEvent['category'])}>{kind}</Button
						>{/each}
				</div>
			</fieldset>
			<div class="space-y-1.5">
				<Label for="event-note">Notes</Label><Textarea
					id="event-note"
					value={note}
					oninput={(event) => (note = event.currentTarget.value)}
				/>
			</div>
			{#if error}<p role="alert" class="rounded-lg border border-destructive p-3 text-sm">
					{error}
				</p>{/if}<Dialog.Footer
				>{#if editing}<Button type="button" variant="outline" onclick={remove}>Delete event</Button
					>{/if}<Button type="submit">Save event</Button></Dialog.Footer
			>
		</form></Dialog.Content
	></Dialog.Root
>

<style>
	.calendar-screen {
		height: 100%;
		min-height: 0;
		display: grid;
		grid-template-rows: 86px minmax(0, 1fr);
	}
	.calendar-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 290px;
		min-height: 0;
		overflow: auto;
	}

	@media (max-width: 1200px) {
		.calendar-layout {
			grid-template-columns: minmax(0, 1fr);
		}
	}
	@media (max-width: 767px) {
		.calendar-screen {
			grid-template-rows: 78px minmax(0, 1fr);
		}
	}
</style>
