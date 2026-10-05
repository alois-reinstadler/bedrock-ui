<script lang="ts">
	import ExampleCard from '#lib/site/ExampleCard.svelte';
	import MotionExample from '#lib/site/guide-examples/motion-disclosure.svelte';
	import TextExample from '#lib/site/guide-examples/motion-text.svelte';
	import { Button } from '#lib/bedrock/ui/button';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';

	const imports = `// Engine-free application policy
import MotionProvider from '#lib/bedrock/motion/MotionProvider.svelte';
import { useMotionPolicy } from '#lib/bedrock/motion/policy.svelte.js';

// Bedrock policy bridge for engine compositions
import AstraPolicy from '#lib/bedrock/motion/AstraPolicy.svelte';

// Astra's own authoring API; transition durations use seconds
import { motion, AnimatePresence, LayoutGroup } from 'astra-motion';
import { TextReveal, TextSwap } from 'astra-motion/text';
import { Tilt } from 'astra-motion/tilt';

// Existing lightweight Bedrock helpers use milliseconds
import { reveal } from '#lib/bedrock/motion/presence.js';
import { autoSize } from '#lib/bedrock/motion/auto-size.js';`;
</script>

<svelte:head>
	<title>Motion — Bedrock</title>
	<meta
		name="description"
		content="Bedrock motion policy, CSS feedback, and Astra-powered coordinated interactions."
	/>
</svelte:head>

