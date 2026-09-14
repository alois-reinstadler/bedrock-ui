<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import * as Card from '#lib/bedrock/ui/card';
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Text } from '#lib/bedrock/ui/text';
	import type { ComponentAccessibilityGuide } from '#lib/site/component-guides/index.js';
	import type { ComponentDoc } from '#lib/site/registry';

	let {
		component,
		accessibility
	}: { component: ComponentDoc; accessibility: ComponentAccessibilityGuide } = $props();

	const sections = [
		{ id: 'semantics', title: 'Semantics', key: 'semantics' },
		{ id: 'keyboard', title: 'Keyboard interaction', key: 'keyboard' },
		{ id: 'focus', title: 'Focus management', key: 'focus' },
		{ id: 'labels', title: 'Labels and instructions', key: 'labels' },
		{ id: 'announcements', title: 'Announcements', key: 'announcements' },
		{ id: 'reduced-motion', title: 'Reduced motion', key: 'reducedMotion' }
	] as const;

	const criterionLinks: Record<string, string> = {
		'WCAG 4.1.2: Name, Role, Value':
			'https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html',
		'WCAG 2.1.1: Keyboard': 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html',
		'WCAG 2.4.11: Focus Not Obscured (Minimum)':
			'https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html',
		'WCAG 1.4.3: Contrast (Minimum)':
			'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html',
		'WCAG 1.4.11: Non-text Contrast':
			'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html',
		'WCAG 1.4.3 and 1.4.11': 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html'
	};
</script>

<div class="space-y-12" data-doc-tab="accessibility">
	<section id="accessibility-overview" aria-labelledby="accessibility-heading" class="space-y-4">
		<Heading id="accessibility-heading" level={2}>Accessibility contract</Heading>
		<Text color="muted" as="p" class="max-w-3xl leading-relaxed">
			{component.title} provides the foundation described below. Applications still own accessible names,
			meaningful content, state announcements, and testing in the final context.
		</Text>
	</section>

	<div class="grid gap-4 md:grid-cols-2">
		{#each sections as section (section.id)}
			<Card.Root id={section.id} class="scroll-mt-24 shadow-none">
				<Card.Header><Card.Title>{section.title}</Card.Title></Card.Header>
				<Card.Content>
					<ul class="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
						{#each accessibility[section.key] as item (item)}<li>{item}</li>{/each}
					</ul>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>

	{#if accessibility.requirements?.length}
		<section id="color-contrast" aria-labelledby="contrast-heading" class="space-y-4">
			<div class="max-w-3xl space-y-2">
				<Heading id="contrast-heading" level={2}
					>{component.slug === 'button' ? 'Color contrast' : 'Testable requirements'}</Heading
				>
				<Text color="muted" as="p" class="leading-relaxed">
					Components must meet WCAG 2.2 Level AA across variants, states, and themes. Measure
					foreground and background colors as they appear together on screen.
				</Text>
			</div>
			<div class="overflow-x-auto rounded-xl border bg-card">
				<table class="w-full min-w-[56rem] border-collapse text-left text-sm">
					<thead class="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
						<tr>
							<th scope="col" class="px-4 py-3 font-medium">Requirement</th>
							<th scope="col" class="px-4 py-3 font-medium">Applies to</th>
							<th scope="col" class="px-4 py-3 font-medium">Guidance</th>
						</tr>
					</thead>
					<tbody class="divide-y">
						{#each accessibility.requirements as requirement (requirement.requirement)}
							<tr class="align-top">
								<th scope="row" class="px-4 py-4 font-medium">{requirement.requirement}</th>
								<td class="px-4 py-4 text-muted-foreground">{requirement.appliesTo}</td>
								<td class="max-w-lg space-y-2 px-4 py-4 text-muted-foreground">
									<p>{requirement.guidance}</p>
									<a
										href={criterionLinks[requirement.criteria]}
										target="_blank"
										rel="noreferrer"
										class="font-medium text-foreground underline underline-offset-4"
										>{requirement.criteria}<span class="sr-only"> (opens in a new tab)</span></a
									>
									{#if requirement.criteria === 'WCAG 1.4.3 and 1.4.11'}<a
											class="block underline underline-offset-4"
											href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html"
											>WCAG 1.4.11 disabled-control exemption</a
										>{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	<section id="known-gaps" aria-labelledby="known-gaps-heading" class="space-y-4">
		<div class="flex items-center gap-3">
			<Heading id="known-gaps-heading" level={2}>Known gaps</Heading>
			<Badge variant={accessibility.knownGaps?.length ? 'outline' : 'secondary'}>
				{accessibility.knownGaps?.length ? 'Needs attention' : 'None documented'}
			</Badge>
		</div>
		{#if accessibility.knownGaps?.length}
			<ul class="list-disc space-y-2 ps-5 text-sm leading-relaxed text-muted-foreground">
				{#each accessibility.knownGaps as gap (gap)}<li>{gap}</li>{/each}
			</ul>
		{:else}
			<Text color="muted" as="p" class="leading-relaxed">
				No component-specific upstream gap is documented. This is not a substitute for testing the
				composed experience with keyboard, screen reader, zoom, and forced colors.
			</Text>
		{/if}
	</section>
</div>
