<script lang="ts">
	import { tick } from 'svelte';
	import { autoSize } from './auto-size.js';
	import LayoutGroup from './layout-group.svelte';
	import { layout } from './layout.svelte.js';
	import { appear, reveal, vanish } from './presence.js';
	import Swap from './swap.svelte';
	import { motionEasings, motionPresets } from './tokens.js';

	type Scenario =
		| 'layout'
		| 'nested'
		| 'nested-timing'
		| 'shared'
		| 'shared-triple'
		| 'shared-expiry'
		| 'group-isolation'
		| 'observer-fallback'
		| 'vanish-geometry'
		| 'missing-group'
		| 'continuous-layout'
		| 'diagnostic'
		| 'presence'
		| 'accordion'
		| 'auto-size'
		| 'swap'
		| 'scroll';
	type Alignment = 'start' | 'center' | 'end';

	let { scenario }: { scenario: Scenario } = $props();

	const testTransition = {
		duration: 180,
		spring: { stiffness: 117, damping: 18.4, mass: 1 }
	};
	const moving = layout({ type: 'position', transition: testTransition });
	const parentProjection = layout({ type: 'position', transition: testTransition });
	const childProjection = layout({ type: 'position', transition: testTransition });
	const sourceShared = layout({
		id: 'fixture-shared',
		type: 'position',
		transition: testTransition
	});
	const targetShared = layout({
		id: 'fixture-shared',
		type: 'position',
		transition: testTransition
	});
	const scrolling = layout({ type: 'position', transition: testTransition });
	const slowParentProjection = layout({
		type: 'position',
		transition: { duration: 600, spring: { stiffness: 117, damping: 18.4, mass: 1 } }
	});
	const fastChildProjection = layout({
		type: 'position',
		transition: { duration: 150, spring: { stiffness: 117, damping: 18.4, mass: 1 } }
	});
	const tripleSource = layout({
		id: 'fixture-triple',
		type: 'position',
		transition: testTransition
	});
	const tripleMiddle = layout({
		id: 'fixture-triple',
		type: 'position',
		transition: testTransition
	});
	const tripleTarget = layout({
		id: 'fixture-triple',
		type: 'position',
		transition: testTransition
	});
	const duplicateA = layout({
		id: 'fixture-duplicate',
		type: 'position',
		transition: testTransition
	});
	const duplicateB = layout({
		id: 'fixture-duplicate',
		type: 'position',
		transition: testTransition
	});
	const isolatedOuter = layout({
		id: 'fixture-isolated',
		type: 'position',
		transition: testTransition
	});
	const isolatedInner = layout({
		id: 'fixture-isolated',
		type: 'position',
		transition: testTransition
	});
	const isolatedSource = layout({
		id: 'fixture-adjacent',
		type: 'position',
		transition: testTransition
	});
	const isolatedTarget = layout({
		id: 'fixture-adjacent',
		type: 'position',
		transition: testTransition
	});
	const fallbackItem = layout({ type: 'position', transition: testTransition });
	const orphan = layout({ type: 'position', transition: testTransition });
	const continuousItem = layout({ type: 'position', transition: testTransition });
	const autoSizing = autoSize({ duration: testTransition.duration, easing: 'linear' });

	let alignment = $state<Alignment>('start');
	let nestedAtEnd = $state(false);
	let sourceVisible = $state(true);
	let targetVisible = $state(false);
	let presenceVisible = $state(false);
	let accordionOpen = $state<'a' | 'b'>('a');
	let scrollOffset = $state(0);
	let nestedTimelineEnd = $state(false);
	let tripleOwner = $state<'source' | 'middle' | 'target' | 'none'>('source');
	let expirySource = $state(true);
	let expiryMiddle = $state(true);
	let expiryTarget = $state(false);
	let isolatedSourceVisible = $state(true);
	let isolatedTargetVisible = $state(false);
	let fallbackAtEnd = $state(false);
	let fallbackCount = $state(1);
	let vanishGeometryVisible = $state(true);
	let continuousAtEnd = $state(false);
	let autoSizeTall = $state(false);
	let swapLong = $state(false);
	let swapEffect = $state<'fade' | 'slide-up'>('fade');
	let fallbackItems = $derived(Array.from({ length: fallbackCount }, (_, index) => index));

	async function transferTeardownFirst() {
		sourceVisible = false;
		await tick();
		targetVisible = true;
	}

	async function transferMountFirst() {
		targetVisible = true;
		await tick();
		sourceVisible = false;
	}

	async function transferThroughUnpaintedOwner() {
		tripleOwner = 'none';
		await tick();
		tripleOwner = 'middle';
		await tick();
		tripleOwner = 'none';
		await tick();
		tripleOwner = 'target';
	}

	function removeNewerOwner() {
		expiryMiddle = false;
	}

	async function transferAfterSnapshotExpiry() {
		expirySource = false;
		await tick();
		expiryTarget = true;
	}

	async function transferAcrossGroups() {
		isolatedSourceVisible = false;
		await tick();
		isolatedTargetVisible = true;
	}
