<script lang="ts">
	import { resolve } from '$app/paths';
	import { onDestroy, tick, untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import CheckIcon from '@lucide/svelte/icons/check';
	import LoaderCircleIcon from '@lucide/svelte/icons/loader-circle';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import ShuffleIcon from '@lucide/svelte/icons/shuffle';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import XIcon from '@lucide/svelte/icons/x';
	import { createLayout } from '#lib/bedrock/motion/engine.js';
	import { cssTransition } from 'astra-motion/css';
	import { Motion } from '#lib/bedrock/motion/css.js';
	import Scene from './scene.svelte';

	type Region = 'west' | 'north' | 'island';
	type Station = { id: string; name: string; code: string; region: Region };
	type Toast = { id: number; gate: string; body: string };
	type Faq = { id: string; q: string; a: string };

	const stations: Station[] = [
		{ id: 'kef', name: 'Keflavik', code: 'KEF', region: 'island' },
		{ id: 'tos', name: 'Tromso', code: 'TOS', region: 'north' },
		{ id: 'bgo', name: 'Bergen', code: 'BGO', region: 'west' },
		{ id: 'lyr', name: 'Longyearbyen', code: 'LYR', region: 'north' },
		{ id: 'aes', name: 'Alesund', code: 'AES', region: 'west' },
		{ id: 'rkv', name: 'Reykjavik', code: 'RKV', region: 'island' }
	];

	const tabs = ['Boarding', 'Hold', 'Taxi', 'Airborne'] as const;
	const regions = ['all', 'west', 'north', 'island'] as const;
	const aligns = ['start', 'center', 'end'] as const;
	const procedures = ['IFR', 'VFR', 'RNAV', 'ILS', 'SID', 'STAR', 'HOLD', 'DEICE'] as const;
	const faqs: Faq[] = [
		{
			id: 'slot',
			q: 'Why not animate left and width?',
			a: 'Those properties reflow every frame. FLIP measures the new box, then only animates transform to avoid continuously recomputing layout.'
		},
		{
			id: 'id',
			q: 'When do I need a shared id?',
			a: 'When the moving piece is a different DOM node (unmount here, mount there). The same node changing place uses an Astra createLayout attachment.'
		},
		{
			id: 'nest',
			q: 'Can I nest layout nodes?',
			a: 'Yes for axis-aligned layout. The child removes its parent projection so inherited movement is applied once. Keep corrected content wrappers separate from nested layout nodes.'
		}
	];
	const notices = [
		{ gate: '18L', body: 'Hold short, bird sweep' },
		{ gate: 'B12', body: 'De-ice truck on Bravo' },
		{ gate: 'T3', body: 'Pushback delayed 6 min' },
		{ gate: '09', body: 'Low vis protocol' }
	];

	let tab = $state<(typeof tabs)[number]>('Boarding');
	let pillBox = $state({ x: 0, w: 0 });
	let region = $state<(typeof regions)[number]>('all');
	let align = $state<(typeof aligns)[number]>('start');
	let deck = $state<Station[]>([...stations]);
	let expanded = $state<string | null>('kef');
	let openFaq = $state<string | null>('slot');
	let toasts = $state<Toast[]>([]);
	let toastSeq = $state(0);
	let searching = $state(false);
	let query = $state('');
	let selectedRow = $state('tos');
	let featured = $state<string | null>(null);
	let dense = $state(false);
	let activeTags = $state<string[]>(['IFR', 'ILS', 'HOLD']);
	let railOpen = $state(true);

	const visible = $derived(
		region === 'all' ? deck : deck.filter((station) => station.region === region)
	);
	const featuredStation = $derived(stations.find((station) => station.id === featured) ?? null);

	const project = createLayout({ transition: { type: 'spring', stiffness: 420, damping: 38 } });
	const searchTransitionDuration = '180ms';
	const searchTransitionTiming = 'cubic-bezier(0.2, 0, 0, 1)';
	const pill = project();
	const chip = project({ mode: 'position' });
	const pack = project({ mode: 'position' });
	const tile = project();
	const toastCard = project({ mode: 'position' });
	const rowMark = project({ id: 'row-mark' });
	const densityCard = project({ mode: 'position' });
	const tagChip = project({ mode: 'position' });
	const stackShell = project({ mode: 'size' });
	const densityShell = project({ mode: 'size' });
	const wrapShell = project({ mode: 'size' });
	const uploadShell = project();
	// Attachment caching is not render state.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const sharedLayouts = new Map<string, Attachment<HTMLElement>>();

	function shared(id: string, type: 'both' | 'position' = 'both') {
		const cacheKey = `${type}:${id}`;
		let attachment = sharedLayouts.get(cacheKey);
		if (!attachment) {
			const created = project({ id, mode: type });
			sharedLayouts.set(cacheKey, created);
			attachment = created;
		}
		return attachment;
	}

	function shuffle() {
		const next = [...deck];
		for (let i = next.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			const current = next[i];
			const swap = next[j];
			if (!current || !swap) continue;
			next[i] = swap;
			next[j] = current;
		}
		deck = next;
	}

	function setPillBox(x: number, w: number) {
		if (pillBox.x === x && pillBox.w === w) return;
		pillBox = { x, w };
	}

	function selectTab(item: (typeof tabs)[number], button: HTMLButtonElement) {
		tab = item;
		setPillBox(button.offsetLeft, button.offsetWidth);
	}

	const trackPill: Attachment<HTMLElement> = (el) => {
		if (typeof requestAnimationFrame === 'undefined') return;
		let frame = 0;
		const update = () => {
			const active = el.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
			if (!active) return;
			untrack(() => setPillBox(active.offsetLeft, active.offsetWidth));
		};
		const scheduleUpdate = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(update);
		};
		const observer = new ResizeObserver(scheduleUpdate);
		observer.observe(el);
		scheduleUpdate();
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	};

	function toggleTag(tag: string) {
		activeTags = activeTags.includes(tag)
			? activeTags.filter((item) => item !== tag)
			: [...activeTags, tag];
	}

	function pushToast() {
		const notice = notices[toastSeq % notices.length];
		if (!notice) return;
		toastSeq += 1;
		toasts = [{ id: toastSeq, gate: notice.gate, body: notice.body }, ...toasts].slice(0, 4);
	}

	function dismissToast(id: number) {
		toasts = toasts.filter((toast) => toast.id !== id);
	}

	async function showFeatured(id: string) {
		featured = id;
		await tick();
		document.querySelector<HTMLButtonElement>('#motion-feature-stage')?.focus({
			preventScroll: true
		});
	}

	async function closeFeatured() {
		const id = featured;
		featured = null;
		await tick();
		if (!id) return;
		document.querySelector<HTMLButtonElement>(`#motion-feature-card-${id}`)?.focus({
			preventScroll: true
		});
	}

	type UploadState = 'idle' | 'busy' | 'done';
	let uploadState = $state<UploadState>('idle');
	let uploadEffect = $state<'fade' | 'slide-up'>('slide-up');
	let uploadTimer = 0;

	function startUpload() {
		if (uploadState !== 'idle') return;
		uploadState = 'busy';
		clearTimeout(uploadTimer);
		uploadTimer = window.setTimeout(() => {
			uploadState = 'done';
			uploadTimer = window.setTimeout(() => (uploadState = 'idle'), 1600);
		}, 1800);
	}

	onDestroy(() => clearTimeout(uploadTimer));

	const uploadStatusMessage = $derived(
		uploadState === 'busy'
			? 'Uploading manifest.'
			: uploadState === 'done'
				? 'Manifest uploaded.'
				: 'Ready to upload manifest.'
	);

	let callsign = $state('');
	let callsignError = $state<string | null>(null);
	let callsignOk = $state(false);

	function checkCallsign(event: SubmitEvent) {
		event.preventDefault();
		const value = callsign.trim().toUpperCase();
		if (!value) {
			callsignError = 'Enter a callsign before filing.';
			callsignOk = false;
			return;
		}
		if (!/^[A-Z]{2,3}\d{1,4}[A-Z]?$/.test(value)) {
			callsignError = 'Two or three letters, then the flight number — like SAS4012.';
			callsignOk = false;
			return;
		}
		callsignError = null;
		callsignOk = true;
	}
