# Bedrock Foundations

> **Status:** Planning contract. The tokens and components described here are proposed foundations, not evidence that an implementation exists. Each API must graduate through the maturity ladder defined by the Bedrock roadmap before product use.

## Purpose

Bedrock foundations provide the smallest semantic vocabulary from which application patterns can be composed. They establish shared meaning for visual tokens, responsive behavior, accessibility, motion, and localization without exposing arbitrary styling knobs through every component.

The foundations have three layers:

1. **Primitive values** are implementation details such as color values, lengths, font metrics, shadows, and timings.
2. **Semantic tokens** describe intent such as `text.muted`, `surface.raised`, or `space.component.gap` and may resolve differently by color scheme, density, or viewport context.
3. **Component roles** consume semantic tokens and expose a constrained API such as `Text role="body"` or `Stack gap="content"`.

Product code should consume component roles first and semantic tokens only when composition requires them. Primitive values must not be part of a public component contract.

## Foundation principles

- **Meaning over appearance.** Names describe the role of a value, not its current hue, pixel size, or Tailwind class.
- **Constrained composition.** Foundations cover common semantic choices without becoming general CSS-prop components.
- **Accessible by default.** Focus, contrast, target size, semantic HTML, reduced motion, and zoom/reflow are part of each contract.
- **Context-aware.** A semantic token may adapt to color scheme, density, container size, writing direction, or user preferences without changing component APIs.
- **Composable, not duplicative.** Larger patterns such as `AppShell`, `FormLayout`, and `DataTable` must compose foundations rather than recreate their behavior.
- **No false maturity.** Generated component availability does not imply a Bedrock foundation or hardened Bedrock component.

## Token taxonomy

The exact token names and values require an implementation decision record. The categories and semantic obligations below are normative.

### Color

Color tokens must be role-based, themeable, and tested as combinations rather than isolated swatches.

| Family              | Required roles                                                                                                     | Contract                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Surface             | canvas, base, subtle, raised, overlay, inverse                                                                     | Establishes background hierarchy. A surface token must identify compatible text and border roles.                                                            |
| Text                | primary, secondary, muted, disabled, inverse, link                                                                 | Represents information hierarchy, not raw gray steps. Disabled text must not be the only disabled cue.                                                       |
| Border              | default, subtle, strong, interactive, disabled                                                                     | Separates structure and controls. Focus is not represented by a border token alone.                                                                          |
| Accent              | default, emphasized, muted, contrast                                                                               | Supports brand and primary interaction roles while preserving foreground contrast.                                                                           |
| Status              | neutral, info, success, warning, danger; each with surface, text, border, and icon roles                           | Status cannot be communicated by color alone. Components pair it with text, iconography, or semantics.                                                       |
| Interaction overlay | hover, pressed, selected, disabled                                                                                 | Layers over or resolves against a base surface. Overlay tokens must define behavior in light, dark, and forced-colors contexts.                              |
| Data visualization  | ordered categorical series, sequential scale, diverging scale, positive, negative, reference, grid, and annotation | Series must remain distinguishable beyond color where the chart permits it. The palette must be evaluated for contrast and common color-vision deficiencies. |

Interaction overlays describe state, not new permanent surfaces. Selected and disabled styles must remain distinguishable from hover and pressed states. Forced-colors behavior must be specified by any component that relies on an overlay.

### Spacing and density

Spacing uses a finite scale with semantic aliases for at least:

- inline icon/text spacing;
- control internal padding;
- tightly related content;
- component gaps;
- section gaps;
- page gutters;
- panel and page padding.

Density is a contextual mode, not an arbitrary multiplier. Initial modes should be `comfortable` and `compact`; a third mode requires a demonstrated product need. Density may alter spacing, control height, and table row height, but it must not reduce readable type, focus visibility, or pointer target behavior below the accessibility contract. Components inherit density from their nearest provider and may opt out only when their contract explains why.

### Control sizes and tap targets

Controls use named sizes such as `sm`, `md`, and `lg`, with `md` as the default unless a component contract states otherwise. A size coordinates control height, horizontal padding, icon size, label typography, and inter-control gap.

Visual size and interactive target size are separate concepts. Compact controls may retain a larger hit area when their layout permits it. Every interactive component contract must state:

- minimum pointer target and spacing assumptions;
- keyboard focus area;
- icon-only target behavior;
- whether dense data surfaces have an approved exception and how that exception is mitigated.

