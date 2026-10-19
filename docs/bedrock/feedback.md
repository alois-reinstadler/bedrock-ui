# Feedback

Bedrock's native feedback component is implemented in `src/lib/bedrock/ui/feedback`.
It does not fork, copy, or depend on Agentation or sv-agentation. Those products
informed the interaction concept; the implementation and versioned data model are
owned here.

## Current surface

Import `Feedback` (or its `Root` alias) from `#lib/bedrock/ui/feedback`.
Mount one instance in the application layout. It portals into the document body,
uses a compact dark inspector surface, and never imports SvelteKit from the component library.
The Bedrock documentation site mounts it only in development; the Feedback docs
example mounts its own scoped instance in both development and production.

- `mode`: `developer` (default) or `review`. Review mode omits automatic style
  capture and hides selectors in the UI. Structured exports retain selectors.
- `enabled`: removes the visible tool and inspection listeners when false.
  This is a UI switch, not a security boundary.
- `open`: bindable toolbar state for an application-owned trigger.
- `showLauncher`: defaults to true; set false when supplying an external trigger.
- `trigger`: external element to restore focus to on close.
- `placement`: `bottom-right` by default, or `top-right` to keep the toolbar clear of
  bottom navigation and media controls.
- `annotations`: bindable list; `onChange` receives a detached snapshot after a
  local mutation. Parent-supplied changes are not automatically saved to local storage.
- `project`, `revision`: metadata for exports and submissions.
- `pageUrl`: reactive page identity supplied by the host router. Without it,
  origin/pathname are captured on mount and popstate. Hosts using pushState must
  pass this prop. Query strings, credentials and fragments are excluded by default;
  do not pass secrets in a custom page identity.
- `scope`: CSS selector restricting selectable content. An invalid selector fails
  closed. It does not restrict where the tool is displayed.
- `storageKey`: optional browser drafts, read on mount and saved after local edits.
  Remount with a different key when changing project or reviewer. Browser storage
  is not a shared inbox or an access-control boundary. Supplied nonempty annotations
  take precedence over stored drafts.
- `onSubmit`: optional async delivery callback. A Send feedback button appears only
  when this is configured. Resolve after durable delivery; reject on failure.
  Submission includes all saved notes across pages, including resolved notes.
  Notes remain available after delivery. Deduplicate by annotation ID server-side.

## Interaction

The launcher expands into a small dark toolbar. `I` toggles inspection, the eye
shows or hides markers, Preview notes opens the review list, and Settings holds
JSON export, optional delivery and shortcut help. Drag the handle to move the
bar; arrow keys on the handle also reposition it. Reset toolbar position restores
the configured placement. Position changes last for this mounted session.

Clicking a target opens a compact card beside it. The card flips or clamps to stay
inside the viewport and clear of the toolbar. Enter saves, Shift+Enter inserts a
line, and Escape cancels. Saving resumes inspection when the note began there.
Developer selectors live under Element details. `I` and `C` do not intercept text
entry in inputs or editable content. Motion follows OS and application reduction.

## Customer text suggestions

In customer review mode, select a plain-text heading, paragraph, link or button
and choose **Edit text on page**. Type directly into the selected element. Enter
saves the suggestion, Shift+Enter adds a line, and Escape cancels. A comment is
optional when the text changed. Undo text edit discards just the copy change.
The original page text is restored on save, cancel, close or unmount; suggestions
are not published changes. Original DOM nodes are restored so application event
handlers and framework bindings survive the temporary preview. If the app updates
the original text while editing, its update wins and the transient draft closes.

Saved annotations optionally contain `textChange: { before, after }`. Both strings
are limited to 4,000 characters; an empty `after` proposes removing the text. JSON,
Markdown, browser drafts and submission callbacks retain both versions. Existing
version-1 notes remain compatible. Editing is limited to individual plain-text
leaves; containers with nested markup, groups, inputs and private content keep the
normal annotation flow. Developer mode retains annotation-only controls.

