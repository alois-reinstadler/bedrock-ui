<script lang="ts">
	import { resolve } from '$app/paths';
	import { untrack } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { fade } from 'svelte/transition';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import SearchIcon from '@lucide/svelte/icons/search';
	import ShuffleIcon from '@lucide/svelte/icons/shuffle';
	import XIcon from '@lucide/svelte/icons/x';
	import { LayoutGroup, layout } from '#lib/bedrock/motion';
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
			a: 'Those properties reflow every frame. FLIP measures the new box, then only animates transform so the compositor can hold 60fps.'
		},
		{
			id: 'id',
			q: 'When do I need a shared id?',
			a: 'When the moving piece is a different DOM node (unmount here, mount there). The same node changing place only needs layout().'
		},
		{
			id: 'nest',
			q: 'Can I nest layout nodes?',
			a: 'Not in v1. Parent and child would both invert, and the child would travel twice.'
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

	const pill = layout();
	const chip = layout({ type: 'position' });
	const pack = layout({ type: 'position' });
	const tile = layout();
	const faqRow = layout({ type: 'position' });
	const toastCard = layout({ type: 'position' });
	const searchShell = layout();
	const rowMark = layout({ id: 'row-mark' });
	const densityCard = layout({ type: 'position' });
	const tagChip = layout({ type: 'position' });
	const railPane = layout();
	const sharedLayouts = new Map<string, Attachment<HTMLElement>>();

	function shared(id: string) {
		let attachment = sharedLayouts.get(id);
		if (!attachment) {
			attachment = layout({ id });
			sharedLayouts.set(id, attachment);
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
		const frame = requestAnimationFrame(() => {
			const active = el.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
			if (!active) return;
			untrack(() => setPillBox(active.offsetLeft, active.offsetWidth));
		});
		return () => cancelAnimationFrame(frame);
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
				Bedrock motion
			</p>
			<h1 class="max-w-[14ch] font-heading text-4xl leading-none tracking-tight md:text-5xl">
				Layout that interpolates
			</h1>
			<p class="mt-5 max-w-[36ch] text-sm leading-relaxed text-muted-foreground">
				The pill is one node that changes box. Shared ids are only for unmount/remount. Detached
				rects are ignored so nothing launches from the viewport origin.
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
					<LayoutGroup class="rounded-[calc(1.75rem-0.375rem)] bg-background p-1">
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
					</LayoutGroup>
				</div>
			</Scene>

			<Scene
				index="02"
				title="Pack and shuffle"
				hint="Filter and reorder. Remaining cards keep their ink."
			>
				<div class="flex flex-wrap items-center gap-2">
					{#each regions as item (item)}
						<button
							type="button"
							class={[
								'rounded-full px-3 py-1.5 text-xs font-medium capitalize',
								region === item ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
							]}
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
				<LayoutGroup class="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{#each visible as station (station.id)}
						<article {@attach pack} class="rounded-2xl bg-muted/80 px-4 py-5">
							<p class="font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</p>
							<p class="mt-2 text-lg tracking-tight">{station.name}</p>
							<p class="mt-1 text-xs text-muted-foreground capitalize">{station.region}</p>
						</article>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene
				index="03"
				title="Unanimatable CSS"
				hint="justify-content cannot tween. The boxes still travel."
			>
				<div class="flex gap-2">
					{#each aligns as item (item)}
						<button
							type="button"
							class={[
								'rounded-full px-3 py-1.5 text-xs font-medium capitalize',
								align === item ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
							]}
							onclick={() => (align = item)}
						>
							{item}
						</button>
					{/each}
				</div>
				<LayoutGroup
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
				</LayoutGroup>
			</Scene>

			<Scene
				index="04"
				title="Size"
				hint="The box scales. Type counter-scales so it does not squash."
			>
				<LayoutGroup class="grid grid-cols-2 gap-2 md:grid-cols-4">
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
							onclick={() => (expanded = expanded === station.id ? null : station.id)}
						>
							<span data-layout-invert class="flex h-full flex-col justify-between p-4">
								<span class="font-mono text-[0.7rem] tracking-widest uppercase">{station.code}</span
								>
								<span class="text-lg tracking-tight">{station.name}</span>
							</span>
						</button>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene
				index="05"
				title="Accordion"
				hint="Siblings slide. Height uses a 0fr / 1fr grid, not scaleY."
			>
				<LayoutGroup class="flex flex-col gap-2">
					{#each faqs as item (item.id)}
						<article {@attach faqRow} class="overflow-hidden rounded-2xl bg-muted/80">
							<button
								type="button"
								class="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
								aria-expanded={openFaq === item.id}
								onclick={() => (openFaq = openFaq === item.id ? null : item.id)}
							>
								{item.q}
								<span class="font-mono text-xs text-muted-foreground"
									>{openFaq === item.id ? '–' : '+'}</span
								>
							</button>
							<div
								class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
								style:grid-template-rows={openFaq === item.id ? '1fr' : '0fr'}
							>
								<p
									class="min-h-0 overflow-hidden px-4 text-sm leading-relaxed text-muted-foreground"
								>
									<span class="block pb-4">{item.a}</span>
								</p>
							</div>
						</article>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene
				index="06"
				title="Stack"
				hint="Enter with fade. The rest of the stack packs with layout."
			>
				<button
					type="button"
					class="inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background"
					onclick={pushToast}
				>
					<PlusIcon class="size-3.5" />
					Post notice
				</button>
				<LayoutGroup class="flex min-h-48 flex-col gap-2">
					{#each toasts as toast (toast.id)}
						<article
							{@attach toastCard}
							class="flex items-start justify-between gap-3 rounded-2xl bg-muted/80 px-4 py-3"
							transition:fade={{ duration: 200 }}
						>
							<div>
								<p class="font-mono text-[0.7rem] tracking-widest uppercase">{toast.gate}</p>
								<p class="mt-1 text-sm">{toast.body}</p>
							</div>
							<button
								type="button"
								class="rounded-full p-1 text-muted-foreground hover:text-foreground"
								aria-label="Dismiss notice"
								onclick={() => dismissToast(toast.id)}
							>
								<XIcon class="size-3.5" />
							</button>
						</article>
					{:else}
						<p class="px-1 py-8 text-sm text-muted-foreground">No live notices.</p>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene index="07" title="Search morph" hint="One shell. Icon island to field.">
				<LayoutGroup class="flex min-h-14 items-center">
					<div
						{@attach searchShell}
						class={[
							'flex items-center overflow-hidden rounded-full bg-muted',
							searching ? 'w-full max-w-md gap-2 px-3 py-2' : 'size-11 justify-center'
						]}
					>
						<button
							type="button"
							class="grid size-7 place-items-center rounded-full"
							aria-label={searching ? 'Close search' : 'Open search'}
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
								class="min-w-0 flex-1 bg-transparent text-sm outline-none"
								placeholder="Stand, gate, or flight"
								bind:value={query}
							/>
						{/if}
					</div>
				</LayoutGroup>
			</Scene>

			<Scene
				index="08"
				title="Row mark"
				hint="Shared id on the highlight. It remounts under the selected row."
			>
				<LayoutGroup class="flex flex-col overflow-hidden rounded-[1.6rem] bg-muted/50">
					{#each stations as station (station.id)}
						<button
							type="button"
							class="relative flex items-center justify-between px-4 py-3 text-left text-sm"
							onclick={() => (selectedRow = station.id)}
						>
							{#if selectedRow === station.id}
								<span {@attach rowMark} class="absolute inset-0 bg-background"></span>
							{/if}
							<span class="relative font-medium">{station.name}</span>
							<span class="relative font-mono text-[0.7rem] tracking-widest text-muted-foreground"
								>{station.code}</span
							>
						</button>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene
				index="09"
				title="Card to stage"
				hint="Shared id on the tile and the overlay. Neighbors keep their seats."
			>
				<LayoutGroup class="relative min-h-56">
					<div class="grid grid-cols-3 gap-2">
						{#each stations.slice(0, 3) as station (station.id)}
							{#if featured !== station.id}
								<button
									type="button"
									{@attach shared(station.id)}
									class="min-h-28 overflow-hidden rounded-[1.6rem] bg-muted p-4 text-left"
									onclick={() => (featured = station.id)}
								>
									<span data-layout-invert class="flex h-full flex-col justify-between">
										<span class="font-mono text-[0.7rem] tracking-widest uppercase"
											>{station.code}</span
										>
										<span class="text-lg tracking-tight">{station.name}</span>
									</span>
								</button>
							{:else}
								<div class="min-h-28 rounded-[1.6rem] bg-muted/40" aria-hidden="true"></div>
							{/if}
						{/each}
					</div>
					{#if featuredStation}
						<button
							type="button"
							{@attach shared(featuredStation.id)}
							class="absolute inset-0 z-10 flex min-h-56 w-full flex-col justify-between overflow-hidden rounded-[1.6rem] bg-foreground p-4 text-left text-background"
							onclick={() => (featured = null)}
						>
							<span data-layout-invert class="flex h-full flex-col justify-between">
								<span class="font-mono text-[0.7rem] tracking-widest uppercase"
									>{featuredStation.code}</span
								>
								<span>
									<span class="block text-3xl tracking-tight">{featuredStation.name}</span>
									<span class="mt-2 block text-sm text-background/70">Click to fold back</span>
								</span>
							</span>
						</button>
					{/if}
				</LayoutGroup>
			</Scene>

			<Scene index="10" title="Density" hint="Two columns or three. Cards keep identity.">
				<button
					type="button"
					class="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
					onclick={() => (dense = !dense)}
				>
					{dense ? 'Open grid' : 'Dense grid'}
				</button>
				<LayoutGroup class={['grid gap-2', dense ? 'grid-cols-3' : 'grid-cols-2']}>
					{#each stations as station (station.id)}
						<article {@attach densityCard} class="rounded-2xl bg-muted/80 px-3 py-4">
							<p class="font-mono text-[0.65rem] tracking-widest uppercase">{station.code}</p>
							<p class="mt-1 text-sm tracking-tight">{station.name}</p>
						</article>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene
				index="11"
				title="Wrap"
				hint="Chips reflow onto the next line. Each tag keeps its node."
			>
				<div class="flex flex-wrap gap-2">
					{#each procedures as tag (tag)}
						<button
							type="button"
							class={[
								'rounded-full px-3 py-1.5 text-xs font-medium',
								activeTags.includes(tag)
									? 'bg-foreground text-background'
									: 'bg-muted text-muted-foreground'
							]}
							onclick={() => toggleTag(tag)}
						>
							{tag}
						</button>
					{/each}
				</div>
				<LayoutGroup class="flex max-w-sm flex-wrap gap-2 rounded-[1.6rem] bg-muted/50 p-3">
					{#each activeTags as tag (tag)}
						<span
							{@attach tagChip}
							class="rounded-full bg-background px-3 py-1.5 text-xs font-medium"
						>
							{tag}
						</span>
					{/each}
				</LayoutGroup>
			</Scene>

			<Scene index="12" title="Rail" hint="The main pane grows into the vacated column.">
				<button
					type="button"
					class="w-fit rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
					onclick={() => (railOpen = !railOpen)}
				>
					{railOpen ? 'Stow rail' : 'Show rail'}
				</button>
				<LayoutGroup class="flex min-h-48 overflow-hidden rounded-[1.6rem]">
					{#if railOpen}
						<aside class="w-40 shrink-0 bg-muted p-4">
							<p class="font-mono text-[0.7rem] tracking-widest uppercase">Stands</p>
							<p class="mt-3 text-sm leading-relaxed text-muted-foreground">B12, B14, T3</p>
						</aside>
					{/if}
					<div {@attach railPane} class="flex flex-1 flex-col justify-between bg-muted/40 p-5">
						<p class="font-mono text-[0.7rem] tracking-widest uppercase">Ground</p>
						<p class="text-lg tracking-tight">Pushback window is open on Bravo.</p>
					</div>
				</LayoutGroup>
			</Scene>
		</main>
	</div>
</div>
