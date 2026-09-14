import type { ComponentGuides } from './types';

export const overlayGuides = {
	'alert-dialog': {
		purpose:
			'Alert Dialog interrupts the current task to ask for an explicit decision before a consequential action. It pairs an alertdialog surface with clearly separated safe and affirmative choices so a destructive operation cannot happen by accident.',
		useWhen: [
			'Deleting a record, project, account, or other data that cannot be restored.',
			'Voiding, cancelling, or publishing a business object when the outcome has lasting consequences.',
			'Confirming an operation whose scope or side effects deserve one final review.'
		],
		avoidWhen: [
			'Use Dialog for a focused task or form that does not demand a binary safety decision.',
			'Use a normal button plus inline feedback for reversible, low-risk actions.',
			'Do not use it as a generic warning message; use Alert or Banner when no immediate decision is required.'
		],
		anatomy: [
			{
				name: 'AlertDialog.Root',
				description:
					'Owns the bindable open state and coordinates all dialog parts. Alias: AlertDialog.AlertDialog.',
				required: true
			},
			{
				name: 'AlertDialog.Trigger',
				description:
					'Opens the dialog and accepts a child snippet for delegating its behavior to a Button. Omit it only when Root.open is controlled elsewhere. Alias: AlertDialog.AlertDialogTrigger.'
			},
			{
				name: 'AlertDialog.Portal',
				description:
					'Moves custom dialog layers out of clipping and stacking contexts. Content already creates this portal, so do not wrap ordinary Content again. Alias: AlertDialog.AlertDialogPortal.'
			},
			{
				name: 'AlertDialog.Overlay',
				description:
					'Dims and visually separates the blocked page behind the alert. Content renders it automatically with Bedrock overlay motion. Alias: AlertDialog.AlertDialogOverlay.'
			},
			{
				name: 'AlertDialog.Content',
				description:
					'Creates the portalled modal surface, overlay, focus scope, scroll lock, and default or small layout. Alias: AlertDialog.AlertDialogContent.',
				required: true
			},
			{
				name: 'AlertDialog.Header',
				description:
					'Groups Media, Title, and Description and aligns them responsively. Alias: AlertDialog.AlertDialogHeader.'
			},
			{
				name: 'AlertDialog.Media',
				description:
					'Holds an optional icon or illustration and adjusts the Header grid when present. Alias: AlertDialog.AlertDialogMedia.'
			},
			{
				name: 'AlertDialog.Title',
				description:
					'Provides the visible heading and the accessible name referenced by Content. Alias: AlertDialog.AlertDialogTitle.',
				required: true
			},
			{
				name: 'AlertDialog.Description',
				description:
					"Explains the consequence and exact action scope, and supplies Content's accessible description. Alias: AlertDialog.AlertDialogDescription.",
				required: true
			},
			{
				name: 'AlertDialog.Footer',
				description:
					'Groups decision controls and stacks them on narrow screens. Alias: AlertDialog.AlertDialogFooter.'
			},
			{
				name: 'AlertDialog.Cancel',
				description:
					'Renders the safe outline action and closes the dialog when activated. Alias: AlertDialog.AlertDialogCancel.',
				required: true
			},
			{
				name: 'AlertDialog.Action',
				description:
					'Renders the affirmative action with Button variants; the consumer performs the operation and owns successful closure. Alias: AlertDialog.AlertDialogAction.',
				required: true
			}
		],
		behavior: [
			'Root.open supports two-way binding and onOpenChange; Trigger is unnecessary when a parent controls that state.',
			'Content is portalled, locks page scrolling, traps Tab focus, receives initial focus, and restores focus on close.',
			'Escape closes the alert unless the consumer prevents the escape event; outside interaction is ignored by default.',
			'Cancel closes itself. Action does not change Root.open in the current implementation, so an affirmative handler must close a controlled Root after the operation succeeds.',
			'Content and Overlay use the semantic overlay motion class and resolve immediately under reduced motion.'
		],
		examplePlan: [
			{
				title: 'Confirm a destructive operation',
				demonstrates:
					'A controlled delete flow with explicit scope, Cancel as the safe choice, Action performing the operation, and the handler closing the dialog after success.',
				priority: 'primary'
			},
			{
				title: 'Icon-led compact confirmation',
				demonstrates:
					'The small Content size with Media, a concise title and description, and responsive footer ordering.',
				priority: 'secondary'
			},
			{
				title: 'Pending confirmation',
				demonstrates:
					'An asynchronous affirmative action that stays open and disables both choices while pending, then reports failure without losing the decision context.',
				priority: 'edge-case'
			}
		]
	},
	command: {
		purpose:
			'Command turns a query into a ranked, keyboard-navigable set of actions or destinations. It can live inline or inside the supplied dialog wrapper, and it exposes selection state without executing product behavior on its own.',
		useWhen: [
			'Providing a keyboard-first command palette for application actions and navigation.',
			'Filtering a moderate action set where users know part of the command name.',
			'Building the searchable list inside a selector or another composed picker.'
		],
		avoidWhen: [
			'Use Selector, Combobox, or Multi Selector when the result is a form value rather than an action.',
			'Use Dropdown Menu when the small action set does not need search or ranking.',
			'Do not use it for full-text search results, server pagination, or an unbounded data browser.'
		],
		anatomy: [
			{
				name: 'Command.Root',
				description:
					'Owns filtering, ranking, keyboard selection, the bindable selected value, and the optional imperative API. Alias: Command.Command.',
				required: true
			},
			{
				name: 'Command.Dialog',
				description:
					'Alternative top-level composition that places an internal Command.Root in a modal Dialog with bindable open and value state. Alias: Command.CommandDialog.'
			},
			{
				name: 'Command.Input',
				description:
					'Captures the bindable search query and supplies the styled search field. Alias: Command.CommandInput.'
			},
			{
				name: 'Command.List',
				description:
					"Contains the filtered results in a vertically scrolling viewport capped at the component's default height. Alias: Command.CommandList.",
				required: true
			},
			{
				name: 'Command.Empty',
				description:
					'Appears after filtering leaves no matching items. Alias: Command.CommandEmpty.'
			},
			{
				name: 'Command.Loading',
				description:
					'Represents loading content and can expose determinate progress from 0 to 100. Alias: Command.CommandLoading.'
			},
			{
				name: 'Command.Group',
				description:
					'Groups related items and optionally creates its heading from the heading prop. Alias: Command.CommandGroup.'
			},
			{
				name: 'Command.Item',
				description:
					'Represents a selectable command and calls onSelect after pointer or keyboard activation. Alias: Command.CommandItem.',
				required: true
			},
			{
				name: 'Command.LinkItem',
				description:
					'Provides the same searchable command-item behavior while rendering a real anchor for navigation. Alias: Command.CommandLinkItem.'
			},
			{
				name: 'Command.Separator',
				description:
					'Visually divides meaningful result sections and follows filtering visibility. Alias: Command.CommandSeparator.'
			},
			{
				name: 'Command.Shortcut',
				description:
					'Displays a keyboard shortcut hint at the end of an Item; it does not register or execute that shortcut. Alias: Command.CommandShortcut.'
			}
		],
		behavior: [
			'Root automatically scores and hides items from the Input query; shouldFilter=false hands rendering and ranking to the consumer.',
			'Arrow Up and Arrow Down change the active item, Home and End jump to the boundaries, and Enter selects. Optional loop and Ctrl+N/J/P/K navigation are forwarded from bits-ui.',
			"Disabled items are skipped. Stable value and keywords props are important when an item's visible text is dynamic.",
			'List scrolls the active result into view and contains horizontal overflow; Root can report its full filtered state through onStateChange.',
			'Dialog supplies a hidden title and description, portals the modal, traps focus, and defaults to no close button; its open state must be driven by a shortcut or another control.'
		],
		examplePlan: [
			{
				title: 'Search and run actions',
				demonstrates:
					'An inline Input, grouped List, disabled Item, Empty state, keyboard selection, stable values, and onSelect updating visible result feedback.',
				priority: 'primary'
			},
			{
				title: 'Application command palette',
				demonstrates:
					'Command.Dialog opened by a documented keyboard shortcut, with action Items, navigation LinkItems, and Shortcut labels that remain display-only.',
				priority: 'secondary'
			},
			{
				title: 'Remote result lifecycle',
				demonstrates:
					'Consumer-owned filtering with shouldFilter disabled, Loading progress while a query runs, then populated and Empty states without losing the query.',
				priority: 'edge-case'
			}
		]
	},
	'context-menu': {
		purpose:
			'Context Menu exposes actions that apply to the object or region under the pointer. It preserves the compact right-click convention while supplying keyboard navigation, selectable preferences, nested actions, and accessible menu roles.',
		useWhen: [
			'Offering object-specific actions on a table row, canvas object, file, or editor region.',
			'Providing expert shortcuts that duplicate actions available through a visible path.',
			'Grouping contextual commands, toggles, or mutually exclusive view options near the pointer.'
		],
		avoidWhen: [
			'Do not make it the only way to reach an action; touch and keyboard users need an equivalent visible path.',
			'Use Dropdown Menu for a button-invoked action list.',
			'Use Popover when the floating surface contains arbitrary interactive controls rather than menu items.'
		],
		anatomy: [
			{
				name: 'ContextMenu.Root',
				description:
					'Owns bindable open state, direction, and menu coordination. Alias: ContextMenu.ContextMenu.',
				required: true
			},
			{
				name: 'ContextMenu.Trigger',
				description:
					'Defines the region whose context-menu gesture opens the menu; it renders a div by default and can be disabled. Alias: ContextMenu.ContextMenuTrigger.',
				required: true
			},
			{
				name: 'ContextMenu.Portal',
				description:
					'Moves custom menu content out of clipping contexts. Content already portals itself. Alias: ContextMenu.ContextMenuPortal.'
			},
			{
				name: 'ContextMenu.Content',
				description:
					'Creates the positioned, portalled menu surface at the context gesture and applies Bedrock popover motion. Alias: ContextMenu.ContextMenuContent.',
				required: true
			},
			{
				name: 'ContextMenu.Item',
				description:
					'Runs one action; supports disabled, inset, default, and destructive presentation. Alias: ContextMenu.ContextMenuItem.',
				required: true
			},
			{
				name: 'ContextMenu.CheckboxItem',
				description:
					'Represents one bindable checked or indeterminate menu preference and renders its check indicator. Alias: ContextMenu.ContextMenuCheckboxItem.'
			},
			{
				name: 'ContextMenu.RadioGroup',
				description:
					'Owns the bindable value for a mutually exclusive set of RadioItems. Alias: ContextMenu.ContextMenuRadioGroup.'
			},
			{
				name: 'ContextMenu.RadioItem',
				description:
					'Represents one required value within a RadioGroup and renders its selected indicator. Alias: ContextMenu.ContextMenuRadioItem.'
			},
			{
				name: 'ContextMenu.Group',
				description:
					'Creates a semantic group for related items and connects an optional GroupHeading. Alias: ContextMenu.ContextMenuGroup.'
			},
			{
				name: 'ContextMenu.GroupHeading',
				description:
					'Names its containing Group or RadioGroup for assistive technology. Alias: ContextMenu.ContextMenuGroupHeading.'
			},
			{
				name: 'ContextMenu.Label',
				description:
					'Adds visual section text without establishing the GroupHeading relationship. Alias: ContextMenu.ContextMenuLabel.'
			},
			{
				name: 'ContextMenu.Separator',
				description:
					'Visually separates meaningful action groups. Alias: ContextMenu.ContextMenuSeparator.'
			},
			{
				name: 'ContextMenu.Shortcut',
				description:
					'Displays an existing keyboard shortcut; it does not bind the key command. Alias: ContextMenu.ContextMenuShortcut.'
			},
			{
				name: 'ContextMenu.Sub',
				description:
					'Owns bindable open state for one nested menu. Alias: ContextMenu.ContextMenuSub.'
			},
			{
				name: 'ContextMenu.SubTrigger',
				description:
					'Acts as the parent-menu item that opens a Sub and displays its direction indicator. Alias: ContextMenu.ContextMenuSubTrigger.'
			},
			{
				name: 'ContextMenu.SubContent',
				description:
					'Contains the nested menu items and applies Bedrock popover motion. Alias: ContextMenu.ContextMenuSubContent.'
			}
		],
		behavior: [
			'Right-click opens at the pointer. Touch uses the underlying long-press gesture, so a visible alternative remains necessary for discoverability.',
			'Arrow keys move through enabled items, Home and End reach the boundaries, typeahead matches item text, Enter or Space selects, and Escape closes the innermost menu.',
			'Submenus open from SubTrigger by pointer or directional keyboard input and return focus to the parent item when closed.',
			'Item closes on selection by default; closeOnSelect can keep preference menus open. CheckboxItem and RadioGroup expose bindable state.',
			'Content portals and collision-adjusts around the viewport; Content and SubContent use semantic popover motion with reduced-motion fallback.'
		],
		examplePlan: [
			{
				title: 'Record actions at the pointer',
				demonstrates:
					'A realistic row trigger, grouped actions, disabled state, destructive action, visible equivalent action button, and keyboard selection feedback.',
				priority: 'primary'
			},
			{
				title: 'Contextual view preferences',
				demonstrates:
					'Bindable CheckboxItem and RadioGroup state, semantic GroupHeading, visual Label, and Shortcut text without implying automatic shortcut registration.',
				priority: 'secondary'
			},
			{
				title: 'Nested actions near an edge',
				demonstrates:
					'Sub, SubTrigger, and SubContent with collision-aware placement, disabled nested items, and Escape closing only the submenu first.',
				priority: 'edge-case'
			}
		]
	},
	dialog: {
		purpose:
			"Dialog isolates a short, focused task from the page while preserving the user's place. It supplies modal semantics, focus containment, scroll locking, dismissal, and a conventional header and action layout.",
		useWhen: [
			'Editing a compact form or reviewing details without navigating away from the current context.',
			'Collecting a decision that is important but not inherently destructive.',
			'Presenting a bounded task whose content and actions fit comfortably in a modal surface.'
		],
		avoidWhen: [
			'Use Alert Dialog for irreversible confirmation.',
			'Use Sheet for a taller edge-aligned workspace or Drawer for a touch-first draggable panel.',
			'Use a dedicated route when the task is long, linkable, deep, or needs substantial navigation.'
		],
		anatomy: [
			{
				name: 'Dialog.Root',
				description:
					'Owns bindable open state and coordinates nested dialog parts. Alias: Dialog.Dialog.',
				required: true
			},
			{
				name: 'Dialog.Trigger',
				description:
					'Opens the dialog and accepts child-snippet delegation to a Button or another valid trigger. Alias: Dialog.DialogTrigger.'
			},
			{
				name: 'Dialog.Portal',
				description:
					'Moves custom layers outside clipping and stacking contexts; Content already owns one. Alias: Dialog.DialogPortal.'
			},
			{
				name: 'Dialog.Overlay',
				description:
					'Dims the blocked page; Content includes it automatically with Bedrock overlay motion. Alias: Dialog.DialogOverlay.'
			},
			{
				name: 'Dialog.Content',
				description:
					'Creates the centred portalled surface, overlay, focus scope, scroll lock, and optional icon close button. Alias: Dialog.DialogContent.',
				required: true
			},
			{
				name: 'Dialog.Header',
				description:
					'Groups the visible title and description with consistent spacing. Alias: Dialog.DialogHeader.'
			},
			{
				name: 'Dialog.Title',
				description:
					'Provides the heading and accessible name referenced by Content. Alias: Dialog.DialogTitle.',
				required: true
			},
			{
				name: 'Dialog.Description',
				description:
					"Explains the task and supplies Content's accessible description. Alias: Dialog.DialogDescription."
			},
			{
				name: 'Dialog.Footer',
				description:
					'Arranges task actions responsively and can add a default outline close action. Alias: Dialog.DialogFooter.'
			},
			{
				name: 'Dialog.Close',
				description:
					'Closes the dialog and supports child-snippet delegation for a custom Button. Alias: Dialog.DialogClose.'
			}
		],
		behavior: [
			'Root.open supports two-way binding and onOpenChange, so a trigger can be omitted for programmatic flows.',
			'Content portals to the document, traps and loops focus, locks background scrolling, and restores focus to the trigger after close.',
			'Escape, outside interaction, Close, and the default icon button dismiss unless the corresponding cancellable handler prevents it.',
			'Content.showCloseButton defaults to true. Footer.showCloseButton is a separate optional text close action; avoid rendering redundant dismissal controls.',
			'Title and Description IDs wire to the dialog role automatically. Keep a Title even when visually hiding it.',
			'Content and Overlay use semantic overlay motion and preserve final state and focus behavior when reduced motion is requested.'
		],
		examplePlan: [
			{
				title: 'Edit a focused record',
				demonstrates:
					'A labelled modal form with Description, validation, explicit Cancel through Close, submit behavior, initial focus, and focus restoration.',
				priority: 'primary'
			},
			{
				title: 'Controlled details dialog',
				demonstrates:
					'Programmatic bind:open without Trigger, a hidden but accessible Title, and one intentional close-control strategy.',
				priority: 'secondary'
			},
			{
				title: 'Long modal content',
				demonstrates:
					'Consumer-supplied bounded scrolling at narrow and zoomed viewports while the header, actions, accessible name, and focus scope remain usable.',
				priority: 'edge-case'
			}
		]
	},
	drawer: {
		purpose:
			'Drawer presents a modal panel that users can drag from an edge and dismiss with a gesture. It is the touch-first overlay for transient controls or detail, with snap points and nested drawers available when the interaction truly needs physical progression.',
		useWhen: [
			'Presenting mobile filters, choices, or supporting details in a panel users can swipe away.',
			'Offering a bottom sheet with meaningful partial and expanded snap points.',
			'Building a nested touch workflow where each panel remains a distinct modal step.'
		],
		avoidWhen: [
			'Use Sheet for a deterministic edge panel that should not expose drag physics or snap points.',
			'Use Dialog for a compact centred task.',
			'Do not use a drawer for persistent app navigation or content that deserves its own route.'
		],
		anatomy: [
			{
				name: 'Drawer.Root',
				description:
					'Owns bindable open and activeSnapPoint state, drag behavior, direction, modality, and dismissal policy. Alias: Drawer.Drawer.',
				required: true
			},
			{
				name: 'Drawer.NestedRoot',
				description:
					'Alternative root for a drawer opened inside another drawer while preserving nested coordination. Alias: Drawer.DrawerNestedRoot.'
			},
			{
				name: 'Drawer.Trigger',
				description:
					'Opens the drawer and can delegate to an existing Button through its child snippet. Alias: Drawer.DrawerTrigger.'
			},
			{
				name: 'Drawer.Portal',
				description:
					'Moves custom drawer layers out of clipping contexts; Content already creates one. Alias: Drawer.DrawerPortal.'
			},
			{
				name: 'Drawer.Overlay',
				description:
					'Dims the blocked page and is rendered automatically by Content. Alias: Drawer.DrawerOverlay.'
			},
			{
				name: 'Drawer.Content',
				description:
					'Creates the fixed, portalled drawer surface and bottom-edge drag indicator, and applies Bedrock drawer motion. Alias: Drawer.DrawerContent.',
				required: true
			},
			{
				name: 'Drawer.Header',
				description:
					'Groups title and description, centring bottom and top drawer text until the medium breakpoint. Alias: Drawer.DrawerHeader.'
			},
			{
				name: 'Drawer.Title',
				description:
					'Provides the visible heading and accessible name for the drawer dialog. Alias: Drawer.DrawerTitle.',
				required: true
			},
			{
				name: 'Drawer.Description',
				description:
					'Explains the panel task and supplies its accessible description. Alias: Drawer.DrawerDescription.'
			},
			{
				name: 'Drawer.Footer',
				description:
					'Pins a vertical action group after the drawer body. Alias: Drawer.DrawerFooter.'
			},
			{
				name: 'Drawer.Close',
				description:
					'Closes the current drawer and can delegate behavior to a custom Button. Alias: Drawer.DrawerClose.'
			}
		],
		behavior: [
			'Root defaults to a bottom drawer and supports top, left, and right directions; horizontal drawers cap at three quarters width and a small-screen maximum.',
			'Pointer drag, release velocity, closeThreshold, snapPoints, and bind:activeSnapPoint come from vaul-svelte. ScrollLockTimeout prevents a content scroll from immediately becoming a dismiss gesture.',
			'Dismissible controls whether drag, outside click, and Escape may close; modal=false allows outside interaction and changes the expected focus contract.',
			'Content portals and includes Overlay. Modal usage locks background interaction and returns focus through the underlying dialog behavior.',
			'Root defaults shouldScaleBackground to true, but visible page scaling requires the surrounding Vaul page-wrapper convention.',
			'Bedrock applies drawer motion to Content and overlay motion to Overlay; reduced motion must not delay the final open or closed state.'
		],
		examplePlan: [
			{
				title: 'Mobile filter drawer',
				demonstrates:
					'A bottom drawer with a labelled Header, scrollable filter body, reset and apply actions in Footer, swipe dismissal, and explicit Close.',
				priority: 'primary'
			},
			{
				title: 'Snap-point detail panel',
				demonstrates:
					'Multiple snapPoints with bind:activeSnapPoint, enough real content to explain partial versus expanded states, and scroll-to-drag handoff.',
				priority: 'secondary'
			},
			{
				title: 'Nested drawer',
				demonstrates:
					'NestedRoot opened from a parent Drawer, Escape and Close affecting only the top panel, and focus returning to the nested trigger.',
				priority: 'edge-case'
			}
		]
	},
	'dropdown-menu': {
		purpose:
			'Dropdown Menu places a compact set of commands or settings behind an explicit trigger. It manages menu semantics, roving keyboard focus, typeahead, checked choices, and nested menus without turning the trigger into a form field.',
		useWhen: [
			'Collecting secondary actions behind a More, account, row-action, or toolbar button.',
			'Offering a short set of menu preferences with checkbox or radio state.',
			'Organising a bounded action hierarchy that benefits from one submenu level.'
		],
		avoidWhen: [
			'Use Select, Selector, or Combobox when the trigger represents a selected form value.',
			'Use Context Menu for right-click actions tied to a pointer location.',
			'Use Popover when the surface contains forms, rich controls, or arbitrary layout rather than menu items.'
		],
		anatomy: [
			{
				name: 'DropdownMenu.Root',
				description:
					'Owns bindable open state, direction, and menu coordination. Alias: DropdownMenu.DropdownMenu.',
				required: true
			},
			{
				name: 'DropdownMenu.Trigger',
				description:
					'Opens the menu and accepts child-snippet delegation to an existing Button. Alias: DropdownMenu.DropdownMenuTrigger.',
				required: true
			},
			{
				name: 'DropdownMenu.Portal',
				description:
					'Moves custom menu layers out of clipping contexts; Content already portals itself. Alias: DropdownMenu.DropdownMenuPortal.'
			},
			{
				name: 'DropdownMenu.Content',
				description:
					'Creates the positioned, collision-aware menu surface and applies Bedrock popover motion. Alias: DropdownMenu.DropdownMenuContent.',
				required: true
			},
			{
				name: 'DropdownMenu.Item',
				description:
					'Runs one command and supports disabled, inset, default, and destructive presentation. Alias: DropdownMenu.DropdownMenuItem.',
				required: true
			},
			{
				name: 'DropdownMenu.CheckboxGroup',
				description:
					'Owns a bindable string array for grouped CheckboxItems. Alias: DropdownMenu.DropdownMenuCheckboxGroup.'
			},
			{
				name: 'DropdownMenu.CheckboxItem',
				description:
					'Represents one checked or indeterminate setting and renders its indicator. Alias: DropdownMenu.DropdownMenuCheckboxItem.'
			},
			{
				name: 'DropdownMenu.RadioGroup',
				description:
					'Owns the bindable selected value for mutually exclusive RadioItems. Alias: DropdownMenu.DropdownMenuRadioGroup.'
			},
			{
				name: 'DropdownMenu.RadioItem',
				description:
					'Represents one required value in a RadioGroup and renders its selected indicator. Alias: DropdownMenu.DropdownMenuRadioItem.'
			},
			{
				name: 'DropdownMenu.Group',
				description:
					'Creates a semantic group for related items and connects GroupHeading. Alias: DropdownMenu.DropdownMenuGroup.'
			},
			{
				name: 'DropdownMenu.GroupHeading',
				description:
					'Names its containing Group, CheckboxGroup, or RadioGroup for assistive technology. Alias: DropdownMenu.DropdownMenuGroupHeading.'
			},
			{
				name: 'DropdownMenu.Label',
				description:
					'Adds visual menu section text without creating the GroupHeading relationship. Alias: DropdownMenu.DropdownMenuLabel.'
			},
			{
				name: 'DropdownMenu.Separator',
				description:
					'Visually divides meaningful action groups. Alias: DropdownMenu.DropdownMenuSeparator.'
			},
			{
				name: 'DropdownMenu.Shortcut',
				description:
					'Displays an existing keyboard shortcut without registering it. Alias: DropdownMenu.DropdownMenuShortcut.'
			},
			{
				name: 'DropdownMenu.Sub',
				description:
					'Owns bindable open state for one nested menu. Alias: DropdownMenu.DropdownMenuSub.'
			},
			{
				name: 'DropdownMenu.SubTrigger',
				description:
					'Acts as the parent-menu item that opens a Sub and displays its direction indicator. Alias: DropdownMenu.DropdownMenuSubTrigger.'
			},
			{
				name: 'DropdownMenu.SubContent',
				description:
					'Contains nested menu items and applies Bedrock popover motion. Alias: DropdownMenu.DropdownMenuSubContent.'
			}
		],
		behavior: [
			'Trigger opens by pointer, Enter, Space, or Arrow Down; focus moves into Content and returns to the trigger when the menu closes.',
			'Arrow keys move through enabled items, Home and End reach the boundaries, typeahead matches textValue or text content, and Escape closes the innermost menu.',
			'Item closes on selection by default. closeOnSelect can preserve the surface for multi-setting interactions.',
			'CheckboxGroup and RadioGroup expose bindable values; individual CheckboxItem also binds checked and indeterminate state.',
			'Content defaults to start alignment and portals with viewport collision handling. Content and SubContent use semantic popover motion with reduced-motion fallback.'
		],
		examplePlan: [
			{
				title: 'Toolbar action menu',
				demonstrates:
					'A Button-delegated trigger, labelled action groups, disabled and destructive Items, selection feedback, typeahead, and focus restoration.',
				priority: 'primary'
			},
			{
				title: 'View settings menu',
				demonstrates:
					'CheckboxGroup, CheckboxItem, RadioGroup, RadioItem, semantic GroupHeadings, and bound state while keeping the menu open across related changes.',
				priority: 'secondary'
			},
			{
				title: 'Nested export actions',
				demonstrates:
					'Sub, SubTrigger, SubContent, Shortcut labels, collision-aware placement near a viewport edge, and Escape closing one layer at a time.',
				priority: 'edge-case'
			}
		]
	},
	'hover-card': {
		purpose:
			'Hover Card gives a link or reference a richer preview without interrupting reading or requiring a click. It opens after hover or keyboard focus and can remain available while the pointer moves into the preview.',
		useWhen: [
			'Previewing a person, project, citation, or destination from an inline link.',
			'Showing non-essential metadata that helps a user decide whether to follow a link.',
			'Revealing the hidden members of a compact Overflow List or Avatar Stack through Preview.'
		],
		avoidWhen: [
			'Use Tooltip for a terse, non-interactive hint.',
			'Use Popover when activation should be explicit or the surface contains a form or task controls.',
			'Do not place information required to understand or complete the page only inside a hover interaction.'
		],
		anatomy: [
			{
				name: 'HoverCard.Root',
				description:
					'Owns bindable open state, hover and focus delays, and disabled behavior. Alias: HoverCard.HoverCard.',
				required: true
			},
			{
				name: 'HoverCard.Trigger',
				description:
					'Defines the anchor that opens the preview on hover or focus and should delegate to a real link. Alias: HoverCard.HoverCardTrigger.',
				required: true
			},
			{
				name: 'HoverCard.Portal',
				description:
					'Moves custom preview content out of clipping contexts; Content already portals itself. Alias: HoverCard.HoverCardPortal.'
			},
			{
				name: 'HoverCard.Content',
				description:
					'Creates the collision-aware, portalled preview surface and applies Bedrock popover motion. Alias: HoverCard.HoverCardContent.',
				required: true
			},
			{
				name: 'HoverCard.Preview',
				description:
					'Convenience composition for a custom trigger snippet and a wrapping list of related items, with shorter 200 ms open and 100 ms close defaults. Alias: HoverCard.HoverCardPreview.'
			}
		],
		behavior: [
			'Root.open supports two-way binding; the base Root defaults to 700 ms open and 300 ms close delays, while Preview intentionally uses 200 ms and 100 ms.',
			'Trigger is an anchor primitive. Preserve its link destination and spread delegated props onto the focusable link.',
			'Keyboard focus opens the preview unless ignoreNonKeyboardFocus changes that policy; Escape closes and focus stays with the link.',
			'Content is portalled, collision-aware, and may stay open while pointer or focus moves into it. Avoid task-critical controls despite that hoverability.',
			'Preview requires both trigger and children snippets, wraps items in a compact flex layout, and supports align, sideOffset, and contentClass.'
		],
		examplePlan: [
			{
				title: 'Preview a linked project',
				demonstrates:
					'A real destination link, useful identity and status metadata, delayed hover, keyboard-focus opening, collision placement, and Escape dismissal.',
				priority: 'primary'
			},
			{
				title: 'Preview collapsed items',
				demonstrates:
					"HoverCard.Preview with its trigger-props snippet, wrapping child items, custom alignment, and the helper's shorter delays.",
				priority: 'secondary'
			},
			{
				title: 'Viewport-edge preview',
				demonstrates:
					'Long but non-essential metadata near a viewport boundary, automatic collision handling, pointer travel into Content, and disabled state.',
				priority: 'edge-case'
			}
		]
	},
	lightbox: {
		purpose:
			'Lightbox opens images and PDFs in a full-screen, modal viewing stage without losing the surrounding gallery context. It owns item navigation, captions, downloads, document rendering, and localized control labels.',
		useWhen: [
			'Inspecting gallery images at a larger scale from thumbnails.',
			'Previewing image and PDF attachments in a record or conversation.',
			'Keeping a user in context while they step through a small, known media set.'
		],
		avoidWhen: [
			'Use Pdf Viewer directly for sustained document reading, search, or page-level document work.',
			'Use Carousel for inline browsing that should remain part of page layout.',
			'Use a dedicated media route for deep linking, editing, annotations, or very large collections.'
		],
		anatomy: [
			{
				name: 'Lightbox.Root',
				description:
					'The complete component: optional trigger, dialog portal and overlay, image or PDF stage, caption, counter, cyclic navigation, download, and close controls. Alias: Lightbox.Lightbox.',
				required: true
			}
		],
		behavior: [
			'items is a required LightboxItem array. Each item requires src and alt; caption, explicit image or pdf type, and downloadName are optional, and .pdf sources infer PDF rendering.',
			'open and index are bindable. Supplying no children creates a programmatically controlled viewer; children become the Dialog.Trigger when present. Keep index within the current items bounds because item lookup is clamped but the displayed counter uses index directly.',
			'Arrow Left and Arrow Right cycle through items with wraparound. Escape and Close dismiss through the underlying modal Dialog, and clicking the empty full-screen stage also closes.',
			'The current item changes through a keyed fade Swap; the full-screen Content and Overlay use semantic overlay motion and reduce immediately under reduced motion.',
			'Images use their item alt text. PDFs pass the same accessible name to Pdf Viewer, while the current alt text also names the dialog through a visually hidden title.',
			'LightboxLabels overrides download, close, previous, next, counter, imageView, and fileFallbackName strings. Downloads use downloadName or derive a filename from the source and alt text.',
			'The current implementation does not provide the planned Thumbnail-to-Lightbox shared-element flight.'
		],
		examplePlan: [
			{
				title: 'Image gallery from thumbnails',
				demonstrates:
					'External accessible thumbnail buttons setting bind:index and bind:open, captions, counter, cyclic arrow-key navigation, download, close, and focus restoration.',
				priority: 'primary'
			},
			{
				title: 'Mixed image and PDF attachments',
				demonstrates:
					'Explicit and inferred item types, Pdf Viewer composition, downloadName, and the visual transition between unlike media.',
				priority: 'secondary'
			},
			{
				title: 'Controlled and localized viewer',
				demonstrates:
					'Programmatic open without trigger children, a valid controlled index, custom LightboxLabels, and a single-item set with navigation controls correctly omitted.',
				priority: 'edge-case'
			}
		]
	},
	popover: {
		purpose:
			'Popover reveals a small, non-modal surface anchored to a trigger for contextual information or lightweight controls. It manages positioning, collision avoidance, dismissal, focus movement, and optional controlled state while leaving the internal layout to the consumer.',
		useWhen: [
			'Editing compact settings or filters without leaving the current view.',
			'Showing contextual details that need richer layout than a Tooltip.',
			'Anchoring a small interactive panel to a control while the rest of the page remains available.'
		],
		avoidWhen: [
			'Use Tooltip for a short, non-interactive hint.',
			'Use Dropdown Menu when every option is a command or menu selection.',
			'Use Dialog, Sheet, or Drawer when the task must block background interaction or needs substantial space.'
		],
		anatomy: [
			{
				name: 'Popover.Root',
				description:
					'Owns bindable open state and coordinates trigger, close, and content. Alias: Popover.Popover.',
				required: true
			},
			{
				name: 'Popover.Trigger',
				description:
					'Opens the popover, anchors its position, and can delegate to an existing Button. Alias: Popover.PopoverTrigger.',
				required: true
			},
			{
				name: 'Popover.Portal',
				description:
					'Moves custom floating layers outside clipping contexts; Content already portals itself. Alias: Popover.PopoverPortal.'
			},
			{
				name: 'Popover.Content',
				description:
					'Creates the portalled, collision-aware surface with default centre alignment, four-pixel offset, and Bedrock popover motion. Alias: Popover.PopoverContent.',
				required: true
			},
			{
				name: 'Popover.Header',
				description:
					'Provides consistent visual spacing for Title and Description. Alias: Popover.PopoverHeader.'
			},
			{
				name: 'Popover.Title',
				description:
					'Adds a styled visual title; it is a div and does not automatically name Content. Alias: Popover.PopoverTitle.'
			},
			{
				name: 'Popover.Description',
				description:
					'Adds styled supporting text; it is a div and does not automatically describe Content. Alias: Popover.PopoverDescription.'
			},
			{
				name: 'Popover.Close',
				description:
					'Closes the popover from an explicit control and supports child-snippet delegation. Alias: Popover.PopoverClose.'
			}
		],
		behavior: [
			'Root.open is bindable and reports changes; Trigger may alternatively open on hover with its own openDelay and closeDelay.',
			'Content portals, flips or shifts to avoid collisions, closes on Escape or outside interaction by default, and restores focus according to the floating-layer focus scope.',
			'The surface is non-modal by default, so choose a sensible first focus target for interactive content and do not assume background content is inert.',
			'Title and Description are visual containers, not automatic aria-labelledby or aria-describedby wiring; the consumer owns any accessible naming needed by its content.',
			'Content applies semantic popover motion and commits the final state immediately under reduced motion.'
		],
		examplePlan: [
			{
				title: 'Edit contextual settings',
				demonstrates:
					'A Button-delegated Trigger, Header, Title, Description, a compact labelled control, explicit Close, outside dismissal, Escape, and focus restoration.',
				priority: 'primary'
			},
			{
				title: 'Placement and collision behavior',
				demonstrates:
					'Side, alignment, offset, and automatic collision handling from triggers near each viewport edge.',
				priority: 'secondary'
			},
			{
				title: 'Controlled hover popover',
				demonstrates:
					'bind:open state with openOnHover delays, pointer travel between Trigger and Content, and an explicit boundary between hover help and task-critical controls.',
				priority: 'edge-case'
			}
		]
	},
	sheet: {
		purpose:
			'Sheet opens a deterministic modal workspace from a chosen viewport edge. It uses Dialog semantics and focus behavior with directional motion, making it suitable for taller supporting tasks that need more room than a centred modal but no drag physics.',
		useWhen: [
			'Editing record details or filters alongside the page that launched the task.',
			'Presenting mobile navigation or supporting information in a modal edge panel.',
			'Keeping a bounded task visible at a stable edge while preserving the underlying page context.'
		],
		avoidWhen: [
			'Use Drawer for swipe-to-dismiss behavior, velocity, or snap points.',
			'Use Dialog for compact centred tasks.',
			'Use a persistent Sidebar or dedicated route for primary navigation and long-lived workspaces.'
		],
		anatomy: [
			{
				name: 'Sheet.Root',
				description: 'Owns bindable open state and modal dialog coordination. Alias: Sheet.Sheet.',
				required: true
			},
			{
				name: 'Sheet.Trigger',
				description:
					'Opens the sheet and accepts child-snippet delegation to a Button. Alias: Sheet.SheetTrigger.'
			},
			{
				name: 'Sheet.Portal',
				description:
					'Moves custom sheet layers out of clipping contexts; Content already creates one. Alias: Sheet.SheetPortal.'
			},
			{
				name: 'Sheet.Overlay',
				description:
					'Dims the blocked page and is rendered automatically by Content with overlay motion. Alias: Sheet.SheetOverlay.'
			},
			{
				name: 'Sheet.Content',
				description:
					'Creates the fixed portalled panel from top, right, bottom, or left and includes an optional icon close button. Alias: Sheet.SheetContent.',
				required: true
			},
			{
				name: 'Sheet.Header',
				description:
					'Groups the sheet title and description with consistent inset spacing. Alias: Sheet.SheetHeader.'
			},
			{
				name: 'Sheet.Title',
				description:
					'Provides the visible heading and accessible name for the dialog surface. Alias: Sheet.SheetTitle.',
				required: true
			},
			{
				name: 'Sheet.Description',
				description:
					'Explains the task and supplies its accessible description. Alias: Sheet.SheetDescription.'
			},
			{
				name: 'Sheet.Footer',
				description:
					'Pins a vertical action group at the end of the panel. Alias: Sheet.SheetFooter.'
			},
			{
				name: 'Sheet.Close',
				description:
					'Closes the sheet and can delegate behavior to a custom Button. Alias: Sheet.SheetClose.'
			}
		],
		behavior: [
			'Content defaults to the right side, supports all four edges, and constrains left and right panels to three quarters width with a small-screen maximum.',
			'Root.open supports two-way binding, so Trigger is optional for programmatic flows.',
			'Content portals, traps focus, locks background scrolling, closes on Escape or outside interaction by default, and restores focus to the trigger.',
			'Content.showCloseButton defaults to true; use explicit Close when product copy or action placement needs a labelled dismissal control.',
			'Content uses semantic drawer motion while Overlay uses overlay motion; both resolve without delayed interaction under reduced motion.'
		],
		examplePlan: [
			{
				title: 'Edit record details',
				demonstrates:
					'A right-side Sheet with accessible Header, scrollable form body, sticky Footer actions, explicit save and Close behavior, and restored trigger focus.',
				priority: 'primary'
			},
			{
				title: 'Directional sheets',
				demonstrates:
					'Top, right, bottom, and left sides with content chosen to explain when horizontal versus vertical entry is useful.',
				priority: 'secondary'
			},
			{
				title: 'Controlled narrow viewport',
				demonstrates:
					'Programmatic bind:open, long content at mobile width and high zoom, one close-control strategy, focus containment, and Escape dismissal.',
				priority: 'edge-case'
			}
		]
	},
	sonner: {
		purpose:
			'Sonner hosts a queue of brief toast notifications emitted by application actions. Bedrock supplies a theme-aware Toaster and status icons, while the svelte-sonner toast API owns creation, updates, actions, and dismissal.',
		useWhen: [
			'Confirming a completed background or user-initiated action without interrupting the workflow.',
			'Reporting a short success, warning, or error that does not require an immediate modal decision.',
			'Tracking an asynchronous operation through loading and settled toast states.'
		],
		avoidWhen: [
			'Use inline field or form errors when the message must remain next to the problem.',
			'Use Alert or Banner for persistent, page-level information.',
			'Use Alert Dialog when the user must decide before a consequential action proceeds.'
		],
		anatomy: [
			{
				name: 'Sonner.Toaster',
				description:
					'Mounts the global toast viewport, follows mode-watcher theme state, and supplies Bedrock loading, success, error, info, and warning icons.',
				required: true
			}
		],
		behavior: [
			'Mount one Toaster near the application root; individual features call toast from svelte-sonner rather than mounting another host.',
			'Toaster forwards svelte-sonner configuration such as position, duration, visible count, rich colors, and close-button behavior.',
			'The host follows the current light or dark mode and maps its normal surface, text, and border to Bedrock color tokens.',
			'Toasts are transient and rendered outside the initiating component, so important errors and state changes still need durable inline semantics where users continue the task.',
			'The loading icon currently spins; consumers must verify reduced-motion behavior before relying on that animated state.'
		],
		examplePlan: [
			{
				title: 'Global host and action feedback',
				demonstrates:
					'Toaster mounted once in the root layout and a page action emitting a concise success toast with a useful description.',
				priority: 'primary'
			},
			{
				title: 'Status variants',
				demonstrates:
					'Success, info, warning, and error notifications using the supplied icons and readable content in both light and dark themes.',
				priority: 'secondary'
			},
			{
				title: 'Asynchronous operation',
				demonstrates:
					'A single loading toast updated to success or error, duplicate-action prevention, and durable inline error recovery when the task fails.',
				priority: 'edge-case'
			}
		]
	},
	tooltip: {
		purpose:
			'Tooltip supplies a short, supplemental hint for a focused or hovered control. It centralises hover timing, collision-aware placement, portal behavior, and a compact arrowed surface without adding a task or persistent message.',
		useWhen: [
			'Clarifying an unfamiliar icon-only control that already has an accessible name.',
			'Expanding a terse label with a short shortcut or consequence hint.',
			'Applying one shared delay policy to a cluster of related controls through Provider.'
		],
		avoidWhen: [
			"Do not use Tooltip as the trigger's accessible name or the only source of essential instructions.",
			'Use Hover Card for richer link previews and Popover for interactive content.',
			'Use inline helper text, validation, Alert, or Banner when the message must remain visible or be announced as status.'
		],
		anatomy: [
			{
				name: 'Tooltip.Provider',
				description:
					'Shares delay, skip-delay, hoverability, close, disabled, and focus policy across descendant tooltips; Bedrock defaults its delay to zero. Alias: Tooltip.TooltipProvider.'
			},
			{
				name: 'Tooltip.Root',
				description:
					'Owns bindable open state and optional per-tooltip timing or tethered-trigger configuration. Alias: Tooltip.Tooltip.',
				required: true
			},
			{
				name: 'Tooltip.Trigger',
				description:
					'Anchors the hint and opens it on hover or keyboard focus; delegate props to the actual focusable control. Alias: Tooltip.TooltipTrigger.',
				required: true
			},
			{
				name: 'Tooltip.Portal',
				description:
					'Moves custom tooltip layers out of clipping contexts; Content already portals itself. Alias: Tooltip.TooltipPortal.'
			},
			{
				name: 'Tooltip.Content',
				description:
					'Creates the portalled hint, defaults above the trigger, and includes its styled arrow and Bedrock hint motion. Alias: Tooltip.TooltipContent.',
				required: true
			}
		],
		behavior: [
			"Trigger opens on hover and keyboard focus, closes on pointer leave or blur, and never replaces the trigger's own accessible name.",
			'Escape dismisses the open tooltip without moving focus. Trigger click closes by default unless provider or root configuration disables that behavior.',
			'Provider is optional; without one, bits-ui defaults to a 700 ms delay. Bedrock Provider intentionally overrides that delay to zero and can coordinate skipDelayDuration across descendants.',
			'Content portals, collision-adjusts around the viewport, defaults to top placement with zero offset, and accepts arrowClasses for the built-in arrow.',
			'Content uses semantic hint motion and must become immediate under reduced motion. Keep copy brief enough to read without pointer precision.'
		],
		examplePlan: [
			{
				title: 'Explain an icon action',
				demonstrates:
					'An icon-only Button with its own aria-label, delegated Trigger props, concise supplemental Content, hover and keyboard-focus opening, and Escape dismissal.',
				priority: 'primary'
			},
			{
				title: 'Shared toolbar timing',
				demonstrates:
					'One Provider wrapping several tooltips, immediate first-open policy, skip-delay movement between controls, and shortcut content using Kbd.',
				priority: 'secondary'
			},
			{
				title: 'Placement and content boundary',
				demonstrates:
					'All four sides near viewport edges, collision handling, a bounded multiline hint, disabled Trigger, and why interactive controls move to Popover.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
