# Email productivity workspace

The Email template now includes three full screens: Mail, Calendar, and Tasks. The screen is linkable through `?screen=mail`, `?screen=calendar`, or `?screen=tasks`. Internal navigation uses SvelteKit query navigation, keeps local edits while switching screens, and moves focus to the destination heading. Browser history restores the selected screen. Invalid screen names fall back to Mail.

## Mail

- Fictional inbox conversations include previous replies; a local reply appends to its conversation and appears in Sent.
- Forward pre-fills the subject and quoted content. Save draft stores an editable local message in Drafts.
- Existing search, folder navigation, unread/starred filtering, selection, bulk actions, attachment preview, and mobile reading transitions remain.
- Archive offers an explicit undo action. Search checks the complete message body and the reading pane follows the filtered result set.
- No message is sent outside the page. Reload resets local content.

## Calendar

- Bedrock Calendar supplies month navigation, keyboard day selection, and event indicators. The selected day's agenda and upcoming events sit alongside the month.
- Today returns to the explicitly documented demo date, 14 September 2026. Times are labeled Europe/Vienna.
- Add, edit, and delete events with title, date, start/end times, category, location, and notes.
- Native required input constraints and explicit end-time/overlap checks reject invalid entries with announced feedback.
- Bedrock DateInput supplies segmented date editing. Dialog closure restores focus to the Calendar heading.

## Tasks

- Create, edit, complete, reopen, and delete tasks with due dates, project names, and notes.
- Today includes overdue items; Upcoming shows later incomplete work; Completed provides a separate history.
- Search filters title and project; counts, completion progress, status messages, and useful empty states stay current.
- DateInput and Dialog preserve the same date-editing pattern as Calendar. Dialog closure restores focus to the Tasks heading.

## Composition and boundaries

Reuses public Bedrock Avatar, Badge, Button, Calendar/Day, Checkbox, DateInput, Dialog, DropdownMenu, Icon, IconButton, Input, InputGroup, Label, Progress, ScrollArea, Separator, Sheet, and Textarea. No blocks are consumed. New screen components and mock data are isolated under `src/lib/templates/email-client` instead of growing the mail component into a three-screen monolith.

No external artwork, network services, backend mutations, new dependencies, or frozen shadcn changes. Existing attachment preview is illustrative text, not a real third-party PDF. Screens use theme tokens, responsive layouts, and motion timing tokens with reduced-motion overrides.

The static build reads the screen query after mount, avoiding SvelteKit's prerender restriction on `url.searchParams`. The initial HTML is the default Mail screen; the linked screen is selected during hydration. Local state is intentionally session-only and is not represented as durable storage.

## Verification

`pnpm check`: zero errors and warnings. Production build passes. Changed-file Prettier and ESLint pass. All five changed Svelte files pass Svelte MCP autofixer with no issues or suggestions.

Production Playwright: **7 passed (13.2 seconds)** at `http://127.0.0.1:4078`. Focused E2E covers event conflict/create/edit/delete and month navigation, task lifecycle and mobile screen history, reply/forward draft/archive undo, plus the original mail and mobile-focus tests and a browser Back/Forward regression with an event editor open.

Shared Chrome browser tour checked 390px mobile, 768px tablet, and 1440px desktop; light/dark screenshots, heading focus, Calendar selection, and screen transitions. Final inspected pages had no console errors or failed resources, and no horizontal document overflow. The mobile E2E also exercises reduced motion.

Screenshots in `static/templates/email-client/`: `tasks-mobile-dark.png`, `calendar-desktop-light.png`, and `mail-desktop-dark.png`. User preview: `http://100.64.0.2:4078`.

Implementation checks caught and fixed static-prerender query access and nonreactive shallow screen navigation. The installed SvelteKit 3 prerelease uses `goto(url, { reset: false })`; this was verified against its installed `GotoOptions` type, since stable MCP documentation still shows the SvelteKit 2 option names. The managed production preview was restarted after rebuilding to avoid stale manifest/asset references.

Inactive screens cannot handle mail keyboard shortcuts or show portaled dialogs. Navigation clears inactive modal state; the regression test proves Back/Forward does not leave or reopen the event editor. Calendar arrow-key selection plus Enter was also exercised in shared Chrome, updating the selected-day agenda correctly. All owned browser tabs were closed after verification.
