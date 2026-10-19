# Motion consumer ledger

Date: 2026-09-29. This ledger records delivered ownership;
final acceptance and measured evidence are recorded in [implementation.md](implementation.md).

## Component-family follow-up (2026-10-02)

The [component motion implementation](../component-motion-implementation.md)
supersedes these specific migration-era entries below: AvatarStack membership is
now opt-in; DataTable counts and Lightbox media no longer use Swap; `streamText`
defaults to immediate delivery and offers explicit pacing with live policy input
and frame disposal. Sonner retained exits now become inert immediately. The
remaining historical migration boundaries still apply.

## Production and application consumers

| Consumer                                     | Owner after migration                               | Reason / remaining boundary                                                                                                                                       |
| -------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AsyncButton labels                           | Astra presence; measured native shell               | Preserve immediate async state, one semantic label and real width/height reflow.                                                                                  |
| AvatarStack membership                       | Astra position-only layout                          | Coordinate packing without scaling avatar content.                                                                                                                |
| AvatarStack preview                          | CSS positioning, native Swap/autoSize compatibility | Bounded content replacement; replacing this separately is not required for packing migration.                                                                     |
| Tabs indicator                               | Measurement + CSS                                   | One measured surface does not need projection/group discovery.                                                                                                    |
| Outline indicator and activation             | Measurement + CSS; effective reduction for scroll   | Preserve active-link semantics, scroll tracking and immediate reduced navigation.                                                                                 |
| DataTable indicator                          | Measurement + CSS                                   | Sorting/selection remain unchanged; selection-count Swap remains bounded compatibility.                                                                           |
| DocsSidebar active/hover highlights          | Measurement + CSS                                   | Prevent shared docs shell from importing the custom layout engine for two surfaces.                                                                               |
| Accordion content                            | Bits semantics + native reveal                      | Real height reflow and reversed exits; do not replace with independent keyframes or double retention.                                                             |
| ChatComposer shell                           | Native autoSize                                     | Intrinsic size is real flow, not projection.                                                                                                                      |
| Lightbox content                             | Bits dialog + native Swap                           | Keep focus trap, navigation and scroll lock; portalled roots carry application policy.                                                                            |
| Music-player album fade                      | Native Svelte transition                            | Small local paint transition; reads effective reduction from its node.                                                                                            |
| Chat streaming utility                       | Existing paced text reveal                          | Text-stream pacing is not migrated to Astra. Existing utility chooses OS reduction at creation; application/live pacing policy is a recorded residual.            |
| Standard controls, overlays, loading effects | CSS / existing semantic owner                       | OS reduction applies globally. Application reduction follows provider ancestry or an attached portal root. Third-party JS gestures remain owned by their library. |
| Root layout                                  | Engine-free MotionProvider                          | Shares request-scoped application policy; does not load Astra globally.                                                                                           |

## Composition, examples and compatibility

| Consumer                                                                                              | Disposition                                                                                                                                     |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `/motion`                                                                                             | Current CSS feedback, Astra presence and expandable/reorderable project composition.                                                            |
| `/docs/motion` and guide disclosure                                                                   | Current policy and direct Astra authoring API; visible SSR, explicit focus handling and inert exits.                                            |
| `astra.test.svelte`, `astra-policy.test.svelte`                                                       | Updated public-API regression fixtures; obsolete CSS export assertions removed, semantics retained.                                             |
| `CssButton`, `CssPanel`, `css.ts`                                                                     | Removed; upstream CSS subpath no longer exists. No replacement engine masquerading as CSS.                                                      |
| `config.ts`                                                                                           | Raw advanced Astra configuration, explicitly measured engine cost.                                                                              |
| `engine.ts`, `projection.ts`, `values.ts`, `scroll.ts`                                                | Explicit public Astra compatibility entries, isolated from ordinary controls.                                                                   |
| Native `index.ts`, `LayoutGroup`, `layout.svelte.ts`, `Swap`, presence and sizing helpers             | Compatibility exports remain for named consumers and historical labs; full custom-engine retirement is not claimed.                             |
| `/demo/ui`, `/demo/motion-test`, motion concurrency/continuity/foundations labs and internal testbeds | Retained native compatibility demonstrations and regression evidence. Their layout engine is route-local rather than docs-shell infrastructure. |
| `/demo/motion-route-prototype` and route coordination utilities                                       | Separate experimental JS/WAAPI continuity work; unchanged and not promoted to production support.                                               |
| Tokens/CSS, policy fixtures and all motion test imports                                               | Shared policy vocabulary or verification; excluded from application-engine adoption counts.                                                     |

## Deliberate residuals and next acceptance criteria

- The custom local layout engine remains reachable through historical demonstrations
  and compatibility APIs. Delete it only after all those consumers are replaced or
  deliberately retired, with an explicit API migration. It is no longer required
  for ordinary measured indicators.
- `Swap` remains in preview, DataTable count, Lightbox and native demos. Replacing it
  requires preserving crisp text, one meaningful accessible copy, interruption and
  genuine size interpolation within measured bundle limits. Keeping this bounded
  helper is not a claim that it has become Astra presence.
- `autoSize` retains its existing mutation/lifecycle observation strategy. Arbitrary
  image/font-induced intrinsic resize is not universally guaranteed; a future natural
  inner-box observer needs reversal and feedback-loop qualification. Current fixed-size
  avatar image boxes do not require a universal auto-to-auto sizing guarantee.
- Raw third-party portalled components do not inherit an application CSS scope solely
  through Svelte context. Custom consumers attach `useMotionPolicy().attach` to their
  moving root; OS CSS reduction remains global. JavaScript-owned third-party momentum
  and animations are not reconfigured by the Bedrock provider.
- `streamText` is an existing pacing utility, including its existing lifecycle limits.
  A separate change should provide application/live preference input and owned frame
  disposal without changing text delivery semantics. This migration does not claim
  every asynchronous update or third-party effect is paused by motion reduction.
- Astra `routes` and `view-navigation` remain excluded from normal application graphs.
  Kit 3 compatibility and the prior interrupted-route continuity contract need their
  own qualification before adoption.
