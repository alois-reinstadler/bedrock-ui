# Bedrock motion

Astryx is the motion design authority: preserve its durations, easing curves and
spring parameters. Bedrock applies that system to component behavior and
accessibility. Astra Motion is the implementation engine for
coordinated presence, shared layout, gesture physics and animated values. Simple
color, border and measured-indicator feedback stays in CSS.

## Application policy

Use `MotionProvider.svelte` from `#lib/bedrock/motion` around application content.
The optional `reduced` boolean adds application reduction to OS and parent policy;
a nested provider cannot re-enable movement. The provider imports no Astra engine.
A component outside the provider still follows the OS preference.

`useMotionPolicy()` from `policy.svelte.js` returns a reactive `reduced` getter and
an `attach` attachment. Attach portalled moving roots to carry their context's
policy outside its DOM ancestry. Policy is request-scoped during SSR. Essential
content must be visible before hydration, with `initial={false}` on engine components
where an entrance would otherwise hide it.

`AstraPolicy.svelte` bridges this policy to Astra's `MotionConfig`. Import it only
where the engine is already needed. Explicit animation transition props must also
select zero duration/delay under `policy.reduced`, including opacity and decorative
repeats; engine positional reduction alone does not suppress every paint effect.
For a paint effect that may already be running when reduction changes, explicitly
own its MotionValue and register `settleOnReducedMotion(value)` from
`settle-motion.svelte.js`. This completes only that value's public playback controls,
including a retained exit; it does not finish unrelated animations or remount content.
The application CSS policy shortens CSS transitions/animations and stops repeated
spin/pulse. Live reduction settles retained Bedrock sizing, presence and layout work.

Raw `MotionConfig` remains available from `config.js` for advanced engine consumers.
It is not engine-free and does not configure Bedrock's application policy. Astra's
primary motion components default to `never`; always choose an explicit policy for
raw Astra use. The safe Bedrock bridge follows the OS and application setting.

## Composition

Use Astra's own `motion`, `AnimatePresence` and `LayoutGroup` APIs with Bedrock
policy and presets. Bedrock does not mirror Astra's entire API or add unrestricted
animation props to every ordinary component. `/motion` demonstrates native feedback,
coordinated presence, and project cards that expand and reorder without navigation.

Semantic state, keyboard handling, focus and status announcements belong to Bedrock
or the existing primitive. They update immediately. Exiting interactive surfaces are
inert and hidden from assistive technology; move focus to a meaningful surviving
control before removing a focused surface.

One system owns each retained exit and animated property. Do not apply Bits, Svelte
and Astra retention to the same surface. Keep positioning transforms separate from
animation transforms. Use real measurement/reflow for intrinsic shell sizing when
projection would distort content or fail to move surrounding flow as intended.

## Text and pointer tilt

Import `TextReveal` and `TextSwap` directly from `astra-motion/text`. Effects
(`fade`, `slide`, `blur`), segmentation (`whole`, `words`, `graphemes`) and stagger
are independent options. Word mode keeps punctuation in the word’s animation;
grapheme mode preserves Unicode clusters. Use `AstraPolicy` around the composition
so Bedrock’s application reduction reaches the text engine. These text primitives
settle all their own movement and paint effects when reduction changes.

For a stable replacement region, use `size="reserve"` with all known `alternatives`,
or `size="fixed"` with explicit dimensions and overflow handling. The default
content sizing may move adjacent layout. `mode="wait"` coalesces replacements while
an exit completes; `mode="sync"` keeps at most two visual layers and snaps to the
latest message on another update during exit. One semantic message remains exposed;
live announcements are opt-in. Plain text is supported; rich interactive text and
automatic line splitting are outside this API. See the live `/docs/motion` example.

`TiltCard` composes `astra-motion/tilt` with Bedrock’s Spotlight surface and policy.
Astra owns shared springs and pointer measurement; Bedrock keeps the styled surface
inside the rotating layer. Outer classes/attributes remain on a stationary wrapper.
Focus and scrolling settle tilt; subsequent pointer movement resumes it. Native
controls stay mounted, touch remains neutral, and reduced motion disables tilt.
Do not put layout projection inside the rotating content; animate an outer ancestor.

## Surface recipes

`styles.css` owns one stateful recipe per surface family. Components apply the
family class; do not layer `duration-100`, `animate-in`, zoom or slide utilities on
that same surface. Bits owns retention and focus; CSS owns visual interpolation.
`surfacePresence` makes retained exits inert and hidden from assistive technology.

| Family              | Visual entrance      | Exit                | Retention entrance |
| ------------------- | -------------------- | ------------------- | ------------------ |
| Popover/menu/select | 200 ms, enter curve  | 150 ms, exit curve  | 200 ms             |
| Tooltip             | 140 ms, enter curve  | Immediate dismissal | 140 ms             |
| Dialog content      | 140 ms, enter curve  | 175 ms, exit curve  | 410 ms             |
| Dialog backdrop     | 410 ms, enter curve  | 175 ms, exit curve  | 410 ms             |
| Sheet               | 410 ms, drawer curve | 175 ms, exit curve  | 410 ms             |
| Navigation panel    | 230 ms, enter curve  | 175 ms, exit curve  | 230 ms             |