Exact sizes are token decisions and must be validated before becoming stable API.

### Typography

Typography tokens combine family, size, weight, line height, and tracking into semantic roles. Required roles are:

- display;
- page title;
- section heading;
- subsection heading;
- body;
- body strong;
- compact body;
- label;
- helper text;
- code;
- numeric/tabular data.

Heading level and visual role are independent. A `Heading` may render a visually modest role while preserving the correct document outline. Components must not choose heading levels on behalf of an unknown page context.

Typography must remain legible at 200% text zoom and 400% page zoom. Truncation is opt-in, must expose the full value where necessary, and is inappropriate for essential instructions or errors.

### Radii

Radii express roles rather than a free numeric scale:

- control;
- container;
- overlay;
- pill;
- media;
- none.

Nested surfaces should use coordinated radii. Components expose a radius choice only when product semantics require it; otherwise the component owns the appropriate role token.

### Borders and elevation

Border tokens define width, style, and semantic color for separators, containers, interactive controls, and strong emphasis. Elevation tokens define named layers such as flat, raised, floating, and modal through a combination of shadow, border, and surface—not shadow alone.

Elevation communicates spatial relationship and must be consistent with the layer taxonomy. Dark mode and high-contrast modes may use different combinations to preserve boundaries. Consumers must not infer stacking order from shadow strength.

### Focus treatment

Bedrock uses one recognizable focus treatment across interactive components. Tokens must cover ring color, width, offset, and contrast surface. The treatment must:

- be visible for keyboard focus using `:focus-visible` where appropriate;
- remain visible against every supported surface and in forced-colors mode;
- not depend on color alone;
- not be clipped by component overflow without a documented alternative;
- remain distinct from selected, error, hover, and active states.

Components may add an internal focus style for composite widgets, but they may not remove the global focus affordance without providing an equivalent.

### Layers and z-index

Layer tokens describe ownership instead of publishing arbitrary z-index values. Required levels are:

- document content;
- sticky content;
- application navigation;
- popover/menu;
- toast/status;
- modal overlay;
- modal content;
- critical/system interruption.

Each portal-based component must name its layer, containing-block assumptions, and nesting behavior. New z-index values require a taxonomy change; consumers must not increment values locally to win stacking conflicts.

### Motion

Motion tokens cover:

- duration roles for instant, feedback, transition, and deliberate movement;
- easing roles for standard, enter, exit, and emphasized movement;
- approved spring presets;
- distance roles for subtle, local, and contextual travel.

The motion contract is authoritative for the FLIP engine, presence attachments, `Swap`, reduced motion, interruption, and performance. Foundation components consume these tokens but must remain semantically correct with animation disabled. Reduced motion may remove, shorten, or replace movement; it must never delay state visibility.

The existing Astryx-aligned presets are the seed vocabulary for M1. They are preserved until
representative fixtures justify a documented change; Bedrock must not normalize or replace their
durations, curves, or spring parameters incidentally while building other foundations.

### Responsive and container behavior

Responsive decisions are based on available space and content pressure, not device labels. Page-level structure may use viewport breakpoints. Reusable components should prefer container queries when behavior depends on their allocated width.

The responsive taxonomy must define:

- content-width and reading-width limits;
- page gutter changes;
- container size thresholds;
- stack-to-inline transitions;
- panel collapse behavior;
- density changes, if any;
- overflow ownership;
- logical properties for left-to-right and right-to-left layouts.

No component may hide essential content solely because a threshold is crossed. Responsive changes must preserve DOM reading order, focus order, landmarks, and accessible names.

## Semantic component APIs

These tables define API direction, not finalized TypeScript signatures. Each component requires its own completed component contract before implementation.

### Content foundations

