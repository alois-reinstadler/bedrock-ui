<script lang="ts">
	import MapPin from '@lucide/svelte/icons/map-pin';

	import { Button } from '#lib/bedrock/ui/button';

	import { type CalendarEvent } from '#lib/templates/email-client/productivity-data.js';

	let {
		selectedLabel,
		dayEvents,
		scheduledMinutes,
		focusMinutes,
		duration,
		edit,
		upcoming,
		onSelectUpcoming
	}: {
		selectedLabel: string;
		dayEvents: CalendarEvent[];
		scheduledMinutes: number;
		focusMinutes: number;
		duration: (value: number) => string;
		edit: (event?: CalendarEvent) => void;
		upcoming: CalendarEvent[];
		onSelectUpcoming: (date: string) => void;
	} = $props();
</script>

<aside class="agenda-pane" aria-label="Day agenda">
	<header>
		<span class="agenda-label">Your schedule</span>
		<h2>{selectedLabel}</h2>
		<p aria-label="Day summary">
			{dayEvents.length} events · {duration(scheduledMinutes)} scheduled · {duration(focusMinutes)} focus
		</p>
	</header>
	<div class="agenda-list">
		{#each dayEvents as event (event.id)}<Button
				variant="ghost"
				type="button"
				class={[
					'control-templates-email-client-calendar-screen h-auto whitespace-normal',
					'agenda-event justify-start p-0'
				]}
				onclick={() => edit(event)}
				aria-label={`Edit ${event.title}`}
				><span class="event-time">{event.start}<small>{event.end}</small></span><span
					class={[
						'event-details',
						{
							'focus-event': event.category === 'Focus',
							'personal-event': event.category === 'Personal'
						}
					]}
					><strong>{event.title}</strong><span
						><MapPin size={12} />{event.location || 'No location'}</span
					><small>{event.note}</small></span
				></Button
			>{:else}<p class="empty-day">No events scheduled for this day.</p>
			<Button size="sm" variant="outline" onclick={() => edit()}>Add an event</Button>{/each}
	</div>
	<div class="upcoming">
		<h3>Coming up</h3>
		{#each upcoming as event (event.id)}<Button
				variant="ghost"
				type="button"
				class={['control-templates-email-client-calendar-screen h-auto whitespace-normal']}
				onclick={() => onSelectUpcoming(event.date)}
				><small>{event.date.slice(5)} · {event.start}</small><span>{event.title}</span></Button
			>{/each}
	</div>
</aside>

<style>
	.focus-event {
		border-color: #76a3c2;
		background: color-mix(in oklab, #76a3c2 12%, var(--background));
	}
	.personal-event {
		border-color: #c7a57c;
		background: color-mix(in oklab, #c7a57c 12%, var(--background));
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
	:global(.control-templates-email-client-calendar-screen.agenda-event) {
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
	.upcoming :global(button.control-templates-email-client-calendar-screen) {
		align-items: flex-start;
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
		.upcoming {
			display: none;
		}
	}
	@media (max-width: 767px) {
		.agenda-pane {
			padding: 22px 18px 100px;
		}
		.agenda-list {
			display: block;
		}
		:global(.control-templates-email-client-calendar-screen.agenda-event) {
			margin-bottom: 22px;
		}
	}
</style>