The `--bedrock-surface-enter` / `--bedrock-surface-exit` variables control paint;
`--bedrock-surface-enter-clock` / `--bedrock-surface-exit-clock` control primitive
retention. They resolve to Astryx tokens. Early readable dialog content and immediate
tooltip dismissal are existing component policies, not changes to the seed values.
The 100 ms hint-exit seed remains available; tooltips explicitly choose immediate
removal so stale hints do not linger over the next action. Reduced motion settles
both clocks. Native Vaul drawers retain their own gesture and transform ownership.

`labelReplacement` names the existing 400 ms, enter-eased readable-label tween.
`contentReplacement` names the 183/23/1 spring recipe. A spring solver's settling
time is not a guaranteed 400 ms duration; the legacy sampled spring normalizes its
curve to that window. Keep that distinction explicit when choosing an adapter.

## Template motion

Templates consume the same Astryx enter/exit and feedback recipes. Album fades
use live Bedrock reduction, including delayed transitions. Stagger delays describe
composition order and remain separate from playback durations. Video route paint
never gates `onNavigate`: its post-commit callback starts the entrance immediately,
even if outgoing paint was paused. OS and application reduction cancel the owned
route animation. Do not infer production shared-route support from this small fade.

## Timing and compatibility

`tokens.ts` is the canonical millisecond vocabulary; tests mechanically compare
`tokens.css` against it. `astra-presets.ts` converts semantic recipes to seconds at
the engine boundary. Astryx seed values remain unchanged. Change a seed only through a dated design decision with fixture evidence.

The native `index.js` entry retains `reveal`, `autoSize`, `Swap`, `LayoutGroup` and
other compatibility APIs in milliseconds. Explicit `engine.js`, `projection.js`,
`values.js` and `scroll.js` imports still expose Astra capabilities. Their existence
does not require routing simple controls through an engine.

Internal production consumers import helpers such as `swap.svelte`, `auto-size.js`
and `presence.js` directly. The compatibility barrel also exports the old layout
engine; using it for a small helper can retain that engine in shared application
chunks even when the consumer never requests layout.

The updated upstream package removed `astra-motion/css`. Bedrock's `CssButton`,
`CssPanel` and `css.js` bridge have been removed with their in-tree consumers migrated.
For simple controls use normal Bedrock components and CSS. For coordinated animation
use Astra directly. There is no compatibility shim that quietly introduces the engine
under a CSS-only name. Custom-component adaptation uses Astra's `motion.create` and
requires the component to forward attachments to its native root. The removed
`createMotion` constructor is not re-exported; use Astra’s `motion.bind` for native
bindings, including its documented SSR spread and exit directive when needed.

## Package and verification

The content-addressed archive in `vendor/astra-motion.json` identifies the exact
installed runtime, including source snapshot provenance, SHA-256 and license
notices. The current archive is packed from clean upstream commit `2acb6b2`; the source
manifest records the tracked files and their SHA-256 hashes. The packaged archive is sufficient for
reproducible consumer installation. Astra and the bundled engines include MIT notices.

Use `pnpm install --frozen-lockfile`; the flag preserves the checked-in resolution.
The package verifier compares archive metadata and all installed files, resolves
public exports and bundles real consumer fixtures. Its graph checks recognize the
engine vendored inside Astra, reject React, duplicate engine identities and accidental
Kit route imports, and require ordinary Button/legacy fixtures to exclude the engine.
Configuration imports are measured rather than incorrectly asserted engine-free.

Refresh only from a frozen, reviewed source snapshot. Run upstream prepack through
packing, name the archive by content, update provenance/dependency/lockfile together,
and run package, type, focused runtime and production-build gates. Avoid overwriting
a same-version archive and assuming the package manager refreshed it.

Browser suites use the shared Chrome through the repository's CDP fixtures. Production
E2E needs `DEV_LOCAL_URL` from the managed preview. Record the tested source/archive,
actual checks and bundle measurements; historical reports do not qualify a new build.

## Boundaries

Routes remain a separate concern. Bedrock runs Kit 3; Astra declares Kit 2 support
for its optional navigation entries. Neither this integration nor the existing
JS/WAAPI route prototype establishes production route-transition support.

The [consumer ledger](astra-integration/consumer-ledger.md) records migrated and
retained paths. The original [architecture review](motion-architecture-review.md)
and [verification report](astra-integration/verification.md) remain dated evidence;
their removed CSS-backend and old license descriptions are historical.
See the [latest RC3 refresh](astra-integration/rc3-upgrade.md) for current evidence;
the [original RC.3 integration record](astra-integration/rc3.md) describes the earlier snapshot.
