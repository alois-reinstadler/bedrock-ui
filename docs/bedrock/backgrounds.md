# Background components

AnimatedGradient and LightRays require **WebGL2**. Their documentation and registry declare this requirement, as does Map. They use the pinned vanilla `@paper-design/shaders@0.0.81` package; no React runtime is used. The dependency is loaded on the client when a shader surface mounts.

Both components are content containers. Give them an explicit height or padding. Their decorative renderer is hidden from assistive technology and never captures input. Keep foreground contrast independent of the animation. A CSS gradient is present during SSR, loading, WebGL unavailability, initialization failure, and context loss. A failed or lost renderer remains on its fallback until remount; the component does not repeatedly request contexts.

Colors accept hex strings (#RGB, #RGBA, #RRGGBB, #RRGGBBAA). Unsupported colors are ignored and an empty palette receives a default. Gradients accept up to ten colors; rays accept five. Resolve CSS variables or OKLCH tokens to hex before passing them. Speed is bounded to -3–3; zero and paused stop continuous animation. Reduced motion stops playback and settles to a deterministic frame. Paper pauses offscreen and hidden-document rendering. Each surface defaults to a one-million physical-pixel budget, configurable up to four million. Teardown disposes observers, animation work and GPU resources.

DotPattern, GridPattern, and NoiseOverlay are static CSS/SVG layers and do not require WebGL. Place them inside a positioned container. DotPattern's subtle variant reduces contrast; it is not a separate component. Patterns accept opacity, scale/spacing and radial edge fading where applicable. They never convey essential information.

Paper Shaders is Apache-2.0 licensed. When copying this integration, install the exact pinned dependency and preserve its LICENSE and NOTICE when redistributing its code. The installed notices are mirrored beside the internal renderer. Source: https://github.com/paper-design/shaders and https://shaders.paper.design/.