</script>

{#if scenario === 'layout'}
	<div class="controls">
		<button type="button" onclick={() => (alignment = 'start')}>Start</button>
		<button type="button" onclick={() => (alignment = 'center')}>Mitte</button>
		<button type="button" onclick={() => (alignment = 'end')}>Ende</button>
	</div>
	<LayoutGroup class={`layout-stage alignment-${alignment}`} data-testid="layout-root">
		<div {@attach moving} class="moving-node" data-testid="moving-node">A</div>
	</LayoutGroup>
{:else if scenario === 'nested'}
	<button type="button" onclick={() => (nestedAtEnd = !nestedAtEnd)}>Elternteil verschieben</button>
	<LayoutGroup
		class={`nested-stage ${nestedAtEnd ? 'alignment-end' : 'alignment-start'}`}
		data-testid="nested-root"
	>
		<div {@attach parentProjection} class="projection-parent" data-testid="projection-parent">
			<div {@attach childProjection} class="projection-child" data-testid="projection-child">A</div>
		</div>
	</LayoutGroup>
{:else if scenario === 'nested-timing'}
	<button type="button" onclick={() => (nestedTimelineEnd = !nestedTimelineEnd)}>
		Verschachtelt verschieben
	</button>
	<LayoutGroup class="timeline-stage" data-testid="timeline-root">
		<div
			{@attach slowParentProjection}
			class="timeline-parent"
			data-testid="timeline-parent"
			style:left={`${nestedTimelineEnd ? 300 : 0}px`}
		>
			<div
				{@attach fastChildProjection}
				class="timeline-child"
				data-testid="timeline-child"
				style:left={`${nestedTimelineEnd ? 80 : 0}px`}
			></div>
		</div>
	</LayoutGroup>
{:else if scenario === 'shared'}
	<div class="controls">
		<button type="button" onclick={transferTeardownFirst}>Zuerst entfernen</button>
		<button type="button" onclick={transferMountFirst}>Zuerst einfügen</button>
	</div>
	<LayoutGroup class="shared-stage" data-testid="shared-root">
		{#if sourceVisible}
			<div {@attach sourceShared} class="shared-node shared-source" data-testid="shared-source">
				A
			</div>
		{/if}
		{#if targetVisible}
			<div {@attach targetShared} class="shared-node shared-target" data-testid="shared-target">
				A
			</div>
		{/if}
	</LayoutGroup>
{:else if scenario === 'shared-triple'}
	<button type="button" onclick={transferThroughUnpaintedOwner}>Dreifach übertragen</button>
	<LayoutGroup class="shared-stage" data-testid="triple-root">
		{#if tripleOwner === 'source'}
			<div {@attach tripleSource} class="shared-node triple-source" data-testid="triple-source">
				A
			</div>
		{:else if tripleOwner === 'middle'}
			<div {@attach tripleMiddle} class="shared-node triple-middle" data-testid="triple-middle">
				B
			</div>
		{:else if tripleOwner === 'target'}
			<div {@attach tripleTarget} class="shared-node triple-target" data-testid="triple-target">
				C
			</div>
		{/if}
	</LayoutGroup>
{:else if scenario === 'shared-expiry'}
	<div class="controls">
		<button type="button" onclick={removeNewerOwner}>Neueren Besitzer entfernen</button>
		<button type="button" onclick={transferAfterSnapshotExpiry}>Nach Ablauf übertragen</button>
	</div>
	<LayoutGroup class="shared-stage" data-testid="expiry-root">
		{#if expirySource}
			<div {@attach tripleSource} class="shared-node triple-source" data-testid="expiry-source">
				A
			</div>
		{/if}
		{#if expiryMiddle}
			<div {@attach tripleMiddle} class="shared-node triple-middle" data-testid="expiry-middle">
				B
			</div>
		{/if}
		{#if expiryTarget}
			<div {@attach tripleTarget} class="shared-node triple-target" data-testid="expiry-target">
				C
			</div>
		{/if}
	</LayoutGroup>
{:else if scenario === 'group-isolation'}
	<button type="button" onclick={transferAcrossGroups}>Zwischen Gruppen übertragen</button>
	<LayoutGroup class="shared-stage" data-testid="isolation-outer">
		<div {@attach isolatedOuter} class="shared-node triple-source" data-testid="isolated-outer">
			A
		</div>
		<LayoutGroup class="shared-stage inner-isolation" data-testid="isolation-inner">
			<div {@attach isolatedInner} class="shared-node triple-middle" data-testid="isolated-inner">
				B
			</div>
		</LayoutGroup>
	</LayoutGroup>
	<div class="adjacent-groups">
		<LayoutGroup class="shared-stage" data-testid="adjacent-source-root">
			{#if isolatedSourceVisible}
				<div
					{@attach isolatedSource}
					class="shared-node triple-source"
					data-testid="adjacent-source"
				>
					S
				</div>
			{/if}
		</LayoutGroup>
		<LayoutGroup class="shared-stage" data-testid="adjacent-target-root">
			{#if isolatedTargetVisible}
				<div
					{@attach isolatedTarget}
					class="shared-node triple-target"
					data-testid="adjacent-target"
				>
					T
				</div>
			{/if}
		</LayoutGroup>
	</div>
{:else if scenario === 'observer-fallback'}
	<div class="controls">
		<button type="button" onclick={() => (fallbackAtEnd = !fallbackAtEnd)}>
			Fallback verschieben
		</button>
		<button type="button" onclick={() => (fallbackCount += 1)}>Fallback hinzufügen</button>
	</div>
	<LayoutGroup
		class={`fallback-stage ${fallbackAtEnd ? 'alignment-end' : 'alignment-start'}`}
		data-testid="fallback-root"
	>
		{#each fallbackItems as item (item)}
			<div {@attach fallbackItem} class="moving-node" data-testid={`fallback-item-${item}`}>
				{item}
			</div>
		{/each}
	</LayoutGroup>
{:else if scenario === 'vanish-geometry'}
	<button type="button" onclick={() => (vanishGeometryVisible = false)}>Geometrie entfernen</button>
	<div class="vanish-geometry-root" data-testid="vanish-geometry-root">
		{#if vanishGeometryVisible}
			<div out:vanish class="vanish-geometry-node" data-testid="vanish-geometry-node">Inhalt</div>
		{/if}
		<div class="vanish-sibling" data-testid="vanish-sibling">B</div>
	</div>
{:else if scenario === 'missing-group'}
	<div {@attach orphan} data-testid="orphan-layout-node">A</div>
{:else if scenario === 'continuous-layout'}
	<button type="button" onclick={() => (continuousAtEnd = !continuousAtEnd)}>
		CSS-Übergang starten
	</button>
	<LayoutGroup class="continuous-root" data-testid="continuous-root">
		<div
			{@attach continuousItem}
			class:at-end={continuousAtEnd}
			class="continuous-node"
			data-testid="continuous-node"
		></div>
	</LayoutGroup>
{:else if scenario === 'diagnostic'}
	<LayoutGroup class="shared-stage" data-testid="diagnostic-root">
		<div {@attach duplicateA} class="shared-node shared-source">A</div>
		<div {@attach duplicateB} class="shared-node shared-target">B</div>
	</LayoutGroup>
{:else if scenario === 'presence'}
	<button type="button" onclick={() => (presenceVisible = !presenceVisible)}>
		{presenceVisible ? 'Inhalt ausblenden' : 'Inhalt einblenden'}
	</button>
	<div class="presence-stage" data-testid="presence-root">
		{#if presenceVisible}
			<div in:appear out:vanish class="presence-card" data-testid="presence-card">Hinweis</div>
			<div in:reveal out:reveal class="reveal-card" data-testid="reveal-card">
				Zusätzliche Angaben
			</div>
		{/if}
	</div>
	<div class="presence-sentinel" data-testid="presence-sentinel">Danach</div>
{:else if scenario === 'accordion'}
	<div style="display: flex; flex-direction: column">
		<div>
			<button type="button" onclick={() => (accordionOpen = 'a')}>Erste Antwort</button>
			{#if accordionOpen === 'a'}
				<div
					data-testid="accordion-a"
					in:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
					out:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
				>
					<div style="height: 40px">Kurz</div>
				</div>
			{/if}
		</div>
		<div>
			<button type="button" onclick={() => (accordionOpen = 'b')}>Zweite Antwort</button>
			{#if accordionOpen === 'b'}
				<div
					data-testid="accordion-b"
					in:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
					out:reveal={{ duration: motionPresets.reveal.duration, easing: motionEasings.enter }}
				>
					<div style="height: 72px">Lang</div>
				</div>
			{/if}
		</div>
	</div>
	<div data-testid="accordion-sentinel">Danach</div>
{:else if scenario === 'auto-size'}
	<button type="button" onclick={() => (autoSizeTall = !autoSizeTall)}>Höhe ändern</button>
	<div {@attach autoSizing} class="auto-size-shell" data-testid="auto-size-shell">
		<div class="auto-size-row">A</div>
		{#if autoSizeTall}
			<div class="auto-size-row">B</div>
		{/if}
	</div>
{:else if scenario === 'swap'}
	<button type="button" onclick={() => (swapLong = !swapLong)}>Inhalt wechseln</button>
	<button type="button" onclick={() => (swapEffect = swapEffect === 'fade' ? 'slide-up' : 'fade')}>
		Effekt wechseln
	</button>
	<div data-testid="swap-shell">
		<Swap key={swapLong} effect={swapEffect}>
			{#if swapLong}
				<span data-testid="swap-long">Längerer Inhalt</span>
			{:else}
				<span data-testid="swap-short">Kurz</span>
			{/if}
		</Swap>
	</div>
{:else}
	<button type="button" onclick={() => (scrollOffset += 40)}>Element verschieben</button>
	<div class="outside-scroll" data-testid="outside-scroll">
		<div class="outside-scroll-canvas">
			<LayoutGroup class="scroll-stage" data-testid="scroll-root">
				<div class="scroll-canvas">
					<div
						{@attach scrolling}
						class="scrolling-node"
						data-testid="scrolling-node"
						style:left={`${260 + scrollOffset}px`}
					>
						A
					</div>
				</div>
			</LayoutGroup>
		</div>
	</div>
{/if}

<style>
	.controls {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	button {
		padding: 0.25rem 0.5rem;
		border: 1px solid currentColor;
	}

	:global(.layout-stage),
	:global(.nested-stage) {
		display: flex;
		align-items: center;
		width: 360px;
		height: 80px;
		border: 1px solid transparent;
	}

	:global(.alignment-start) {
		justify-content: flex-start;
	}

	:global(.alignment-center) {
		justify-content: center;
	}

	:global(.alignment-end) {
		justify-content: flex-end;
	}

	.moving-node,
	.projection-parent,
	.shared-node,
	.scrolling-node {
		width: 48px;
		height: 48px;
	}

	.moving-node,
	.projection-parent,
	.shared-node,
	.scrolling-node,
	.projection-child {
		display: grid;
		place-items: center;
		background: rgb(20 20 20);
		color: white;
	}

	.projection-parent {
		padding: 12px;
	}

	.projection-child {
		width: 24px;
		height: 24px;
		background: rgb(220 80 80);
	}

	:global(.shared-stage) {
		position: relative;
		width: 360px;
		height: 72px;
	}

	:global(.inner-isolation) {
		margin-left: 72px;
	}

	.adjacent-groups {
		display: grid;
		grid-template-columns: 360px 360px;
		gap: 24px;
	}

	:global(.fallback-stage) {
		display: flex;
		gap: 8px;
		width: 360px;
		height: 80px;
	}

	.vanish-geometry-root {
		position: relative;
		display: flex;
		direction: rtl;
		width: 360px;
		height: 96px;
		justify-content: flex-start;
	}

	.vanish-geometry-node {
		box-sizing: content-box;
		width: 120px;
		height: 40px;
		padding: 9px;
		border: 4px solid rgb(20 20 20);
	}

	.vanish-sibling {
		width: 48px;
		height: 48px;
	}

	:global(.continuous-root) {
		position: relative;
		width: 320px;
		height: 64px;
	}

	.continuous-node {
		position: absolute;
		top: 8px;
		left: 0;
		width: 48px;
		height: 48px;
		background: rgb(20 20 20);
		transition: left 180ms linear;
	}

	.continuous-node.at-end {
		left: 240px;
	}

	:global(.timeline-stage) {
		position: relative;
		width: 420px;
		height: 96px;
	}

	.timeline-parent,
	.timeline-child {
		position: absolute;
		top: 16px;
		display: grid;
		place-items: center;
	}

	.timeline-parent {
		width: 100px;
		height: 64px;
		background: rgb(20 20 20);
	}

	.timeline-child {
		width: 20px;
		height: 32px;
		background: rgb(220 80 80);
	}

	.shared-node {
		position: absolute;
		top: 12px;
	}

	.shared-source {
		left: 12px;
	}

	.shared-target {
		left: 300px;
	}

	.triple-source {
		left: 12px;
	}

	.triple-middle {
		left: 156px;
	}

	.triple-target {
		left: 300px;
	}

	.presence-stage {
		position: relative;
		width: 280px;
		margin-top: 0.5rem;
	}

	.presence-sentinel {
		width: 48px;
		height: 20px;
	}

	.presence-card,
	.reveal-card {
		padding: 8px;
		background: rgb(230 230 230);
	}

	.reveal-card {
		margin-top: 8px;
	}

	.auto-size-shell {
		box-sizing: border-box;
		width: 180px;
		overflow: hidden;
		background: rgb(230 230 230);
	}

	.auto-size-row {
		height: 40px;
	}

	:global(.scroll-stage) {
		width: 240px;
		height: 96px;
		overflow: auto;
		border: 1px solid transparent;
	}

	.outside-scroll {
		width: 260px;
		overflow: auto;
	}

	.outside-scroll-canvas {
		width: 640px;
	}

	.scroll-canvas {
		position: relative;
		width: 640px;
		height: 80px;
	}

	.scrolling-node {
		position: absolute;
		top: 16px;
	}
</style>
