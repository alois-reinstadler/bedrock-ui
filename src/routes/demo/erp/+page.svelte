<script lang="ts">
	import DownloadIcon from '@lucide/svelte/icons/download';
	import FileTextIcon from '@lucide/svelte/icons/file-text';
	import ImageIcon from '@lucide/svelte/icons/image';
	import InfoIcon from '@lucide/svelte/icons/info';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import * as AlertDialog from '#lib/bedrock/ui/alert-dialog';
	import { AvatarStack, type AvatarStackItem } from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Banner from '#lib/bedrock/ui/banner';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Chat from '#lib/bedrock/ui/chat';
	import { Combobox } from '#lib/bedrock/ui/combobox';
	import {
		DataTable,
		type DataTableColumn,
		type DataTableLabels,
		type DataTableView
	} from '#lib/bedrock/ui/data-table';
	import { Lightbox, type LightboxItem } from '#lib/bedrock/ui/lightbox';
	import { OverflowList } from '#lib/bedrock/ui/overflow-list';
	import {
		PowerSearch,
		applyPowerSearchFilters,
		type PowerSearchConfig,
		type PowerSearchFilter,
		type PowerSearchLabels
	} from '#lib/bedrock/ui/power-search';
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';
	import * as Tooltip from '#lib/bedrock/ui/tooltip';

	type Order = {
		id: string;
		number: string;
		customer: string;
		status: 'open' | 'confirmed' | 'delivered' | 'cancelled';
		createdAt: Date;
		net: number;
	};

	const customers = [
		'Alpenmilch GmbH',
		'Bergbahnen Tirol AG',
		'Congress Innsbruck',
		'Druckerei Steiner',
		'Elektro Huber KG',
		'Felsenkeller Brauerei',
		'Gasthof Post',
		'Holzbau Wieser'
	];
	const statuses: Order['status'][] = ['open', 'confirmed', 'delivered', 'cancelled'];

	let orders = $state<Order[]>(
		Array.from({ length: 37 }, (_, index) => ({
			id: `ord-${index + 1}`,
			number: `PO-2026-${String(1041 + index).padStart(4, '0')}`,
			customer: customers[(index * 5) % customers.length],
			status: statuses[(index * 3) % statuses.length],
			createdAt: new Date(Date.now() - index * 5_400_000),
			net: Math.round((index * 137.35 + 240) * 100) / 100
		}))
	);

	const statusBadge = {
		open: 'secondary',
		confirmed: 'outline',
		delivered: 'default',
		cancelled: 'destructive'
	} as const;

	const views: DataTableView<Order>[] = [
		{ key: 'open', label: 'Open', filter: (row) => row.status === 'open' },
		{ key: 'confirmed', label: 'Confirmed', filter: (row) => row.status === 'confirmed' },
		{ key: 'delivered', label: 'Delivered', filter: (row) => row.status === 'delivered' },
		{ key: 'cancelled', label: 'Cancelled', filter: (row) => row.status === 'cancelled' },
		{ key: 'empty', label: 'No matches', filter: () => false }
	];

	// This demo shows German localization through explicit label and locale overrides.
	const tableLabels: DataTableLabels = {
		all: 'Alle',
		views: 'Ansichten',
		searchPlaceholder: 'Suchen…',
		searchAria: 'Tabelle durchsuchen',
		group: 'Gruppieren',
		groupNone: 'Keine',
		columns: 'Spalten',
		selected: 'ausgewählt',
		clearSelection: 'Auswahl aufheben',
		selectAll: 'Alle Zeilen auswählen',
		selectRow: 'Zeile auswählen',
		selectGroup: 'Gruppe auswählen',
		noResults: 'Keine Ergebnisse.',
		showAll: 'Alle anzeigen',
		entries: (shown, total) => `${shown} von ${total} Einträgen`,
		rowsPerPage: 'Zeilen pro Seite',
		pageOf: (page, pages) => `Seite ${page} von ${pages}`,
		firstPage: 'Erste Seite',
		previousPage: 'Vorherige Seite',
		nextPage: 'Nächste Seite',
		lastPage: 'Letzte Seite',
		reorderHint: 'Spalte ziehen oder mit Alt+Pfeiltasten verschieben',
		reorderAria: (header) => `${header} — mit Alt+Pfeiltasten verschieben`
	};

	// Typed filter bar feeding the orders table; German labels continue the
	// explicit-localization pattern of this demo.
	const searchConfig: PowerSearchConfig = {
		freeTextField: 'customer',
		fields: [
			{ key: 'customer', label: 'Kunde', type: 'string' },
			{
				key: 'status',
				label: 'Status',
				type: 'enumList',
				values: [
					{ value: 'open', label: 'Offen' },
					{ value: 'confirmed', label: 'Bestätigt' },
					{ value: 'delivered', label: 'Geliefert' },
					{ value: 'cancelled', label: 'Storniert' }
				],
				operators: [
					{ key: 'isAnyOf', label: 'ist eines von' },
					{ key: 'isNoneOf', label: 'ist keines von' }
				]
			},
			{
				key: 'net',
				label: 'Netto',
				type: 'number',
				operators: [
					{ key: 'gte', label: '≥' },
					{ key: 'lte', label: '≤' },
					{ key: 'eq', label: '=' }
				]
			},
			{
				key: 'createdAt',
				label: 'Angelegt',
				type: 'date',
				operators: [
					{ key: 'after', label: 'nach' },
					{ key: 'before', label: 'vor' },
					{ key: 'is', label: 'am' }
				]
			}
		]
	};
	let orderFilters = $state<PowerSearchFilter[]>([]);
	const filteredOrders = $derived(applyPowerSearchFilters(orderFilters, orders));
	const searchLabels: PowerSearchLabels = {
		results: (count) => `${count} Treffer`,
		clearAll: 'Filter löschen',
		edit: (label) => `Filter ${label} bearbeiten`,
		remove: (label) => `Filter ${label} entfernen`,
		apply: 'Übernehmen',
		noFields: 'Keine passenden Felder.',
		operator: 'Operator',
		searchValues: 'Werte suchen…',
		added: (label) => `Filter ${label} hinzugefügt`,
		updated: (label) => `Filter ${label} aktualisiert`,
		removed: (label) => `Filter ${label} entfernt`,
		cleared: 'Filter gelöscht'
	};

	const columns: DataTableColumn<Order>[] = $derived([
		{ key: 'number', header: 'Order', type: 'id', hideable: false },
		{ key: 'customer', header: 'Customer' },
		{
			key: 'status',
			header: 'Status',
			type: 'badge',
			badgeVariant: (value) => statusBadge[value as Order['status']]
		},
		{ key: 'createdAt', header: 'Created', cell: createdCell },
		{ key: 'net', header: 'Net', type: 'currency' }
	]);

	function archiveRows(rows: Order[]) {
		console.info(
			'Archive:',
			rows.map((row) => row.number)
		);
	}

	function cancelRows(rows: Order[]) {
		const ids = new Set(rows.map((row) => row.id));
		orders = orders.map((order) => (ids.has(order.id) ? { ...order, status: 'cancelled' } : order));
	}

	function exportRows(rows: Order[]) {
		console.info(
			'Export:',
			rows.map((row) => row.number)
		);
	}

	let showBanner = $state(true);
	let selectedCustomer = $state<string>('');
	const customerItems = customers.map((name) => ({ value: name, label: name }));

	const fullTeam: AvatarStackItem[] = [
		{ fallback: 'AR', name: 'Alois Reinstadler' },
		{ fallback: 'MK', name: 'Maria König' },
		{ fallback: 'JS', name: 'Jonas Steiner' },
		{ fallback: 'TH', name: 'Theresa Huber' },
		{ fallback: 'LW', name: 'Lukas Wieser' },
		{ fallback: 'PB', name: 'Paula Brandner' },
		{ fallback: 'NN', name: 'Nina Nagele' }
	];

	let teamSize = $state(7);
	const team = $derived(fullTeam.slice(0, teamSize));

	const tags = [
		'Urgent',
		'Export',
		'Partial delivery',
		'Framework contract',
		'2 % discount',
		'Pickup',
		'New customer',
		'Open complaint'
	];

	function placeholderImage(label: string, hue: number): string {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"><rect width="100%" height="100%" fill="hsl(${hue} 40% 82%)"/><text x="50%" y="50%" font-family="sans-serif" font-size="48" fill="hsl(${hue} 45% 30%)" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
		return `data:image/svg+xml,${encodeURIComponent(svg)}`;
	}

	const attachments: LightboxItem[] = [
		{
			src: placeholderImage('Delivery note', 210),
			alt: 'Delivery note',
			caption: 'Delivery note DN-2026-0113'
		},
		{
			src: placeholderImage('Weight ticket', 30),
			alt: 'Weight ticket',
			caption: 'Weight ticket from Aug 29, 2026'
		},
		{ src: placeholderImage('Delivery photo', 140), alt: 'Delivery photo' },
		{ src: '/demo/beleg.pdf', alt: 'Invoice RE-2026-0815 (PDF)', caption: 'Invoice RE-2026-0815' }
	];

	const lightboxLabels = {
		download: 'Herunterladen',
		close: 'Schließen',
		previous: 'Vorheriger Anhang',
		next: 'Nächster Anhang',
		counter: (current: number, total: number) => `${current} von ${total}`,
		imageView: 'Bildansicht',
		fileFallbackName: 'datei'
	};

	function downloadAttachment(item: LightboxItem) {
		const anchor = document.createElement('a');
		anchor.href = item.src;
		anchor.download = item.src.startsWith('data:')
			? `${item.alt.replaceAll(/[^\w-]+/g, '-').toLowerCase()}.svg`
			: (item.src.split('/').pop() ?? item.alt);
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	}

	function downloadAllAttachments() {
		for (const item of attachments) downloadAttachment(item);
	}

	type Message = { id: number; role: 'user' | 'assistant'; text: string; at: Date };
	let messages = $state<Message[]>([
		{
			id: 1,
			role: 'assistant',
			text: 'Hi! How can I help with this order?',
			at: new Date(Date.now() - 340_000)
		},
		{
			id: 2,
			role: 'user',
			text: 'When will PO-2026-1042 be delivered?',
			at: new Date(Date.now() - 250_000)
		},
		{
			id: 3,
			role: 'assistant',
			text: 'PO-2026-1042 is confirmed for Thursday, September 3. The carrier was notified yesterday.',
			at: new Date(Date.now() - 180_000)
		}
	]);
	let nextId = 4;

	function sendMessage(text: string) {
		messages.push({ id: nextId++, role: 'user', text, at: new Date() });
		setTimeout(() => {
			messages.push({
				id: nextId++,
				role: 'assistant',
				text: 'Got it — noted.',
				at: new Date()
			});
		}, 600);
	}
