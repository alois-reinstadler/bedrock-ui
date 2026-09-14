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

## Page-by-page example review handoff

Use this follow-up prompt when turning the reviewed guidance into final live examples.
Assign a small, contiguous slug set so every page receives visual and interaction review.

```text
## Task

Finish the Bedrock component documentation pages for [SLUGS] in [WORKTREE]. Read
the corresponding entries in `src/lib/site/component-guides/` before changing an
example. Inspect the public index, implementation, tests, and frozen upstream
implementation where applicable. Do not delegate.

Every rendered page must keep this shared information architecture:

1. Installation — a valid, TypeScript-correct import near the top.
2. Usage — what the component is, what it is not, when to use it, complete anatomy,
   and important behavior. Compound parts must be named and explained individually.
3. Examples — a primary live example followed only by secondary or edge-case examples
   that teach a materially different state, composition, or boundary.
4. A right-hand On this page outline on wide screens, built from the shared Outline
   component and linked to stable section ids.

For every assigned example:

- Decide whether the current scenario actually teaches the primary job recorded in
  `examplePlan`; replace it when it is generic, decorative, incomplete, or misleading.
- Make every shown interaction work. Do not add inert buttons, fake links, unexplained
  controls, or success/error states that cannot be reached.
- Include the minimum realistic data needed to expose layout, state, overflow,
  keyboard, focus, and accessibility behavior.
- Prefer Bedrock Heading, Text, Card, Badge, CodeBlock, Outline, Empty, and other shared
  primitives for documentation chrome. Native article, section, list, dl/dt/dd, and
  form semantics remain native HTML.
- Keep visible documentation copy in English and code identifiers in English.
- Preserve lazy example loading. Do not eagerly import the examples registry or heavy
  dependencies such as LayerChart, PDF.js, Shiki, Formsnap, or Superforms into the
  shared documentation route.

Verification for each slug:

1. Run the Svelte autofixer on every changed `.svelte` file until it reports no issues.
2. Run Prettier, `pnpm check`, and the relevant unit tests.
3. Navigate to the page from another component page (do not only load it directly).
4. Confirm the URL, h1, Installation import, Usage copy, anatomy, and live example all
   update to the selected slug.
5. Exercise every interactive example state, inspect console and network errors, and
   check the right-hand outline at desktop width plus the content at a narrow width.
6. Commit only the assigned examples/tests with `docs: finish [SLUGS] examples`.

Every progress update must use the exact ten-character ASCII bar format. Report 100%
only after browser verification succeeds.
```
