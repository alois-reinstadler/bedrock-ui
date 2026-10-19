# Final route validation — all fixed route gates pass

Captured 2026-09-29 after the final direct-import cleanup, on the rebuilt main
production preview `http://127.0.0.1:4086`, Chrome 152.0.7977.82, viewport
1280 x 900, DPR 1, CPU 1x. Vite 8.2.2, Node 24.20.0. The production manifest
SHA-256 is `9103f20b6b251d94e19b91453f1ac5d7132a4e57a1794dac25d7333a41406677`.

This is new, append-only evidence. The earlier failed route measurement remains in
[runtime-comparison.md](runtime-comparison.md), and its failed matched control remains
in [paired-control.md](paired-control.md). No allowance or baseline was increased.

Six internal UI imports now address the small native helpers directly rather than
traversing the compatibility barrel. This removes accidental loading of the retained
legacy layout engine on ordinary routes. The native public compatibility exports
remain available for their named consumers. No production chunk-grouping rule or
feature deferral was introduced.

## Actual production route measurements

The same protocol captured requested `.js` resources after full navigation and
600 ms settling, then summed gzip of each corresponding built file. See
[final resource lists](final-route-resources.json) and
[computed comparisons](final-route-comparison.json).

| Route             | Final JS gzip | Delta from original baseline | Original fixed ceiling | Result |
| ----------------- | ------------: | ---------------------------: | ---------------------: | ------ |
| Button docs       |      215290 B |                      -8242 B |               265836 B | Pass   |
| Docs shell        |      174697 B |                      -8449 B |               225450 B | Pass   |
| Motion            |      199760 B |                     +19122 B |               222942 B | Pass   |
| AsyncButton docs  |      261503 B |                     +34626 B |               269181 B | Pass   |
| ERP / AvatarStack |      345906 B |                     +38650 B |               349560 B | Pass   |

ERP is **6516 B smaller** than the first candidate (352422 B). It passes the
original ceiling by **3654 B** and the matched-control ceiling (350542 B) by
**4636 B**. Its motion delta against the same-chat/same-toolchain control is
**37668 B**, below the unchanged **42304 B** allowance.

None of the JavaScript resources loaded by these five routes contains the
`data-layout-invert` marker from the retained custom layout engine. This is a
production byte/marker check, supplementary to the independently run module-graph
verifier; absence of a marker alone is not used as a proof of arbitrary code absence.
All captured resources returned without HTTP errors.

## Bounded final interaction check

An additional ERP smoke focused the first named AvatarStack trigger, performed
eight rapid alternating remove/add activations, and allowed 600 ms to settle.
The focused identity remained **Alois Reinstadler**, the stack retained five
buttons, no running stack animation remained, and there was no desktop document
overflow. The console had no warnings/errors. Raw results:
[final ERP smoke](final-erp-smoke.json).

The already-passing three-run frame measurements and manual normal/reduced/mobile/
RTL/CSS-zoom checks were not repeated: this final change only selects direct imports
of the same helper APIs. Their actual coverage and pre-existing mobile-demo
limitations remain documented in [runtime-comparison.md](runtime-comparison.md).
The parent also ran its separately recorded final composition smoke.

Every owned browser page was closed. The temporary old-motion control preview at
port 4095 was stopped after this comparison; its allocation and recoverable sources
remain available. The final user preview at port 4086 remains running.
