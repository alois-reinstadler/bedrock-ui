# Decorative components

These components use SVG, DOM, and CSS; none requires WebGL. All motion components honor Bedrock's `MotionProvider` and the operating system reduced-motion preference. TextReveal and TextSwap are imported from `astra-motion/text` with Bedrock’s `AstraPolicy` bridge; the motion guide includes a live example.

## QRCode

`value` is required. `size` defaults to 192 pixels. `modules="dots"` and `finder="rounded"` opt into styling. `foreground`, `background`, and `errorCorrectionLevel` customize encoding and presentation. The SVG always includes a four-module quiet zone, defaults to dark modules on white, and exposes `label` plus the original value as accessible text. Add a normal link beside it when the value is a URL. Empty or oversized values render a readable status instead of throwing. Scannability still depends on printed/displayed size and chosen contrast; validate branded codes on the target devices.

## Marquee

Accepts arbitrary `children`, `vertical`, `reverse`, `speed` in pixels per second, and `gap` in pixels. The track measures its content and keeps one original set plus an inert, aria-hidden visual copy. Use decorative content without hardcoded IDs because snippets render twice. `paused` is bindable; pause/resume controls are visible by default. Customize their labels with `pauseLabel` and `resumeLabel`. Hover pauses by default, and keyboard focus pauses and resets the track, hides the duplicate, and makes the original viewport scrollable to keep every original control reachable. `fade` masks the edges; vertical tracks use `--marquee-height` (default 16rem). Reduced motion shows the original content statically without the fade or duplicate. Hide built-in controls only when equivalent external pause controls exist.

## AnimatedSignature

Pass meaningful `text` plus prepared `paths` and `viewBox` for the smallest client cost. Optional `fontUrl` lazily imports opentype.js and converts text to outlined glyph paths. Font URLs must permit browser fetches; self-host properly licensed TTF, OTF, or parser-supported WOFF fonts. Font parsing does not reconstruct pen strokes: prepared single-line SVG paths create the most natural handwritten result. `fontSize`, `duration` (seconds), `delay` (seconds), `strokeWidth`, `color`, and `filled` control rendering. Server rendering and font failures retain readable text; `onLoadError` reports failures. Pending requests abort on input changes or teardown. Reduced motion displays the complete signature. This is decorative typography, not signature capture or signing functionality.

## Spotlight and SpotlightGroup

Use `Spotlight` for an individual card, or wrap multiple surfaces in `SpotlightGroup` to share one pointer position across the grid. Each surface calculates its own local coordinates and paints separate fill and masked border layers; grid gaps remain unpainted. Customize `radius`, `color`, `fill`, `border`, or `disabled`. Pointer light is decorative and responds only to mouse input. Child controls remain keyboard accessible without requiring the light effect. Scroll resets stale coordinates, and reduced motion disables tracking.

## TiltCard

A composed card using `astra-motion/tilt` with an independent inner transform layer and optional `spotlight`. `maxTilt` defaults to 8 degrees; `perspective` defaults to 900 pixels. `disabled` provides a static card. Fine mouse/pen pointers drive shared springs; touch stays neutral. Exit and pointer cancellation spring back, while scroll, keyboard focus and motion policy settle immediately. Pointer movement resumes tracking after focus or scrolling. The outer wrapper remains available for layout/reveal transforms. The outer `class` and native attributes stay on the measurement/layout wrapper; the Spotlight surface, border and shadow live inside the rotating content.

## TextShimmer and TextHighlight

`TextShimmer` is an inline span with configurable `color`, `highlight`, `duration` (seconds), and `paused`. Keep it brief or provide a pause control for continuously animated visible content. Reduced motion and forced colors display readable static text.

`TextHighlight` uses semantic `mark`, preserves wrapping, and supports `variant="highlight"` or `variant="underline"`. Its static treatment is the default; opt into a one-shot sweep with `animated`. `color` and `duration` customize the treatment. Both components preserve one accessible text representation and inherit the surrounding semantic typography.
