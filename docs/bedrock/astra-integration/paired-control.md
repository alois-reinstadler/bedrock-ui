# Matched production control — ERP gate remains failed

On 2026-09-29, a separate production control was built from the recoverable dirty
Bedrock baseline plus **only** concurrent user commit `0f18f48` (`feat(chat): add
optional voice input controls and demo`). It retains the old Astra archive
`b99f2f8d46b4e6c3c515ad97fa6b9ac730e2e556ce25b5a505b13b800dc14afe` and uses
frozen-lock Vite **8.2.2**, matching the candidate toolchain.

The exact seven-file chat patch applied cleanly; its SHA-256 is
`ca3422430ca3dda78f4be8daa34894c202dfb6303ccd884545fe066e54aaa790`.
The control changes are confined to the isolated verification worktree and must
not be integrated as motion changes. The build log and patch remain under
`/workspace/agent-jobs/bedrock-astra-migration/` as `paired-control-build.log` and
`concurrent-chat-control.patch`.

This is an explicitly authorized paired comparison, **not a new budget**. The
original +45166 B route failure remains in [runtime-comparison.md](runtime-comparison.md).

| ERP JS gzip comparison                                     |           Bytes |
| ---------------------------------------------------------- | --------------: |
| Original production baseline                               |          307256 |
| Matched old-motion control, current chat feature/toolchain |          308238 |
| Current migrated candidate                                 |          352422 |
| Matched motion delta                                       |          +44184 |
| Unchanged allowance                                        |          +42304 |
| Matched absolute ceiling                                   |          350542 |
| Excess above ceiling                                       | **1880 — FAIL** |

The unrelated chat/toolchain control shift is +982 B. It does not explain the
entire original overage. Both component runtime gates pass, and the separately
measured component fixture budgets pass, but this whole-route gate still blocks
unqualified adoption under the recorded plan.

The control used the same full-navigation resource observation on the managed
production preview at `http://127.0.0.1:4095/demo/erp`, 1280 x 900, DPR 1, CPU 1x,
600 ms resource settling. [Requested JS resources](paired-control-resources.json)
and [source hashes / computed comparison](paired-control-comparison.json) preserve
the measurement. There were no console warnings/errors or HTTP responses >=400.
The owned page was closed; the control preview remains running.

Resolution requires sufficient measured optimization, retaining the previous
component implementation, or a separately reviewed budget revision with substantive
rationale. This evidence makes no such revision and does not report the route as
passing.
