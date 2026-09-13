# Component documentation page handoff

Use this prompt unchanged for every Bedrock documentation category. Replace the
bracketed values before handing it to a worker.

```text
## Task

Audit and author the documentation guidance for every [CATEGORY] component in
Bedrock. Work only in [WORKTREE]. Your assigned slugs are:

[SLUGS]

For each slug, inspect all of the following before writing:

1. `src/lib/bedrock/ui/<slug>/index.ts` and every component it exports.
2. The Bedrock implementation and, where it is a facade, the underlying frozen
   shadcn implementation.
3. `src/lib/site/examples/<slug>.svelte`.
4. Relevant tests and any component contract in `docs/bedrock/`.

Populate only `src/lib/site/component-guides/[CATEGORY].ts`. Do not modify the
shared schema, registry, page renderer, examples, components, or other category
files. Do not delegate. Do not commit generated build output.

## Required content for every component

- `purpose`: two or three concrete sentences explaining what the component is
  and the user problem it solves. Do not repeat the one-line registry summary.
- `useWhen`: two to four specific situations where this component is the right
  choice.
- `avoidWhen`: two to four boundaries explaining what it is not and which
  neighboring primitive to use instead.
- `anatomy`: every public compound export users compose, using the names shown
  by the namespace import (`Card.Root`, `Card.Header`, and so on). Explain each
  part's responsibility and mark structurally required parts. For a single
  component, document that component by its public name.
- `behavior`: important keyboard, focus, overflow, responsive, state, or
  accessibility behavior that is not obvious from the anatomy. Omit only when
  there truly is nothing useful to say.
- `examplePlan`: critique the current example through the plan you write. Include
  one `primary` example that teaches the normal use, then only the `secondary`
  and `edge-case` examples needed to reveal meaningful variants, composition,
  states, or failure boundaries. Each entry must say exactly what it demonstrates.

## Quality bar

- Describe the implementation that exists, not an imagined API.
- Use plain English, active voice, and product scenarios rather than filler.
- Distinguish semantic components from merely visual containers.
- Call out controlled/bindable state, snippets, required providers, portal
  behavior, and accessibility ownership where relevant.
- Never say “use this to display content” or similarly circular copy.
- Do not invent props, exports, guarantees, or examples.
- Do not copy upstream documentation verbatim.
- Keep each bullet independently useful and concise.

## Acceptance

- Every assigned slug has exactly one guide entry.
- Every public export in each assigned `index.ts` is accounted for in anatomy,
  except aliases; aliases should be mentioned with their canonical export.
- The file passes Prettier and TypeScript checking against the shared schema.
- Run `pnpm exec prettier --check` on the assigned file.
- Commit the result with `docs: author [CATEGORY] component guides`.

## Progress updates

Every progress update must use the exact ten-character ASCII bar format, for
example `[####------] 40% Auditing component anatomy`. Finish at 100% only after
the assigned file has been verified and committed.
```

The renderer owns visual consistency. Category workers own factual accuracy and
example intent. A later example pass may alter live demos, but it must preserve the
teaching goal recorded in each guide rather than merely making the preview busier.
