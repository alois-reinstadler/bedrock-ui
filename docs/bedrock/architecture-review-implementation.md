# Architecture review implementation

The public Bedrock imports remain stable. This pass repairs facade contracts,
reduces component responsibilities, and makes documentation and verification
reflect the public surface.

## Changes

- 306 forwarding facades explicitly preserve upstream bindable props and their
  defaults. Discriminated Input, Calendar and ToggleGroup contracts retain their
  typed branches; Resizable forwards the aliased imperative handle. The frozen
  shadcn sources remain unchanged.
- Reference extraction inherits defaults but reports a binding only when the
  public component declares it. Regression tests cover a spread-only wrapper,
  explicit bindings and aliased props. Consumer tests exercise Input, Textarea,
  Dialog and Pagination through the public API.
- ExampleCard preview and code panels size to content between 10rem and
  `max(10rem, min(40rem, 75svh))`. Both panels scroll internally when needed.
  Duplicate Best practices prose was removed from the component overview.
- DataTable has separate feature/label definitions and a view-tab component that
  owns its measurement and observer cleanup. VideoPlayer has separate controls
  and public types. Mail mutations live in a command module; the view retains
  routing, selection and focus. Repeated draft saves update the same local draft.
- Theme tokens and utilities belong to `src/lib/bedrock/styles.css`. ESLint
  enforces the Bedrock/site import direction and use of the shared E2E fixture.
- Every E2E spec uses one browser fixture. Local runs attach the existing Chrome;
  GitHub Actions owns its test browser and production preview. Browser files run
  serially. Actual remote-media playback tests have a separate script.
- Accessibility scans have no rule, route, component or generated-ID exemptions.
  Avatar fallback/count colors and AvatarStack composition were corrected.
  Tinted destructive badges use a dedicated text token in both themes; the
  exported badge recipe uses the same token. Overflow-count buttons use the
  foreground token to remain readable on muted surfaces. Custom colors and the remaining
  documented interactive variant limitations still require contextual checks.
- Mail restores focus after destination navigation and DOM updates. Reduced-motion
  CSS uses zero-duration transitions so inherited visibility cannot briefly defer
  focus; animation durations retain their existing completion-event behavior.

## Verification

- Production build completed. Svelte checking reports zero errors and warnings.
- All 483 unit tests across 91 files passed: 179 server tests and 304 browser
  component tests. Browser component files were verified in nine sequential
  batches after long shared-Chrome runs stalled or lost their browser connection.
- The map context error assertion now handles both synchronous throws and rejected
  render promises, matching the component test runner's initialization paths.
- 69 focused production-browser checks passed: 17 mail flows, 30 representative
  accessibility routes, eight light/dark contrast scans, and 14 documentation,
  responsive preview, and media-volume checks.
- The documentation page was inspected in shared Chrome with no console warnings
  or errors and no failed requests. Desktop and mobile screenshots were captured.
- Motion-package integrity/bundle checks and the static asset policy passed.
- Prettier and whitespace checks passed. The full ESLint scan's reported type-export
  issues were corrected and the affected files passed a focused rerun.

The final build and browser checks used an isolated snapshot because other work
was rebuilding the main checkout concurrently. All 306 facades and the refactored
implementation files were compared with the working checkout before completion.
Hosted CI and actual remote-media playback were not run locally.
