# Component examples: batch 1

34 dedicated default/common previews and 34 contextual examples. Previews and examples have distinct explicit IDs; primitive-generated IDs remain instance-local. Interactions only change local demo state.

| Component        | Scenario                                 | Decision taught                                                                                                           |
| ---------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| accordion        | Before your workshop                     | Single expansion keeps booking questions easy to scan without hiding the main booking details.                            |
| alert            | Recover a failed export                  | Keep the failure beside its recovery action and announce the result without replacing the surrounding page.               |
| alert-dialog     | Remove a workspace member                | Name the affected person and consequences, and keep the safe cancellation action explicit.                                |
| aspect-ratio     | An editorial feature                     | Reserve the media footprint before content arrives so a reading list stays stable.                                        |
| async-button     | Save notification preferences            | A simulated first failure teaches retry behavior while preserving the selected setting.                                   |
| avatar           | Project reviewers                        | Keep a visible name beside each avatar; initials remain useful when a teammate has no photo.                              |
| badge            | Triage a release checklist               | Combine text labels with state; color alone must never communicate whether work is ready.                                 |
| banner           | Scheduled maintenance in a workspace     | A dismissible announcement sits above the workflow and can be restored without losing the draft.                          |
| blockquote       | Research synthesis                       | Separate a participant’s voice from the author’s interpretation and identify the fictional source.                        |
| breadcrumb       | A nested document workspace              | Breadcrumbs show location; the current document stays plain text instead of linking to itself.                            |
| button           | Publish a project update                 | Use one primary action, a quieter draft action, and a disabled action with an explanation.                                |
| button-group     | Review an incoming request               | Group related actions while keeping the decision result visible. A group is not a selection widget.                       |
| calendar         | Book a workshop day                      | Choose a date before confirming a reservation; the selected day stays visible in the booking summary.                     |
| card             | A workshop reservation                   | Use the footer for a clear next action and show the resulting reservation in the same card.                               |
| carousel         | Choose a workshop track                  | Each slide carries a real decision. Previous and next controls remain available beside swipe gestures.                    |
| chart            | Monitor a service budget                 | Pair the chart with a written trend and the underlying values so the report remains useful without visual interpretation. |
| chat             | Delivery support conversation            | Keep the order context beside the conversation. Messages stay local and no automated reply is implied.                    |
| checkbox         | Email delivery preferences               | An optional preference starts unchecked and does not block the main form action.                                          |
| checkbox-list    | Prepare a client handover                | Selection changes the export summary; unavailable material explains why it cannot be included.                            |
| citation         | An evidence-backed recommendation        | Keep the claim readable and attach a source that readers can inspect independently.                                       |
| clickable-card   | A project library                        | The main card opens a project; its separate pin action must not accidentally open it.                                     |
| code-block       | Connect an activity feed                 | A compact integration recipe keeps the copyable request beside its expected response.                                     |
| collapsible      | Track a delivery                         | Keep the useful summary visible and reveal lower-priority tracking details on demand.                                     |
| color-picker     | Customize a project marker               | Use the selected color decoratively while keeping the project name and text contrast independent.                         |
| combobox         | Assign a review owner                    | Search a growing team list, then confirm the assignment in a separate action.                                             |
| command          | Workspace action finder                  | Filtering narrows real actions; selecting a result updates the local workspace activity.                                  |
| context-menu     | File actions with a keyboard alternative | A context menu accelerates file work, while visible buttons keep the same actions discoverable.                           |
| data-table       | Review recent purchase orders            | Filter the order queue before reviewing amounts and status. Status labels remain understandable without color.            |
| date-input       | Set a review deadline                    | A date without a time is appropriate when the deadline applies to the whole working day.                                  |
| date-range-input | Choose a reporting period                | A date range defines an inclusive report window; a preset offers a useful shortcut.                                       |
| date-time-input  | Schedule a team review                   | Explain the time zone beside the field; this example uses a local wall-clock time, not an instant.                        |
| dialog           | Rename a project                         | A dialog is useful for a short focused edit. Preserve the current name until the user saves.                              |
| drawer           | Filter a document library                | A compact filter surface is useful on mobile. Applying filters updates the visible result summary.                        |
| dropdown-menu    | Actions on a project row                 | Keep secondary actions in a menu with explicit names and visible feedback.                                                |

## Verification

- All 68 changed Svelte files passed Svelte MCP autofixer with no issues or suggestions.
- `pnpm check`: 0 errors, 0 warnings.
- Prettier check: all 68 changed Svelte files pass.
- ESLint: all 68 changed Svelte files pass.
- `git diff --check`: pass.
- Integrated production and browser verification belongs to the orchestrator because the shared preview loader is outside this worker’s scope.

## Suggested integrated interaction checks

- Button: publish, save draft, clear, then verify publish is disabled.
- Avatar: assign another reviewer and verify the status.
- Async Button: first save fails; retry succeeds without clearing the checkbox.
- Dialog: cancel a draft rename, reopen, and save a new name.
- Drawer: apply assigned-to-me filter, reopen and cancel a changed draft filter.
- Clickable Card: pin without triggering the main card action, then open the card.
- Command: filter and select an action; verify the local status.
- Data Table: toggle open-order filtering.
- Date fields: change/clear values and verify dependent save behavior.
