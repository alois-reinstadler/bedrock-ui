# Social Network template

Route: `/templates/social-network`. Mosaic is a fictional community for creative work and neighborhood observations. All identities, copy, and CSS field-map artwork are original local fixtures; there are no external assets or services.

## Components consumed

Public Bedrock imports: Avatar/AvatarFallback, Badge, Button, Card, IconButton, Input, ScrollArea, Separator, Sheet, and Textarea. No blocks are required. The shared template layout supplies global navigation and catalogue return. The template's own toolbar is application navigation.

## Interactions and contracts

- Compose a note with a 320-character limit, optional original sample field-map attachment, disabled empty submission, and polite success announcement.
- Filter notes by text, person, or topic. Latest/popular buttons reorder results; saved, circle, and own-profile views filter them. Empty views explain recovery.
- Toggle appreciation, repost, and saved state with accessible pressed state.
- Expand conversations and submit replies with Enter or a labeled send button.
- Open author profiles in focus-managed Bedrock Sheets and follow/unfollow people.
- Mark notifications read, with the unread count updating immediately.
- Mobile navigation uses a Sheet plus compact bottom controls. Tablet uses the full-width feed; desktop adds navigation and discovery rails.

All changes are local in-memory demonstrations and reset on reload. There is no authentication, upload pipeline, moderation, or production persistence. “Attach sample field map” deliberately describes its actual behavior.

## Accessibility decisions

Controls have visible focus, labeling, and pressed/expanded state where applicable. Composer and reply fields have explicit labels. Sheets use the existing public focus trap and Escape behavior. Thread motion respects `prefersReducedMotion`; CSS interactions respect the reduced-motion media query. Both themes use Bedrock semantic tokens. Frozen Avatar internals retain their existing upstream contrast limitations; this template does not claim to fix them.

## Verification

Focused Playwright tests are colocated as `social-network.e2e.ts`: publishing, reactions, threads, mobile notifications, search empty state, reply submission, profiles, and read state. Production browser execution and final shared-shell screenshots follow orchestrator integration. Changed-file ESLint and Prettier pass; Svelte autofixer reports zero issues and zero suggestions.

Final isolated `pnpm check`: 0 errors, 0 warnings. `pnpm build` compiled the application but failed prerender because the shared `/docs/templates` route does not yet exist in this worktree. This is an integration prerequisite; no prerender suppression or shared configuration changes were made. The focused E2E suite has not yet been executed, and visual browser evidence remains pending integration.
