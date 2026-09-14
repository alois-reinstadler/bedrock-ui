<script lang="ts">
	import { Button } from '#lib/bedrock/ui/button';
	import { CodeBlock } from '#lib/bedrock/ui/code-block';
	import DocsPageHeader from '#lib/site/DocsPageHeader.svelte';

	const install = 'pnpm install --frozen-lockfile\npnpm motion:verify\npnpm check\npnpm build';
	const example = `<script lang="ts">
  import { CssButton, CssPanel } from '#lib/bedrock/motion/css.js';
  import { MotionConfig } from '#lib/bedrock/motion/config.js';
  let open = $state(false);
<${'/'}script>

<MotionConfig reducedMotion="user">
  <CssButton aria-expanded={open} aria-controls="motion-details"
    onclick={() => (open = !open)}>Toggle details</CssButton>
  {#if open}
    <CssPanel id="motion-details" motion={{
      initial: { opacity: 0, y: 8 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
      transition: { duration: 0.2 }
    }}>Your details remain mounted until the exit finishes.</CssPanel>
  {/if}
</MotionConfig>`;
	const imports = `// Default: Astra CSS, seconds
import { Motion, MotionConfig, Size } from '#lib/bedrock/motion/index.js';

// Finite CSS tweens and Bedrock wrappers: seconds
import { createMotion, CssButton, CssPanel } from '#lib/bedrock/motion/css.js';

// Physics, gestures and projection: seconds
import { Motion as SpringMotion, Presence } from '#lib/bedrock/motion/engine.js';

// Narrow engine capabilities
import { createLayout } from '#lib/bedrock/motion/projection.js';
import { motionValue } from '#lib/bedrock/motion/values.js';

// Shared Astra policy without importing the engine
import { MotionConfig as ScopedMotionConfig } from '#lib/bedrock/motion/config.js';`;
</script>

<svelte:head>
	<title>Motion — Bedrock</title>
	<meta
		name="description"
		content="Build purposeful interactions with Astra CSS and JavaScript motion, accessible defaults, and one consistent API."
	/>
</svelte:head>

<article class="mx-auto max-w-4xl px-4 py-10 md:px-8">
	<DocsPageHeader
		title="Motion"
		description="CSS for feedback and finite transitions. JavaScript for physics and layout. One Astra API, with reduced-motion support built in."
	/>
	<section class="mt-10" aria-labelledby="choose-heading">
		<h2 id="choose-heading" class="text-2xl font-medium tracking-tight">Choose an entry point</h2>
		<p class="mt-3 mb-5 text-muted-foreground">
			Start with the default CSS entry. Move to the JavaScript entry when an interaction needs
			physics or shared layout. Use the CSS Size wrapper for intrinsic shells. Bedrock components
			follow the same rule.
		</p>
		<CodeBlock
			class="bg-background"
			title="Import boundaries"
			language="typescript"
			code={imports}
		/>
		<p class="mt-4 text-sm text-muted-foreground">
			<strong class="text-foreground">Timing is explicit.</strong> Astra transition duration and delay
			use seconds: 200 milliseconds becomes 0.2 seconds. Spring stiffness and damping are physics parameters,
			not durations. The low-level Svelte cssTransition helper uses milliseconds and requires an explicit
			reducedMotion option for application preferences.
		</p>
	</section>
	<section class="mt-12" aria-labelledby="example-heading">
		<h2 id="example-heading" class="text-2xl font-medium tracking-tight">
			An accessible disclosure
		</h2>
		<p class="mt-3 mb-5 text-muted-foreground">
			CssButton preserves native button activation and disabled behavior. CssPanel owns its native
			element and retains it through an ancestor conditional's exit transition. Keep interactive
			content out of a departing panel, or move focus back to the trigger before closing it.
		</p>
		<CodeBlock class="bg-background" title="Disclosure.svelte" language="svelte" code={example} />
		<div class="mt-5">
			<Button href="/motion" variant="outline">Open the motion comparison</Button>
		</div>
	</section>
	<section class="mt-12" aria-labelledby="policy-heading">
		<h2 id="policy-heading" class="text-2xl font-medium tracking-tight">
			Respect motion preferences
		</h2>
		<p class="mt-3 text-muted-foreground">
			Astra follows the operating system's reduced-motion preference by default. MotionConfig scopes
			policy to its descendants: user follows the system, always requests reduced motion, and the
			never setting permits full motion regardless of system preference. Prefer user for normal use
			and always for an explicit reduce-motion setting.
		</p>
		<p class="mt-3 text-muted-foreground">
			Both Astra backends consume this provider, including the migrated Bedrock components. Reduced
			motion must preserve the final state, meaningful feedback, keyboard access, and focus. It is
			not a substitute for testing an interaction with animation disabled.
		</p>
		<p class="mt-3 text-muted-foreground">
			Keep CSS bindings on finite tweens. If an ancestor provider defines a spring transition, give
			each CSS binding a local tween transition. Do not assume a CSS binding can execute an
			engine-only option.
		</p>
	</section>
	<section class="mt-12" aria-labelledby="boundaries-heading">
		<h2 id="boundaries-heading" class="text-2xl font-medium tracking-tight">
			Keep ownership clear
		</h2>
		<ul class="mt-4 space-y-3 text-muted-foreground">
			<li>
				<strong class="text-foreground">One owner per property.</strong> Animate an inner surface when
				a popover, tooltip, drawer, or layout primitive owns positioning transforms. Do not attach two
				motion systems to the same transform.
			</li>
			<li>
				<strong class="text-foreground">CSS has a finite contract.</strong> Use scalar opacity, pixel
				position and size, scale, rotation, static variants, and hover, tap, or focus targets. Springs,
				drag, MotionValues, projection, keyframe arrays, repeats, and per-frame callbacks require the
				engine.
			</li>
			<li>
				<strong class="text-foreground">Transitions have lifecycle rules.</strong> A CSS intro snapshots
				its trajectory. Reactive targets wait until the intro ends; imperative animate calls reject during
				an intro or retained exit.
			</li>
			<li>
				<strong class="text-foreground">Routes are a separate boundary.</strong> This application uses
				SvelteKit 3. Astra's optional route adapter declares a Kit 2 peer and is not qualified here. Keep
				the site's current navigation behavior.
			</li>
		</ul>
	</section>
	<section class="mt-12" aria-labelledby="package-heading">
		<h2 id="package-heading" class="text-2xl font-medium tracking-tight">Install and verify</h2>
		<p class="mt-3 mb-5 text-muted-foreground">
			Astra is installed from the versioned archive checked into vendor. A fresh checkout needs no
			sibling repository or unpublished registry release. Bedrock's #lib imports are local source
			aliases, not a published Bedrock package.
		</p>
		<CodeBlock
			class="bg-background"
			title="From the Bedrock repository"
			language="sh"
			code={install}
		/>
		<p class="mt-3 text-sm text-muted-foreground">
			The frozen-lockfile flag prevents installation from rewriting the dependency lock. Package
			provenance and the refresh procedure live in docs/bedrock/motion.md.
		</p>
	</section>
</article>
