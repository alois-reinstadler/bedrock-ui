<script lang="ts">
	import { Markdown } from '#lib/bedrock/ui/markdown';

	const content = `# Rendering markdown

Bedrock renders markdown **safely** through its own components — raw HTML is
shown as escaped text, never injected [guide]. Inline \`code\` and
[links](https://example.com) map onto Bedrock primitives.

## Checklist

- Headings receive stable, deduped ids
- Ordered and task lists are supported
- [x] Lexer-only \`marked\` usage
- [ ] Component override prop (backlog)

\`\`\`ts
import { Markdown } from '#lib/bedrock/ui/markdown';
\`\`\`

> Blockquotes, tables, and separators render through the same families used
> everywhere else in the system.

| Token | Component |
| --- | ---: |
| heading | Heading |
| code | CodeBlock |`;
</script>

<Markdown
	{content}
	sources={{ guide: { title: 'Markdown guide', url: 'https://example.com/markdown' } }}
/>
