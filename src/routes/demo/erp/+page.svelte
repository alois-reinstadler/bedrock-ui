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
	import { DataTable, type DataTableColumn, type DataTableView } from '#lib/bedrock/ui/data-table';
	import { Lightbox, type LightboxItem } from '#lib/bedrock/ui/lightbox';
	import { OverflowList } from '#lib/bedrock/ui/overflow-list';
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';
	import * as Tooltip from '#lib/bedrock/ui/tooltip';

	type Order = {
		id: string;
		number: string;
		customer: string;
		status: 'offen' | 'bestätigt' | 'geliefert' | 'storniert';
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
	const statuses: Order['status'][] = ['offen', 'bestätigt', 'geliefert', 'storniert'];

	let orders = $state<Order[]>(
		Array.from({ length: 37 }, (_, index) => ({
			id: `ord-${index + 1}`,
			number: `AU-2026-${String(1041 + index).padStart(4, '0')}`,
			customer: customers[(index * 5) % customers.length],
			status: statuses[(index * 3) % statuses.length],
			createdAt: new Date(Date.now() - index * 5_400_000),
			net: Math.round((index * 137.35 + 240) * 100) / 100
		}))
	);

	const statusBadge = {
		offen: 'secondary',
		bestätigt: 'outline',
		geliefert: 'default',
		storniert: 'destructive'
	} as const;

	const views: DataTableView<Order>[] = [
		{ key: 'offen', label: 'Offen', filter: (row) => row.status === 'offen' },
		{ key: 'bestätigt', label: 'Bestätigt', filter: (row) => row.status === 'bestätigt' },
		{ key: 'geliefert', label: 'Geliefert', filter: (row) => row.status === 'geliefert' },
		{ key: 'storniert', label: 'Storniert', filter: (row) => row.status === 'storniert' },
		{ key: 'leer', label: 'Ohne Treffer', filter: () => false }
	];

	const columns: DataTableColumn<Order>[] = $derived([
		{ key: 'number', header: 'Auftrag', type: 'id', hideable: false },
		{ key: 'customer', header: 'Kunde' },
		{
			key: 'status',
			header: 'Status',
			type: 'badge',
			badgeVariant: (value) => statusBadge[value as Order['status']]
		},
		{ key: 'createdAt', header: 'Angelegt', cell: createdCell },
		{ key: 'net', header: 'Netto', type: 'currency' }
	]);

	function archiveRows(rows: Order[]) {
		console.info(
			'Archivieren:',
			rows.map((row) => row.number)
		);
	}

	function cancelRows(rows: Order[]) {
		const ids = new Set(rows.map((row) => row.id));
		orders = orders.map((order) => (ids.has(order.id) ? { ...order, status: 'storniert' } : order));
	}

	let showBanner = $state(true);
	let selectedCustomer = $state<string>('');
	const customerItems = customers.map((name) => ({ value: name, label: name }));

	const team: AvatarStackItem[] = [
		{ fallback: 'AR' },
		{ fallback: 'MK' },
		{ fallback: 'JS' },
		{ fallback: 'TH' },
		{ fallback: 'LW' },
		{ fallback: 'PB' },
		{ fallback: 'NN' }
	];

	const tags = [
		'Dringend',
		'Export',
		'Teillieferung',
		'Rahmenvertrag',
		'Skonto 2 %',
		'Selbstabholer',
		'Neukunde',
		'Reklamation offen'
	];

	function placeholderImage(label: string, hue: number): string {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="640"><rect width="100%" height="100%" fill="hsl(${hue} 40% 82%)"/><text x="50%" y="50%" font-family="sans-serif" font-size="48" fill="hsl(${hue} 45% 30%)" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
		return `data:image/svg+xml,${encodeURIComponent(svg)}`;
	}

	const attachments: LightboxItem[] = [
		{
			src: placeholderImage('Lieferschein', 210),
			alt: 'Lieferschein',
			caption: 'Lieferschein LS-2026-0113'
		},
		{
			src: placeholderImage('Wiegeschein', 30),
			alt: 'Wiegeschein',
			caption: 'Wiegeschein vom 29.08.2026'
		},
		{ src: placeholderImage('Foto Anlieferung', 140), alt: 'Foto der Anlieferung' },
		{ src: '/demo/beleg.pdf', alt: 'Rechnung RE-2026-0815 (PDF)', caption: 'Rechnung RE-2026-0815' }
	];

	type Message = { id: number; role: 'user' | 'assistant'; text: string; at: Date };
	let messages = $state<Message[]>([
		{
			id: 1,
			role: 'assistant',
			text: 'Grüß dich! Wie kann ich beim Auftrag helfen?',
			at: new Date(Date.now() - 340_000)
		},
		{
			id: 2,
			role: 'user',
			text: 'Wann wird AU-2026-1042 geliefert?',
			at: new Date(Date.now() - 250_000)
		},
		{
			id: 3,
			role: 'assistant',
			text: 'AU-2026-1042 ist für Donnerstag, 3. September bestätigt. Die Spedition wurde gestern avisiert.',
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
				text: 'Verstanden — ich habe mir das notiert.',
				at: new Date()
			});
		}, 600);
	}

	function exportRows(rows: Order[]) {
		console.info(
			'Export:',
			rows.map((row) => row.number)
		);
	}
</script>

