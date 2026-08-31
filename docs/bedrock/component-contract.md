# Bedrock Component Contract

> **Status:** Planning template. This document defines the evidence required for a component to claim Bedrock maturity. It does not mark any current component as hardened.

## Purpose

Every Bedrock component, from `Text` to `DataTable`, has one authoritative structured contract written before implementation. The contract drives its API, examples, documentation, accessibility behavior, and tests. Generated code or a working demo is not a substitute for a completed contract.

Use the template below in the component's canonical documentation. Delete instructional prompts only after answering them. Write `Not applicable — <reason>` rather than silently omitting a section.

## Maturity ladder

| Level | Name                         | Meaning                                                                                                                     | Minimum evidence                                                                                                  |
| ----- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1     | Generated Shadcn component   | Imported/generated starting point. No Bedrock compatibility or stability is implied.                                        | Provenance and current upstream version are recorded.                                                             |
| 2     | Bedrock compatibility façade | Public import and naming align with Bedrock enough to support migration. Semantics may still follow the upstream primitive. | Supported façade API, deviations, basic type checks, and migration notes are documented.                          |
| 3     | Hardened Bedrock component   | Full contract is implemented and supported as a design-system component.                                                    | All applicable release gates in this document pass, including browser and accessibility verification.             |
| 4     | Product-level pattern        | A validated composition of hardened components for a recurring product workflow.                                            | Named consumers, end-to-end scenarios, content rules, responsive behavior, and product acceptance are documented. |

Graduation is demand-driven. A foundation or real product pattern must require the component; Bedrock does not rewrite all generated families speculatively. Maturity is stated per component and version, never inferred from its directory or export path.

## Contract template

### 1. Identity and status

```md
# <Component name>

- Contract owner:
- Reviewers: design / engineering / accessibility / content
- Maturity: 1 Generated | 2 Compatibility façade | 3 Hardened | 4 Product pattern
- Status: proposed | experimental | stable | deprecated
- Version or review date:
- Required by:
- Replaces or wraps:
- Related decision records:
```

State whether code exists. If it does, distinguish generated, experimental, and stable exports. List unresolved decisions that block graduation.

### 2. Purpose and scope

Answer:

- What user problem does the component solve?
- When is it appropriate?
- When is it inappropriate, and what should be used instead?
- Which responsibilities belong to the component, its parent pattern, and the consumer?
- What are the explicit non-goals?

The purpose must be expressed as behavior or meaning, not merely visual appearance.

### 3. Anatomy

List every named part, whether it is required, and who owns it.

| Part     | Required | DOM/primitive role      | Responsibility | Customizable?        |
| -------- | -------- | ----------------------- | -------------- | -------------------- |
| `<name>` | yes/no   | `<element>` / primitive | `<purpose>`    | token / slot / fixed |

Include relationships between parts, portal boundaries, generated IDs, labels/descriptions, and conditional regions. DOM structure is private unless explicitly declared stable.

### 4. Public API and state model

For each prop, event/callback, binding, context value, export, or method, record:

| API      | Type     | Default   | Required | Controlled?                    | SSR-safe? | Meaning and invariants |
| -------- | -------- | --------- | -------- | ------------------------------ | --------- | ---------------------- |
| `<name>` | `<type>` | `<value>` | yes/no   | controlled/uncontrolled/either | yes/no    | `<contract>`           |

Then specify:

- the smallest valid configuration;
- valid and invalid combinations;
- default behavior;
- controlled and uncontrolled state, including initial/default state props;
- how a component behaves if control changes after mount;
- event ordering and whether events are cancellable;
- update/binding semantics;
- stable versus experimental API;
- deprecation and migration behavior;
- forwarded HTML attributes, refs, and event handlers;
- form participation, names, values, reset, submission, and validation behavior where relevant.

Controlled mode means the consumer owns the source of truth and the component requests changes. Uncontrolled mode means the component owns current state after initialization. A component must not silently mix these modes or mutate controlled state internally.

### 5. Composition, slots, and snippets

Document:

- supported children and nesting;
- named slots/snippets and their parameters;
- required parent/child relationships;
- context providers and consumers;
- trigger/content or root/item composition;
- behavior when optional content is absent;
- whether fragments, multiple children, or `asChild`-style delegation are supported;
- portal ownership and containment;
- escape hatches and their stability;
- unsupported compositions, especially nested interactive controls.

Composition examples are part of the contract. Custom content must not remove required semantics, accessible names, focus handling, localization, or state affordances.

### 6. Semantic HTML

Record the default rendered elements, roles, attributes, and landmark behavior for every part. State when consumers may change an element and which invariants remain mandatory.

Cover:

- native HTML preferred over ARIA emulation;
- heading and landmark relationships;
- list/table/form semantics;
- labels, descriptions, errors, and status associations;
- generated ID strategy;
- DOM and reading order;
- behavior at 200% text zoom and 400% page zoom;
- forced-colors support.

### 7. Accessible name and description

Specify:

