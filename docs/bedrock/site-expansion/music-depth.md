# Music Player depth pass

Drift is a local listening application with nine playable original instrumental sketches. Playback begins only after an explicit user action.

## Listening and library behavior

- A native `HTMLAudioElement` owns playback, elapsed time, duration, seek, volume, pause, and track-end events. No simulated timer advances the timeline.
- Play errors produce an actionable retry surface. Changing tracks cancels obsolete playback requests; route teardown pauses playback and releases the media source.
- Next/previous, shuffle (excluding the current song), repeat-current-song, queue removal, and play-next work on the real queue. Automatic playback stops at the end of a non-shuffled queue.
- Album saves, liked songs, and recently played tracks are separate collections persisted in this browser. Storage failures keep the current visit usable.
- Home, search, library, liked songs, recently played, and album choice are linked through query parameters. Back/forward and reload preserve the selected screen. Search changes replace the current history entry.
- The compact player expands to show full transport and seeking on mobile. Queue dismissal restores focus to its opener. Search supports Command/Control+K; page-level Space toggles playback and arrow keys seek, without intercepting focused form/control keys.
- Internal screen entrance uses Bedrock motion tokens and is disabled for reduced motion. Color surfaces follow the active theme.

## Media provenance

All nine songs were composed procedurally for this repository using original note patterns. There are no sampled recordings, borrowed melodies, external media services, or third-party artwork. Fictional performer names identify the local catalogue; they do not imply human recordings.

The deterministic generator is `src/lib/templates/music-player/generate-audio.py`. It uses Python standard-library additive synthesis and the installed ffmpeg MP3 encoder. Each sketch layers chord pads, a bell-like melodic phrase, bass, kick, and quiet percussion, with delay and fade-in/fade-out. Durations range from 30.8 to 36.3 seconds. Nine mono 64 kbit/s MP3 files total **2,446,069 bytes**, below the 3 MB limit. Original SVG cover art is generated from the same catalogue.

Reproduce from the repository root:

```sh
python3 src/lib/templates/music-player/generate-audio.py
pnpm exec prettier --write static/templates/music-player/*.svg
```

The generator and assets were authored for this repository; no third-party media license or attribution is required. No dependency was added. Browser requests load audio by URL; tracks are not bundled into JavaScript. Only the first track's metadata is preloaded before interaction.

## Public Bedrock components consumed

Avatar/AvatarFallback, Badge, Button, Icon, IconButton, Input, and ScrollArea. Native audio and labeled range inputs provide the browser media contract and keyboard-operable seeking/volume controls. No reusable blocks are consumed.

## Verification

- `pnpm check`: 0 errors and 0 warnings.
- Changed Svelte file: Svelte MCP autofixer reports no issues or suggestions.
- Changed TypeScript/Svelte files: ESLint passes.
- Python generator: standard-library AST syntax validation passes; all audio assets generated successfully.
- Production build: passes with static prerendering. Query screens initialize after hydration and synchronize explicitly on popstate to avoid stale shallow-navigation content.
- Scoped production Playwright: **7 passed (12.7 seconds)**. Covers real playback progression, seeking, source changes, repeat, volume, route exit, saved-library reloads, search, mobile expanded transport, queue removal/focus return, media-error retry, tablet inner-scroll widths, and browser Back.
- Shared Chrome inspection: desktop light, tablet dark, and mobile dark; no horizontal overflow, console errors, or failed artwork/media requests. Media responds with HTTP 206 range support.
- Browser screenshots: `/tmp/music-depth-desktop-light.png`, `/tmp/music-depth-tablet-dark.png`, `/tmp/music-depth-mobile-dark.png`.
- Managed production preview: `bedrock-music-depth`, local `http://127.0.0.1:4079`, user `http://100.64.0.2:4079`.