{#snippet createdCell(order: Order)}
	<Timestamp date={order.createdAt} class="text-muted-foreground" />
{/snippet}

<svelte:head>
	<title>ERP-Primitive</title>
</svelte:head>

<div class="min-h-[100dvh] bg-background text-foreground">
	{#if showBanner}
		<Banner.Root variant="warning">
			<TriangleAlertIcon />
			<Banner.Content>
				<span class="font-medium">Wartungsfenster</span>
				<span class="text-muted-foreground">
					Samstag, 6. September, 22:00–24:00 Uhr — Buchungen sind währenddessen pausiert.
				</span>
			</Banner.Content>
			<Banner.Close onclick={() => (showBanner = false)} />
		</Banner.Root>
	{/if}

	<div class="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-10 md:px-8">
		<header class="flex flex-wrap items-end justify-between gap-4">
			<div>
				<p class="mb-2 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
					Bedrock ERP
				</p>
				<h1 class="font-heading text-3xl tracking-tight">ERP-Primitive</h1>
				<p class="mt-1 text-sm text-muted-foreground">
					Aufträge, Lieferungen und Belege — Bedrock-Komponenten im Verbund.
				</p>
			</div>
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						{#snippet child({ props })}
							<Button {...props}>
								<PlusIcon />
								Neuer Auftrag
							</Button>
						{/snippet}
					</Tooltip.Trigger>
					<Tooltip.Content>Legt einen neuen Auftrag an</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		</header>

		<section class="flex flex-col gap-3">
			<h2 class="text-sm font-medium text-muted-foreground">Aufträge</h2>
			<DataTable
				data={orders}
				{columns}
				selectable
				searchable
				pageSize={10}
				caption="Auftragsliste"
				{views}
				groupable={['customer']}
				reorderable
			>
				{#snippet actions(rows: Order[])}
					<Button size="sm" variant="outline" onclick={() => archiveRows(rows)}>Archivieren</Button>
					<AlertDialog.Root>
						<AlertDialog.Trigger>
							{#snippet child({ props })}
								<Button {...props} size="sm" variant="destructive">Stornieren</Button>
							{/snippet}
						</AlertDialog.Trigger>
						<AlertDialog.Content>
							<AlertDialog.Header>
								<AlertDialog.Title>
									{rows.length}
									{rows.length === 1 ? 'Auftrag' : 'Aufträge'} stornieren?
								</AlertDialog.Title>
								<AlertDialog.Description>
									Die Stornierung wird sofort gebucht und in den Ansichten sichtbar. Diese Aktion
									kann nicht rückgängig gemacht werden.
								</AlertDialog.Description>
							</AlertDialog.Header>
							<AlertDialog.Footer>
								<AlertDialog.Cancel>Abbrechen</AlertDialog.Cancel>
								<AlertDialog.Action onclick={() => cancelRows(rows)}>Stornieren</AlertDialog.Action>
							</AlertDialog.Footer>
						</AlertDialog.Content>
					</AlertDialog.Root>
				{/snippet}
				{#snippet exportActions(rows: Order[])}
					<Button size="sm" variant="outline" onclick={() => exportRows(rows)}>
						<DownloadIcon />
						Exportieren
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
					placeholder="Kunde wählen…"
					searchPlaceholder="Kunde suchen…"
				/>
				{#if selectedCustomer}
					<p class="text-sm text-muted-foreground">Ausgewählt: {selectedCustomer}</p>
				{/if}

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">Zuständige</h2>
				<AvatarStack items={team} max={4} />

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">Systemstatus</h2>
				<ul class="flex flex-col gap-1.5 text-sm">
					<li class="flex items-center gap-2">
						<StatusDot status="success" /> Buchhaltung betriebsbereit
					</li>
					<li class="flex items-center gap-2">
						<StatusDot status="info" pulse /> Lagerbestand wird synchronisiert
					</li>
					<li class="flex items-center gap-2">
						<StatusDot status="warning" /> Wartungsfenster geplant
					</li>
					<li class="flex items-center gap-2">
						<StatusDot status="destructive" /> Zoll-Schnittstelle gestört
					</li>
				</ul>

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">
					Merkmale (Container schmal ziehen)
				</h2>
				<div class="resize-x overflow-hidden rounded-lg border border-dashed border-border p-3">
					<OverflowList items={tags}>
						{#snippet item(tag)}
							<Badge variant="secondary">{tag}</Badge>
						{/snippet}
					</OverflowList>
				</div>

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">Anhänge</h2>
				<div class="flex items-center gap-2">
					{#each attachments as attachment, index (attachment.src)}
						{@const isPdf = attachment.src.toLowerCase().endsWith('.pdf')}
						<Lightbox items={attachments} {index}>
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
					<Chat.MessageList>
						<Chat.SystemMessage>Heute</Chat.SystemMessage>
						{#each messages as message (message.id)}
							<Chat.Message role={message.role}>
								<Chat.MessageBubble>{message.text}</Chat.MessageBubble>
								<Chat.MessageMetadata>
									<Timestamp date={message.at} />
								</Chat.MessageMetadata>
							</Chat.Message>
						{/each}
					</Chat.MessageList>
					<div class="p-3 pt-0">
						<Chat.Composer onSend={sendMessage} />
					</div>
				</Chat.Root>

				<Banner.Root variant="info" class="rounded-lg border">
					<InfoIcon />
					<Banner.Content>
						<span>Alle Beträge netto in EUR, Formatierung de-AT.</span>
					</Banner.Content>
				</Banner.Root>
			</div>
		</section>
	</div>
</div>