Selection outlines interpolate between hovered elements; drawing a box and
scrolling use immediate geometry. Composer and notes panels animate their real
size as contents change without scaling text. Both follow reduced-motion policy.

## Target capture

In Select element mode, click a target or hold the left mouse button and drag a
box. A live count and outlines show the fully enclosed elements. Release to
compose one note for the group; Escape cancels. Parent elements include their
children without duplicate targets. Empty boxes stay in selection mode, and
selections over 50 elements ask for a smaller box. Scrolling, resizing, losing
window focus or receiving pointer cancellation cancels an in-progress drag.
Touch and keyboard retain single-element selection and page notes.

Drag previews reuse a snapshot of visible candidate geometry, rebuilding it after
observed page mutations or layout changes. Releasing the mouse always performs a
fresh scan before saving the selection. Pointer movement updates the selection
overlay without resolving all saved-note markers again; markers remeasure when
the page geometry or annotation state changes. Inspection observers and listeners
are active only while the feedback panel is open.

Group targets use `kind: 'group'` and an `elements` array of individual element
snapshots, including selectors, text and optional styles. Existing version-1
single-element and page drafts remain supported. JSON and Markdown exports
include each group member; group pins follow the remaining matching elements
and report when any member no longer matches.

Prefer a unique `data-feedback-id` on reviewable sections and controls. The picker
then tries `data-testid`, unique IDs, and finally a unique structural CSS path.
It saves a bounded text excerpt, tag, viewport, capture-time rectangle, timestamps,
and optionally a small style snapshot. It does not inspect Svelte internals or
pretend to know a source file. Exclude private areas with `data-feedback-ignore`.
Inputs, textareas, selects, and editable content are excluded, including their text
when capturing an ancestor. Visible page text can still contain personal data;
the embedding application chooses the review scope and excluded areas.

Pins remeasure on scrolling, resizing, and observed layout mutations while the
panel is open. A thin green outline and an anchor stay visible while composing;
the compact composer opens beside the target and shows its label and type. Hovering or
focusing a saved marker previews its target. They hide when a target disappears or a structural selector no
longer matches its captured text. Stable IDs intentionally survive text changes.
This does not guarantee anchoring through arbitrary document redesigns.

## Customer integration boundary

The template gallery and Feedback example link to all four live templates with
`?feedback=review` or `?feedback=developer`. Both modes are intentionally available
in the published template showcase. The preview dock opens the panel, switches
modes and turns feedback off; it remains usable when the dock is minimized.
Development starts in developer mode. An explicit URL mode takes precedence over
the mode remembered for the current browser tab. Subpage navigation preserves the
selected mode; switching template or mode remounts the tool with its own draft key.
Notes are scoped to template content, excluding preview controls. Exports include
the selected template/mode's notes across its pages. The global developer launcher
does not also mount inside templates.

The review UI, local draft lifecycle, resolve/reopen actions, Markdown/JSON export
and delivery callback are implemented. Shared projects, invited reviewers,
authentication, backend validation, persistence, discussion threads and screenshots
are separate application work. A production customer review service must validate
the submitted project/reviewer against its authenticated session, not trust the
payload's project label. Customer comments are feedback data, not instructions to
run code or deploy changes automatically.

Known limits: no screenshot capture, selected text ranges, iframe
or shadow-root traversal, source mappings, live animation tracking, modal top-layer
integration, or cross-tab merging. The composer and notes preview are nonmodal regions so reviewers can
move between the page and feedback. Its page-note action works without a pointer.

## Verification

Model tests cover draft validation and exports. Browser tests cover selection
without activation, draft persistence, editing/status changes, keyboard input,
route isolation, privacy exclusions, submission failure/retry and unmount cleanup.
Template integration tests in `src/routes/templates/feedback.e2e.ts` cover both
modes on all four templates, separate draft stores, navigation and reloads,
external-trigger focus, gallery links, and minimized controls on mobile.
