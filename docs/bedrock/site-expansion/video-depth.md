# Video Library depth pass

## Product behavior

- A cinematic still from Signal Above anchors the hero; the same original artwork appears on its card and detail surface.
- Seven category choices filter the actual ten-title catalogue. Search still covers title, description, and genres, with an actionable empty state.
- Watchlist changes persist in this browser. Storage failures leave the current visit usable and disclose the persistence limitation.
- Continue watching is based on actual playback and seeking, replacing fabricated percentages. Resume survives reload, completed films leave the resume list, and individual progress can be removed. Progress flushes on close and page exit as well as native time and seek events, so fast navigation does not depend on a delayed timeupdate.
- Details expose metadata, saved state, playback, and related titles. Moving between details and playback directs focus to the new content; closing returns to the original opener.
- Native media setup listeners attach through the public VideoPlayer API and are removed when the player unmounts. There is no automatic playback or sound. Source-element failures are captured in the template, which exposes a keyboard-accessible reload action that remounts the player.
- Internal detail/playback changes use Bedrock motion duration and easing tokens, with reduced-motion support.

## Original media provenance

All artwork and both films were authored specifically for this repository using mathematical landscape compositions. No third-party footage, catalogue artwork, trademarks, or downloaded source material was used. The deterministic renderer is preserved at `static/templates/video-library/render-films.py`; it uses the already available Python, NumPy, and ffmpeg tools and adds no project dependency.

| Film         | Composition                                                                                   | Encoding                       | Duration   | Video size    |
| ------------ | --------------------------------------------------------------------------------------------- | ------------------------------ | ---------- | ------------- |
| Signal Above | A moving light crosses an aurora sky above four layered mountain ridges, warming toward dawn. | H.264, 960×540, 24 fps, silent | 24 seconds | 403,444 bytes |
| Paper Suns   | Folded lanterns rise through a warm sky above five drifting dune layers and a rising sun.     | H.264, 960×540, 24 fps, silent | 24 seconds | 426,688 bytes |

Both videos, posters, and captions total **866,050 bytes**, below the 8 MB asset budget.

JPEG posters are extracted from each film at twelve seconds. Optional English WebVTT tracks describe the visual progression; there is no speech requiring transcription. MP4 metadata is placed at the beginning for progressive playback. Images and clips are local; video is only requested when the playback surface opens.

The remaining eight titles are fictional catalogue entries. Their player explicitly identifies the original sample short being shown and states that no full-length video exists. Their mock runtimes are not presented as the actual sample duration.

## Bedrock consumption

Reuses Avatar, Badge, Button, Dialog, Heading, Icon, IconButton, Input, ScrollArea, Text, and VideoPlayer. No public component API, block, shared navigation, global template registry, frozen shadcn file, or dependency was changed.

## Verification

- `pnpm check`: zero errors and warnings.
- Changed-file Prettier and ESLint pass.
- Svelte MCP documentation consulted; both changed Svelte files pass svelte-autofixer with zero issues and suggestions.
- Both encoded clips verified with ffprobe as 24-second H.264 films; original poster frames visually inspected.
- Production build passes.
- Focused production Playwright suite: **26 passed in 21.7 seconds** (13 cases repeated twice), including real playback of both films, keyboard seeking, immediate close/reload resume, persisted watchlist, categories, failed-source recovery, focus return, and 390/768/1440px light/dark reduced-motion layouts.
- Normal Chrome browser tour: no console warnings/errors, no failed media/poster/caption requests; video byte ranges return 206 and images/captions return 200. Mobile player verified at 390px with no horizontal overflow.
- Browser-verified detail transition: 0.23 seconds with the Bedrock enter easing. Owned browser tab closed after the audit.
- Screenshots: `/tmp/bedrock-video-desktop.png` and `/tmp/bedrock-video-player-mobile.png`.
- Managed production preview: `http://127.0.0.1:4077/templates/video-library` for tools; `http://100.64.0.2:4077/templates/video-library` for the user. Slug: `bedrock-video-depth`.

The initial blocked-media test exposed the nested-source error gap and now passes through the template recovery surface. The immediate seek/close/reload regression exposed delayed native timeupdate delivery; synchronous close/page-exit flushing fixes it. After any rebuild, restart the owned managed preview so its asset index matches the current hashed files.
