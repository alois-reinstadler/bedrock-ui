# Email Client template

Route: `/templates/email-client`. The shared template layout supplies the Bedrock header and catalogue return link.

A responsive three-pane mailbox with fictional `.example` identities, local search, unread/starred filters, read state, individual and bulk archive/delete, starring, a reply/compose dialog with native validation, a working Sent folder, attachment preview, and an invitation calendar. No message is sent over a network. State resets on reload; the submit dialog makes this limitation explicit.

## Bedrock dependencies

Avatar, Badge, Button, Checkbox, Dialog, DropdownMenu, Icon, IconButton, Input, InputGroup, Label, ScrollArea, Separator, Sheet, and Textarea. No block dependency and no new package dependencies. The local typed data module is imported only by this template.

## Interaction and accessibility decisions

- Native buttons expose list selection and actions; native checkbox semantics support bulk selection.
- Desktop provides folder, list, and reading panes. Tablet collapses folders into a Sheet. Mobile displays one pane at a time with a Back control.
- Opening a message focuses its heading; returning focuses the list heading. Hidden mobile panes use visibility so they are unavailable to keyboard navigation.
- Bedrock Dialog and Sheet own focus containment, Escape, labels, and focus restoration. Compose uses required labeled fields and an email input.
- Slash focuses search and C opens compose within the mail app, excluding text fields, modifier combinations, and open overlays. Arrow navigation applies only on message-summary controls.
- Local state changes announce through a polite live region. Sent messages remain readable after composing.
- Colors use theme tokens; avatar initials have explicit light/dark pairs. The inherited Avatar internals exception is not claimed fixed here.
- Pane transitions use Bedrock tokens and collapse to effectively zero duration under reduced motion.

## Verification

Focused Playwright coverage lives beside the template and exercises search/empty state, bulk archive, compose/Sent, calendar invitation, mobile reading/focus restoration, Sheet Escape, and horizontal overflow. Final production browser verification and screenshots follow integration into the shared site shell.

Takeover verification: `pnpm check` completed with 0 errors and 0 warnings; changed-file ESLint and Prettier passed; Svelte MCP autofixer returned zero issues and suggestions for both Svelte files. Three focused Playwright tests passed against the managed development preview (desktop, mobile reduced motion, mobile standard-motion focus). Shared Chrome inspection found no warnings or errors. Screenshots: `static/templates/email-client/thumbnail.png`, `/tmp/bedrock-email-mobile-dark.png`. Production integration remains an orchestrator check.
