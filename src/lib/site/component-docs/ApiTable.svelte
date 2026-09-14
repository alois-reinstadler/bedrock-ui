<script lang="ts">
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Text } from '#lib/bedrock/ui/text';
	import type { ComponentApiEntry } from '#lib/site/component-guides/index.js';

	let { entries }: { entries: ComponentApiEntry[] } = $props();
</script>

<div class="overflow-x-auto rounded-xl border bg-card">
	<table class="w-full min-w-[46rem] border-collapse text-left text-sm">
		<thead class="bg-muted/40 text-xs tracking-wide text-muted-foreground uppercase">
			<tr>
				<th scope="col" class="px-4 py-3 font-medium">Name</th>
				<th scope="col" class="px-4 py-3 font-medium">Type</th>
				<th scope="col" class="px-4 py-3 font-medium">Default</th>
				<th scope="col" class="px-4 py-3 font-medium">Description</th>
			</tr>
		</thead>
		<tbody class="divide-y">
			{#each entries as entry (`${entry.kind}-${entry.name}`)}
				<tr class="align-top">
					<th scope="row" class="px-4 py-4 font-normal">
						<div class="flex flex-wrap items-center gap-2">
							<code class="font-code font-medium text-foreground">{entry.name}</code>
							<Badge variant="outline">{entry.kind}</Badge>
							{#if entry.required}<Badge>Required</Badge>{/if}
						</div>
					</th>
					<td class="px-4 py-4"><code class="font-code text-xs">{entry.type}</code></td>
					<td class="px-4 py-4 text-muted-foreground">
						{#if entry.default}<code class="font-code text-xs">{entry.default}</code>{:else}—{/if}
					</td>
					<td class="max-w-md px-4 py-4">
						<Text color="muted" as="p" class="leading-relaxed">{entry.description}</Text>
						{#if entry.sourceUrl}<a
								class="mt-2 inline-block text-xs underline underline-offset-4"
								href={entry.sourceUrl}>Installed type declaration</a
							>{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
