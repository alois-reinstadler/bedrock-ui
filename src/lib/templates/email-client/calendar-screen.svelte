<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	let {
		active = true,
		events = $bindable<CalendarEvent[]>([])
	}: { active?: boolean; events?: CalendarEvent[] } = $props();
	import { CalendarDate, parseDate, type DateValue } from '@internationalized/date';
	import Plus from '@lucide/svelte/icons/plus';
	import MapPin from '@lucide/svelte/icons/map-pin';
	import { Calendar, Day } from '#lib/bedrock/ui/calendar';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import { Button } from '#lib/bedrock/ui/button';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { demoToday, type CalendarEvent } from './productivity-data.js';
	let selected = $state<DateValue>(parseDate(demoToday));
	let month = $state<DateValue>(parseDate(demoToday));
	let open = $state(false);
	afterNavigate(() => {
		if (!active) open = false;
	});
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
	const dayEvents = $derived(
		events
			.filter((event) => event.date === selected.toString())
			.sort((a, b) => a.start.localeCompare(b.start))
	);
	const upcoming = $derived(
		events
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
		const conflict = events.find(
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
		events = editing
			? events.map((existing) => (existing.id === editing ? item : existing))
			: [...events, item];
		selected = date;
		month = date;
		announcement = `${item.title} ${editing ? 'updated' : 'added'} on ${item.date}.`;
		open = false;
	}
	function remove() {
		const item = events.find((event) => event.id === editing);
		events = events.filter((event) => event.id !== editing);
		announcement = `${item?.title ?? 'Event'} deleted.`;
		open = false;
	}
	function today() {
		selected = parseDate(demoToday);
		month = selected;
		announcement = 'Showing the demo date, 14 September 2026.';
	}
</script>

<section class="calendar-screen mx-auto max-w-[100rem] p-4 sm:p-6 lg:p-8">
	<header class="mb-6 flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
				Make time for what matters
			</p>
			<h1
				id="calendar-screen-heading"
				tabindex="-1"
				class="mt-1 text-3xl font-semibold tracking-tight"
			>
				Calendar
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">A little structure. A little breathing room.</p>
		</div>
		<Button onclick={() => edit()}><Plus class="size-4" />New event</Button>
	</header>
	<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
		<div class="min-w-0 rounded-2xl border bg-card p-3 shadow-sm sm:p-5">
			<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 class="text-lg font-semibold" data-calendar-month>{monthLabel}</h2>
					<p class="text-xs text-muted-foreground">All times shown in Europe/Vienna</p>
				</div>
				<Button variant="outline" size="sm" onclick={today}>Today</Button>
			</div>
			<Calendar
				type="single"
				value={selected}
				onValueChange={(value) => {
					if (value) selected = value;
				}}
				placeholder={month}
				onPlaceholderChange={(value) => (month = value)}
				locale="en-GB"
				weekStartsOn={1}
				class="workspace-calendar w-full bg-transparent [--cell-size:clamp(2.25rem,5vw,4.5rem)]"
			>
				{#snippet day({ day, outsideMonth })}<Day
						><div
							class="flex h-full flex-col items-center justify-center gap-1"
							class:opacity-40={outsideMonth}
						>
							<span>{day.day}</span><span class="flex h-1.5 gap-0.5" aria-hidden="true"
								>{#each events
									.filter((event) => event.date === day.toString())
									.slice(0, 3) as event (event.id)}<span class="size-1 rounded-full bg-current"
									></span>{/each}</span
							>
						</div></Day
					>{/snippet}
			</Calendar>
			<div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
				<span>● Team</span><span>● Focus time</span><span>● Personal</span><span class="sm:ml-auto"
					>Dots indicate scheduled events</span
				>
			</div>
		</div>
		<aside class="min-w-0 space-y-5" aria-label="Day agenda">
			<div class="rounded-2xl border bg-card p-5">
				<div class="mb-5 flex items-center justify-between gap-3">
					<h2 class="font-semibold">{selectedLabel}</h2>
					<Badge variant="secondary">{dayEvents.length} events</Badge>
				</div>
				<div class="space-y-3">
					{#each dayEvents as event (event.id)}<button
							class="event-card w-full rounded-xl border-l-4 bg-muted/35 p-4 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
							class:border-l-violet-500={event.category === 'Team'}
							class:border-l-sky-500={event.category === 'Focus'}
							class:border-l-amber-500={event.category === 'Personal'}
							onclick={() => edit(event)}
							aria-label={`Edit ${event.title}`}
							><span class="text-xs font-medium text-muted-foreground"
								>{event.start}–{event.end} · {event.category}</span
							><span class="mt-1 block font-medium">{event.title}</span><span
								class="mt-2 flex items-center gap-1 text-xs text-muted-foreground"
								><MapPin class="size-3" />{event.location || 'Location to be confirmed'}</span
							></button
						>{:else}<div class="rounded-xl border border-dashed px-4 py-8 text-center">
							<p class="font-medium">A clear day</p>
							<p class="mt-1 text-sm text-muted-foreground">
								Protect some focus time or add a plan.
							</p>
							<Button variant="outline" size="sm" class="mt-4" onclick={() => edit()}
								>Add an event</Button
							>
						</div>{/each}
				</div>
			</div>
			<div class="rounded-2xl border bg-muted/25 p-5">
				<h2 class="mb-4 text-sm font-semibold">Coming up</h2>
				{#each upcoming as event (event.id)}<button
						class="block w-full border-t py-3 text-left first:border-0 hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
						onclick={() => {
							selected = parseDate(event.date);
							month = selected;
						}}
						><span class="text-xs text-muted-foreground">{event.date} · {event.start}</span><span
							class="block text-sm font-medium">{event.title}</span
						></button
					>{:else}<p class="text-sm text-muted-foreground">No later events scheduled.</p>{/each}
			</div>
		</aside>
	</div>
	<p role="status" class="mt-4 min-h-5 text-sm text-muted-foreground">{announcement}</p>
	<p class="mt-3 text-xs text-muted-foreground">
		Demo date: 14 September 2026. Changes stay on this page and reset on reload.
	</p>
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
		min-height: calc(100svh - 11rem);
	}
	:global(.workspace-calendar [data-slot='calendar-months']) {
		width: 100%;
	}
	:global(.workspace-calendar [data-slot='calendar-month']) {
		width: 100%;
	}
	:global(.workspace-calendar table) {
		width: 100%;
	}
	@media (prefers-reduced-motion: reduce) {
		.event-card {
			transition: none;
		}
	}

	:global(.workspace-calendar tr) {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
	}
	:global(.workspace-calendar td),
	:global(.workspace-calendar th) {
		width: 100%;
	}
	:global(.workspace-calendar [data-calendar-day]) {
		width: 100%;
	}
	:global(.workspace-calendar [data-calendar-header]) {
		height: 2.5rem;
	}
	:global(.workspace-calendar [data-calendar-prev-button]),
	:global(.workspace-calendar [data-calendar-next-button]) {
		height: 2.5rem;
		width: 2.5rem;
	}
</style>
