# Component motion implementation

Implemented 2026-10-02 against the [129-family motion plan](component-motion-plan.md).
Four isolated workers handled surfaces, disclosures, decorative behavior, and the
remaining controls/content families. Integration included independent challenges
and follow-up fixes. Existing unrelated workspace changes were preserved.

## Public options

| Family                                      | New or clarified option                           | Default                                                                           |
| ------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| DropdownMenu, ContextMenu                   | Content `motion="default" \| "soft" \| "stagger"` | One sharp surface; expressive mode moves only later decorative icons              |
| Menubar, Popover, HoverCard, Select, Dialog | Content `motion="default" \| "soft"`              | Sharp text; no whole-text zoom                                                    |
| Accordion, Collapsible                      | Content `textMotion="none" \| "prose"`            | Existing height reveal; optional short prose sharpens early without a second fade |
| Tabs, Calendar, RangeCalendar, SteppedForm  | Root `motion="none" \| "panel"`                   | Immediate panel replacement; optional whole-panel change on interaction           |
| Banner, Chat                                | Banner / Message `motion="none" \| "enter"`       | Static initial content/history; urgent banners stay immediate                     |
| Avatar                                      | AvatarStack `animateLayout`                       | Membership layout animation is opt-in                                             |
| Chat streaming utility                      | `speed`, optional `reduced` getter, `dispose()`   | Incoming text is immediate; paced presentation is explicit                        |

Try the representative interactions at `/demo/component-motion`, linked from
`/docs/motion`. Application reduction and OS reduction both settle effects.

## Implementation coverage

- **Surfaces:** dropdown/context menus, menubar, popover, hover card, select,
  tooltip, navigation menu, dialog, alert dialog, sheet, drawer and command use
  the shared surface rules. Short side-aware travel replaces whole-text zoom.
  CSS transitions reverse in place; Bits retains lifecycle ownership. Exiting
  surfaces become inert and hidden from assistive technology. Tooltip dismissal
  remains immediate. Dialog content clears in the hint budget while its actual
  backdrop uses the overlay budget. Vaul retains drawer gesture transforms.
- **Disclosures and panels:** optional prose sharpening skips interactive copy
  and settles on focus. Panel changes have one incoming visual owner and key-based
  shell reflow; initial mount, keyboard focus and reduction remain immediate.
  No compact-label spring is reused for a calendar, tab panel or form step.
- **Controls and content:** focus feedback is immediate, initially checked boxes
  do not draw on hydration, data-table selection counts update directly, and
  lightbox media does not run through a compact text swap. Video controls remain
  visible while focused. Chat history stays still, deliberate insertions may
  enter, and programmatic scrolling finishes at its destination on reduction.
  Explicit paced text never hides text already exposed under reduction.
- **Maps and replacement:** programmatic camera motion tracks its destination
  and settles under live reduction. Map popup policy and route paint respect
  reduction. Compact Swap exits are inert and aria-hidden with focus handoff.
- **Decoration:** marquee, skeleton, spinner, status dot, shimmer and shader work
  pause while hidden/offscreen. Skeletons become static under reduction.
  Completed signature/highlight presentation does not replay when full motion
  returns. Spotlight settles on focus, scrolling, touch and window blur.
- **Toasts:** Sonner remains the animation and retention owner. Dismissed toasts
  become inert and accessibility-hidden immediately; focus moves safely and
  same-ID revival restores accessibility.
- **Retained defaults:** static layout/content families and existing compliant
  indicator/control behaviors remain as specified in the family table. Optional
  parent-level entry compositions do not add automatic mount animation or an
  animation prop to every primitive. Sidebar keeps its existing single layout
  owner; no blanket stagger or spring was added.

Production navigation checks also exposed a CodeBlock highlighting subscription
race during speculative route preloads. CodeSource now supplies synchronous
plaintext and owns its asynchronous subscription through the component lifecycle;
regressions cover fork discard/commit and unmount/remount.

Canonical timing tokens and spring presets are unchanged. The existing
Astryx-aligned values remain authoritative; Resax contributes restrained visual
character rather than its larger blur or slower timing.

## Verification

The integrated unit/component suite passes **608 tests in 118 files**. Browser
component files were run in bounded batches after a monolithic run stalled during
module loading; every discovered test file is accounted for. Regression coverage includes rapid surface reversal, portal policy, immediate focus,
decorative-only menu staggering, navigation handoff, disclosure/panel defaults,
live reduction, chat streaming/scroll settlement, map camera settlement and
focused video controls. Desktop and 390px mobile manual checks include console,
network and appearance inspection.

Final checks:

- Type checking: zero errors and warnings.
- Production build and changed-file formatting/ESLint: passed.
- 25 targeted production E2E cases: passed across the final suite and the narrowed
  loading-status selector rerun. Coverage includes the component demo, existing
  motion laboratory, sidebar navigation, light/dark reduced-motion skeletons and
  PDF loading. Earlier navigation failures were resolved by the CodeSource fix;
  existing broad example selectors were scoped to their intended content.
- Final production demo console: no errors or warnings; no failed resource
  responses. Desktop/mobile appearance and overflow were inspected. The preview
  remains available at `http://100.64.0.2:4098/demo/component-motion`.
- Development-only `derived_inert` warnings were observed in rapid-reversal
  fixture runs; the related assertions pass. No claim is made that every one of
  the 129 families received an individual visual or performance benchmark.
- Family inventory: 129 directories and 129 unique plan rows, with no omissions.
  Timing tokens and spring preset files match their pre-task snapshots.

The four temporary worker worktrees were removed after integration. No commits
or dependency additions were made.
