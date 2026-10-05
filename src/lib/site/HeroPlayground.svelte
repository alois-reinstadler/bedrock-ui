<script lang="ts">
	import type { Attachment } from 'svelte/attachments';
	import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';
	import ActivityIcon from '@lucide/svelte/icons/activity';
	import CommandIcon from '@lucide/svelte/icons/command';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import { AsyncButton } from '#lib/bedrock/ui/async-button';
	import * as Avatar from '#lib/bedrock/ui/avatar';
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Card from '#lib/bedrock/ui/card';
	import { Input } from '#lib/bedrock/ui/input';
	import { Kbd } from '#lib/bedrock/ui/kbd';
	import { Progress } from '#lib/bedrock/ui/progress';
	import { StatusDot } from '#lib/bedrock/ui/status-dot';
	import { Switch } from '#lib/bedrock/ui/switch';
	import { Token } from '#lib/bedrock/ui/token';

	const policy = useMotionPolicy();
	const settleScene: Attachment<HTMLElement> = (node) => {
		if (policy.reduced) {
			node.style.setProperty('--scene-x', '0deg');
			node.style.setProperty('--scene-y', '0deg');
		}
	};

	let live = $state(true);
	let query = $state('');
	let tags = $state(['Motion', 'Forms', 'Data']);

	let searchResults = $derived(
		query.trim()
			? ['Selector', 'Command', 'Combobox'].filter((item) =>
					item.toLowerCase().includes(query.toLowerCase())
				)
			: []
	);

	function tilt(event: PointerEvent) {
		if (policy.reduced || event.pointerType === 'touch') return;
		const node = event.currentTarget as HTMLElement;
		const rect = node.getBoundingClientRect();
		const x = (event.clientX - rect.left) / rect.width - 0.5;
		const y = (event.clientY - rect.top) / rect.height - 0.5;
		node.style.setProperty('--scene-x', `${x * 7}deg`);
		node.style.setProperty('--scene-y', `${y * -6}deg`);
	}

	function resetTilt(event: PointerEvent) {
		const node = event.currentTarget as HTMLElement;
		node.style.setProperty('--scene-x', '0deg');
		node.style.setProperty('--scene-y', '0deg');
	}

	function removeTag(label: string) {
		tags = tags.filter((tag) => tag !== label);
	}

	async function sync() {
		await new Promise((resolve) => setTimeout(resolve, 700));
	}
</script>

<svelte:window
	onkeydown={(event) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			document.getElementById('hero-component-search')?.focus();
		}
	}}
/>

<section
	class="constellation"
	data-reduced-motion={policy.reduced}
	{@attach settleScene}
	aria-label="Interactive Bedrock component constellation"
	onpointermove={tilt}
	onpointerleave={resetTilt}
