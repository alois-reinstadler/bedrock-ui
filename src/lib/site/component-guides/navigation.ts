import type { ComponentGuides } from './types';

export const navigationGuides = {
	breadcrumb: {
		purpose:
			'A breadcrumb gives people a compact map from the current page back through its parent hierarchy. Its ancestor links support lateral recovery without replacing the site’s primary navigation.',
		useWhen: [
			'A page sits at least two levels deep and its parent categories help people understand where they are.',
			'People may need to return directly to an ancestor such as a collection, workspace, or settings section.',
			'A narrow header needs a location cue that can wrap without taking over the page.'
		],
		avoidWhen: [
			'The destinations are peers in the main site structure; use Navigation Menu or Sidebar instead.',
			'The labels represent stages in a task rather than location; use Stepper instead.',
			'You only need a browser-history action; use a clearly labelled back link or button instead.'
		],
		anatomy: [
			{
				name: 'Breadcrumb.Root',
				description:
					'Required nav landmark with the default accessible name “breadcrumb”. The flat Breadcrumb export aliases this part.',
				required: true
			},
			{
				name: 'Breadcrumb.List',
				description:
					'Required ordered list that lays out and wraps the trail. BreadcrumbList is its flat alias.',
				required: true
			},
			{
				name: 'Breadcrumb.Item',
				description:
					'Required list item around each ancestor or current-page part. BreadcrumbItem is its flat alias.',
				required: true
			},
			{
				name: 'Breadcrumb.Link',
				description:
					'Anchor for a navigable ancestor; its child snippet can delegate the rendered link while preserving supplied props. BreadcrumbLink is its flat alias.'
			},
			{
				name: 'Breadcrumb.Separator',
				description:
					'Presentational divider between items; it uses a chevron by default or renders supplied children and stays hidden from assistive technology. BreadcrumbSeparator is its flat alias.'
			},
			{
				name: 'Breadcrumb.Page',
				description:
					'Non-interactive current-page label marked with aria-current="page". BreadcrumbPage is its flat alias.',
				required: true
			},
			{
				name: 'Breadcrumb.Ellipsis',
				description:
					'Presentational “more” marker for ancestors the consumer has intentionally collapsed; it does not open a menu itself. BreadcrumbEllipsis is its flat alias.'
			}
		],
		behavior: [
			'Only ancestor links enter the tab order; the current page, separators, and ellipsis are not controls.',
			'The list wraps at narrow widths. The consumer decides which ancestors to collapse and must preserve enough context to identify the current location.',
			'All refs, classes, and compatible native attributes pass through to their underlying semantic elements.'
		],
		examplePlan: [
			{
				title: 'Nested documentation path',
				demonstrates:
					'A complete ancestor trail with real links, presentational separators, and one non-link current page in the normal header-sized layout.',
				priority: 'primary'
			},
			{
				title: 'Collapsed long path',
				demonstrates:
					'A deep hierarchy shortened with Ellipsis, plus long labels wrapping in a narrow container without turning the ellipsis into an unexplained control.',
				priority: 'edge-case'
			}
		]
	},
	menubar: {
		purpose:
			'A menubar organizes application commands into a persistent row of keyboard-operable menus, similar to a desktop application menu. It handles opening, focus movement, selection controls, and nested command groups while the consumer owns what each command does.',
		useWhen: [
			'A dense editor or operational tool has stable command categories such as File, Edit, and View.',
			'Each category contains actions, toggles, exclusive settings, or nested commands that need one keyboard model.',
			'People repeatedly use the same application commands and benefit from visible shortcut hints.'
		],
		avoidWhen: [
			'The entries navigate to areas of a website; use Navigation Menu, Sidebar, or ordinary links instead.',
			'One button needs a short action menu; use Dropdown Menu instead of a permanent menubar.',
			'The choices form a data-entry field; use Select, Checkbox, or Radio Group instead.'
		],
		anatomy: [
			{
				name: 'Menubar.Root',
				description:
					'Required composite root that coordinates the active menu and horizontal roving focus. Menubar is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.Menu',
				description:
					'Required state boundary for one top-level trigger and its content; value identifies it for controlled open-state callbacks. MenubarMenu is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.Trigger',
				description:
					'Required button-like top-level menu item that opens its associated Content and exposes expanded state. MenubarTrigger is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.Content',
				description:
					'Required positioned command panel; it portals by default and accepts placement, collision, focus, and dismissal props from the underlying primitive. MenubarContent is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.Item',
				description:
					'Selectable command row with optional inset alignment and default or destructive styling. MenubarItem is its flat alias.'
			},
			{
				name: 'Menubar.CheckboxItem',
				description:
					'Command row for an independent boolean or indeterminate setting; checked and indeterminate are bindable. MenubarCheckboxItem is its flat alias.'
			},
			{
				name: 'Menubar.RadioGroup',
				description:
					'Required context around related RadioItems that share one bindable value. MenubarRadioGroup is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.RadioItem',
				description:
					'One mutually exclusive choice inside RadioGroup, with a built-in selected mark. MenubarRadioItem is its flat alias.'
			},
			{
				name: 'Menubar.Group',
				description:
					'Semantic grouping boundary for related menu items. MenubarGroup is its flat alias.'
			},
			{
				name: 'Menubar.GroupHeading',
				description:
					'Heading supplied to the underlying semantic group, with optional inset alignment. MenubarGroupHeading is its flat alias.'
			},
			{
				name: 'Menubar.Label',
				description:
					'Visual section label rendered as a neutral container; use GroupHeading when the label must name a Group semantically. MenubarLabel is its flat alias.'
			},
			{
				name: 'Menubar.Separator',
				description:
					'Non-interactive rule between meaningful groups of commands. MenubarSeparator is its flat alias.'
			},
			{
				name: 'Menubar.Shortcut',
				description:
					'Visual, right-aligned shortcut hint inside an item; it does not register or execute the shortcut. MenubarShortcut is its flat alias.'
			},
			{
				name: 'Menubar.Sub',
				description:
					'State provider for a nested menu, with bindable open state. MenubarSub is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.SubTrigger',
				description:
					'Parent command row that opens a nested menu and adds a directional chevron. MenubarSubTrigger is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.SubContent',
				description:
					'Positioned panel containing a Sub menu’s items. MenubarSubContent is its flat alias.',
				required: true
			},
			{
				name: 'Menubar.Portal',
				description:
					'Advanced portal boundary or target override; Content already creates one for its panel. MenubarPortal is its flat alias.'
			}
		],
		behavior: [
			'Left and Right move among top-level triggers, with optional looping; Enter, Space, or ArrowDown opens the focused menu, and hovering another trigger switches an already-open menubar.',
			'Inside a menu, arrow keys, Home, End, typeahead, Enter, and Space follow the menu pattern; Escape closes the panel and restores focus to its trigger.',
			'Root value and onValueChange expose the active top-level menu. Menu onOpenChange, CheckboxItem checked/indeterminate, RadioGroup value, and Sub open expose their narrower state boundaries.',
			'Content is portalled to avoid clipping. Consumers must still give icon-only commands accessible names and wire every command or shortcut to real behavior.'
		],
		examplePlan: [
			{
				title: 'Application command bar',
				demonstrates:
					'File and View menus with working command callbacks, separators, one checked preference, disabled state, and visible shortcut hints under the normal keyboard model.',
				priority: 'primary'
			},
			{
				title: 'Exclusive settings and groups',
				demonstrates:
					'A semantically headed RadioGroup with a bound value, inset alignment, and a destructive command separated from ordinary actions.',
				priority: 'secondary'
			},
			{
				title: 'Nested command menu',
				demonstrates:
					'Sub, SubTrigger, and SubContent with enough adjacent items to verify pointer transfer, Escape restoration, and keyboard traversal.',
				priority: 'edge-case'
			}
		]
	},
	'navigation-menu': {
		purpose:
			'A navigation menu presents important site destinations as direct links or as grouped link panels. It gives broad information architectures a predictable desktop navigation pattern while preserving real anchors for the destinations themselves.',
		useWhen: [
			'A site header combines direct destination links with categories that reveal several related destinations.',
			'Grouped links need short descriptions or richer panel layouts than a simple horizontal link row can hold.',
			'People should be able to scan major sections without leaving the current page first.'
		],
		avoidWhen: [
			'The entries execute application commands; use Menubar or Dropdown Menu instead.',
			'The navigation is a persistent application rail with deep nesting and collapse behavior; use Sidebar instead.',
			'There are only a few direct links; use a semantic nav with ordinary Link components instead of adding disclosure behavior.'
		],
		anatomy: [
			{
				name: 'NavigationMenu.Root',
				description:
					'Required provider for open value, orientation, hover delays, and the optional shared Viewport. NavigationMenuRoot is its flat alias.',
				required: true
			},
			{
				name: 'NavigationMenu.List',
				description:
					'Required semantic list of top-level Item parts. NavigationMenuList is its flat alias.',
				required: true
			},
			{
				name: 'NavigationMenu.Item',
				description:
					'Required boundary for either a direct Link or a Trigger paired with Content; openOnHover can be disabled per item. NavigationMenuItem is its flat alias.',
				required: true
			},
			{
				name: 'NavigationMenu.Trigger',
				description:
					'Button that reveals an Item’s Content and communicates open state with its built-in chevron. NavigationMenuTrigger is its flat alias.'
			},
			{
				name: 'NavigationMenu.Content',
				description:
					'Panel of destination links associated with a Trigger; it supports dismissal callbacks and force mounting. NavigationMenuContent is its flat alias.'
			},
			{
				name: 'NavigationMenu.Link',
				description:
					'Navigable anchor for either a top-level destination or a link inside Content; active marks the current destination. NavigationMenuLink is its flat alias.'
			},
			{
				name: 'NavigationMenu.Indicator',
				description:
					'Optional visual pointer that tracks the open trigger and can be force-mounted for custom animation. NavigationMenuIndicator is its flat alias.'
			},
			{
				name: 'NavigationMenu.Viewport',
				description:
					'Shared, size-aware panel surface for Content transitions. Root renders it automatically when viewport is true, so compose this part manually only for an intentional custom arrangement. NavigationMenuViewport is its flat alias.'
			}
		],
		behavior: [
			'Root opens panels after a hover delay and allows a shorter skip delay between neighboring triggers; value and onValueChange expose the currently open item.',
			'Arrow keys move through the composite navigation in its configured orientation. Enter or Space opens a trigger, Escape dismisses content, and focusable links remain normal anchors.',
			'With viewport enabled, Content panels transition through one shared measured surface; viewport=false positions each panel below its own item instead.',
			'The consumer owns destination URLs, current-page active state, responsive replacement on small screens, and concise link descriptions.'
		],
		examplePlan: [
			{
				title: 'Product navigation',
				demonstrates:
					'A direct active link beside a triggered panel of real, described destination links, plus Indicator and the Root-managed shared Viewport.',
				priority: 'primary'
			},
			{
				title: 'Independent panels',
				demonstrates:
					'viewport=false with differently sized Content panels so users can see the positioning and animation trade-off without assuming a portal.',
				priority: 'secondary'
			},
			{
				title: 'Keyboard and content pressure',
				demonstrates:
					'Disabled and long-label triggers, a panel with enough links for focus traversal, and narrow-width guidance that hands off to a mobile navigation pattern.',
				priority: 'edge-case'
			}
		]
	},
	outline: {
		purpose:
			'Outline is an in-page table of contents that keeps the nearest heading highlighted while a document scrolls. It turns heading metadata into accessible hash links and gives long reading surfaces a stable way to jump between sections.',
		useWhen: [
			'A long article, reference page, or settings document has multiple meaningful headings.',
			'Readers need both direct section links and a visible indication of the section currently in view.',
			'The content scrolls inside either the document or a known scroll container.'
		],
		avoidWhen: [
			'The links move between routes or major application areas; use Breadcrumb, Navigation Menu, or Sidebar instead.',
			'The content is short enough to scan without section navigation.',
			'The items are ordered workflow stages rather than heading anchors; use Stepper instead.'
		],
		anatomy: [
			{
				name: 'Outline.Root',
				description:
					'Required labelled nav that renders the item list, nested indentation, roving-focus links, scroll-spy state, and animated active indicator. Outline is its flat alias.',
				required: true
			},
			{
				name: 'Outline.OutlineItem / Outline.OutlineProps',
				description:
					'Exported TypeScript contracts for each { id, label, level } entry and for the complete Root API, including controlled active state and navigation callbacks.'
			}
		],
		behavior: [
			'Exactly one outline link is in the tab order. ArrowUp and ArrowDown move one item, Home and End jump to the limits, and Enter or Space activates the focused item.',
			'Activation updates the URL hash with history.replaceState, applies offset as scroll margin, and scrolls smoothly unless reduced motion is requested.',
			'activeId is bindable. Set scrollSpy=false to own it completely; otherwise IntersectionObserver selects the heading nearest the activation line in the document or supplied scrollContainer.',
			'onNavigateStart fires before scrolling and onNavigateEnd fires once after settling, an instant reduced-motion jump, a missing target, or user interruption.',
			'Every item id must match an element id. The active indicator uses Bedrock shared-layout motion, while its visibility uses the state timing token.'
		],
		examplePlan: [
			{
				title: 'Scrollable article outline',
				demonstrates:
					'A realistically tall article with two heading depths, matching ids, sticky Outline, scroll-spy changes, hash navigation, and a fixed-header offset.',
				priority: 'primary'
			},
			{
				title: 'Controlled container outline',
				demonstrates:
					'A bounded scrollContainer with scrollSpy disabled, bound activeId, and start/end callbacks so the state-ownership boundary is explicit.',
				priority: 'secondary'
			},
			{
				title: 'Long and missing targets',
				demonstrates:
					'Long nested labels plus an intentionally absent target to show that the hash and callbacks still settle without claiming a scroll occurred.',
				priority: 'edge-case'
			}
		]
	},
	pagination: {
		purpose:
			'Pagination calculates a compact set of page controls from a total item count and page size. It lets people move through a large, already-partitioned result set while the consumer remains responsible for fetching or slicing the corresponding records.',
		useWhen: [
			'A table, search result, or collection has enough records that discrete pages improve scanning and performance.',
			'People need stable page positions they can revisit rather than an open-ended feed.',
			'The interface must expose first, last, neighboring, previous, and next navigation without rendering every page.'
		],
		avoidWhen: [
			'The result set is small enough to show at once or filter locally without paging.',
			'New items should append continuously as the reader reaches the end; use an explicit load-more or infinite-list pattern instead.',
			'The numbered controls represent steps in a task; use Stepper instead.'
		],
		anatomy: [
			{
				name: 'Pagination.Root',
				description:
					'Required navigation state provider that derives pages, range, and currentPage for its children snippet from count, perPage, page, and siblingCount. Pagination is its flat alias.',
				required: true
			},
			{
				name: 'Pagination.Content',
				description:
					'Required list that groups all rendered controls. PaginationContent is its flat alias.',
				required: true
			},
			{
				name: 'Pagination.Item',
				description:
					'Required list item around each page, ellipsis, or direction control. PaginationItem is its flat alias.',
				required: true
			},
			{
				name: 'Pagination.Link',
				description:
					'Button-like page control for a page object; isActive applies aria-current="page", and children can replace the numeric fallback. PaginationLink is its flat alias.'
			},
			{
				name: 'Pagination.Ellipsis',
				description:
					'Non-interactive marker for a gap in the generated page range; it is hidden from assistive technology. PaginationEllipsis is its flat alias.'
			},
			{
				name: 'Pagination.Previous',
				description:
					'Preferred previous-page control with a chevron and a responsive visible label; it disables itself on the first page. PaginationPrevious is its flat alias.'
			},
			{
				name: 'Pagination.Next',
				description:
					'Preferred next-page control with a chevron and a responsive visible label; it disables itself on the final page. PaginationNext is its flat alias.'
			},
			{
				name: 'Pagination.PrevButton',
				description:
					'Legacy previous-page control retained for compatibility and optional custom children; prefer Previous in new work. PaginationPrevButton is its flat alias.'
			},
			{
				name: 'Pagination.NextButton',
				description:
					'Legacy next-page control retained for compatibility and optional custom children; prefer Next in new work. PaginationNextButton is its flat alias.'
			}
		],
		behavior: [
			'Root renders a navigation landmark named “pagination”; each page control gets a numeric accessible label and the selected page is marked current.',
			'Arrow keys move focus according to orientation and text direction, Home and End jump to the first and last rendered controls, and loop optionally wraps focus.',
			'Enter, Space, or a primary click requests a page change through onPageChange. Previous and Next disable automatically at the range boundaries.',
			'The children snippet provides PageItem keys that must be used for keyed rendering; it also exposes a one-based range suitable for a “results x–y” summary.',
			'Changing page is intentionally immediate under the Bedrock motion contract; loading, scroll restoration, URL state, and result focus are consumer responsibilities.'
		],
		examplePlan: [
			{
				title: 'Paged search results',
				demonstrates:
					'A controlled page value, result-range summary, generated Page and Ellipsis items, and the preferred Previous and Next controls updating a small result list.',
				priority: 'primary'
			},
			{
				title: 'Sibling and keyboard options',
				demonstrates:
					'Controls for siblingCount, orientation, and loop with enough pages to expose both ellipses and directional focus behavior.',
				priority: 'secondary'
			},
			{
				title: 'Empty and boundary pages',
				demonstrates:
					'Zero results, first-page and last-page disabled controls, and a narrow container where direction labels hide but their accessible names remain.',
				priority: 'edge-case'
			}
		]
	},
	sidebar: {
		purpose:
			'Sidebar composes a responsive application navigation region whose desktop form can collapse or move off canvas and whose mobile form becomes a sheet. Its provider coordinates state, shortcuts, tooltips, and layout so navigation and main content respond together.',
		useWhen: [
			'An application has persistent primary navigation, grouped destinations, and enough horizontal room for a desktop rail.',
			'The same navigation must collapse to icons on desktop and remain available as an overlay on small screens.',
			'A shell needs coordinated header, scrolling navigation, footer, nested links, badges, actions, and a main-content inset.'
		],
		avoidWhen: [
			'A marketing site only needs a small header menu; use Navigation Menu or ordinary links instead.',
			'The panel is temporary task content rather than application navigation; use Sheet instead.',
			'The page only needs a local table of contents; use Outline instead of introducing shell-level state.'
		],
		anatomy: [
			{
				name: 'Sidebar.Provider',
				description:
					'Required context and layout wrapper for open state, mobile state, the keyboard shortcut, persistence, and collapsed-label tooltips. SidebarProvider is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.Root',
				description:
					'Required responsive sidebar surface; side, variant, and collapsible determine placement and desktop collapse behavior. Sidebar is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.Header',
				description:
					'Fixed top region for workspace identity, switchers, or search. SidebarHeader is its flat alias.'
			},
			{
				name: 'Sidebar.Input',
				description:
					'Compact text input with bindable value for filtering or finding navigation items; the consumer must provide its accessible label. SidebarInput is its flat alias.'
			},
			{
				name: 'Sidebar.Content',
				description:
					'Flexible scrolling middle region that hides overflow when the desktop sidebar is icon-collapsed. SidebarContent is its flat alias.'
			},
			{
				name: 'Sidebar.Footer',
				description:
					'Fixed bottom region for account, help, or secondary shell controls. SidebarFooter is its flat alias.'
			},
			{
				name: 'Sidebar.Group',
				description:
					'Positioned container for one related section of sidebar content. SidebarGroup is its flat alias.'
			},
			{
				name: 'Sidebar.GroupLabel',
				description:
					'Visual group label that collapses away in icon mode and supports child delegation; it does not create a heading level by itself. SidebarGroupLabel is its flat alias.'
			},
			{
				name: 'Sidebar.GroupAction',
				description:
					'Optional compact action positioned beside a GroupLabel; it hides in icon mode and supports child delegation. SidebarGroupAction is its flat alias.'
			},
			{
				name: 'Sidebar.GroupContent',
				description:
					'Neutral content region under a group label, normally containing Menu. SidebarGroupContent is its flat alias.'
			},
			{
				name: 'Sidebar.Menu',
				description: 'Required semantic list around MenuItem rows. SidebarMenu is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.MenuItem',
				description:
					'Required positioned list item that coordinates its button, badge, and action states. SidebarMenuItem is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.MenuButton',
				description:
					'Primary interactive row, rendered as a button by default or delegated to a link through child; supports active state, variants, sizes, and an icon-mode tooltip. SidebarMenuButton is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.MenuAction',
				description:
					'Separate row action positioned after MenuButton, optionally revealed on hover or focus; it hides in icon mode and supports child delegation. SidebarMenuAction is its flat alias.'
			},
			{
				name: 'Sidebar.MenuBadge',
				description:
					'Non-interactive trailing count or short status aligned to MenuButton and hidden in icon mode. SidebarMenuBadge is its flat alias.'
			},
			{
				name: 'Sidebar.MenuSkeleton',
				description:
					'Loading placeholder for one menu row, with an optional icon block and randomized text width. SidebarMenuSkeleton is its flat alias.'
			},
			{
				name: 'Sidebar.MenuSub',
				description:
					'Nested semantic list with an inset guide; the entire nested branch hides in icon mode. SidebarMenuSub is its flat alias.'
			},
			{
				name: 'Sidebar.MenuSubItem',
				description:
					'Required list item for one nested destination. SidebarMenuSubItem is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.MenuSubButton',
				description:
					'Anchor for a nested destination, with small or medium size, consumer-owned active state, and child delegation. SidebarMenuSubButton is its flat alias.',
				required: true
			},
			{
				name: 'Sidebar.Separator',
				description:
					'Visual divider using the shared Separator component and sidebar border color. SidebarSeparator is its flat alias.'
			},
			{
				name: 'Sidebar.Trigger',
				description:
					'Icon button that toggles the desktop or mobile state from provider context and includes an accessible “Toggle Sidebar” label. SidebarTrigger is its flat alias and is also exported as Trigger.'
			},
			{
				name: 'Sidebar.Rail',
				description:
					'Pointer-only desktop edge target for collapsing or expanding the sidebar; it is removed from sequential keyboard focus, so Trigger must remain available. SidebarRail is its flat alias.'
			},
			{
				name: 'Sidebar.Inset',
				description:
					'Main landmark that fills the remaining shell space and gains the inset surface treatment when Root uses variant="inset". SidebarInset is its flat alias.'
			},
			{
				name: 'Sidebar.useSidebar',
				description:
					'Context accessor for open, openMobile, state, isMobile, setters, and toggle; call it only in descendants of Provider and keep the returned class instance intact rather than destructuring it.'
			}
		],
		behavior: [
			'Provider open is bindable and onOpenChange reports desktop changes; those changes persist to the sidebar_state cookie for seven days. Mobile open state is separate and available through useSidebar.',
			'Ctrl+B or Command+B toggles the current desktop or mobile presentation. Trigger remains the keyboard-operable control; Rail has tabindex=-1.',
			'Below the mobile breakpoint, a collapsible Root becomes a Sheet with its own focus and dismissal behavior. collapsible="none" stays a fixed-width region instead.',
			'Desktop off-canvas and icon collapse currently transition width and side position over 200ms with linear easing; group labels and row geometry use the same generated-sidebar timing rather than Bedrock motion tokens.',
			'MenuButton renders a button unless its child snippet delegates the merged props to a link. isActive is presentation supplied by the consumer, and tooltipContent appears only for a collapsed desktop sidebar.',
			'Root can sit on either logical side and supports sidebar, floating, and inset surfaces; essential destinations must remain reachable when icon-only mode hides labels, badges, actions, and nested menus.'
		],
		examplePlan: [
			{
				title: 'Responsive application shell',
				demonstrates:
					'A complete Provider, icon-collapsible Root, Header search, grouped link-delegated MenuButtons, active state, badge and action, Footer, Trigger, Rail, and main Inset with real navigation content.',
				priority: 'primary'
			},
			{
				title: 'Controlled variants',
				demonstrates:
					'Bound open state with onOpenChange plus controls for left/right side, floating/inset surfaces, and offcanvas/icon/none collapse modes.',
				priority: 'secondary'
			},
			{
				title: 'Nested, loading, and compressed states',
				demonstrates:
					'MenuSub links, MenuSkeleton rows, long labels, collapsed tooltips, and the intentional disappearance of badges and secondary actions without hiding the primary destinations.',
				priority: 'edge-case'
			}
		]
	},
	stepper: {
		purpose:
			'Stepper communicates the ordered stages of a multi-step process, which stage is current, and which stages are complete. It can remain informational for a linear flow or expose non-disabled steps as buttons when the product supports non-linear navigation.',
		useWhen: [
			'A form, document flow, onboarding sequence, or setup process has named stages and one active stage.',
			'People need to see completed, current, optional, and upcoming stages at the same time.',
			'The product intentionally allows returning to or jumping between stages through onStepClick.'
		],
		avoidWhen: [
			'You are showing scalar task completion without named stages; use Progress instead.',
			'The views are peers rather than an ordered process; use Tabs instead.',
			'The labels are page headings or route ancestors; use Outline or Breadcrumb instead.'
		],
		anatomy: [
			{
				name: 'Stepper.Root',
				description:
					'Required ordered-list provider for activeStep, orientation, accessible label, optional click handler, and localizable status labels. Stepper is its flat alias and StepperLabels is the exported override type.',
				required: true
			},
			{
				name: 'Stepper.Step',
				description:
					'Required zero-based stage with label, optional description, optional/disabled flags, status color plus accessible text, and replaceable indicator. Its children render only as indented vertical content. StepperStep is its flat alias.',
				required: true
			}
		],
		behavior: [
			'activeStep is consumer-controlled. Earlier indices are completed, the matching index gets aria-current="step", and later indices remain upcoming.',
			'Providing onStepClick turns every non-disabled Step label and indicator into a native button; disabled steps stay non-interactive instead of rendering disabled buttons.',
			'Only advancing by exactly one stage animates the newly covered connector. Initial render, backwards movement, and multi-step jumps commit immediately, and reduced motion collapses the reveal duration.',
			'status="success", "warning", or "error" changes only the indicator and adds screen-reader text; it does not redefine completion or recolor the connector.',
			'The Root is deliberately an ordered list, not a nav landmark. Consumers own stage validation, route changes, and whether a requested jump is allowed.'
		],
		examplePlan: [
			{
				title: 'Linear document flow',
				demonstrates:
					'Externally controlled Back and Next actions across labelled stages with one description, one optional stage, completion marks, and the single-step connector animation.',
				priority: 'primary'
			},
			{
				title: 'Interactive vertical process',
				demonstrates:
					'orientation="vertical", onStepClick, a disabled stage, localized labels, status indicators, and per-step children that explain the current work.',
				priority: 'secondary'
			},
			{
				title: 'Custom marks and non-adjacent changes',
				demonstrates:
					'A custom indicator snippet plus jump and backwards controls, making clear that those state changes do not animate connector fill.',
				priority: 'edge-case'
			}
		]
	},
	tabs: {
		purpose:
			'Tabs lets people switch among a small set of related peer panels without leaving the page. It coordinates tab semantics, roving focus, panel associations, orientation, and an optional shared active indicator while the consumer owns the selected value.',
		useWhen: [
			'Several peer views share one context and only one needs to be visible at a time.',
			'People benefit from switching quickly between concise panels such as overview, activity, and settings.',
			'A horizontal or vertical tablist can keep every choice visible without scrolling or disclosure.'
		],
		avoidWhen: [
			'The sections must be read together, compared simultaneously, or linked individually as page headings; use normal sections or Outline instead.',
			'The choices are sequential stages with completion state; use Stepper instead.',
			'There are too many labels to remain visible at the supported widths; use navigation, Select, or another disclosure pattern instead of a cramped tablist.'
		],
		anatomy: [
			{
				name: 'Tabs.Root',
				description:
					'Required provider for the bindable selected value, orientation, activation mode, loop behavior, and disabled state. Tabs is its flat alias.',
				required: true
			},
			{
				name: 'Tabs.List',
				description:
					'Required tablist with default or line styling. Its Bedrock indicator prop adds the shared sliding pill to the default variant and defaults to true; TabsList is its flat alias.',
				required: true
			},
			{
				name: 'Tabs.Trigger',
				description:
					'Required tab control whose value must match one Content value; it supports individual disabled state. TabsTrigger is its flat alias.',
				required: true
			},
			{
				name: 'Tabs.Content',
				description:
					'Required tabpanel associated to the Trigger with the same value; inactive panels remain rendered with hidden set. TabsContent is its flat alias.',
				required: true
			},
			{
				name: 'Tabs.tabsListVariants / Tabs.TabsListVariant',
				description:
					'Exported Tailwind-variants style function and TypeScript variant type for code that must match List’s supported default and line treatments.'
			}
		],
		behavior: [
			'Exactly one enabled Trigger participates as the current tab stop. Arrow keys follow orientation, Home and End jump to the limits, and loop optionally wraps at the ends.',
			'Automatic activation selects a tab when focus reaches it; activationMode="manual" waits for Enter, Space, or click. value and bind:value expose selection changes.',
			'Trigger and Content ids are associated through aria-controls and aria-labelledby; each active panel is focusable and inactive panels are hidden.',
			'The default List measures the active Trigger and animates one shared pill with the Bedrock layout engine, including interruption and container scrolling. Set indicator=false for no pill; the line variant always uses its per-trigger underline.',
			'Content changes and keyboard highlight traversal stay immediate; reduced motion preserves the final selected state without making motion a prerequisite.'
		],
		examplePlan: [
			{
				title: 'Related project views',
				demonstrates:
					'Bound selection across three unequal-width triggers and meaningful panels, with the default shared pill visibly retargeting during click and arrow-key changes.',
				priority: 'primary'
			},
			{
				title: 'Line and vertical variants',
				demonstrates:
					'A line List and a vertical List with long labels, disabled trigger, and correctly aligned panels so both orientation and variant differences are explicit.',
				priority: 'secondary'
			},
			{
				title: 'Manual activation and rapid retargeting',
				demonstrates:
					'activationMode="manual", loop=true, indicator=false comparison, and rapid selection changes that distinguish focus movement from committed panel updates.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
