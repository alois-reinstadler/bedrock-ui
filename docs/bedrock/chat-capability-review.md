# Chat capability review

Reference reviewed: https://www.beautifului.dev/ (2026-09-29), including its published Chat source.

Beautiful UI has a broader gallery of agent interaction patterns. Its Chat example itself renders one submitted prompt and two scripted replies revealed by timers. Header tabs update selection styling; the three header actions have no handlers in the published example. The Prompt Bar is a separate component. This is a useful interaction/design reference, not evidence of a more complete conversation runtime.

Bedrock already provides draft recovery, multi-file intake and upload states, message editing/retry, selectable feedback, empty/loading/error states, history pagination with anchor preservation, model/reasoning choices, and controlled voice input. Retain these behaviors.

## Additions

- Composer `contexts` / `commands`: @ and / autocomplete at a collapsed caret, arrow navigation, Enter selection, Escape dismissal, selected chips, structured `context` and `command` submission fields. Context chips are explicit selections independent of text. Commands never execute on selection.
- Citation, Sources, SourceCard: inline source previews, expandable references, readable context excerpts, and safe optional links.
- Approval and Questions: explicit decisions, single-choice/custom answers, multiple questions, optional skipping, async locking, rejection recovery.
- Activity: tool/task/public-summary rows or compact chips, status, duration, progress, expandable results and substeps. Apps supply public summaries; no hidden model reasoning is inferred.
- Recommendation: app-provided alternatives and confidence descriptions, explicit acceptance/dismissal.
- ChangeReview: app-computed review units with unified-diff or before/after CodeBlock views, selective application, and async recovery. This does not infer review-unit boundaries or execute patches.
- SelectionActions: selected response text passed to quote/explain/rewrite callbacks, including keyboard-made selections. The consuming app chooses whether to fill a draft or perform an action.

All are opt-in. Capture, transport, retrieval, authorization, execution, and persistence remain application-owned. Use stable item IDs. Key decision/review components by request ID to reset completed state for new requests. Callback rejection retains input; successful decisions stop duplicate submission. Do not replace a live request with a different request under the same identity.

Each workflow has a Preview/Code example with copy feedback. Existing Tabs and Sidebar can compose conversation navigation; application-specific tables, charts, inspectors, and remote screen viewers remain separate primitives.