<article class="mx-auto max-w-4xl px-4 py-10 md:px-8">
	<DocsPageHeader
		title="Motion"
		description="Quiet feedback for controls. Coordinated movement for related content. One policy for motion preferences."
	/>
	<section class="mt-10" aria-labelledby="architecture-heading">
		<h2 id="architecture-heading" class="text-2xl font-medium tracking-tight">
			Choose by responsibility
		</h2>
		<p class="mt-3 text-muted-foreground">
			Astryx defines the timing, easing curves and spring parameters. Bedrock applies that motion
			system to accessible component behavior. CSS handles simple feedback; Astra Motion is the
			engine for coordinated presence, shared layout, gestures and animated values.
		</p>
		<p class="mt-3 text-muted-foreground">
			Use ordinary Bedrock components with their default behavior. For a custom composition, use
			Astra's public API with Bedrock's motion policy. Keep focused measurement and lifecycle
			helpers where the interaction needs real content reflow.
		</p>
	</section>
	<section class="mt-10" aria-labelledby="family-heading">
		<h2 id="family-heading" class="text-2xl font-medium tracking-tight">Component motion</h2>
		<p class="mt-3 text-muted-foreground">
			Menus and popovers enter as one surface. Choose motion="soft" on their Content for a brief
			sharpen effect. Dropdown and context menus also accept motion="stagger" for decorative icons;
			labels and focused actions stay immediate.
		</p>
		<p class="mt-3 text-muted-foreground">
			Accordion and Collapsible Content accept textMotion="prose" for short, noninteractive copy.
			Tabs, Calendar, RangeCalendar and SteppedForm accept motion="panel" for a whole-panel change.
			These effects are opt-in; ordinary content starts readable.
		</p>
		<p class="mt-3 text-muted-foreground">
			Banner and Chat.Message accept motion="enter" for deliberate new insertions. Existing messages
			and urgent banners stay still. Reduced motion settles functional effects and makes decorative
			loading indicators static. Continuous decoration pauses offscreen.
		</p>
		<div class="mt-5">
			<Button href="/demo/component-motion" variant="outline">Try component motion</Button>
		</div>
	</section>
	<section class="mt-10" aria-labelledby="choose-heading">
		<h2 id="choose-heading" class="text-2xl font-medium tracking-tight">Choose an entry point</h2>
		<div class="mt-5">
			<CodeBlock
				class="bg-background"
				title="Import boundaries"
				language="typescript"
				code={imports}
			/>
		</div>
		<p class="mt-4 text-sm text-muted-foreground">
			Bedrock durations use milliseconds. Astra duration and delay use seconds: 200 milliseconds
			becomes 0.2 seconds. Import the engine only in components that use it; the application policy
			and ordinary CSS controls remain independent.
		</p>
	</section>
	<section class="mt-12" aria-labelledby="example-heading">
		<h2 id="example-heading" class="text-2xl font-medium tracking-tight">Coordinated presence</h2>
		<p class="mt-3 mb-5 text-muted-foreground">
			Astra retains the departing surface. Bedrock keeps focus and semantic state immediate: the
			closing panel becomes inert, and its Close action returns focus to the trigger.
		</p>
		<ExampleCard
			label="Motion disclosure example"
			sourceUrl="/docs/examples/guide-examples/motion-disclosure/source.json"
			><MotionExample /></ExampleCard
		>
		<div class="mt-5">
			<Button href="/motion" variant="outline">Open the motion comparison</Button>
		</div>
	</section>
	<section class="mt-12" aria-labelledby="text-heading">
		<h2 id="text-heading" class="text-2xl font-medium tracking-tight">
			Text that changes in place
		</h2>
		<p class="mt-3 mb-5 text-muted-foreground">
			TextReveal combines fade, slide or blur with whole-text, word or grapheme segmentation.
			TextSwap uses the same effects when replacing a message. Import both from astra-motion/text
			and wrap custom compositions in AstraPolicy so Bedrock's application preference also applies.
		</p>
		<ExampleCard
			label="Text reveal and replacement example"
			sourceUrl="/docs/examples/guide-examples/motion-text/source.json"><TextExample /></ExampleCard
		>
		<p class="mt-4 text-sm text-muted-foreground">
			Reserve space for known alternatives to keep nearby controls still, or use fixed dimensions
			with an explicit overflow policy. Content sizing can move surrounding layout. Wait mode
			finishes the exit before entering the latest message; sync mode overlaps two layers and snaps
			to the latest value if another update arrives during the exit. Live announcements are opt-in.
		</p>
		<p class="mt-4 text-sm text-muted-foreground">
			TiltCard uses Astra's optional Tilt primitive. Its styled card surface rotates inside a
			stationary measurement wrapper; put entrance or layout motion on an outer element. Touch stays
			neutral, and keyboard focus, scrolling or reduced motion settle the decorative movement.
		</p>
	</section>
	<section class="mt-12" aria-labelledby="policy-heading">
		<h2 id="policy-heading" class="text-2xl font-medium tracking-tight">
			Respect motion preferences
		</h2>
		<p class="mt-3 text-muted-foreground">
			MotionProvider combines the operating system preference with an optional application reduction
			setting. A nested scope can request less motion; it cannot cancel a parent's reduction.
			Components used without a provider still respect the system preference.
		</p>
		<p class="mt-3 text-muted-foreground">
			Use AstraPolicy around custom engine compositions. Read useMotionPolicy().reduced when
			specifying explicit transitions so opacity and decorative effects also settle immediately.
			Attach the policy to a portalled root when it needs the same CSS treatment outside its
			original DOM ancestry.
		</p>
		<p class="mt-3 text-muted-foreground">
			For live reduction during an existing paint animation, own its MotionValue and register
			settleOnReducedMotion(value). It completes that value without remounting content or cancelling
			unrelated work. Raw Astra motion components default to unrestricted motion. Its MotionConfig
			is an advanced engine configuration, not a replacement for Bedrock's shared policy. Keep
			essential server-rendered content visible with initial=false.
		</p>
	</section>
	<section class="mt-12" aria-labelledby="boundaries-heading">
		<h2 id="boundaries-heading" class="text-2xl font-medium tracking-tight">
			Keep ownership clear
		</h2>
		<ul class="mt-4 space-y-3 text-muted-foreground">
			<li>
				<strong class="text-foreground">One owner per property.</strong> Use a separate animation surface
				when a popover or gesture primitive owns positioning transforms.
			</li>
			<li>
				<strong class="text-foreground">One owner per exit.</strong> Choose the appropriate Bits, Svelte
				or Astra lifecycle. Do not stack independent retention systems on the same surface.
			</li>
			<li>
				<strong class="text-foreground">Semantics are immediate.</strong> Selection, status announcements
				and focus never wait for an animation. Departing interactive content must be inert.
			</li>
			<li>
				<strong class="text-foreground">Routes are separate.</strong> Astra's optional navigation adapters
				are not qualified for this site's Kit 3 version. The existing route continuity prototype remains
				experimental.
			</li>
		</ul>
	</section>
	<section class="mt-12" aria-labelledby="package-heading">
		<h2 id="package-heading" class="text-2xl font-medium tracking-tight">Package and migration</h2>
		<p class="mt-3 text-muted-foreground">
			The repository includes an exact Astra archive with its source identity and integrity hash. No
			sibling checkout is needed to install or build Bedrock. Astra is MIT licensed, with upstream
			notices included in the package.
		</p>
		<p class="mt-3 text-muted-foreground">
			The former astra-motion/css entry and CssButton/CssPanel wrappers have been retired. Use
			normal Bedrock controls and CSS for simple feedback, or Astra's motion components for
			coordinated behavior. Existing native Bedrock helpers retain their millisecond contracts while
			consumers migrate. The legacy createMotion constructor is removed; use motion.bind for native
			bindings.
		</p>
	</section>
</article>