- whether an accessible name is required;
- accepted naming sources and their precedence;
- whether visible text must match the accessible name;
- description and error association;
- icon-only and decorative-content behavior;
- development warnings for a missing or ambiguous name;
- localized defaults versus consumer-provided domain language.

Examples must include the minimum accessible invocation. Placeholder text is not a label.

### 8. Keyboard and focus behavior

Provide a key-by-key table for interactive components.

| Input                  | Preconditions | Result       | Focus after result | Native or custom |
| ---------------------- | ------------- | ------------ | ------------------ | ---------------- |
| `<key/pointer action>` | `<state>`     | `<behavior>` | `<target>`         | native/custom    |

Also define:

- initial focus and tab order;
- roving tabindex or `aria-activedescendant`, if used;
- focus entry, movement, wrapping, escape, dismissal, and restoration;
- focus behavior after insertion, removal, disablement, loading, or error;
- pointer and touch equivalence;
- typeahead and text-input conflicts;
- behavior when the invoker disappears;
- whether focus is trapped and why;
- focus-visible and forced-colors treatment.

Native browser behavior should be preserved unless the component implements a recognized composite-widget pattern.

### 9. States and interactions

Describe appearance, semantics, allowed actions, announcements, and transition rules for every applicable state:

| State            | Visual affordance | Semantics/ARIA | Interaction | Announcement |
| ---------------- | ----------------- | -------------- | ----------- | ------------ |
| default          |                   |                |             |              |
| hover            |                   |                |             |              |
| focus-visible    |                   |                |             |              |
| active/pressed   |                   |                |             |              |
| disabled         |                   |                |             |              |
| selected/current |                   |                |             |              |
| loading/pending  |                   |                |             |              |
| error/invalid    |                   |                |             |              |
| success          |                   |                |             |              |
| empty            |                   |                |             |              |

Add component-specific states and a transition table when combinations matter. State must never be communicated by color or animation alone. Distinguish unavailable, read-only, busy, selected, and invalid semantics rather than styling them as synonyms.

### 10. Theme, display modes, and responsive behavior

Specify behavior for:

- light and dark color schemes;
- high contrast and forced colors;
- comfortable and compact density;
- reduced motion;
- narrow containers and supported viewport ranges;
- text zoom, page zoom, and user font changes;
- left-to-right and right-to-left direction;
- long, short, and localized content;
- print, if relevant.

Responsive changes must preserve DOM reading order, keyboard order, accessible names, and essential actions. Motion is progressive enhancement; semantics and state changes must remain complete when it is removed.

### 11. Tokens and customizable parts

List every semantic token consumed by the component and its fallback. Do not list raw primitive values as public API.

| Token/part | Purpose | Default semantic role | Supported override     | Constraints |
| ---------- | ------- | --------------------- | ---------------------- | ----------- |
| `<token>`  |         |                       | theme / variant / slot |             |

Document:

- supported variants and sizes;
- inherited theme/density behavior;
- named slots/snippets or parts that are stable customization points;
- whether `class` and style attributes are forwarded and what they may safely control;
- internal classes and DOM details that are explicitly unstable;
- combinations the design system does not support.

Customization must not bypass accessibility behavior, state visibility, target sizes, localization, or focus treatment.

### 12. Internationalization and content

Inventory every component-owned string, including accessible-only and live-region text.

| Message key      | Canonical English source | Parameters       | Visible/a11y/live | Override allowed? |
| ---------------- | ------------------------ | ---------------- | ----------------- | ----------------- |
| `<semantic.key>` | `<English source>`       | `<typed values>` | `<channel>`       | yes/no            |

The English catalogue is canonical. Components resolve all internal strings through it and never construct sentences from concatenated fragments. Additional locale packs, including `de-AT`, do not change the component API.

Specify:

- fallback behavior for unavailable or incomplete locale packs;
- `Intl` locale and formatting needs for dates, numbers, units, lists, and relative time;
- plural/select grammar and typed interpolation values;
- translator context and length constraints;
- whether product/domain copy must be supplied by the consumer;
- announcement deduplication and timing.

Do not put secrets, raw server exceptions, or untrusted markup into user-facing or announced messages.

### 13. Motion

If the component moves, enters, exits, reveals, swaps, or changes layout, document:

- which Bedrock motion primitive and tokens it uses;
- the semantic purpose of the motion;
- trigger, duration/easing/spring role, and affected properties;
- interruption and retargeting behavior;
- insertion/removal and focus timing;
- reduced-motion behavior;
- scroll and nested-scroll implications;
- SSR/hydration behavior;
- performance limits and unsupported nesting.

Reference the central motion contract rather than restating engine details. If motion is not necessary, state that explicitly.

### 14. Performance expectations

Define a measurable budget appropriate to the component:

- expected and maximum practical instance counts;
- mount, update, and interaction scenarios to profile;
- DOM node and observer ownership;
- layout reads/writes and animation costs;
- client bundle and optional-feature boundaries;
- virtualization or pagination threshold;
- cleanup of listeners, timers, animations, subscriptions, and portals;
- behavior under rapid updates and interrupted work;
- SSR and hydration cost;
- degradation strategy when limits are exceeded.

Avoid unsupported universal claims such as “fast.” Record the fixture, hardware/browser assumptions, measurement method, and threshold. Performance regressions that violate the contract block graduation.

### 15. Examples and composition stories

Required examples are:

1. minimum accessible usage;
2. common/default usage;
3. controlled usage, when stateful;
4. uncontrolled usage, when supported;
5. custom composition using documented slots/parts;
6. loading, empty, error, disabled, and long-content cases as applicable;
7. dark mode, compact density, reduced motion, narrow container, and RTL fixtures as applicable;
8. integration inside the product pattern that required the component;
9. an inappropriate-use example with the recommended alternative.

Examples must use public APIs only. A story is a verification fixture when practical, not decorative documentation.

### 16. Verification matrix

List concrete files/fixtures and assertions. “Covered” is insufficient.

| Layer             | Required coverage                                                                                                                     | Evidence                           |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Type/unit         | prop defaults, state transitions, controlled/uncontrolled rules, utilities, invalid combinations                                      | test file and named cases          |
| Component/browser | rendered semantics, interaction, focus, keyboard, announcements, resizing, hydration, interruption                                    | browser test and target browsers   |
| Accessibility     | automated rules plus manual name/role/value, keyboard-only, focus order/restoration, screen-reader checks where behavior is announced | audit record and known limitations |
| Visual            | supported states, themes, density, zoom, forced colors, responsive containers, long/localized content, RTL                            | snapshots or review fixture        |
| Integration/E2E   | composition in the requiring pattern and critical user paths                                                                          | scenario and route/story           |
| Performance       | agreed instance-count fixture, rapid updates, cleanup, and budget                                                                     | measurements and threshold         |

Tests should assert semantics and outcomes rather than internal DOM that is not contracted. Visual snapshots do not replace interaction or accessibility tests.

### 17. Known limitations and follow-ups

Record each limitation with user impact, workaround, target maturity/milestone, and owner. A limitation is acceptable only if it does not contradict the claimed maturity. Link deferred capabilities to the backlog instead of implying they exist.

### 18. Change policy

State:

- stable public API and customization points;
- experimental surfaces;
- compatibility and deprecation period;
- migration notes required for breaking changes;
- ownership of upstream generated-code updates;
- how contract, docs, examples, and tests are updated in the same change.

## Acceptance and graduation gates

### Level 1: Generated Shadcn component

- [ ] Provenance, generation command/version, and local modifications are recorded.
- [ ] It is labelled generated; no Bedrock stability claim is made.
- [ ] Type checking for the checked-in source passes.

### Level 2: Bedrock compatibility façade

- [ ] Purpose, public façade API, semantic HTML, accessible-name requirements, and known deviations are documented.
- [ ] Public import path and migration behavior are verified.
- [ ] Basic unit/type and browser rendering checks pass.
- [ ] The façade is explicitly labelled compatibility-level, not hardened.

### Level 3: Hardened Bedrock component

- [ ] Every contract section is complete or marked not applicable with a reason.
- [ ] Appropriate/inappropriate use, anatomy, API defaults, state ownership, and composition are approved.
- [ ] Semantic HTML, accessible names, keyboard interaction, focus, and every applicable visual/semantic state are verified.
- [ ] Dark mode, reduced motion, forced colors, density, responsive behavior, zoom, long content, and RTL are addressed.
- [ ] All component-owned strings resolve through the English canonical catalogue; fallback and overrides are tested.
- [ ] Consumed tokens and stable customization parts are documented.
- [ ] Unit/type, browser, accessibility, visual, integration, and performance gates pass at the agreed scope.
- [ ] Examples use only supported public APIs.
- [ ] No unresolved issue contradicts the stable contract.
- [ ] The project-wide required verification baseline is green.

### Level 4: Product-level pattern

- [ ] At least one real consumer and workflow requires the pattern.
- [ ] Every constituent component is hardened or has an approved, time-bound exception.
- [ ] Content, responsive composition, navigation/focus continuity, validation/error recovery, loading, and permissions are tested end to end as applicable.
- [ ] Product analytics or success criteria and operational failure behavior are recorded where relevant.
- [ ] The pattern documents variation boundaries instead of exposing arbitrary assembly.
- [ ] Product, design, engineering, accessibility, and content owners approve the contract.

## Review record

Use a durable table rather than relying on conversation history.

| Date       | Reviewer/discipline | Decision                    | Evidence or unresolved issue |
| ---------- | ------------------- | --------------------------- | ---------------------------- |
| YYYY-MM-DD | `<name/role>`       | approve / changes requested | `<link>`                     |

The component's status changes only when the corresponding gate is complete and its evidence is linked. A later regression returns it to an explicitly tracked at-risk state until the contract is restored.
