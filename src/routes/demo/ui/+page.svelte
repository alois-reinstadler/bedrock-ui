<script lang="ts">
	import { resolve } from '$app/paths';
	import SharedPillExample from './SharedPillExample.svelte';
	import PackAndShuffleExample from './PackAndShuffleExample.svelte';
	import UnanimatableCSSExample from './UnanimatableCSSExample.svelte';
	import SizeExample from './SizeExample.svelte';
	import AccordionExample from './AccordionExample.svelte';
	import StackExample from './StackExample.svelte';
	import SearchMorphExample from './SearchMorphExample.svelte';
	import RowMarkExample from './RowMarkExample.svelte';
	import CardToStageExample from './CardToStageExample.svelte';
	import DensityExample from './DensityExample.svelte';
	import WrapExample from './WrapExample.svelte';
	import RailExample from './RailExample.svelte';
	import ContentSwapExample from './ContentSwapExample.svelte';
	import ValidationExample from './ValidationExample.svelte';
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
			<SharedPillExample />

			<PackAndShuffleExample />

			<UnanimatableCSSExample />

			<SizeExample />

			<AccordionExample />

			<StackExample />

			<SearchMorphExample />

			<RowMarkExample />

			<CardToStageExample />

			<DensityExample />

			<WrapExample />

			<RailExample />

			<ContentSwapExample />

			<ValidationExample />
		</main>
	</div>
</div>

<style>
</style>