</script>

{#snippet createdCell(order: Order)}
	<Timestamp date={order.createdAt} locale="de-AT" class="text-muted-foreground" />
{/snippet}

<svelte:head>
	<title>ERP primitives</title>
</svelte:head>

<div class="min-h-[100dvh] bg-background text-foreground">
	{#if showBanner}
		<Banner.Root variant="warning">
			<TriangleAlertIcon />
			<Banner.Content>
				<span class="font-medium">Maintenance window</span>
				<span class="text-foreground/70">
					Saturday, September 6, 22:00–24:00 — postings are paused during this time.
				</span>
			</Banner.Content>
			<Banner.Close aria-label="Schließen" onclick={() => (showBanner = false)} />
		</Banner.Root>
	{/if}

	<div class="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-10 md:px-8">
		<header class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="mb-2 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
					Bedrock ERP
				</p>
				<h1 class="font-heading text-3xl tracking-tight">ERP primitives</h1>
				<p class="mt-1 text-sm text-muted-foreground">
					Orders, deliveries, and documents — Bedrock components working together.
				</p>
			</div>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props}>
								<PlusIcon />
								New order
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Creates a new purchase order</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</header>

		<section class="flex flex-col gap-3">
			<h2 class="text-sm font-medium text-muted-foreground">Orders</h2>
			<PowerSearch
				config={searchConfig}
				bind:filters={orderFilters}
				placeholder="Bestellungen filtern…"
				resultCount={filteredOrders.length}
				labels={searchLabels}
			/>
			<DataTable
				data={filteredOrders}
				{columns}
				selectable
				searchable
				pageSize={10}
				caption="Order list"
				{views}
				groupable={['customer']}
				reorderable
				labels={tableLabels}
				locale="de-AT"
			>
				{#snippet actions(rows: Order[])}
					<Button size="sm" variant="outline" onclick={() => archiveRows(rows)}>Archive</Button>
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							{#snippet child({ props })}
								<Button {...props} size="sm" variant="destructive">Cancel orders</Button>
							{/snippet}
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>
									Cancel {rows.length}
									{rows.length === 1 ? 'order' : 'orders'}?
								</AlertDialog.Title>
								<AlertDialog.Description>
									The cancellation is posted immediately and reflected in the views. This action
									cannot be undone.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Keep orders</AlertDialog.Cancel>
								<AlertDialog.Action onclick={() => cancelRows(rows)}
									>Cancel orders</AlertDialog.Action
								>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{/snippet}
				{#snippet exportActions(rows: Order[])}
					<Button size="sm" variant="outline" onclick={() => exportRows(rows)}>
						<DownloadIcon />
						Export ({rows.length})
					</Button>
				{/snippet}
			</DataTable>
		</section>

		<section class="grid gap-8 md:grid-cols-2">
			<div class="flex flex-col gap-3">
				<h2 class="text-sm font-medium text-muted-foreground">Combobox</h2>
				<Combobox
					items={customerItems}
					bind:value={selectedCustomer}
					placeholder="Kunde auswählen…"
					searchPlaceholder="Kunden suchen…"
					emptyText="Keine Ergebnisse."
				/>
				{#if selectedCustomer}
					<p class="text-sm text-muted-foreground">Selected: {selectedCustomer}</p>
				{/if}

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">Assignees</h2>
				<div class="flex items-center gap-3">
					<AvatarStack items={team} max={4} moreLabel={(count) => `${count} weitere anzeigen`} />
					<span class="inline-flex gap-1">
						<Button
							variant="ghost"
							size="icon-xs"
							aria-label="Mitglied entfernen"
							disabled={teamSize <= 1}
							onclick={() => (teamSize -= 1)}>−</Button
						>
						<Button
							variant="ghost"
							size="icon-xs"
							aria-label="Mitglied hinzufügen"
							disabled={teamSize >= fullTeam.length}
							onclick={() => (teamSize += 1)}>+</Button
						>
					</span>
				</div>

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">System status</h2>
				<ul class="flex flex-col gap-1.5 text-sm">
					<li class="flex items-center gap-2">
						<StatusDot status="success" /> Accounting operational
					</li>
					<li class="flex items-center gap-2">
						<StatusDot status="info" pulse /> Inventory syncing
					</li>
					<li class="flex items-center gap-2">
						<StatusDot status="warning" /> Maintenance scheduled
					</li>
					<li class="flex items-center gap-2">
						<StatusDot status="destructive" /> Customs interface down
					</li>
				</ul>

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">
					Tags (drag the container narrower)
				</h2>
				<div class="resize-x overflow-hidden rounded-lg border border-dashed border-border p-3">
					<OverflowList items={tags} moreLabel={(count) => `${count} weitere Einträge anzeigen`}>
						{#snippet item(tag)}
							<Badge variant="secondary">{tag}</Badge>
						{/snippet}
					</OverflowList>
				</div>

				<div class="mt-4 flex items-center justify-between">
					<h2 class="text-sm font-medium text-muted-foreground">Attachments</h2>
					<Button size="sm" variant="ghost" onclick={downloadAllAttachments}>
						<DownloadIcon />
						Download all ({attachments.length})
					</Button>
				</div>
				<div class="flex items-center gap-2">
					{#each attachments as attachment, index (attachment.src)}
						{@const isPdf = attachment.src.toLowerCase().endsWith('.pdf')}
						<Lightbox items={attachments} {index} labels={lightboxLabels}>
							<Thumbnail src={isPdf ? undefined : attachment.src} alt={attachment.alt} size="lg">
								{#if isPdf}<FileTextIcon />{:else}<ImageIcon />{/if}
							</Thumbnail>
						</Lightbox>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-3">
				<h2 class="text-sm font-medium text-muted-foreground">Chat</h2>
				<Chat.Root class="h-96 rounded-lg border border-border">
					<Chat.MessageList scrollDownLabel="Nach unten scrollen">
						<Chat.SystemMessage>Today</Chat.SystemMessage>
						{#each messages as message (message.id)}
							<Chat.Message role={message.role}>
								<Chat.MessageBubble>{message.text}</Chat.MessageBubble>
								<Chat.MessageMetadata>
									<Timestamp date={message.at} locale="de-AT" />
								</Chat.MessageMetadata>
							</Chat.Message>
						{/each}
					</Chat.MessageList>
					<div class="p-3 pt-0">
						<Chat.Composer
							onSend={sendMessage}
							placeholder="Nachricht schreiben…"
							sendLabel="Senden"
						/>
					</div>
				</Chat.Root>

				<Banner.Root variant="info" class="rounded-lg border">
					<InfoIcon />
					<Banner.Content>
						<span>All amounts are net in EUR.</span>
					</Banner.Content>
				</Banner.Root>
			</div>
		</section>
	</div>
</div>
