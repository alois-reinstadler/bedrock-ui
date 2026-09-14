# Contextual examples: batch 2

Each of the 34 families below has a separate compact preview in `src/lib/site/previews/` and a product-context example in `src/lib/site/examples/`. The route owner loads them independently. Explicit preview IDs have a separate prefix, and the Superforms preview uses its own form identifier.

| Family             | Contextual scenario              |
| ------------------ | -------------------------------- |
| `empty`            | First project onboarding         |
| `field`            | Delivery instructions            |
| `field-status`     | Choose a workspace address       |
| `file-input`       | Expense receipt attachments      |
| `form`             | Account recovery email           |
| `heading`          | Editorial hierarchy              |
| `hover-card`       | Decision ownership               |
| `icon`             | Backup activity                  |
| `icon-button`      | Document row actions             |
| `indicator`        | Audience selection               |
| `input`            | Monthly product digest           |
| `input-group`      | Order lookup                     |
| `input-otp`        | Confirm a new device             |
| `item`             | Project handoff files            |
| `kbd`              | Keyboard shortcut reference      |
| `label`            | Billing contact form             |
| `lightbox`         | Inspection evidence              |
| `link`             | Project handoff note             |
| `list`             | Workspace setup guide            |
| `markdown`         | Project update from an editor    |
| `menubar`          | Draft editor commands            |
| `metadata-list`    | Support case details             |
| `multi-selector`   | Regional rollout audience        |
| `native-select`    | Order fulfillment                |
| `navigation-menu`  | Product resource navigation      |
| `number-input`     | Workspace storage estimate       |
| `outline`          | Project proposal navigation      |
| `overflow-list`    | Issue labels in a narrow sidebar |
| `pagination`       | Customer directory               |
| `pdf-viewer`       | Invoice review                   |
| `popover`          | Report display settings          |
| `power-search`     | Orders requiring attention       |
| `progress`         | Workspace preparation            |
| `progressive-blur` | Activity panel with soft edges   |

## Interaction and accessibility decisions

- Example mutations are local and explicitly described as demonstrations. No files, messages, or account changes are sent to a server.
- Form scenarios use persistent labels, native required/email constraints, and status feedback. Input wrappers receive controlled values through their public event callbacks rather than unsupported bindings.
- Document icon actions expose descriptive names and pressed state. Indicators remain decorative within controls that own interaction.
- The shortcut help accepts `?` only outside editable controls and also has an ordinary button. It does not require the shortcut.
- Pagination slices actual directory rows; search filters actual orders; rollout selection and storage estimates update their summaries.
- Existing Progressive Blur diagnostic surfaces and the `Inspect samples` focus test remain intact. Its preview action has a distinct name. The new activity panel uses ScrollArea edge detection instead of an always-visible mask.
- Heading previews demonstrate visual scales at a consistent semantic level, avoiding an extra document-level heading.
- No dependencies, public APIs, navigation, route loaders, or frozen shadcn files changed.

## Verification

- `pnpm check`: 0 errors, 0 warnings.
- Changed-file Prettier: passes for all 68 Svelte files.
- Changed-file ESLint: passes for all 68 Svelte files.
- Official Svelte MCP documentation consulted for state, derived values, snippets, and accessibility.
- `svelte-autofixer`: all 68 changed Svelte files report zero issues and zero suggestions in the final pass.
- Static preview/example ID intersection check: no duplicate explicit IDs within any family pair.
- Integrated production browser and route regression coverage is owned by the orchestrator; this batch does not claim independent browser verification.
