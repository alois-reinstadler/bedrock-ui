<script lang="ts">
	import { Heading } from '#lib/bedrock/ui/heading';
	import { Outline } from '#lib/bedrock/ui/outline';
	import { Text } from '#lib/bedrock/ui/text';

	const items = [
		{ id: 'outline-introduction', label: 'Decision', level: 1 },
		{ id: 'outline-installation', label: 'Scope', level: 2 },
		{ id: 'outline-usage', label: 'Rollout', level: 2 }
	];
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Project proposal navigation</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Use a local outline for a long document so readers can jump between its decision, scope, and
			rollout plan.
		</p>
	</header>

	<div class="grid gap-6 sm:grid-cols-[11rem_1fr]">
		<Outline {items} class="w-44 shrink-0" />
		<div class="min-w-0 space-y-4">
			<Heading level={2} visual={4} id="outline-introduction">Decision</Heading>
			<Text as="p">Give every project a named owner so decisions do not disappear into chat.</Text>
			<Heading level={3} visual={5} id="outline-installation">Scope</Heading>
			<Text as="p"
				>Begin with active projects. Archived work remains available without requiring ownership
				changes.</Text
			>
			<Heading level={3} visual={5} id="outline-usage">Rollout</Heading>
			<Text as="p"
				>Invite one pilot team this week. Review support requests before expanding to the full
				workspace.</Text
			>
		</div>
	</div>
</section>
