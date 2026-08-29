<script lang="ts">
	import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
	import * as Alert from '#lib/bedrock/ui/alert';
	import * as Avatar from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Button } from '#lib/bedrock/ui/button';
	import * as Card from '#lib/bedrock/ui/card';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import * as Field from '#lib/bedrock/ui/field';
	import { Input } from '#lib/bedrock/ui/input';
	import { Progress } from '#lib/bedrock/ui/progress';
	import * as Select from '#lib/bedrock/ui/select';
	import { Slider } from '#lib/bedrock/ui/slider';
	import { Switch } from '#lib/bedrock/ui/switch';
	import * as Tabs from '#lib/bedrock/ui/tabs';

	const strata = [
		{ value: 'basalt', label: 'Basalt' },
		{ value: 'granite', label: 'Granite' },
		{ value: 'schist', label: 'Schist' }
	];

	let layer = $state('basalt');
	let notify = $state(true);
	let depth = $state(47);
	let acknowledged = $state(false);
	let tab = $state('intake');
	let selectedLayer = $derived(strata.find((item) => item.value === layer)?.label ?? 'Select layer');
</script>

<div class="relative">
	<div
		class="absolute -inset-x-6 -inset-y-8 hidden rounded-[2rem] bg-muted/40 ring-1 ring-foreground/5 md:block"
	></div>
	<Card.Root class="relative bg-card/95 shadow-[0_24px_48px_-24px_rgba(24,24,27,0.35)]">
		<Card.Header class="border-b">
			<div class="flex items-start justify-between gap-3">
				<div>
					<Card.Title>Core sample 08</Card.Title>
					<Card.Description>Live Bedrock controls, wired to local state.</Card.Description>
				</div>
				<Badge variant="secondary">47.2m</Badge>
			</div>
		</Card.Header>
		<Card.Content class="space-y-5 pt-4">
			<Tabs.Root bind:value={tab}>
				<Tabs.List>
					<Tabs.Trigger value="intake">Intake</Tabs.Trigger>
					<Tabs.Trigger value="crew">Crew</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="intake" class="space-y-4 pt-4">
					<Field.Field>
						<Field.Label for="site">Site name</Field.Label>
						<Input id="site" value="Rannoch Cut" />
					</Field.Field>
					<Field.Field>
						<Field.Label>Layer</Field.Label>
						<Select.Root type="single" bind:value={layer}>
							<Select.Trigger class="w-full">
								{selectedLayer}
							</Select.Trigger>
							<Select.Content>
								{#each strata as item (item.value)}
									<Select.Item value={item.value} label={item.label} />
								{/each}
							</Select.Content>
						</Select.Root>
					</Field.Field>
					<Field.Field>
						<Field.Label>Depth {depth}m</Field.Label>
						<Slider type="single" bind:value={depth} min={8} max={92} />
					</Field.Field>
					<Progress value={depth} max={92} />
					<div class="flex items-center justify-between gap-3">
						<Field.Field orientation="horizontal" class="w-auto">
							<Switch id="alerts" bind:checked={notify} />
							<Field.Label for="alerts">Shift alerts</Field.Label>
						</Field.Field>
						<Field.Field orientation="horizontal" class="w-auto">
							<Checkbox id="ack" bind:checked={acknowledged} />
							<Field.Label for="ack">Logged</Field.Label>
						</Field.Field>
					</div>
				</Tabs.Content>
				<Tabs.Content value="crew" class="space-y-4 pt-4">
					<div class="flex items-center gap-3">
						<Avatar.Root>
							<Avatar.Fallback>MV</Avatar.Fallback>
						</Avatar.Root>
						<div class="min-w-0">
							<p class="text-sm font-medium">Mira Voss</p>
							<p class="text-xs text-muted-foreground">Night lead · Shaft 3</p>
						</div>
						<Badge variant="outline" class="ms-auto">On site</Badge>
					</div>
					<Alert.Root>
						<CircleAlertIcon />
						<Alert.Title>Hold on east face</Alert.Title>
						<Alert.Description>Water ingress at 31.8m. Crew rotated at 02:14.</Alert.Description>
					</Alert.Root>
				</Tabs.Content>
			</Tabs.Root>
		</Card.Content>
		<Card.Footer class="justify-end gap-2">
			<Button variant="outline">Discard</Button>
			<Button>Save sample</Button>
		</Card.Footer>
	</Card.Root>
</div>
