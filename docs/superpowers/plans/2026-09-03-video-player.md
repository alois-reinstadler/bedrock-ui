# Bedrock VideoPlayer — proposal

Date: 2026-09-03 · Status: proposed (not scheduled) · Owner: pending review
Context: deferred from the 2026-09-01 component expansion (backlog §8). This
document is the decision basis; nothing here is implemented.

## 1. Purpose and scope

A media surface for product content: feature walkthroughs, support recordings,
attachment previews in Chat/Lightbox, and documentation clips. It is NOT a
streaming platform player — no ads, no DRM, no playlists, no engagement
overlays. Astryx has no video component; this is a Bedrock-native design bound
by the component contract, ERP interaction standards (44px targets,
keyboard-first), and the motion system.

Anatomy (proposed): `VideoPlayer.Root` (figure + context), `Video` (the
element), `Controls` (bar), `PlayButton`, `Scrubber`, `TimeDisplay`,
`VolumeControl`, `CaptionsToggle`, `SettingsMenu` (rate/quality),
`FullscreenToggle`, `PipToggle`, plus a data-driven `<VideoPlayer>` facade
composing all of it (the Selector/Combobox relationship, inverted: facade
first, parts exported for composition).

## 2. Native versus custom controls

| Option                                                               | For                                                                            | Against                                                                                                                                                |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A. Native `controls` attribute                                       | Zero code, perfect platform semantics, free PiP/fullscreen/captions UI         | Unstylable, inconsistent across browsers, no design-token integration, no 44px guarantee on desktop Chrome's tiny targets, no labels-prop localization |
| B. Fully custom controls over the media element API                  | Token-styled, localizable via `labels`, testable, consistent                   | Must re-implement keyboard map, buffering states, captions menu, error surfaces; more a11y risk, more code                                             |
| C. Hybrid: custom controls by default, `nativeControls` prop opt-out | Product surfaces get the design system; embeds/mobile edge cases can fall back | Two paths to test                                                                                                                                      |

**Recommendation: C.** Custom controls are the point of having a design-system
player (labels pattern, tokens, target sizes); the `nativeControls` escape
hatch costs one prop and keeps degraded environments working. On touch devices
where the OS fullscreen player takes over anyway (iOS `playsinline` rules),
the custom bar stays but fullscreen delegates to the platform.

## 3. Captions and subtitles

- Source of truth: native `<track kind="captions|subtitles">` + the
  `TextTrack` API. No custom cue parser — WebVTT via the browser.
- Rendering: default native cue rendering (`::cue` styled with tokens where
  supported). A `renderCues` opt-in draws cues into a styled overlay div for
  full token control; it reads `activeCues` on `cuechange` only (no polling).
- `CaptionsToggle` cycles off → each available track (labelled by
  `track.label`/`srclang`), persisted per player via a `captionsTrack`
  bindable prop; no global persistence in v1.
- The toggle is a labelled IconButton (registry needs a `captions` semantic
  name — one registry addition, recorded when implemented).
- Contract: captions must never be hidden by the controls bar (bar overlays
  bottom; cue window shifts up while controls are visible, the standard
  platform behavior).

## 4. Keyboard behavior (key-by-key)

Focus model: the Root is one focus group; controls are normal tab stops (no
roving — few controls, standard pattern). The video element itself is NOT
focusable; the Root div (`role="group"`, labelled by the media title) carries
the shortcut listener so shortcuts work without stealing typing focus.

| Input                  | Result                    | Notes                                                  |
| ---------------------- | ------------------------- | ------------------------------------------------------ |
| Space / K              | Toggle play/pause         | Only when focus is inside Root and not on a text input |
| ArrowLeft / ArrowRight | Seek −5s / +5s            | Shift = ±30s; announced via the live region ("0:42")   |
| J / L                  | Seek −10s / +10s          | YouTube-convention alias, documented                   |
| ArrowUp / ArrowDown    | Volume ±5%                | When VolumeControl or Root focused                     |
| M                      | Mute toggle               |                                                        |
| F                      | Fullscreen toggle         |                                                        |
| P                      | Picture-in-picture toggle | Only when supported                                    |
| C                      | Captions toggle           |                                                        |
| Home / End             | Seek 0 / duration         |                                                        |
| 0–9                    | Seek to 0–90%             | Optional (`shortcuts="extended"`), off by default      |
| Escape                 | Exit fullscreen           | Native; never trapped                                  |

