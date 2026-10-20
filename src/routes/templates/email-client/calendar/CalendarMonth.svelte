<script lang="ts">
	import { useWorkspace } from '#lib/templates/email-client/workspace.svelte.js';
	import { CalendarDate, type DateValue } from '@internationalized/date';

	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';

	import { Button } from '#lib/bedrock/ui/button';

	import { demoToday, type CalendarEvent } from '#lib/templates/email-client/productivity-data.js';
	const workspace = useWorkspace();
	let {
		monthLabel,
		month = $bindable(),
		selected,
		monthDays,
		visibleEvents,
		categories,
		dayLabel,
		selectDay,
		today,
		toggleCategory
	}: {
		monthLabel: string;
		month: DateValue;
		selected: DateValue;
		monthDays: CalendarDate[];
		visibleEvents: CalendarEvent[];
		categories: readonly CalendarEvent['category'][];
		dayLabel: (day: DateValue) => string;
		selectDay: (day: DateValue) => void;
		today: () => void;
		toggleCategory: (kind: CalendarEvent['category']) => void;
	} = $props();
</script>

<div class="month-pane">
	<div class="month-toolbar">
		<h2 data-calendar-month>{monthLabel}</h2>
		<div>
			<Button size="sm" variant="outline" onclick={today}>Today</Button><Button
				size="icon"
				variant="ghost"
				aria-label="Previous month"
				onclick={() => (month = month.subtract({ months: 1 }))}><ChevronLeft size={16} /></Button
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
				)}<Button
					variant="ghost"
					type="button"
					class={[
						'control-templates-email-client-calendar-screen h-auto whitespace-normal',
						'month-day justify-start rounded-none',
						{
							outside: day.month !== month.month,
							selected: day.toString() === selected.toString(),
							today: day.toString() === demoToday
						}
					]}
					aria-label={dayLabel(day)}
					aria-pressed={day.toString() === selected.toString()}
					onclick={() => selectDay(day)}
					><span class="day-number">{day.day}</span
					>{#each dayItems.slice(0, 2) as event (event.id)}<span
							class={[
								'calendar-entry',
								{
									'focus-event': event.category === 'Focus',
									'personal-event': event.category === 'Personal'
								}
							]}><span>{event.start}</span>{event.title}</span
						>{/each}{#if dayItems.length > 2}<span class="more-events"
							>+{dayItems.length - 2} more</span
						>{/if}</Button
				>{/each}
		</div>
	</div>
	<div class="calendar-filters">
		{#each categories as kind (kind)}<Button
				variant="ghost"
				type="button"
				class={[
					'control-templates-email-client-calendar-screen h-auto whitespace-normal',
					{ inactive: !workspace.calendarCategories.includes(kind) }
				]}
				aria-label={`Show ${kind} calendar`}
				aria-pressed={workspace.calendarCategories.includes(kind)}
				onclick={() => toggleCategory(kind)}
				><i class={[{ 'focus-dot': kind === 'Focus', 'personal-dot': kind === 'Personal' }]}
				></i>{kind}</Button
			>{/each}
	</div>
</div>

<style>
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
		border-radius: var(--radius-lg);
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
	:global(.control-templates-email-client-calendar-screen.month-day) {
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
	:global(.control-templates-email-client-calendar-screen.month-day:nth-child(7n)) {
		border-right: 0;
	}
	:global(.control-templates-email-client-calendar-screen.month-day:hover),
	:global(.control-templates-email-client-calendar-screen.month-day.selected) {
		background: color-mix(in oklab, #5967c7 6%, var(--background));
	}
	:global(.control-templates-email-client-calendar-screen.month-day.selected) {
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
	:global(.control-templates-email-client-calendar-screen.today) .day-number {
		background: #5967c7;
		color: white;
	}
	:global(.control-templates-email-client-calendar-screen.outside:not(.today)) .day-number {
		color: var(--muted-foreground);
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
	.calendar-filters :global(button.control-templates-email-client-calendar-screen) {
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
	.calendar-filters :global(.control-templates-email-client-calendar-screen.inactive) {
		opacity: 0.4;
		text-decoration: line-through;
	}

	@media (max-width: 1200px) {
		.month-pane {
			padding-bottom: 5px;
		}

		:global(.control-templates-email-client-calendar-screen.month-day) {
			min-height: 90px;
		}
	}
	@media (max-width: 767px) {
		.month-pane {
			padding: 18px 14px 0;
		}
		.month-toolbar h2 {
			font-size: 14px;
		}
		:global(.control-templates-email-client-calendar-screen.month-day) {
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

		.weekdays span {
			padding-inline: 2px;
		}
	}
</style>
