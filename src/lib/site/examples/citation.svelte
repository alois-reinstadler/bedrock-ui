<script lang="ts">
	import { Citation } from '#lib/bedrock/ui/citation';
</script>

<section class="w-full max-w-2xl space-y-5">
	<header class="space-y-1">
		<h3 class="text-lg font-semibold">An evidence-backed recommendation</h3>
		<p class="text-sm text-muted-foreground">
			Keep the claim readable and attach a source that readers can inspect independently.
		</p>
	</header>
	<article class="space-y-4 rounded-xl border bg-card p-5">
		<p class="text-xs tracking-wide text-muted-foreground uppercase">Accessibility review</p>
		<h4 class="text-xl font-semibold">Label controls by their purpose</h4>
		<p class="text-sm leading-7">
			Visible labels help people understand what information a form expects.<Citation
				number={1}
				source={{
					title: 'W3C: Labels or Instructions',
					url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html'
				}}
			/>
		</p>
		<p class="text-sm leading-7">
			Our review therefore keeps the email label above the input, even after a value is entered.<Citation
				number={2}
				source={{ title: 'Local review decision: retain visible labels' }}
				variant="number"
			/>
		</p>
	</article>
</section>
