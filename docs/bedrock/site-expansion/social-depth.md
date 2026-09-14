# Social Network depth pass

Mosaic now has distinct discovery and profile surfaces alongside its feed, circles, saved notes, threads, and notifications. All people, content, and original SVG illustrations are fictional and local.

## Interaction decisions

- Primary screens use the `view` query parameter. Threads use `thread`; profile sheets use `profile`. Browser back/forward and reload preserve these destinations. Unknown view values fall back to Home; unknown profiles do not open a sheet. Static rendering never reads query parameters before hydration.
- Primary navigation closes profile/thread surfaces and moves focus to the screen heading. Internal screen entrances use Bedrock motion tokens, with explicit reduced-motion overrides. Existing replies respect the Svelte reduced-motion preference.
- Profile fields are staged until Save. Saving updates the profile, current author identity, and previously published local notes. Your own profile cannot be followed.
- The composer retains text drafts in local storage until publication. Storage failures preserve an in-memory draft. Optional original field-map artwork requires an editable nonempty image description. Published notes, profile changes, follows, replies, reactions, and moderation remain in memory; reloading resets them to the fictional seed data. No remote message or post is sent.
- Saving notes feeds the Saved screen. Hiding any note removes it from all feeds, with an explicit Undo action. Replies and appreciation/repost counts update visibly.
- Notifications support unread filtering, individual read state, mark-all-read, and an empty state after catching up.
- Discovery exposes suggested people on mobile as well as desktop. Search filters people, content, and topics; circle feeds reflect actual follow state.

## Public Bedrock APIs consumed

Avatar/AvatarFallback, Badge, Button, Card, IconButton, Input, ScrollArea, Separator, Sheet, Textarea; shared ThemeToggle remains the site theme control. No component library, frozen shadcn, shared layout, navigation registry, or dependencies changed. No shared blocks are consumed.

## Original media

`static/templates/social-network/field-map.svg` is a garden gathering map. `margins.svg` is an editorial spread created for the fictional independent publisher. Both are local, lazy-loaded in the feed, and have meaningful text alternatives. No third-party artwork, brands, or media requests.

## Verification

- `pnpm check`: 0 errors, 0 warnings.
- Svelte MCP autofixer: no issues or suggestions for the changed Svelte page.
- Changed Svelte/TypeScript Prettier and ESLint: pass; Markdown Prettier: pass.
- `pnpm build`: pass (existing adapter API deprecation and tool color-environment warnings remain).
- `DEV_LOCAL_URL=http://127.0.0.1:4081 pnpm exec playwright test src/routes/templates/social-network/social-network.e2e.ts --workers=1`: 6 passed in 21.5 seconds, including original regression coverage and three new depth tests.
- Production Chrome MCP tour: 1440×1000 desktop light, 390×844 mobile dark, and 834×1112 tablet light; profile heading receives focus after navigation, discovery following updates visibly, no horizontal page overflow, no console errors/warnings, original image requests return 200. The suite also covers reduced motion and browser history.
- First test run identified input before hydration. Search and draft inputs now remain disabled until mounted, preventing lost input; the rerun passed all tests.
- Preview: http://100.64.0.2:4081/templates/social-network (manager slug `bedrock-social-depth`). Preview restarted after the final build.
- Screenshots: `/tmp/social-depth-desktop-light.png`, `/tmp/social-depth-profile-light.png`, `/tmp/social-depth-mobile-dark.png`, `/tmp/social-depth-tablet-light.png`. Root may copy these into the final combined audit.
- Verification logs: `/tmp/social-depth-check.log`, `/tmp/social-depth-build.log`, `/tmp/social-depth-e2e.log`.

All changes are scoped to this template, its original assets, tests, and this report. No dependency changes, pushes, publishing, or deployment.
