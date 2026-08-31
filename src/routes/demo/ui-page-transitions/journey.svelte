<script lang="ts">
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import MapPinIcon from '@lucide/svelte/icons/map-pin';
	import type { RunTransition } from './types';

	type Stop = {
		city: string;
		country: string;
		day: string;
		title: string;
		body: string;
		accent: string;
		times: [string, string, string];
	};

	let { runTransition }: { runTransition: RunTransition } = $props();

	const stops: Stop[] = [
		{
			city: 'Wien',
			country: 'AT',
			day: 'Tag 01',
			title: 'Ein langsamer Anfang',
			body: 'Kaffee am Kanal, ein Umweg durch den Dritten und das letzte Licht am Cobenzl.',
			accent: '#d9ff73',
			times: ['09:20', '14:10', '19:35']
		},
		{
			city: 'Triest',
			country: 'IT',
			day: 'Tag 02',
			title: 'Bis ans Wasser',
			body: 'Mit dem Nachtzug ans Meer. Bora in den Gassen, Espresso im Stehen, Mittag am Molo.',
			accent: '#8ed7ff',
			times: ['07:42', '12:30', '18:05']
		},
		{
			city: 'Ljubljana',
			country: 'SI',
			day: 'Tag 03',
			title: 'Grün dazwischen',
			body: 'Ein freier Vormittag, Markt unter den Arkaden und die kleine Runde hinauf zur Burg.',
			accent: '#ffac8f',
			times: ['08:15', '13:00', '20:10']
		}
	];

	let index = $state(0);
	const stop = $derived(stops[index] ?? stops[0]);

	function go(delta: number) {
		const next = Math.max(0, Math.min(stops.length - 1, index + delta));
		if (next === index) return;
		runTransition(delta > 0 ? 'push-forward' : 'push-back', () => (index = next));
	}
</script>

