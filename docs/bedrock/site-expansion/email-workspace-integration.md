# Integrated Email workspace

Mail, Calendar, and Tasks now share a persistent Lumen app rail on desktop/tablet and compact sticky navigation on mobile. The rail clears Bedrock's sticky header. Query routes remain `/templates/email-client?screen=mail|calendar|tasks`; browser history and direct links retain the existing route contract.

## Workflow and state decisions

- The workspace owns `CalendarEvent[]` and `WorkspaceTask[]`; child screens receive bindable collections. No module-level user state is shared across requests.
- Mail exposes `onCreateTask(subject, context)` and `onCreateEvent(subject, context)` callbacks. Message-to-task creates a dated Mail follow-up, clears prior Tasks filters/search, and focuses the created item. Message-to-calendar opens a prefilled event editor; existing date/time/overlap validation still applies.
- Tasks adds an Important list and accessible star toggles alongside Today, Upcoming, and Completed. Existing task editing, completion, search, due dates, and deletion remain available.
- New messages, replies, and forwards use an inline reading-pane form. Mobile uses the full-width reader pane with a direct Compose control. Composition never creates a dialog or focus trap. Calendar/task editors and attachment previews remain dialogs.
- New composition focuses To; replies focus Message. Back saves a draft; Save draft explicitly saves and exits; Cancel abandons current edits. Opening another message or composer preserves the current composition as a draft first. Sending updates the local Sent folder and conversation history, without sending network email.
- Composition remains mounted while changing productivity screens, preserving entered fields. Drafts, mail edits, events, and tasks are in-memory demo data and reset on reload; screen selection is URL state. This is not a backend, synchronization, or persistent storage implementation.
- Mobile pane visibility no longer participates in a delayed CSS transition. Transform/opacity motion remains token-based, while the destination becomes focusable immediately; reduced-motion handling is retained.

## Verification

- `pnpm check`: 0 errors, 0 warnings.
- Changed TypeScript/Svelte files: ESLint and Prettier pass.
- All four changed Svelte files: Svelte MCP autofixer reports no issues or suggestions.
- `pnpm build`: passed with the existing adapter deprecation advisory.
- Email production E2E: 10 passed in 17.2 seconds. Covers existing mail/calendar/task lifecycle, inline new/reply/forward/draft behavior, filtered Tasks follow-ups, prefilled Calendar events, screen history, and scrolled navigation at 390/768 pixels.
- Repeated mobile focus and inline compose tests: 10 passed in 7.1 seconds, five repetitions per flow.
- Browser checks: 390px dark composition; 768px light calendar; 1440px light compose/calendar/tasks. No horizontal page overflow; compose keyboard Tab moves To → Subject; no duplicate IDs. Calendar navigation produced 102 successful requests and no console warnings/errors. Only the worker's isolated browser tab was used, and it was closed.
- Initial new mobile test exposed that Compose was only in hidden desktop folders. A direct mobile Compose control fixed it; final tests pass.

Preview: http://100.64.0.2:4082/templates/email-client (managed production preview).

Screenshot evidence handed to the orchestrator for the combined audit:

- `/tmp/email-integrated-compose-desktop.png`
- `/tmp/email-integrated-compose-mobile.png`
- `/tmp/email-integrated-calendar-tablet.png`
- `/tmp/email-integrated-calendar-desktop.png`
- `/tmp/email-integrated-tasks-mobile.png` (scrolled navigation)
- `/tmp/email-integrated-tasks-desktop.png`

No new dependencies, package/lock changes, external services, trademarked product branding, or unrelated files.