| Component        | Semantic API                                                                                            | Required behavior                                                                                                                                                                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Text`           | `role` (body, secondary, label, helper, code, numeric), semantic `as`, optional emphasis and truncation | Defaults to a context-appropriate text element, not a heading. Does not expose arbitrary font size, weight, color, margin, or Tailwind utilities as props.                                                     |
| `Heading`        | required or context-provided semantic `level`, independent visual `role`, optional anchor target        | Preserves document outline. Visual styling never determines the rendered heading level.                                                                                                                        |
| `Link`           | destination plus external/download state and emphasis role                                              | Renders a real link for navigation, preserves native browser behavior, exposes a visible focus state, and identifies external behavior accessibly when the product requires it. It is not a button substitute. |
| `Icon`           | icon source/name, semantic size, decorative flag or accessible label                                    | Decorative icons are hidden from assistive technology; meaningful standalone icons require an accessible name. Icon color normally inherits from text.                                                         |
| `VisuallyHidden` | semantic element or snippet content, optional focusable/reveal-on-focus mode                            | Removes content visually without removing it from the accessibility tree. Focusable mode supports skip links and must become visibly usable on focus.                                                          |

`Text` and `Heading` expose semantic roles, not the complete typography token set. Escape hatches such as `class` may exist for layout integration, but relying on them to redefine a component's contracted visuals prevents graduation to hardened status.

### Layout foundations

| Component               | Semantic API                                                                                       | Required behavior                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Stack`                 | `direction`, semantic `gap`, `align`, `justify`, `wrap`, semantic element                          | General one-dimensional composition. It does not expose arbitrary CSS properties.                                                                                                      |
| `HStack`                | semantic `gap`, `align`, `justify`, `wrap`, semantic element                                       | Convenience specialization of `Stack direction="row"`; behavior must not diverge from `Stack`.                                                                                         |
| `VStack`                | semantic `gap`, `align`, `justify`, semantic element                                               | Convenience specialization of `Stack direction="column"`; behavior must not diverge from `Stack`.                                                                                      |
| `Grid`                  | minimum item size or approved column presets, semantic `gap`, `align`, semantic element            | Provides common responsive grids. It must not become a complete CSS Grid DSL. Source order remains meaningful.                                                                         |
| `Center`                | inline and/or block centering, max content width, semantic element                                 | Centers content without assuming full viewport height or changing reading order.                                                                                                       |
| `Section`               | semantic element, spacing role, optional labelled relationship                                     | Creates vertical page rhythm. It renders `section` only when it has an accessible heading/name; otherwise it uses a neutral container.                                                 |
| `Layout` / `PageLayout` | named header, content, optional panel, and footer slots; width, gutter, and panel behavior presets | Owns page regions and responsive composition. It preserves one primary `main` landmark, logical source order, skip-link target, and useful rendering when optional regions are absent. |

`Layout` and `PageLayout` are alternative names pending an API naming decision; only one public canonical name should graduate. `AppShell` will compose this primitive with navigation and utility regions rather than absorb or duplicate its API.

## Localization and internal messages

English is the complete canonical source catalogue for every Bedrock-owned string, including visible labels, accessible names, status announcements, validation wording, empty states, and live-region messages. Catalogue keys are stable semantic identifiers; English prose is data, not a key.

Components must not hardcode internal strings. They resolve messages through the Bedrock catalogue and accept documented overrides where domain language is product-specific. Messages with variables use typed parameters and locale-aware formatting. Concatenating fragments is prohibited because grammar and word order differ across locales.

Additional locale packs, including `de-AT`, may be delivered later without changing component APIs. The host application's locale still determines `Intl` formatting; Bedrock must use explicit locale input rather than ambient assumptions. Until a requested locale pack exists, fallback behavior must be explicit and testable. Shipping product UI in a locale requires the corresponding complete pack, even though English remains the architectural source catalogue.

The catalogue must distinguish:

- visible UI copy;
- accessible-only labels and descriptions;
- live-region announcements;
- validation and status messages;
- formatting patterns for numbers, dates, times, and relative values.

## Theming and customization boundary

Supported customization occurs through documented semantic tokens, named slots/snippets, component variants, and explicitly listed parts. Components must specify which tokens they consume. Raw internal class names and DOM structure are not stable extension points.

A component may permit a `class` for layout participation, but that does not guarantee arbitrary visual overrides. If consumers repeatedly need the same override, it should become a semantic token, supported variant, or product-level pattern.

## Non-goals

The foundation milestone does not:

- rewrite or harden every generated component family;
- claim existing generated Shadcn components satisfy Bedrock contracts;
- provide a general CSS-prop or Tailwind-prop abstraction;
- prescribe product templates, blocks, or machine-readable component discovery;
- implement `AppShell`, `FormLayout`, `DataTable`, or AI/chat components;
- make animation necessary for semantics or comprehension;
- guarantee translation breadth beyond the canonical English catalogue;
- stabilize exact token names or values before visual, accessibility, and product validation;
- replace native HTML semantics with layout components.

Foundations graduate only when a required product pattern exercises them and their component contracts, documentation, and verification gates are complete.