Scrubber: `role="slider"` with `aria-valuemin/max/now` in seconds and
`aria-valuetext` as formatted time ("1:23 of 4:05" via labels); arrows ±5s,
PageUp/Down ±30s, Home/End; drag with pointer capture (the ColorPicker rail
pattern). While scrubbing, preview time updates immediately; playback position
commits on release (`fastSeek` where available) — dragging never animates.

## 5. Fullscreen

- `requestFullscreen` on the Root (not the video) so custom controls and cue
  overlay survive; vendor-prefixed fallback for Safari (`webkitEnterFullscreen`
  on the video is iOS's only path — there the platform player takes over,
  accepted).
- State from `fullscreenchange` events only (never assume the call succeeded).
- In fullscreen the controls auto-hide after 3s idle (pointer move/focus
  reveals; `prefers-reduced-motion` still gets the fade at token duration —
  visibility change, not choreography; focus ALWAYS reveals and pins the bar).
- Focus stays inside Root; Escape handled natively. No `overlay` motion token
  misuse — fullscreen transition is the platform's.

## 6. Picture-in-picture

- `requestPictureInPicture` / `document.exitPictureInPicture`, gated on
  `document.pictureInPictureEnabled && !video.disablePictureInPicture`;
  the toggle renders only when supported (no disabled placeholder).
- State from `enterpictureinpicture`/`leavepictureinpicture` events.
- While in PiP, the inline surface shows a placeholder (Empty-style panel with
  a "Playing in picture-in-picture" line from labels + a return button).

## 7. Mobile behavior

- `playsinline` by default (prop to disable); poster required for lazy
  surfaces (see §9) so touch devices don't fetch media eagerly.
- Touch targets: every control ≥44px via `tap-target`; the scrubber hit area
  is ≥44px tall regardless of the 4px visual track (ColorPicker rail pattern).
- Tap-on-video toggles play/pause; double-tap seek zones are OUT of scope v1
  (backlog note; conflicts with tap-to-toggle without a gesture recognizer).
- Orientation/fullscreen: rely on the platform; no screen-orientation locking.
- Autoplay only as `autoplay muted playsinline` pass-through; the component
  never fights autoplay policy (play() rejections surface as the paused state,
  not an error).

## 8. Streaming formats

- v1: progressive MP4/WebM via native `src`/`<source>` — covers product
  walkthroughs and attachment previews, zero dependencies.
- HLS: native on Safari (`canPlayType('application/vnd.apple.mpegurl')`);
  everywhere else requires hls.js (~90KB gz). DASH requires dash.js (larger).
  **Decision: no streaming dependency in v1.** The API leaves room: a
  `source` union (`string | { src; type }[]`) plus a documented `mediaSetup`
  escape hatch (`(video: HTMLVideoElement) => void | (() => void)`) lets an
  application attach hls.js itself without Bedrock shipping it. If demand
  materializes, hls.js becomes a lazy dynamic import behind
  `streaming="hls"` (PdfViewer pattern) with the dependency-policy entry
  recorded then.

## 9. States, performance, misc

- States per the contract template: idle (poster + play affordance),
  loading/buffering (Spinner, `aria-busy`, only after a 150ms anti-flicker
  delay), playing, paused, seeking, ended (replay affordance), error
  (FieldStatus-style destructive line from labels + retry; never a raw
  MediaError code).
- `preload="metadata"` default; `lazy` prop defers even metadata until
  intersection (attachment lists with many videos).
- Time updates drive the scrubber via `requestVideoFrameCallback` when
  available, else `timeupdate` — both immediate, no motion tokens on the
  progress fill (live data never animates).
- All strings through `labels` (`VideoPlayerLabels`), English defaults:
  play/pause/mute/unmute/volume, seekForward/seekBack(seconds), captions,
  fullscreen/exitFullscreen, pip, playbackRate(rate), timeDisplay(current,
  duration), buffering, error, retry, pipPlaceholder, replay.
- Live region: one polite `role="status"` announcing play/pause/seek/rate
  changes, deduplicated (the Chat/AsyncButton pattern).
- Tests: unit (time formatting, state machine, shortcut map), browser
  (keyboard map with a stubbed media element, scrubber ARIA + pointer,
  captions toggle, error path), e2e smoke with a tiny bundled MP4 fixture.

## 10. Open questions for review

1. Accept the `mediaSetup` escape hatch, or hold the API closed until an
   hls.js decision is forced?
2. Registry additions needed: `captions`, `play`, `pause`, `volume`,
   `fullscreen`, `pip` semantic icons (~6 new names) — one batch, or reuse
   close-enough existing names where possible?
3. Should `CaptionsToggle` persist the chosen track per session
   (localStorage) or stay purely controlled? (Proposed: controlled only.)
