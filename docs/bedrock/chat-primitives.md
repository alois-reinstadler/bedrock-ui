# Chat primitives

Chat remains a primitive family. A complete chat screen belongs to the consuming app: the app owns messages, stable ids, uploads, audio, provider integration, persistence, approvals, and tools. None of the primitives execute a tool or assume a particular AI SDK.

## Choose a composition

| Need                                                  | Compose                                                                                                                                      |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Assistant chat with sensible defaults                 | `Chat.Root` → `Chat.MessageList` → keyed `Chat.Message` → `Chat.MessageBubble`; place `Chat.Composer` after the log                          |
| Messenger with avatars, reactions, or custom surfaces | Generic `Message.Root`, `Message.Avatar`, `Message.Content`, `Bubble.Root`, `Bubble.Content`, `Bubble.Reactions` inside `Chat.MessageList`   |
| Recovery and editing                                  | `Chat.MessageStatus`, `Chat.MessageActions`, `Chat.MessageEditor`; let callbacks update the app's messages                                   |
| Mixed task/tool timeline                              | `Chat.Activity` with stable `steps[].id`                                                                                                     |
| Tool-call summary                                     | `Chat.ToolCalls` with stable `calls[].key`; multiple calls share a collapsible group                                                         |
| Custom activity composition                           | `Chat.ActivityItem` with bindable `open`, details, progress, and optional rich children                                                      |
| Explanatory reasoning prose                           | `Chat.Reasoning` with bindable `open` and `working`; it is not a second task timeline                                                        |
| Inline source preview                                 | `Chat.Citation` with a `ChatSource`; opens the same `Chat.SourceCard` used elsewhere                                                         |
| Source list or individual source                      | `Chat.Sources` or `Chat.SourceCard`, using the same `ChatSource` records                                                                     |
| Direct source link                                    | Generic `Citation` with `number` and `CitationSource.url`; use when no preview is needed                                                     |
| Already-sent image, PDF, or file                      | `Chat.Attachment` inside `Chat.Attachments`; it provides compact preview/removal defaults                                                    |
| Local files and upload lifecycle                      | `Chat.Composer` with `files` and `uploads`, or exported `Chat.ComposerFile` in a custom composer                                             |
| Fully custom file card                                | Generic `Attachment.Root`, `Media`, `Content`, `Title`, `Description`, `Actions`, and `Trigger`                                              |
| Decisions inside a response                           | `Chat.Approval`, `Questions`, `Recommendation`, `ChangeReview`; each delegates mutations to app callbacks                                    |
| Custom input toolbar                                  | `Chat.ModelPicker`, `ReasoningPicker`, `Voice`, and `ComposerFile`; `Composer` also offers `actions`, `headerActions`, and `drawer` snippets |

## Consolidated implementation

`ActivityItem` owns activity status presentation, detail disclosure, progress, and errors. `Activity` and `ToolCalls` are arrangements of that same primitive. They share `ChatActivityStatus` (`pending`, `running`, `complete`, `error`) and `ChatActivityStatusLabels`. `ChatToolCallStatus` remains a compatibility alias. Rows without content are noninteractive; compact rows still expose status text to assistive technology. A stable tool key preserves the expanded detail when streamed calls are reordered.

The internal `createChatAction` owns duplicate-request locking, rejection state, and disposal for workflow decisions, message editing, message actions, delivery retries, and history retries. Composer retains its specialized draft/file clearing behavior, and Voice retains its separate recording lifecycle.

`MessageActions` now awaits async retry and rating callbacks. A failed rating keeps the previous selection; rejected operations show a retryable error. `onFeedbackChange` receives `null` when clearing a rating, while the legacy `onFeedback` only receives non-null selections. If both callbacks are supplied, both run sequentially; normally use `onFeedbackChange` for persistence and reserve the legacy callback for existing consumers. These callbacks cannot provide a transaction across two external services.

## Intentional differences

`Chat.Message` already wraps generic `Message`, adding role-based alignment. `Chat.MessageBubble` is an opinionated single surface with sender tails and first/middle/last grouping; generic `Bubble` separates its container, surface, and reactions and supports seven variants. Their DOM and layout contracts differ, so forcing an alias would break existing styling. Use one surface per message.

`Chat.ComposerFile` already reuses generic `Attachment` for upload cards and cleans up its preview URLs. `Chat.Attachment` is a compact sent-file chip with image/PDF lightbox defaults and an inline span contract. It intentionally remains separate from the generic compound card. Supply an explicit `type` when an attachment URL does not identify its media type.

`Chat.Citation`, `Chat.SourceCard`, and `Chat.Sources` share the same source shape and source-card implementation. Generic `Citation` is a direct numbered link, not a popover. The two source shapes remain compatible with existing consumers: adapt `ChatSource.href` to `CitationSource.url` when selecting direct-link presentation.

Message delivery status and activity status are different lifecycles. `sending`/`streaming` describes a message, while `pending`/`running` describes work performed within it. Keep both rather than translating one into the other.

## Compatibility and ownership

Existing imports, callback names, `ToolCalls.expanded`, `Activity.steps`, compact tool-call data slots, and chat grouping remain available. `ActivityItem`, its status types, and `ComposerFile` are additive exports. No chat primitive was moved to Blocks or removed.

Render history with stable keys. Do not feed the same event to both `Activity` and `ToolCalls` unless deliberately presenting two views. MessageList owns its log announcement; avoid nesting another live log. Only expose actual, application-provided reasoning and source data. Demo messages, simulated failures, and fake streams remain examples rather than primitive defaults.
