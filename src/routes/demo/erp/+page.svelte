<script lang="ts">
	import DownloadIcon from '@lucide/svelte/icons/download';
	import ImageIcon from '@lucide/svelte/icons/image';
	import InfoIcon from '@lucide/svelte/icons/info';
	import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
	import { AvatarStack, type AvatarStackItem } from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Banner from '#lib/bedrock/ui/banner';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Chat from '#lib/bedrock/ui/chat';
	import * as Combobox from '#lib/bedrock/ui/combobox';
	import { DataTable, type DataTableColumn } from '#lib/bedrock/ui/data-table';
	import { Lightbox, type LightboxItem } from '#lib/bedrock/ui/lightbox';
	import { OverflowList } from '#lib/bedrock/ui/overflow-list';
	import { StatusDot, type StatusDotStatus } from '#lib/bedrock/ui/status-dot';
	import { Thumbnail } from '#lib/bedrock/ui/thumbnail';
	import { Timestamp } from '#lib/bedrock/ui/timestamp';

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

	const orders: Order[] = Array.from({ length: 37 }, (_, index) => ({
		id: `ord-${index + 1}`,
		number: `AU-2026-${String(1041 + index).padStart(4, '0')}`,
		customer: customers[(index * 5) % customers.length],
		status: statuses[(index * 3) % statuses.length],
		createdAt: new Date(Date.now() - index * 5_400_000),
		net: Math.round((index * 137.35 + 240) * 100) / 100
	}));

	const statusDot: Record<Order['status'], StatusDotStatus> = {
		offen: 'info',
		bestätigt: 'warning',
		geliefert: 'success',
		storniert: 'destructive'
	};

	const columns: DataTableColumn<Order>[] = $derived([
		{ key: 'number', header: 'Auftrag', hideable: false },
		{ key: 'customer', header: 'Kunde' },
		{ key: 'status', header: 'Status', cell: statusCell },
		{ key: 'createdAt', header: 'Angelegt', cell: createdCell },
		{ key: 'net', header: 'Netto', type: 'currency' }
	]);

	let showBanner = $state(true);
	let selectedCustomer = $state<string>('');
	let customerQuery = $state('');
	const filteredCustomers = $derived(
		customerQuery.trim().length === 0
			? customers
			: customers.filter((name) => name.toLowerCase().includes(customerQuery.toLowerCase()))
	);

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
		{ src: placeholderImage('Foto Anlieferung', 140), alt: 'Foto der Anlieferung' }
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

{#snippet statusCell(order: Order)}
	<span class="inline-flex items-center gap-1.5">
		<StatusDot status={statusDot[order.status]} />
		<span class="capitalize">{order.status}</span>
	</span>
{/snippet}

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
		<header>
			<p class="mb-2 text-[10px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
				Bedrock ERP
			</p>
			<h1 class="font-heading text-3xl tracking-tight">ERP-Primitive</h1>
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
			>
				{#snippet actions(rows: Order[])}
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
				<Combobox.Root
					type="single"
					bind:value={selectedCustomer}
					onOpenChange={(open) => {
						if (!open) customerQuery = '';
					}}
				>
					<Combobox.Input
						placeholder="Kunde wählen…"
						aria-label="Kunde"
						oninput={(event) => (customerQuery = event.currentTarget.value)}
					/>
					<Combobox.Content>
						{#each filteredCustomers as name (name)}
							<Combobox.Item value={name} label={name} />
						{:else}
							<Combobox.Empty />
						{/each}
					</Combobox.Content>
				</Combobox.Root>
				{#if selectedCustomer}
					<p class="text-sm text-muted-foreground">Ausgewählt: {selectedCustomer}</p>
				{/if}

				<h2 class="mt-4 text-sm font-medium text-muted-foreground">Zuständige</h2>
				<AvatarStack items={team} max={4} />

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
						<Lightbox items={attachments} {index}>
							<Thumbnail src={attachment.src} alt={attachment.alt} size="lg">
								<ImageIcon />
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
