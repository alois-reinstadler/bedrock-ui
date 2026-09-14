# Video Library template

Route: `/templates/video-library`. The shared templates layout supplies Bedrock navigation and the catalogue return link. The template supplies its own fictional Frame product toolbar, not another Bedrock header.

## Scope and interactions

Ten fictional titles, four horizontal category rails, featured title, local watchlist, title/genre/full-text search with an empty state, details dialog and playback dialog. Mobile navigation collapses independently of the shared site header. Search and saved collections use responsive grids; discovery rails keep fixed-width cards.

All titles, summaries and CSS poster artwork are original local demo content. Every title deliberately uses the existing `/demo/clip.mp4` sample and `/demo/clip.en.vtt` captions; the player explicitly discloses this. There is no external catalogue, media dependency, authentication, purchase flow or storage service. Watchlist state lasts for this page visit.

## Public Bedrock APIs consumed

Avatar, Badge, Button, Dialog, Heading, Icon, IconButton, Input, ScrollArea, Text and VideoPlayer. There are no block dependencies. Imports use `#lib/bedrock/ui/<slug>`. Template-specific PosterArt and VideoCard stay inside this route; catalogue metadata is a small local module. No dependencies added.

## Accessibility and motion decisions

- `/` focuses search outside editable controls and dialogs. It never steals a player's keyboard input.
- Search result counts and watchlist updates have a polite status region.
- View switches focus the main content. Documentary navigation first restores discovery, then focuses and scrolls its section.
- Dialog uses Bedrock focus containment and Escape handling, with explicit focus restoration because openings use programmatic buttons rather than Dialog.Trigger.
- Watchlist actions remain visible on touch screens and have title-specific labels. Navigation buttons expose pressed state.
- Posters are decorative; visible title buttons and detail actions provide names.
- Player uses existing English captions and Bedrock keyboard-accessible controls.
- Smooth section scrolling is disabled when reduced motion is requested; poster movement is enabled only without that preference.
- Theme surfaces use Bedrock tokens. Abstract poster colors intentionally remain stable in both themes.
- Existing primitive accessibility limitations are not claimed fixed by this template.

## Verification

Focused Playwright coverage lives at `src/routes/templates/video-library/video-library.e2e.ts`: search, details/playback, saved state, mobile navigation, keyboard search, dialog focus return, empty results, and responsive overflow at 390/768/1440 pixels in light/dark with reduced motion.

Production verification and the final shared-shell browser tour are rerun after orchestrator integration. Local verification results are reported with the handoff commit.

Browser evidence (shared Chrome, managed local preview): `/workspace/recordings/bedrock-video/mobile-light.png` and `/workspace/recordings/bedrock-video/desktop-dark.png`. The screenshot MCP rejected filesystem paths, so image responses were saved without altering their content. Console inspection reported no warnings or errors. The owned browser tab was closed after inspection.