</script>

<svelte:head>
	<title>Layout motion lab</title>
</svelte:head>

<div class="min-h-[100dvh] bg-background text-foreground">
	<div
		class="mx-auto grid max-w-[1400px] gap-12 px-4 py-10 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:px-8 md:py-16 lg:gap-20"
	>
		<header class="md:sticky md:top-16 md:self-start">
			<p class="mb-5 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
				Astra motion · Bedrock UI
			</p>
			<h1 class="max-w-[14ch] font-heading text-4xl leading-none tracking-tight md:text-5xl">
				Layout that interpolates
			</h1>
			<p class="mt-5 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
				Astra CSS handles finite feedback and presence. Astra JavaScript measures layout changes,
				projects shared identities, and retargets springs when you interrupt a move.
			</p>
			<a
				href={resolve('/demo')}
				class="mt-8 inline-flex text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
			>
				Back to demos
			</a>
		</header>

		<main class="flex min-w-0 flex-col gap-16 pb-24">
			<Scene index="01" title="Shared pill" hint="Same element, new box. Interrupt it mid-move.">
				<div class="rounded-[1.75rem] bg-muted/60 p-1.5">
					<div class="rounded-[calc(1.75rem-0.375rem)] bg-background p-1">
						<div class="relative flex flex-wrap gap-1" {@attach trackPill}>
							<span
								{@attach pill}
								class={[
									'pointer-events-none absolute top-0 bottom-0 rounded-full bg-foreground',
									pillBox.w === 0 && 'opacity-0'
								]}
								style:left="{pillBox.x}px"
								style:width="{pillBox.w}px"
							></span>
							{#each tabs as item (item)}
								<button
									type="button"
									class="relative z-10 rounded-full px-4 py-2.5 text-sm font-medium"
									aria-pressed={tab === item}
									onclick={(event) => selectTab(item, event.currentTarget)}
								>
									<span class={tab === item ? 'text-background' : 'text-muted-foreground'}
										>{item}</span
									>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</Scene>

			<Scene
				index="02"
				title="Pack and shuffle"
				hint="Filter and reorder. Remaining cards keep their ink."
			>
				<div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by region">
					{#each regions as item (item)}
						<button
							type="button"
							class={[
								'rounded-full px-3 py-1.5 text-xs font-medium capitalize',
								region === item ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
							]}
							aria-pressed={region === item}
							onclick={() => (region = item)}
						>
							{item}
						</button>
					{/each}
					<button
						type="button"
						class="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
						onclick={shuffle}
					>
						<ShuffleIcon class="size-3.5" />
						Shuffle
					</button>
				</div>
				<div class="relative grid grid-cols-2 gap-2 sm:grid-cols-3">
					{#each visible as station (station.id)}
						<article {@attach pack} class="rounded-2xl bg-muted/80 px-4 py-5">
							<p class="font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</p>
							<p class="mt-2 text-lg tracking-tight">{station.name}</p>
							<p class="mt-1 text-xs text-muted-foreground capitalize">{station.region}</p>
						</article>
					{/each}
				</div>
			</Scene>

			<Scene
				index="03"
				title="Layout beyond CSS"
				hint="justify-content cannot tween. The boxes still travel."
			>
				<div class="flex gap-2" role="group" aria-label="Align callsigns">
					{#each aligns as item (item)}
						<button
							type="button"
							class={[
								'rounded-full px-3 py-1.5 text-xs font-medium capitalize',
								align === item ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
							]}
							aria-pressed={align === item}
							onclick={() => (align = item)}
						>
							{item}
						</button>
					{/each}
				</div>
				<div
					class={[
						'flex min-h-28 rounded-[1.75rem] bg-muted/50 p-3',
						align === 'start' && 'justify-start',
						align === 'center' && 'justify-center',
						align === 'end' && 'justify-end'
					]}
				>
					{#each ['Alpha', 'Bravo', 'Charlie'] as callsign (callsign)}
						<div
							{@attach chip}
							class="rounded-2xl bg-background px-5 py-3 text-sm font-medium shadow-[0_18px_40px_-24px_rgba(24,24,27,0.45)]"
						>
							{callsign}
						</div>
					{/each}
				</div>
			</Scene>

			<Scene
				index="04"
				title="Size"
				hint="The box scales. Type counter-scales so it does not squash."
			>
				<div class="grid grid-cols-2 gap-2 md:grid-cols-4">
					{#each stations.slice(0, 4) as station (station.id)}
						<button
							type="button"
							{@attach tile}
							class={[
								'overflow-hidden rounded-[1.6rem] text-left',
								expanded === station.id
									? 'col-span-2 min-h-48 bg-foreground text-background md:row-span-2'
									: 'min-h-28 bg-muted'
							]}
							aria-pressed={expanded === station.id}
							onclick={() => (expanded = expanded === station.id ? null : station.id)}
						>
							<span
								{@attach project({ mode: 'position' })}
								class="flex h-full flex-col justify-between p-4"
							>
								<span class="font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</span
								>
								<span class="text-lg tracking-tight">{station.name}</span>
							</span>
						</button>
					{/each}
				</div>
			</Scene>

			<Scene
				index="05"
				title="Accordion"
				hint="Answers use native document flow; content enters with an Astra CSS fade."
			>
				<div class="flex flex-col gap-2">
					{#each faqs as item (item.id)}
						<article class="overflow-hidden rounded-2xl bg-muted/80">
							<button
								type="button"
								class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
								aria-expanded={openFaq === item.id}
								aria-controls={`motion-faq-${item.id}`}
								onclick={() => (openFaq = openFaq === item.id ? null : item.id)}
							>
								{item.q}
								<span class="font-mono text-xs text-muted-foreground" aria-hidden="true"
									>{openFaq === item.id ? '–' : '+'}</span
								>
							</button>
							{#if openFaq === item.id}
								<div
									id={`motion-faq-${item.id}`}
									in:cssTransition={{ duration: 180, opacity: 0 }}
									out:cssTransition={{ duration: 120, opacity: 0 }}
								>
									<p class="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
								</div>
							{/if}
						</article>
					{/each}
				</div>
			</Scene>

			<Scene
				index="06"
				title="Stack"
				hint="Notices enter and pack while the stack grows at its natural height."
			>
				<button
					type="button"
					class="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
					onclick={pushToast}
				>
					<PlusIcon class="size-3.5" />
					Post notice
				</button>
				<div id="motion-stack-shell" {@attach stackShell} class="overflow-hidden">
					<div
						class="relative flex flex-col gap-2"
						role="log"
						aria-label="Live notices"
						aria-live="polite"
						aria-relevant="additions"
					>
						{#each toasts as toast (toast.id)}
							<article
								{@attach toastCard}
								class="flex items-start justify-between gap-3 rounded-2xl bg-muted/80 px-4 py-3"
							>
								<div>
									<p class="font-mono text-[0.7rem] tracking-widest uppercase">{toast.gate}</p>
									<p class="mt-1 text-sm">{toast.body}</p>
								</div>
								<button
									type="button"
									class="rounded-full p-1 text-muted-foreground hover:text-foreground"
									aria-label={`Dismiss notice for gate ${toast.gate}`}
									onclick={() => dismissToast(toast.id)}
								>
									<XIcon class="size-3.5" />
								</button>
							</article>
						{:else}
							<p class="px-1 py-4 text-sm text-muted-foreground">No live notices.</p>
						{/each}
					</div>
				</div>
			</Scene>

			<Scene index="07" title="Search morph" hint="A continuous shell keeps its content crisp.">
				<div class="flex min-h-14 items-center">
					<div
						class="motion-search-shell h-11 max-w-full overflow-hidden rounded-full bg-muted"
						style:width={searching ? 'min(28rem, 100%)' : '2.75rem'}
						style:--motion-search-duration={searchTransitionDuration}
						style:--motion-search-timing={searchTransitionTiming}
					>
						<span class="flex h-11 w-[28rem] max-w-full items-center gap-2 px-2">
							<button
								type="button"
								class="grid size-7 shrink-0 place-items-center rounded-full"
								aria-label={searching ? 'Close search' : 'Open search'}
								aria-expanded={searching}
								aria-controls="motion-search-field"
								onclick={() => {
									searching = !searching;
									if (!searching) query = '';
								}}
							>
								{#if searching}
									<XIcon class="size-3.5" />
								{:else}
									<SearchIcon class="size-3.5" />
								{/if}
							</button>
							{#if searching}
								<input
									id="motion-search-field"
									class="min-w-0 flex-1 rounded-sm bg-transparent text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
									aria-label="Search stands, gates, or flights"
									placeholder="Stand, gate, or flight"
									bind:value={query}
									in:cssTransition={{ duration: 180, opacity: 0 }}
								/>
							{/if}
						</span>
					</div>
				</div>
			</Scene>

			<Scene
				index="08"
				title="Row mark"
				hint="Shared id on the highlight. It remounts under the selected row."
			>
				<div class="flex flex-col overflow-hidden rounded-[1.6rem] bg-muted/50">
					{#each stations as station (station.id)}
						<button
							type="button"
							class="relative flex items-center justify-between px-4 py-3 text-left text-sm"
							aria-pressed={selectedRow === station.id}
							onclick={() => (selectedRow = station.id)}
						>
							{#if selectedRow === station.id}
								<span {@attach rowMark} class="absolute inset-0 bg-background" aria-hidden="true"
								></span>
							{/if}
							<span class="relative font-medium">{station.name}</span>
							<span class="relative font-mono text-[0.7rem] tracking-widest text-muted-foreground"
								>{station.code}</span
							>
						</button>
					{/each}
				</div>
			</Scene>

			<Scene
				index="09"
				title="Card to stage"
				hint="Surface and identity text transfer independently. Neighbors keep their seats."
			>
				<div class="relative min-h-56">
					<div class="grid grid-cols-3 gap-2" inert={featuredStation !== null}>
						{#each stations.slice(0, 3) as station (station.id)}
							{#if featured !== station.id}
								<button
									id={`motion-feature-card-${station.id}`}
									type="button"
									class="relative min-h-28 rounded-[1.6rem] p-4 text-left"
									onclick={() => showFeatured(station.id)}
								>
									<span
										{@attach shared(station.id)}
										class="absolute inset-0 rounded-[1.6rem] bg-muted"
										aria-hidden="true"
									></span>
									<span class="relative z-10 flex h-full flex-col justify-between">
										<span
											{@attach shared(`station-code-${station.id}`, 'position')}
											class="w-fit font-mono text-[0.7rem] tracking-widest uppercase"
											>{station.code}</span
										>
										<span
											{@attach shared(`station-name-${station.id}`, 'position')}
											class="w-fit text-lg tracking-tight">{station.name}</span
										>
									</span>
								</button>
							{:else}
								<div class="min-h-28 rounded-[1.6rem] bg-muted/40" aria-hidden="true"></div>
							{/if}
						{/each}
					</div>
					{#if featuredStation}
						<button
							id="motion-feature-stage"
							type="button"
							class="absolute inset-0 z-10 flex min-h-56 w-full flex-col justify-between overflow-hidden rounded-[1.6rem] p-4 text-left text-background"
							aria-label={`Close details for ${featuredStation.name}`}
							onclick={closeFeatured}
						>
							<span
								{@attach shared(featuredStation.id)}
								class="absolute inset-0 rounded-[1.6rem] bg-foreground"
								aria-hidden="true"
							></span>
							<span class="relative z-10 flex h-full flex-col justify-between">
								<span
									{@attach shared(`station-code-${featuredStation.id}`, 'position')}
									class="w-fit font-mono text-[0.7rem] tracking-widest uppercase"
									>{featuredStation.code}</span
								>
								<span>
									<span
										{@attach shared(`station-name-${featuredStation.id}`, 'position')}
										class="block w-fit text-lg tracking-tight">{featuredStation.name}</span
									>
									<span
										class="mt-2 block text-sm text-background/70"
										in:cssTransition={{ duration: 180, opacity: 0 }}>Click to fold back</span
									>
								</span>
							</span>
						</button>
					{/if}
				</div>
			</Scene>

			<Scene
				index="10"
				title="Density"
				hint="Cards keep identity while the grid settles into its new natural height."
			>
				<button
					type="button"
					class="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
					aria-pressed={dense}
					aria-controls="motion-density-grid"
					onclick={() => (dense = !dense)}
				>
					{dense ? 'Open grid' : 'Dense grid'}
				</button>
				<div id="motion-density-shell" {@attach densityShell} class="overflow-hidden">
					<div
						id="motion-density-grid"
						class={['grid gap-2', dense ? 'grid-cols-3' : 'grid-cols-2']}
					>
						{#each stations as station (station.id)}
							<article {@attach densityCard} class="rounded-2xl bg-muted/80 px-3 py-4">
								<p class="font-mono text-[0.65rem] tracking-widest uppercase">{station.code}</p>
								<p class="mt-1 text-sm tracking-tight">{station.name}</p>
							</article>
						{/each}
					</div>
				</div>
			</Scene>

			<Scene
				index="11"
				title="Wrap"
				hint="Chips reflow onto the next line. Each tag keeps its node."
			>
				<div class="flex flex-wrap gap-2" role="group" aria-label="Active procedures">
					{#each procedures as tag (tag)}
						<button
							type="button"
							class={[
								'rounded-full px-3 py-1.5 text-xs font-medium',
								activeTags.includes(tag)
									? 'bg-foreground text-background'
									: 'bg-muted text-muted-foreground'
							]}
							aria-pressed={activeTags.includes(tag)}
							onclick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
				<div
					{@attach wrapShell}
					class="box-border max-w-sm overflow-hidden rounded-[1.6rem] bg-muted/50 p-3"
				>
					<div class="relative flex flex-wrap gap-2">
						{#each activeTags as tag (tag)}
							<span
								{@attach tagChip}
								class="rounded-full bg-background px-3 py-1.5 text-xs font-medium"
							>
								{tag}
							</span>
						{/each}
					</div>
				</div>
			</Scene>

			<Scene index="12" title="Rail" hint="The main pane grows into the vacated column.">
				<button
					type="button"
					class="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
					aria-expanded={railOpen}
					aria-controls="motion-stand-rail"
					onclick={() => (railOpen = !railOpen)}
				>
					{railOpen ? 'Stow rail' : 'Show rail'}
				</button>
				<div class="flex min-h-48 overflow-hidden rounded-[1.6rem]">
					{#if railOpen}
						<Motion
							as="aside"
							id="motion-stand-rail"
							class="shrink-0 overflow-hidden bg-muted"
							aria-label="Stands"
							motion={{
								initial: { width: 0, opacity: 0 },
								animate: { width: 160, opacity: 1 },
								exit: { width: 0, opacity: 0 },
								transition: { duration: 0.18 }
							}}
						>
							<div class="box-border w-40 shrink-0 p-4">
								<p class="font-mono text-[0.7rem] tracking-widest uppercase">Stands</p>
								<p class="mt-3 text-sm leading-relaxed text-muted-foreground">B12, B14, T3</p>
							</div>
						</Motion>
					{/if}
					<div class="flex flex-1 flex-col justify-between bg-muted/40 p-5">
						<p class="font-mono text-[0.7rem] tracking-widest uppercase">Ground</p>
						<p class="text-lg tracking-tight">Pushback window is open on Bravo.</p>
					</div>
				</div>
			</Scene>

			<Scene
				index="13"
				title="Content swap"
				hint="A keyed Astra CSS transition changes the label while projection follows the button width."
			>
				<div class="flex gap-1" role="group" aria-label="Swap effect">
					{#each [['fade', 'Fade'], ['slide-up', 'Slide up']] as option (option[0])}
						<button
							type="button"
							class="rounded-full bg-muted px-3 py-1.5 text-xs font-medium aria-pressed:bg-foreground aria-pressed:text-background"
							aria-pressed={uploadEffect === option[0]}
							onclick={() => (uploadEffect = option[0] as 'fade' | 'slide-up')}
						>
							{option[1]}
						</button>
					{/each}
				</div>
				<div class="flex min-h-14 items-center">
					<button
						type="button"
						class="relative rounded-full text-sm font-medium text-background"
						aria-disabled={uploadState !== 'idle'}
						aria-label="Upload manifest"
						aria-describedby="motion-upload-status"
						aria-busy={uploadState === 'busy'}
						onclick={startUpload}
					>
						<span
							{@attach uploadShell}
							class="pointer-events-none absolute inset-0 rounded-full bg-foreground"
							aria-hidden="true"
						></span>
						<span
							class="relative z-10 flex items-center justify-center px-5 py-2.5"
							aria-hidden="true"
						>
							{#key uploadState}<span
									class="inline-flex items-center gap-2 whitespace-nowrap"
									transition:cssTransition={{
										duration: 160,
										opacity: 0,
										y: uploadEffect === 'slide-up' ? 8 : 0
									}}
								>
									{#if uploadState === 'idle'}
										<UploadIcon class="size-4" />
										Upload manifest
									{:else if uploadState === 'busy'}
										<LoaderCircleIcon class="size-4 animate-spin motion-reduce:animate-none" />
										Uploading…
									{:else}
										<CheckIcon class="size-4" />
										Done
									{/if}
								</span>{/key}
						</span>
					</button>
					<span id="motion-upload-status" class="sr-only" role="status">
						{uploadStatusMessage}
					</span>
				</div>
			</Scene>

			<Scene
				index="14"
				title="Validation"
				hint="Validation stays in document flow and fades into view. Astra CSS handles the feedback."
			>
				<form class="flex max-w-sm flex-col gap-2" novalidate onsubmit={checkCallsign}>
					<label class="text-xs font-medium text-muted-foreground" for="callsign">Callsign</label>
					<input
						id="callsign"
						class={[
							'rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
							callsignError ? 'border-red-500/60' : 'border-border focus:border-foreground/40'
						]}
						placeholder="SAS4012"
						aria-invalid={Boolean(callsignError)}
						aria-describedby={callsignError
							? 'callsign-error'
							: callsignOk
								? 'callsign-success'
								: undefined}
						bind:value={callsign}
						oninput={() => {
							callsignError = null;
							callsignOk = false;
						}}
					/>
					{#if callsignError}
						<p
							id="callsign-error"
							in:cssTransition={{ duration: 180, opacity: 0 }}
							out:cssTransition={{ duration: 120, opacity: 0 }}
							class="text-xs text-red-500"
							role="alert"
						>
							{callsignError}
						</p>
					{/if}
					{#if callsignOk}
						<p
							id="callsign-success"
							in:cssTransition={{ duration: 180, opacity: 0 }}
							out:cssTransition={{ duration: 120, opacity: 0 }}
							class="text-xs text-emerald-600"
							role="status"
						>
							Callsign accepted. Squawk assigned on file.
						</p>
					{/if}
					<button
						type="submit"
						class="mt-1 w-fit rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background"
					>
						File plan
					</button>
				</form>
			</Scene>
		</main>
	</div>
</div>

<style>
	.motion-search-shell {
		transition-property: width;
		transition-duration: var(--motion-search-duration);
		transition-timing-function: var(--motion-search-timing);
	}

	@media (prefers-reduced-motion: reduce) {
		.motion-search-shell {
			transition-duration: 0ms;
		}
	}
</style>
