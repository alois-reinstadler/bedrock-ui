# Music Player template

Route: `/templates/music-player`. The shared template layout supplies the site header and catalogue return link.

A fictional catalogue of nine songs and four collections powers an album view, searchable track list, library, liked songs, queue and compact mobile player. Search matches song, artist and album. Album playback replaces the queue; individual tracks join it. Playback is an explicitly labeled local simulation, with elapsed time, seeking, previous/next, shuffle, repeat and mute. No copyrighted audio, remote artwork or external service is required. Artwork is original CSS geometry.

## Public dependencies

Bedrock Avatar / AvatarFallback, Badge, Button, Icon, IconButton, Input and ScrollArea. No blocks or added packages. All data lives in `src/lib/templates/music-player/data.ts` and is route-local; no assets are imported by other templates.

## Accessibility decisions

Native labeled range inputs provide keyboard seeking and volume controls. This deliberately avoids relying on the upstream Bits Slider thumb-labeling gap without changing that primitive. Buttons preserve native Space behavior; playback shortcuts ignore interactive targets. Command/Control-K focuses search. The off-canvas queue uses visibility to keep hidden controls out of keyboard navigation. It is a non-modal complementary region: other content remains available. Escape closes it. Playback does not move focus. Pressed states communicate shuffle, repeat and collection saving. An announced status reports queue additions. Reduced motion disables spatial movement and smooth scrolling. Token surfaces follow the site's light/dark mode.

## Verification

Focused Playwright coverage lives beside the route in `music-player.e2e.ts`: desktop search, empty state, playback, next track, native Space activation, range keyboard control, liked songs; mobile playback, queue dismissal, volume and horizontal overflow under dark/reduced-motion preferences. Integration must execute these against the complete production site and capture browser evidence.
