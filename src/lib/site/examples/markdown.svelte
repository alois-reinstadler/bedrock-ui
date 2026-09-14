<script lang="ts">
	import { Markdown } from '#lib/bedrock/ui/markdown';

	const content = `## September workspace update

The pilot is ready for **team review**. Start with the [installation guide](/docs/installation) if you are joining this week.

### Ready to review

- [x] Project invitation flow
- [x] Document ownership labels
- [ ] Final mobile keyboard review

> Keep the invitation reversible until the recipient accepts it.

### Next steps

1. Invite two colleagues to the sample workspace.
2. Capture any confusing labels in the review document.
3. Send feedback before Friday.

| Owner | Responsibility |
| --- | --- |
| Mira | Interaction review |
| Theo | Keyboard checks |`;
</script>

<section class="w-full space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Project update from an editor</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Render authored release notes with headings, task lists, links, and quoted decisions.
		</p>
	</header>

	<Markdown {content} />
</section>