<section class="transition-stage journey" aria-label="Reiseplan-Beispiel">
	<div class="journey-topbar">
		<div class="route-name"><span>OOO</span> Nachtzug 237</div>
		<div class="pager" aria-label="Reisetage">
			{#each stops as item, itemIndex (item.city)}
				<button
					type="button"
					class:active={itemIndex === index}
					aria-label={`${item.city} anzeigen`}
					onclick={() => {
						const delta = itemIndex - index;
						if (delta !== 0)
							runTransition(delta > 0 ? 'push-forward' : 'push-back', () => (index = itemIndex));
					}}
				></button>
			{/each}
		</div>
	</div>

	<div class="journey-grid">
		<div class="journey-copy">
			<p class="day">{stop.day} / {stop.country}</p>
			<h3>{stop.city}</h3>
			<p class="journey-title">{stop.title}</p>
			<p class="journey-body">{stop.body}</p>
			<div class="journey-controls">
				<button
					type="button"
					aria-label="Vorheriger Tag"
					disabled={index === 0}
					onclick={() => go(-1)}
				>
					<ArrowLeftIcon class="size-4" />
				</button>
				<span>{String(index + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}</span>
				<button
					type="button"
					aria-label="Nächster Tag"
					disabled={index === stops.length - 1}
					onclick={() => go(1)}
				>
					<ArrowRightIcon class="size-4" />
				</button>
			</div>
		</div>

		<div class="ticket" style:--accent={stop.accent}>
			<div class="ticket-orbit orbit-one" aria-hidden="true"></div>
			<div class="ticket-orbit orbit-two" aria-hidden="true"></div>
			<div class="ticket-pin"><MapPinIcon class="size-4" /></div>
			<div class="ticket-city">{stop.city}</div>
			<div class="ticket-times">
				{#each stop.times as time, timeIndex (time)}
					<div>
						<span>{time}</span>
						<small>{['Ankunft', 'Treffpunkt', 'Letzter Halt'][timeIndex]}</small>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.journey {
		min-height: 34rem;
		padding: clamp(1.2rem, 3vw, 2.25rem);
		background: #171815;
		color: #f4f2ea;
	}

	.journey-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1.25rem;
		border-bottom: 1px solid rgb(255 255 255 / 15%);
	}

	.route-name {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.68rem;
		font-weight: 600;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.route-name span {
		letter-spacing: -0.25em;
		color: #d9ff73;
	}

	.pager {
		display: flex;
		gap: 0.35rem;
	}

	.pager button {
		width: 1.4rem;
		height: 0.22rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 18%);
		transition: background 200ms ease;
	}

	.pager button.active {
		background: #f4f2ea;
	}

	.journey-grid {
		display: grid;
		grid-template-columns: minmax(0, 0.8fr) minmax(18rem, 1.2fr);
		gap: clamp(1.5rem, 5vw, 5rem);
		align-items: center;
		min-height: 27.5rem;
	}

	.day,
	.journey-controls,
	.ticket-times small {
		font-size: 0.64rem;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: rgb(244 242 234 / 54%);
	}

	.journey-copy h3 {
		margin-top: 0.6rem;
		font-size: clamp(3.5rem, 8vw, 7.5rem);
		font-weight: 520;
		line-height: 0.82;
		letter-spacing: -0.075em;
	}

	.journey-title {
		margin-top: 1.4rem;
		font-size: 1rem;
		font-weight: 600;
	}

	.journey-body {
		max-width: 36ch;
		margin-top: 0.65rem;
		font-size: 0.82rem;
		line-height: 1.6;
		color: rgb(244 242 234 / 62%);
	}

	.journey-controls {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.8rem;
		max-width: 14rem;
		margin-top: 2rem;
	}

	.journey-controls span {
		text-align: center;
	}

	.journey-controls button {
		display: grid;
		width: 2.5rem;
		aspect-ratio: 1;
		place-items: center;
		border: 1px solid rgb(255 255 255 / 18%);
		border-radius: 50%;
		color: #f4f2ea;
	}

	.journey-controls button:disabled {
		opacity: 0.25;
	}

	.ticket {
		position: relative;
		min-height: 22rem;
		overflow: hidden;
		border: 1px solid rgb(255 255 255 / 14%);
		border-radius: 1.5rem;
		background:
			radial-gradient(
				circle at 75% 20%,
				color-mix(in srgb, var(--accent) 32%, transparent),
				transparent 31%
			),
			linear-gradient(150deg, #292b26, #1d1e1b);
	}

	.ticket::before {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(rgb(255 255 255 / 12%) 0.7px, transparent 0.7px);
		background-size: 12px 12px;
		content: '';
		mask-image: linear-gradient(to bottom, black, transparent 80%);
	}

	.ticket-orbit {
		position: absolute;
		border: 1px solid color-mix(in srgb, var(--accent) 66%, transparent);
		border-radius: 50%;
	}

	.orbit-one {
		top: -32%;
		right: -7%;
		width: 75%;
		aspect-ratio: 1;
	}

	.orbit-two {
		top: -13%;
		right: 9%;
		width: 45%;
		aspect-ratio: 1;
	}

	.ticket-pin {
		position: absolute;
		top: 28%;
		right: 29%;
		display: grid;
		width: 2.5rem;
		aspect-ratio: 1;
		place-items: center;
		border-radius: 50%;
		background: var(--accent);
		color: #171815;
		box-shadow: 0 0 0 0.5rem color-mix(in srgb, var(--accent) 12%, transparent);
	}

	.ticket-city {
		position: absolute;
		bottom: 4.6rem;
		left: 1.25rem;
		font-size: clamp(2rem, 5vw, 4rem);
		font-weight: 520;
		line-height: 1;
		letter-spacing: -0.06em;
	}

	.ticket-times {
		position: absolute;
		right: 1.25rem;
		bottom: 1.2rem;
		left: 1.25rem;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.75rem;
		padding-top: 0.8rem;
		border-top: 1px solid rgb(255 255 255 / 16%);
	}

	.ticket-times div {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.ticket-times span {
		font-size: 0.82rem;
		font-variant-numeric: tabular-nums;
	}

	.ticket-times small {
		font-size: 0.48rem;
	}

	@media (max-width: 640px) {
		.journey {
			min-height: 40rem;
		}

		.journey-grid {
			grid-template-columns: 1fr;
			gap: 1.25rem;
			padding-top: 1.5rem;
		}

		.journey-copy h3 {
			font-size: 4rem;
		}

		.ticket {
			min-height: 15rem;
		}
	}
</style>
