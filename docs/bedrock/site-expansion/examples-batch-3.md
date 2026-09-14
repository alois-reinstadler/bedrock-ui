# Contextual examples: batch 3

Every component has a separate lazy preview file for the overview top. Previews use separate field IDs; the existing Stepped Form onboarding IDs and ScrollArea `data-blur-examples` hooks remain in the contextual examples only.

| Component       | Context and teaching decision                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------- |
| Radio Group     | Delivery method changes the order total.                                                           |
| Range Calendar  | Retreat arrival/departure updates a booking summary.                                               |
| Resizable       | Support inbox balances message list and reading space.                                             |
| Scroll Area     | Activity, plan comparison, two-axis project data, and nested notes retain overflow/focus coverage. |
| Select          | Email digest frequency changes the delivery explanation.                                           |
| Selectable Card | Laboratory shipment selection reports the batch count.                                             |
| Selector        | Environment selection and explicit threshold commit update monitoring feedback.                    |
| Separator       | Order lines, shipping, and total use distinct semantic groups.                                     |
| Sheet           | Edit delivery instructions alongside the order; save closes the panel and updates the summary.     |
| Sidebar         | Workspace section selection updates active state and local content.                                |
| Skeleton        | Toggle loading/loaded directory states with consistent layout and announcements.                   |
| Slider          | Reading-width control updates an article preview; upstream thumb-labeling gap stays explicit.      |
| Sonner          | Archive a conversation and undo from the toast.                                                    |
| Spinner         | Export preparation has disabled pending control and completion feedback.                           |
| Status Dot      | Service health includes written statuses rather than color alone.                                  |
| Stepped Form    | Existing validated team onboarding, backward value preservation, review, and submission retained.  |
| Stepper         | Document preparation progress changes the current task description.                                |
| Switch          | Project email preference updates immediate state feedback.                                         |
| Table           | Warehouse stock comparison offers a row-specific restock request.                                  |
| Tabs            | Shift handover separates plan, log, and crew information.                                          |
| Text            | Editorial hierarchy combines introduction, body, section label, and attribution.                   |
| Textarea        | Support request validates message length and reports sample submission.                            |
| Thumbnail       | Incoming attachments pair image/fallback with file names and metadata.                             |
| Time Input      | Consultation scheduler shows a selected time and explicit time zone.                               |
| Timestamp       | Document activity differentiates relative and exact event dates.                                   |
| Toggle          | Assigned-to-me filter changes the review queue and result count.                                   |
| Toggle Group    | Task list/board selection changes the same data's layout.                                          |
| Token           | Remove individual inventory filters and update visible results.                                    |
| Tokenizer       | Separate known reviewers from freely created topic tags.                                           |
| Tooltip         | Named icon save action has supplemental tooltip and saved feedback.                                |
| Video Player    | Captioned training sample supports lesson completion.                                              |
| Visually Hidden | Statement download includes supplemental accessible file information.                              |

Validation: Svelte MCP documentation consulted; all 64 changed Svelte files pass svelte-autofixer with zero issues and suggestions. `pnpm check` reports zero errors and warnings. Changed-file Prettier and ESLint pass. Integrated production and browser verification is performed by the orchestrator after the new preview loader is available.

No dependencies, shared loader changes, frozen primitive edits, or pushes.
