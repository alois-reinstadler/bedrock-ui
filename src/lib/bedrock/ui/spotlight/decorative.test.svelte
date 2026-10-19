<script lang="ts">
	import { MotionProvider } from '#lib/bedrock/motion/index.js';
	import { Spotlight, SpotlightGroup } from './index.js';
	import Marquee from '../marquee/marquee.svelte';
	import TiltCard from '../tilt-card/tilt-card.svelte';
	import Skeleton from '../skeleton/skeleton.svelte';
	import SkeletonGroup from '../skeleton/skeleton-group.svelte';
	import Spinner from '../spinner/spinner.svelte';
	import StatusDot from '../status-dot/status-dot.svelte';
	import TextShimmer from '../text-shimmer/text-shimmer.svelte';
	import TextHighlight from '../text-highlight/text-highlight.svelte';
	let reduced = $state(false);
</script>

<button type="button" onclick={() => (reduced = !reduced)}>Toggle reduced motion</button>
<MotionProvider {reduced}>
	<SpotlightGroup
		class="grid-cols-2"
		style="width:600px;display:grid;grid-template-columns:1fr 1fr;gap:16px"
	>
		<Spotlight data-testid="first"><div style="height:120px">First surface</div></Spotlight>
		<Spotlight data-testid="second"><div style="height:120px">Second surface</div></Spotlight>
	</SpotlightGroup>
	<Marquee style="max-width:300px"
		>{#each [1, 2, 3, 4] as item (item)}<a href="#item-{item}" style="display:block;min-width:180px"
				>Item {item}</a
			>{/each}</Marquee
	>
	<TiltCard
		><div style="height:120px">
			Tilt content<input aria-label="Tilt note" /><button type="button">Card action</button>
		</div></TiltCard
	>
	<SkeletonGroup><Skeleton class="h-4 w-24" /></SkeletonGroup>
	<Spinner />
	<StatusDot pulse label="Pending" />
	<TextShimmer>Loading details</TextShimmer>
	<TextHighlight animated>Highlighted text</TextHighlight>
</MotionProvider>
