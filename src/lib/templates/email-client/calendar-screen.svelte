<script lang="ts">
	import { useWorkspace } from './workspace.svelte.js';
	const workspace = useWorkspace();
	const active = true;

	import { CalendarDate, parseDate, type DateValue } from '@internationalized/date';
	import Plus from '@lucide/svelte/icons/plus';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import { onMount } from 'svelte';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import { Button } from '#lib/bedrock/ui/button';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { demoToday, type CalendarEvent } from './productivity-data.js';
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
		<div class="month-pane">
			<div class="month-toolbar">
				<h2 data-calendar-month>{monthLabel}</h2>
				<div>
					<Button size="sm" variant="outline" onclick={today}>Today</Button><Button
						size="icon"
						variant="ghost"
						aria-label="Previous month"
						onclick={() => (month = month.subtract({ months: 1 }))}
						><ChevronLeft size={16} /></Button
					><Button
						size="icon"
						variant="ghost"
						aria-label="Next month"
						data-calendar-next-button
						onclick={() => (month = month.add({ months: 1 }))}><ChevronRight size={16} /></Button
					>
				</div>
			</div>
			<div class="month-grid">
				<div class="weekdays">
					{#each ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as day (day)}<span>{day}</span
						>{/each}
				</div>
				<div class="month-days">
					{#each monthDays as day (day.toString())}{@const dayItems = visibleEvents.filter(
							(event) => event.date === day.toString()
						)}<button
							class="month-day"
							class:outside={day.month !== month.month}
							class:selected={day.toString() === selected.toString()}
							class:today={day.toString() === demoToday}
							aria-label={dayLabel(day)}
							aria-pressed={day.toString() === selected.toString()}
							onclick={() => selectDay(day)}
							><span class="day-number">{day.day}</span
							>{#each dayItems.slice(0, 2) as event (event.id)}<span
									class="calendar-entry"
									class:focus-event={event.category === 'Focus'}
									class:personal-event={event.category === 'Personal'}
									><span>{event.start}</span>{event.title}</span
								>{/each}{#if dayItems.length > 2}<span class="more-events"
									>+{dayItems.length - 2} more</span
								>{/if}</button
						>{/each}
				</div>
			</div>
			<div class="calendar-filters">
				{#each categories as kind (kind)}<button
						aria-label={`Show ${kind} calendar`}
						aria-pressed={workspace.calendarCategories.includes(kind)}
						class:inactive={!workspace.calendarCategories.includes(kind)}
						onclick={() => toggleCategory(kind)}
						><i class:focus-dot={kind === 'Focus'} class:personal-dot={kind === 'Personal'}
						></i>{kind}</button
					>{/each}
			</div>
		</div>
		<aside class="agenda-pane" aria-label="Day agenda">
			<header>
				<span class="agenda-label">Your schedule</span>
				<h2>{selectedLabel}</h2>
				<p aria-label="Day summary">
					{dayEvents.length} events · {duration(scheduledMinutes)} scheduled · {duration(
						focusMinutes
					)} focus
				</p>
			</header>
			<div class="agenda-list">
				{#each dayEvents as event (event.id)}<button
						class="agenda-event"
						onclick={() => edit(event)}
						aria-label={`Edit ${event.title}`}
						><span class="event-time">{event.start}<small>{event.end}</small></span><span
							class="event-details"
							class:focus-event={event.category === 'Focus'}
							class:personal-event={event.category === 'Personal'}
							><strong>{event.title}</strong><span
								><MapPin size={12} />{event.location || 'No location'}</span
							><small>{event.note}</small></span
						></button
					>{:else}<p class="empty-day">No events scheduled for this day.</p>
					<Button size="sm" variant="outline" onclick={() => edit()}>Add an event</Button>{/each}
			</div>
			<div class="upcoming">
				<h3>Coming up</h3>
				{#each upcoming as event (event.id)}<button
						onclick={() => {
							selectDay(parseDate(event.date));
							month = selected;
						}}
						><small>{event.date.slice(5)} · {event.start}</small><span>{event.title}</span></button
					>{/each}
			</div>
		</aside>
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
	.month-pane {
		padding: 22px 26px 24px;
		min-width: 0;
	}
	.month-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;
		gap: 8px;
	}
	.month-toolbar h2 {
		font-size: 16px;
		font-weight: 600;
		letter-spacing: -0.3px;
	}
	.month-toolbar > div {
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.month-grid {
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}
	.weekdays,
	.month-days {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}
	.weekdays {
		border-bottom: 1px solid var(--border);
		background: color-mix(in oklab, var(--muted) 40%, transparent);
	}
	.weekdays span {
		padding: 12px 8px;
		font-size: 10px;
		text-align: center;
		color: var(--muted-foreground);
	}
	.month-day {
		min-width: 0;
		min-height: 105px;
		text-align: left;
		border-right: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		padding: 8px 5px;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		gap: 5px;
	}
	.month-day:nth-child(7n) {
		border-right: 0;
	}
	.month-day:hover,
	.month-day.selected {
		background: color-mix(in oklab, #5967c7 6%, var(--background));
	}
	.month-day.selected {
		box-shadow: inset 0 0 0 1px #5967c7;
	}
	.day-number {
		display: grid;
		place-items: center;
		width: 23px;
		height: 23px;
		font-size: 11px;
		border-radius: 50%;
	}
	.today .day-number {
		background: #5967c7;
		color: white;
	}
	.outside .day-number {
		color: var(--muted-foreground);
		opacity: 0.45;
	}
	.calendar-entry {
		display: block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding: 4px;
		border-radius: 3px;
		background: color-mix(in oklab, #9586c8 15%, var(--background));
		color: var(--foreground);
		font-size: 9px;
		border-left: 2px solid #9586c8;
	}
	.calendar-entry > span {
		margin-right: 4px;
		opacity: 0.65;
	}
	.focus-event {
		border-color: #76a3c2;
		background: color-mix(in oklab, #76a3c2 12%, var(--background));
	}
	.personal-event {
		border-color: #c7a57c;
		background: color-mix(in oklab, #c7a57c 12%, var(--background));
	}
	.more-events {
		font-size: 9px;
		color: var(--muted-foreground);
		padding-left: 4px;
	}
	.calendar-filters {
		display: flex;
		gap: 20px;
		padding: 18px 2px;
	}
	.calendar-filters button {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
	}
	.calendar-filters i {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #9586c8;
	}
	.calendar-filters .focus-dot {
		background: #76a3c2;
	}
	.calendar-filters .personal-dot {
		background: #c7a57c;
	}
	.calendar-filters .inactive {
		opacity: 0.4;
		text-decoration: line-through;
	}
	.agenda-pane {
		border-left: 1px solid var(--border);
		padding: 26px 20px 30px;
	}
	.agenda-label {
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--muted-foreground);
	}
	.agenda-pane h2 {
		font-weight: 600;
		font-size: 14px;
		margin-top: 8px;
	}
	.agenda-pane header p {
		font-size: 10px;
		color: var(--muted-foreground);
		margin-top: 7px;
	}
	.agenda-list {
		margin-top: 27px;
	}
	.agenda-event {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		width: 100%;
		text-align: left;
		margin-bottom: 24px;
	}
	.event-time {
		font-size: 11px;
		font-weight: 500;
		width: 33px;
		flex-shrink: 0;
		padding-top: 2px;
	}
	.event-time small {
		display: block;
		font-size: 10px;
		font-weight: 400;
		color: var(--muted-foreground);
		margin-top: 5px;
	}
	.event-details {
		border-left: 2px solid #9586c8;
		padding: 2px 0 3px 12px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		background: none;
		min-width: 0;
	}
	.event-details.focus-event {
		border-color: #76a3c2;
	}
	.event-details.personal-event {
		border-color: #c7a57c;
	}
	.event-details strong {
		font-size: 12px;
		font-weight: 550;
	}
	.event-details > span {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 10px;
		color: var(--muted-foreground);
	}
	.event-details > small {
		font-size: 10px;
		color: var(--muted-foreground);
		line-height: 1.6;
	}
	.upcoming {
		border-top: 1px solid var(--border);
		padding-top: 22px;
		margin-top: 34px;
	}
	.upcoming h3 {
		font-size: 11px;
		font-weight: 600;
	}
	.upcoming button {
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: left;
		padding: 15px 0;
		border-bottom: 1px solid var(--border);
		width: 100%;
	}
	.upcoming small {
		font-size: 10px;
		color: var(--muted-foreground);
	}
	.upcoming span {
		font-size: 11px;
	}
	.empty-day {
		font-size: 12px;
		color: var(--muted-foreground);
		margin-bottom: 15px;
	}
	@media (max-width: 1200px) {
		.calendar-layout {
			grid-template-columns: minmax(0, 1fr);
		}
		.agenda-pane {
			border-left: 0;
			border-top: 1px solid var(--border);
			padding: 22px 26px 100px;
		}
		.agenda-list {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 20px;
		}
		.month-pane {
			padding-bottom: 5px;
		}
		.upcoming {
			display: none;
		}
		.month-day {
			min-height: 90px;
		}
	}
	@media (max-width: 767px) {
		.calendar-screen {
			grid-template-rows: 78px minmax(0, 1fr);
		}
		.month-pane {
			padding: 18px 14px 0;
		}
		.month-toolbar h2 {
			font-size: 14px;
		}
		.month-day {
			min-height: 68px;
			padding: 5px 2px;
		}
		.calendar-entry {
			font-size: 0;
			width: 6px;
			height: 6px;
			padding: 0;
			border: 0;
			border-radius: 50%;
			background: #9586c8;
		}
		.calendar-entry > span {
			display: none;
		}
		.calendar-entry.focus-event {
			background: #76a3c2;
		}
		.calendar-entry.personal-event {
			background: #c7a57c;
		}
		.more-events {
			font-size: 8px;
		}
		.agenda-pane {
			padding: 22px 18px 100px;
		}
		.agenda-list {
			display: block;
		}
		.agenda-event {
			margin-bottom: 22px;
		}
		.weekdays span {
			padding-inline: 2px;
		}
	}
</style>