>
	<div class="scene-glow"></div>
	<div class="scene-grid"></div>
	<div class="world">
		<div class="float float-a plane plane-command">
			<Card.Root class="hero-surface block gap-0 p-3 shadow-xl">
				<div class="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
					<CommandIcon class="size-3.5" />
					<span class="font-code">Quick find</span>
					<Kbd class="ms-auto text-foreground">⌘ K</Kbd>
				</div>
				<Input
					id="hero-component-search"
					value={query}
					oninput={(event) => (query = event.currentTarget.value)}
					aria-label="Search components"
					placeholder="Search components…"
				/>
				{#if searchResults.length}
					<div class="mt-2 space-y-1" aria-live="polite">
						{#each searchResults as result (result)}
							<a
								href={`/docs/components/${result.toLowerCase().replaceAll(' ', '-')}`}
								data-sveltekit-reload
								class="w-full rounded-md px-2 py-1.5 text-left text-xs motion-state corner-theme hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
								>{result}</a
							>
						{/each}
					</div>
				{/if}
			</Card.Root>
		</div>

		<div class="float float-b plane plane-status">
			<Card.Root class="hero-surface flex-row items-center gap-3 p-3 shadow-lg">
				<span
					class="grid size-9 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600 corner-theme"
				>
					<ActivityIcon class="size-4" />
				</span>
				<div class="min-w-0">
					<p class="text-xs font-medium">System pulse</p>
					<p class="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<StatusDot status={live ? 'success' : 'neutral'} pulse={live} />
						{live ? 'All services nominal' : 'Telemetry paused'}
					</p>
				</div>
				<Switch class="ms-auto" bind:checked={live} aria-label="Toggle live telemetry" />
			</Card.Root>
		</div>

		<div class="float float-c plane plane-main">
			<Card.Root class="hero-surface overflow-hidden border-foreground/10 shadow-2xl">
				<Card.Header class="border-b bg-card/85">
					<div class="flex items-start justify-between gap-3">
						<div>
							<Card.Title>Shift intelligence</Card.Title>
							<Card.Description>Live components, composed in place.</Card.Description>
						</div>
						<Badge variant="secondary">Live</Badge>
					</div>
				</Card.Header>
				<Card.Content class="space-y-5 pt-5">
					<div class="flex items-end justify-between gap-4">
						<div>
							<p class="font-code text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
								Throughput
							</p>
							<p class="mt-1 text-3xl font-medium tracking-tight tabular-nums">84.6%</p>
						</div>
						<Avatar.Group>
							<Avatar.Root size="sm"><Avatar.Fallback>MV</Avatar.Fallback></Avatar.Root>
							<Avatar.Root size="sm"><Avatar.Fallback>AK</Avatar.Fallback></Avatar.Root>
							<Avatar.Root size="sm"><Avatar.Fallback>+3</Avatar.Fallback></Avatar.Root>
						</Avatar.Group>
					</div>
					<Progress value={84.6} aria-label="Throughput 84.6 percent" />
					<div class="flex items-center justify-between gap-3">
						<p class="text-xs text-muted-foreground">12 signals reconciled</p>
						<AsyncButton action={sync} pendingLabel="Syncing…" successLabel="Synced" size="sm">
							Sync now
						</AsyncButton>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="float float-d plane plane-tokens">
			<Card.Root class="hero-surface block gap-0 p-3 shadow-xl">
				<div class="mb-2 flex items-center gap-2">
					<SparklesIcon class="size-3.5 text-violet-500" />
					<p class="text-xs font-medium">Active filters</p>
				</div>
				<div class="flex flex-wrap gap-1.5">
					{#each tags as tag (tag)}
						<Token
							label={tag}
							color={tag === 'Motion' ? 'purple' : tag === 'Forms' ? 'blue' : 'green'}
							size="sm"
							onRemove={() => removeTag(tag)}
						/>
					{:else}
						<p class="text-xs text-muted-foreground">All filters cleared.</p>
					{/each}
				</div>
			</Card.Root>
		</div>

		<div class="float float-e plane plane-note">
			<Card.Root class="hero-surface flex-row items-start gap-3 p-3 shadow-xl">
				<span class="mt-0.5 size-2 shrink-0 rounded-full bg-sky-500 ring-4 ring-sky-500/15"></span>
				<div>
					<p class="text-xs font-medium">Motion with a reason</p>
					<p class="mt-1 max-w-[20ch] text-[11px] leading-relaxed text-muted-foreground">
						State changes move. Decoration stays quiet.
					</p>
				</div>
			</Card.Root>
		</div>
	</div>
</section>

<style>
	.constellation {
		--scene-x: 0deg;
		--scene-y: 0deg;
		position: relative;
		min-height: 32rem;
		isolation: isolate;
		perspective: 1100px;
	}

	.scene-glow {
		position: absolute;
		inset: 12% 8%;
		z-index: -2;
		border-radius: 999px;
		background: radial-gradient(
			circle,
			color-mix(in oklab, var(--primary) 13%, transparent),
			transparent 66%
		);
		filter: blur(24px);
	}

	.scene-grid {
		position: absolute;
		inset: 6%;
		z-index: -1;
		border-radius: 2rem;
		background-image:
			linear-gradient(color-mix(in oklab, var(--foreground) 5%, transparent) 1px, transparent 1px),
			linear-gradient(
				90deg,
				color-mix(in oklab, var(--foreground) 5%, transparent) 1px,
				transparent 1px
			);
		background-size: 28px 28px;
		mask-image: radial-gradient(ellipse at center, black, transparent 72%);
		transform: rotateX(64deg) translateY(23%) scale(1.08);
		transform-origin: center bottom;
	}

	.world {
		position: absolute;
		inset: 0;
		transform: rotateX(var(--scene-y)) rotateY(var(--scene-x));
		transform-style: preserve-3d;
		transition: transform var(--motion-reveal) var(--motion-ease-move);
	}

	.float,
	.plane {
		transform-style: preserve-3d;
	}

	.float {
		position: absolute;
	}

	.plane {
		transition:
			transform var(--motion-reveal) var(--motion-ease-move),
			filter var(--motion-state) var(--motion-ease-enter);
	}

	.plane:hover,
	.plane:focus-within {
		filter: drop-shadow(0 22px 28px color-mix(in oklab, black 18%, transparent));
	}

	.constellation :global(.hero-surface) {
		background: color-mix(in oklab, var(--card) 92%, transparent);
		backdrop-filter: blur(18px) saturate(1.15);
	}

	.plane-command {
		width: 15rem;
		transform: translate3d(-7%, 2%, 30px) rotateY(8deg) rotateZ(-2deg);
	}
	.constellation:not([data-reduced-motion='true']) .plane-command:hover,
	.constellation:not([data-reduced-motion='true']) .plane-command:focus-within {
		transform: translate3d(-7%, -2%, 90px) rotateY(3deg) rotateZ(-1deg) scale(1.025);
	}
	.plane-status {
		width: 16rem;
		transform: translate3d(93%, 18%, 4px) rotateY(-9deg) rotateZ(2deg);
	}
	.constellation:not([data-reduced-motion='true']) .plane-status:hover,
	.constellation:not([data-reduced-motion='true']) .plane-status:focus-within {
		transform: translate3d(93%, 13%, 80px) rotateY(-3deg) rotateZ(1deg) scale(1.025);
	}
	.plane-main {
		width: min(22rem, 78vw);
		transform: translate3d(28%, 44%, 65px) rotateX(1deg) rotateY(-2deg);
	}
	.constellation:not([data-reduced-motion='true']) .plane-main:hover,
	.constellation:not([data-reduced-motion='true']) .plane-main:focus-within {
		transform: translate3d(28%, 40%, 125px) rotateX(0deg) rotateY(0deg) scale(1.025);
	}
	.plane-tokens {
		width: 14rem;
		transform: translate3d(-2%, 315%, 8px) rotateY(9deg) rotateZ(2deg);
	}
	.constellation:not([data-reduced-motion='true']) .plane-tokens:hover,
	.constellation:not([data-reduced-motion='true']) .plane-tokens:focus-within {
		transform: translate3d(-2%, 308%, 78px) rotateY(3deg) rotateZ(1deg) scale(1.025);
	}
	.plane-note {
		width: 14rem;
		transform: translate3d(120%, 365%, 35px) rotateY(-8deg) rotateZ(-2deg);
	}
	.constellation:not([data-reduced-motion='true']) .plane-note:hover,
	.constellation:not([data-reduced-motion='true']) .plane-note:focus-within {
		transform: translate3d(120%, 355%, 95px) rotateY(-2deg) rotateZ(-1deg) scale(1.025);
	}

	@media (max-width: 767px) {
		.constellation {
			min-height: auto;
			perspective: none;
		}
		.scene-grid {
			display: none;
		}
		.world {
			position: relative;
			display: grid;
			gap: 0.75rem;
			transform: none;
		}
		.float {
			position: relative;
			animation: none;
		}
		.constellation:not([data-reduced-motion='true']) .plane:hover,
		.constellation:not([data-reduced-motion='true']) .plane:focus-within,
		.plane-command,
		.plane-status,
		.plane-main,
		.plane-tokens,
		.plane-note,
		.plane-command:hover,
		.plane-command:focus-within,
		.plane-status:hover,
		.plane-status:focus-within,
		.plane-main:hover,
		.plane-main:focus-within,
		.plane-tokens:hover,
		.plane-tokens:focus-within,
		.plane-note:hover,
		.plane-note:focus-within {
			width: 100%;
			transform: none;
		}
	}

	.constellation[data-reduced-motion='true'] .world,
	.constellation[data-reduced-motion='true'] .plane {
		transition: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.world,
		.plane {
			transition-duration: 0.01ms;
		}
		.float {
			animation: none;
		}
	}
</style>
