import type { ComponentGuides } from './types';

export const layoutGuides = {
	accordion: {
		purpose:
			'Accordion organizes a related set of questions or settings into independently labeled disclosure panels. It lets people scan the trigger labels first and reveal only the detail they need while preserving the relationship between each label and panel.',
		useWhen: [
			'Present a short FAQ whose question labels remain visible while answers open in place.',
			'Group related settings or explanatory sections when showing every detail at once would obscure the page structure.',
			'Let people compare multiple panels by using the multiple-open mode.'
		],
		avoidWhen: [
			'Use Collapsible for one standalone disclosure instead of creating a one-item accordion.',
			'Use Tabs when switching views should replace a peer panel rather than expand the document flow.',
			'Keep primary actions, validation, and information required to finish a task visible instead of hiding them in a panel.',
			'Use a list, table, or separate detail region for dense collections; opening many tall rows causes repeated layout work.'
		],
		anatomy: [
			{
				name: 'Accordion.Root',
				description:
					'Required context for the set. It owns single- or multiple-open state through the required type prop; value can be controlled with bind:value or observed with onValueChange. Also exported as Accordion.',
				required: true
			},
			{
				name: 'Accordion.Item',
				description:
					'Required wrapper for one trigger and its panel. Its value identifies the item, and its disabled state prevents that item from opening. Also exported as AccordionItem.',
				required: true
			},
			{
				name: 'Accordion.Trigger',
				description:
					'Required labeled button for an item. It supplies the expanded state, relationship to the panel, heading wrapper, and open/closed chevron; set level to match the page heading hierarchy. Also exported as AccordionTrigger.',
				required: true
			},
			{
				name: 'Accordion.Content',
				description:
					'Required panel for the details controlled by the preceding trigger. It owns the animated reveal wrapper and the padded inner content region. Also exported as AccordionContent.',
				required: true
			}
		],
		behavior: [
			'In single mode value is one item value; in multiple mode it is an array. The current facade preserves bind:value across the Bedrock wrapper.',
			'Enter or Space toggles the focused trigger. Arrow keys move among triggers in the declared orientation, and navigation loops by default.',
			'Trigger defaults to heading level 3, so consumers must change level when that would skip or flatten the document outline.',
			'Content uses the shipped accordion height animation. The motion audit records a component-local 200 ms curve that does not yet share the complete Bedrock reduced-motion policy.'
		],
		examplePlan: [
			{
				title: 'Single-open FAQ',
				demonstrates:
					'Keep the current three-question example, bind the active value, and state why single mode is appropriate so the normal Root, Item, Trigger, and Content composition is visible.',
				priority: 'primary'
			},
			{
				title: 'Multiple comparison panels',
				demonstrates:
					'Open two related specification panels at once and show the array-valued state plus onValueChange, revealing the meaningful alternative to single mode.',
				priority: 'secondary'
			},
			{
				title: 'Disabled item and heading level',
				demonstrates:
					'Include one unavailable item and place the set under a level-two section with trigger level 3, making disabled behavior and heading ownership explicit.',
				priority: 'edge-case'
			}
		]
	},
	'aspect-ratio': {
		purpose:
			'Aspect Ratio reserves a box with stable proportions while its width responds to the surrounding layout. It prevents media, embeds, and placeholders from changing page geometry as their content loads.',
		useWhen: [
			'Keep thumbnails in a gallery at one consistent shape across responsive column widths.',
			'Reserve the intended frame for video, maps, or other embeds before their content is ready.',
			'Match a skeleton or empty media slot to the final asset dimensions.'
		],
		avoidWhen: [
			'Use intrinsic image width and height when the asset should keep its own dimensions without a responsive frame.',
			'Use explicit width and height constraints when the box should not scale with its container.',
			'Do not expect Aspect Ratio to crop, position, load, or optimize media; style the child or use an image/media component for those jobs.'
		],
		anatomy: [
			{
				name: 'AspectRatio',
				description:
					'The single ratio-constraining root. It accepts the content as children and a numeric width-to-height ratio that defaults to 1; namespace consumers can use the Root alias.',
				required: true
			}
		],
		behavior: [
			'The component determines height from its available width; a parent must provide a meaningful width constraint.',
			'Children still own fitting and overflow. Media commonly needs full width and height plus an explicit object-fit choice.',
			'Changing ratio updates layout only; the component adds no loading state, accessible name, or media semantics.'
		],
		examplePlan: [
			{
				title: 'Responsive media frame',
				demonstrates:
					'Replace the current abstract 16:9 label with a real image in a constrained responsive frame, including explicit alt text and object-cover so the component boundary is clear.',
				priority: 'primary'
			},
			{
				title: 'Gallery ratios',
				demonstrates:
					'Compare square and portrait frames around the same kind of content to show that ratio controls geometry while the child controls cropping.',
				priority: 'secondary'
			}
		]
	},
	card: {
		purpose:
			'Card creates a bounded surface for one self-contained widget, gallery item, or settings group. Its parts establish consistent spacing and visual hierarchy, but they do not add section, heading, or interaction semantics on their own.',
		useWhen: [
			'Group a dashboard widget with a title, summary, body, and a small set of actions.',
			'Present an individual gallery or catalogue item whose surface needs clear separation from its surroundings.',
			'Collect a compact settings group that belongs together but is independent from adjacent groups.'
		],
		avoidWhen: [
			'Use Item, List, or Table for dense record collections; the Bedrock contract forbids wrapping record lists in cards.',
			'Use ClickableCard when the entire surface must navigate or invoke one primary action.',
			'Use SelectableCard when the surface represents checkbox-like selection state.',
			'Use a semantic section, article, fieldset, or heading in addition to or instead of Card when document structure matters.'
		],
		anatomy: [
			{
				name: 'Card.Root',
				description:
					'Required visual surface and spacing context for the composition. It accepts default or small sizing and is also exported as Card.',
				required: true
			},
			{
				name: 'Card.Header',
				description:
					'Optional top grid that aligns Title and Description with an Action. Put Action inside Header for its grid placement to apply. Also exported as CardHeader.'
			},
			{
				name: 'Card.Title',
				description:
					'Optional visual title text. It renders a div rather than a heading, so consumers must provide heading semantics when the title belongs in the page outline. Also exported as CardTitle.'
			},
			{
				name: 'Card.Description',
				description:
					'Optional paragraph for concise context that qualifies the title; it also tells Header to allocate a second row. Also exported as CardDescription.'
			},
			{
				name: 'Card.Action',
				description:
					'Optional upper-right area for a compact action associated with the whole card, positioned across the Header rows. Also exported as CardAction.'
			},
			{
				name: 'Card.Content',
				description:
					'Optional padded body for the card-specific content. It provides spacing only and does not constrain the content type. Also exported as CardContent.'
			},
			{
				name: 'Card.Footer',
				description:
					'Optional closing row for actions or status. It adds a separated muted surface and changes Root bottom padding. Also exported as CardFooter.'
			}
		],
		behavior: [
			'Root, Header, Title, Action, Content, and Footer render div elements; Description renders a paragraph. Card does not create a landmark, heading, accessible name, or focus target.',
			'The small size reduces the shared spacing token and title size for a denser composition.',
			'A first or last image receives matching outer corner treatment, while overflow is clipped by Root.',
			'All parts forward HTML attributes, classes, and children snippets; their layout classes are styling behavior rather than interaction state.'
		],
		examplePlan: [
			{
				title: 'Operational widget',
				demonstrates:
					'Expand the current shift report to use every compositional region: a semantic heading inside Title, supporting Description, a compact Header Action, body content, and distinct Footer actions.',
				priority: 'primary'
			},
			{
				title: 'Small gallery card',
				demonstrates:
					'Show size="sm" with edge-to-edge media and concise metadata, proving how density and first-image corner treatment differ from the widget.',
				priority: 'secondary'
			},
			{
				title: 'Card is not a record list',
				demonstrates:
					'Contrast one card containing a compact Item list with a grid of card-per-row records, explicitly identifying the latter as the composition to avoid.',
				priority: 'edge-case'
			}
		]
	},
	'clickable-card': {
		purpose:
			'Clickable Card gives a summary surface one clear destination or primary action without sacrificing independent controls inside the content. It uses a stretched accessible link or button over the Bedrock Card rather than adding click handlers to a non-interactive container.',
		useWhen: [
			'Navigate from a project, report, or gallery summary to its detail route by clicking anywhere on the surface.',
			'Run one primary action from a card while keeping a secondary button or link independently operable.',
			'Increase the activation target for a concise card whose purpose is unambiguous from its visible content.'
		],
		avoidWhen: [
			'Use Card for a static grouping with no whole-surface action.',
			'Use SelectableCard for checkbox-like selected state or multi-select collections.',
			'Use explicit controls instead when a card contains many peer actions or no single primary destination.',
			'Do not wrap the component in another link or button; it already owns the primary interactive element.'
		],
		anatomy: [
			{
				name: 'ClickableCard',
				description:
					'The single required root combines a Card surface, a stretched link when href is present or button otherwise, and the supplied children. A non-empty label names that hidden primary trigger; namespace consumers can use the Root alias.',
				required: true
			}
		],
		behavior: [
			'Providing href selects navigation semantics and supports target; omitting it creates a native button that invokes onclick.',
			'Disabled buttons use the native disabled state. Disabled links remove href, exit the tab order through tabindex=-1, expose aria-disabled, and suppress onclick.',
			'Nested links, buttons, inputs, labels, and other focusable elements are raised above the stretched trigger so they receive their own pointer and keyboard interaction without firing the card action.',
			'The required label is the primary trigger accessible name, so it should describe the destination or action rather than repeat a generic word such as “Open”.'
		],
		examplePlan: [
			{
				title: 'Navigable report card',
				demonstrates:
					'Change the current primary example to use href for the report destination while retaining the independent Share button, proving the stretched-link and nested-control contract.',
				priority: 'primary'
			},
			{
				title: 'Action card',
				demonstrates:
					'Omit href and handle onclick for a single immediate action, with visible feedback that distinguishes button behavior from navigation.',
				priority: 'secondary'
			},
			{
				title: 'Unavailable destination',
				demonstrates:
					'Disable an href card and show that it cannot be focused, followed, or activated while its unavailable styling and accessible state remain visible.',
				priority: 'edge-case'
			}
		]
	},
	collapsible: {
		purpose:
			'Collapsible attaches one trigger to one optional block of supporting content. It is the focused disclosure primitive for details that should stay near their control without introducing a multi-item navigation structure.',
		useWhen: [
			'Reveal advanced settings beneath a compact summary or button.',
			'Expand optional delivery, reasoning, or diagnostic details in place.',
			'Give one bounded region controlled open state through open and onOpenChange.'
		],
		avoidWhen: [
			'Use Accordion for a labeled set of peer disclosure sections with arrow-key navigation.',
			'Use Dialog, Popover, or Sheet when the content must float, trap attention, or avoid changing document flow.',
			'Do not hide information or actions required to understand errors or complete the current task.',
			'Use conditional rendering directly when no user-operated disclosure control or expanded relationship is needed.'
		],
		anatomy: [
			{
				name: 'Collapsible.Root',
				description:
					'Required context that owns or receives open and disabled state and reports changes through onOpenChange. Also exported as Collapsible.',
				required: true
			},
			{
				name: 'Collapsible.Trigger',
				description:
					'Required button that toggles the content and carries its expanded relationship. Its child snippet supplies props that must be forwarded when delegating rendering to Button or another control. Also exported as CollapsibleTrigger.',
				required: true
			},
			{
				name: 'Collapsible.Content',
				description:
					'Required disclosure region associated with Trigger. It can expose open state to a child snippet and supports forceMount and hiddenUntilFound behavior. Also exported as CollapsibleContent.',
				required: true
			}
		],
		behavior: [
			'The current Bedrock facade is demonstrated as controlled state: pass open and update it from onOpenChange. Root defaults closed when open is omitted.',
			'Enter or Space activates the trigger, while the primitive maintains aria-expanded and the trigger-to-content relationship.',
			'Content defaults hiddenUntilFound to true upstream, allowing browser Find to reveal matched hidden content. forceMount is available for consumers that need the region kept in the DOM.',
			'The primitive does not supply Bedrock reveal motion or content styling; consumers choose the trigger presentation and panel surface.'
		],
		examplePlan: [
			{
				title: 'Controlled delivery details',
				demonstrates:
					'Keep the current example because it teaches open plus onOpenChange and correctly forwards Trigger child props into Button; add a short note explaining why the child props are essential.',
				priority: 'primary'
			},
			{
				title: 'Minimal native trigger',
				demonstrates:
					'Use Trigger directly with no delegated child and let Root own its initial closed state, showing the smallest valid composition.',
				priority: 'secondary'
			},
			{
				title: 'Searchable hidden details',
				demonstrates:
					'Put a distinctive term in closed Content and explain hiddenUntilFound versus forceMount, including that required task information should not depend on discovery through browser Find.',
				priority: 'edge-case'
			}
		]
	},
	'overflow-list': {
		purpose:
			'Overflow List keeps a one-line collection within its available width and replaces items that no longer fit with a count affordance. It continuously measures the rendered item widths, so the visible prefix responds to container and content changes without wrapping.',
		useWhen: [
			'Fit tags, participants, or compact metadata into a toolbar or constrained table cell.',
			'Preserve a stable single-line summary while still making every hidden item discoverable.',
			'Provide a product-specific overflow menu by supplying an overflow snippet that receives the hidden items.'
		],
		avoidWhen: [
			'Use a wrapping flex layout when seeing every item matters more than maintaining one row.',
			'Use a scrollable rail or Scroll Area when spatial order and direct access to every item must remain visible.',
			'Use pagination or virtualization for large data collections; this component renders all items in its measurement rail.',
			'Do not put side-effectful content, duplicate IDs, or stateful form controls in the item snippet because measurement and overflow copies render it more than once.'
		],
		anatomy: [
			{
				name: 'OverflowList',
				description:
					'The single required measuring root. It requires an items array and item(item, index) snippet; an optional overflow(hiddenItems) snippet replaces the default +n preview. Namespace consumers can use the Root alias.',
				required: true
			}
		],
		behavior: [
			'A ResizeObserver recalculates the largest leading slice that fits while reserving space for the overflow indicator. If every item fits, no indicator renders.',
			'The default +n button opens a Hover Card preview on hover or focus and uses moreLabel(count) for its accessible name; the default English label is “Show n more items”.',
			'A custom overflow snippet receives all hidden items and owns its trigger, disclosure behavior, keyboard support, and accessible naming.',
			'Every item is also rendered in an inert, aria-hidden measurement rail. Item snippets must therefore be deterministic and safe to instantiate in hidden copies.'
		],
		examplePlan: [
			{
				title: 'Responsive tag summary',
				demonstrates:
					'Keep the current resizable tag container and default +n preview because it makes the measurement behavior directly testable; add keyboard-focus instructions for discovering the hidden tags.',
				priority: 'primary'
			},
			{
				title: 'Actionable overflow menu',
				demonstrates:
					'Provide a custom overflow snippet that renders a named menu trigger and lists only hidden tags, showing where the consumer assumes accessibility ownership.',
				priority: 'secondary'
			},
			{
				title: 'No item fits',
				demonstrates:
					'Constrain the rail until the entire collection sits behind +n, then change its items and use a custom moreLabel to verify the narrowest state and dynamic remeasurement.',
				priority: 'edge-case'
			}
		]
	},
	resizable: {
		purpose:
			'Resizable divides a bounded workspace into adjacent panes whose proportions people can adjust with pointer, touch, or keyboard input. It is intended for persistent work surfaces where users benefit from trading space between peer regions without leaving the page.',
		useWhen: [
			'Let people balance a navigation tree and editor, or a list and detail pane.',
			'Build nested horizontal and vertical workspaces with explicit minimum and maximum pane sizes.',
			'Persist user-adjusted proportions by configuring the PaneGroup storage API.'
		],
		avoidWhen: [
			'Use ordinary responsive grid or flex layout when the product, rather than the user, should choose the proportions.',
			'Use Sidebar, Sheet, or Drawer when a region should collapse or overlay according to viewport mode.',
			'Do not make critical content reachable only by resizing a pane below its usable minimum.',
			'Avoid resizers in compact touch layouts unless the handle has a deliberate, sufficiently large hit target.'
		],
		anatomy: [
			{
				name: 'Resizable.PaneGroup',
				description:
					'Required context and flex container for one horizontal or vertical group. It calculates percentage layouts, can persist them, and reports changes through onLayoutChange. Also exported as ResizablePaneGroup.',
				required: true
			},
			{
				name: 'Resizable.Pane',
				description:
					'Required Paneforge region that owns default, minimum, maximum, and optional collapsed sizes. Use two or more as direct members of a group; it is also exported as ResizablePane.',
				required: true
			},
			{
				name: 'Resizable.Handle',
				description:
					'Required separator between each adjacent pane pair. It owns drag and keyboard resizing; withHandle adds the visible grip without changing the interaction model. Also exported as ResizableHandle.',
				required: true
			}
		],
		behavior: [
			'PaneGroup requires direction and treats pane sizes as percentages constrained by each Pane minimum, maximum, collapsible, and collapsed settings.',
			'Focused handles use orientation-matching arrow keys, Home, and End to resize. The default keyboard step is 10 percentage points, Shift requests the full range, and F6 cycles among handles.',
			'Dragging with mouse or touch resizes continuously and reports layout and per-pane changes; disabled handles ignore both pointer and keyboard resizing.',
			'Resizing is intentionally immediate under the Bedrock motion contract. Do not layer layout animation onto the changing axis.'
		],
		examplePlan: [
			{
				title: 'List and detail workspace',
				demonstrates:
					'Replace the abstract Nav and Content labels with a realistic bounded two-pane workspace, set useful minSize values, retain the visible handle, and display the current layout after drag or keyboard input.',
				priority: 'primary'
			},
			{
				title: 'Vertical nested group',
				demonstrates:
					'Nest a vertical PaneGroup inside one horizontal Pane to teach direction, handle orientation, and the required group boundaries.',
				priority: 'secondary'
			},
			{
				title: 'Collapsible constrained pane',
				demonstrates:
					'Set collapsible, collapsedSize, minSize, and maxSize on a pane, then exercise Home, End, and disabled handle states to expose the constraint edges.',
				priority: 'edge-case'
			}
		]
	},
	'scroll-area': {
		purpose:
			'Scroll Area gives a deliberately bounded region styled cross-browser scrollbars while retaining a native scrolling viewport. It is useful when overflow belongs inside a local panel and the application needs consistent scrollbar presentation.',
		useWhen: [
			'Constrain a long activity log, picker list, or side panel independently from the document.',
			'Offer horizontal scrolling for wide content that must retain its intrinsic width.',
			'Present both axes in a bounded canvas-like region and style each scrollbar separately.'
		],
		avoidWhen: [
			'Let the document scroll when the content is the primary page flow; nested scroll regions add keyboard and touch friction.',
			'Use Overflow List when a compact one-line summary should collapse extra items behind a count instead of scrolling.',
			'Use Carousel for discrete previous/next slides; Scroll Area provides continuous native overflow, not slide selection.',
			'Do not use it to conceal content without a visible size constraint or another clear overflow cue.'
		],
		anatomy: [
			{
				name: 'ScrollArea.Root',
				description:
					'Required outer context. It creates the internal native viewport and corner, renders a vertical scrollbar by default, selects axes through orientation, and can add scroll-aware progressive edge blurs. Also exported as ScrollArea.',
				required: true
			},
			{
				name: 'ScrollArea.Scrollbar',
				description:
					'Public low-level scrollbar with a built-in thumb. Root already creates the selected axes, so this part is for advanced composition with a compatible primitive Root rather than a second bar inside ScrollArea.Root children. Also exported as ScrollAreaScrollbar.'
			}
		],
		behavior: [
			'Root orientation defaults to vertical. Horizontal content must have an intrinsic or minimum width greater than the viewport, and both mode renders a corner where the bars meet.',
			'edgeBlur accepts vertical, horizontal, both, or false. Each requested physical edge fades in only while overflow content remains beyond it; edgeBlurSize and edgeBlurStrength tune the treatment.',
			'All edge treatments disappear while focus is inside the scroll area so a focus indicator or focused control is never obscured.',
			'The underlying type defaults to hover and hides idle scrollbars after a 600 ms delay; type can request scroll, auto, or always behavior instead.',
			'The internal viewport retains native wheel, touch, and trackpad scrolling. Keyboard scrolling depends on focus reaching suitable content because Root does not make the viewport a tab stop by default.',
			'scrollbarXClasses and scrollbarYClasses target the generated bars independently. The component does not virtualize children or reduce their rendering cost.'
		],
		examplePlan: [
			{
				title: 'Bounded activity log',
				demonstrates:
					'Improve the current ledger example with realistic timestamps, an explicit fixed height, a focusable log body, and enough entries to prove vertical wheel and keyboard scrolling.',
				priority: 'primary'
			},
			{
				title: 'Horizontal comparison rail',
				demonstrates:
					'Use orientation="horizontal" around a deliberately wide row to show that content width, not the component alone, creates horizontal overflow.',
				priority: 'secondary'
			},
			{
				title: 'Two-axis viewport with edge blur',
				demonstrates:
					'Use orientation="both" and edgeBlur="both", keep a bounded width and height, and show each logical blur disappearing when its corresponding scroll boundary is reached.',
				priority: 'edge-case'
			}
		]
	},
	'progressive-blur': {
		purpose:
			'Progressive Blur places a directional backdrop blur over the start or end of a surface. It is a visual affordance for layered content and is also the primitive used by Scroll Area to hint that more content exists beyond a scroll boundary.',
		useWhen: [
			'A clipped or layered surface needs a soft transition into content beneath it.',
			'A custom scroller needs a directional edge treatment outside Scroll Area’s built-in edgeBlur behavior.',
			'A sticky header or footer should visually separate itself without a hard opaque block.'
		],
		avoidWhen: [
			'Use Scroll Area with edgeBlur for ordinary scroll-boundary cues; it manages edge visibility automatically.',
			'Use a solid gradient when content behind the layer must remain visually hidden rather than blurred.',
			'Do not use blur as the only signal that content is scrollable; preserve native scrolling and visible content clipping.'
		],
		anatomy: [
			{
				name: 'ProgressiveBlur',
				description:
					'The decorative overlay, also exported as Root. side selects top, right, bottom, or left; size and strength tune the effect; visible controls its motion-token-driven opacity. The older orientation and edge pair remains as a compatibility alias, with side taking precedence.',
				required: true
			}
		],
		behavior: [
			'The overlay is absolutely positioned and pointer-events-none, so its containing surface must establish positioning and it never intercepts scrolling or clicks.',
			'side defaults to bottom and names the physical edge directly. The compatibility orientation and edge pair maps vertical start/end to top/bottom and horizontal start/end to left/right.',
			'size accepts a CSS length or a pixel number. strength is a pixel blur radius, while visible only changes opacity and uses Bedrock motion tokens.',
			'Five overlapping, softly masked backdrop layers create a continuous falloff without an opaque tint. Reduced-transparency and increased-contrast preferences receive a gradient fallback; --progressive-blur-fallback can match a nested surface.',
			'The component is aria-hidden because it communicates presentation, not structure or state.'
		],
		examplePlan: [
			{
				title: 'Directional surface fades',
				demonstrates:
					'Compare vertical-end and horizontal-end overlays on patterned surfaces so orientation, edge, size, and blur strength are immediately visible.',
				priority: 'primary'
			},
			{
				title: 'Sticky header separation',
				demonstrates:
					'Place a vertical-start blur beneath a sticky toolbar and toggle visible to show the semantic motion timing without intercepting controls.',
				priority: 'secondary'
			},
			{
				title: 'Scroll-aware alternative',
				demonstrates:
					'Contrast manual Progressive Blur composition with Scroll Area edgeBlur and explain why the latter is preferred when visibility depends on scroll position.',
				priority: 'edge-case'
			}
		]
	},
	'selectable-card': {
		purpose:
			'Selectable Card turns a Card surface into one checkbox-like choice while keeping nested controls independent. The consumer owns selection state, which makes the component suitable for both multi-select collections and externally coordinated single-selection layouts.',
		useWhen: [
			'Let people select one or more visual products, files, samples, or plans from card-based choices.',
			'Increase the selection target beyond a small checkbox while retaining a clear selected ring.',
			'Coordinate exactly one selected card by deriving each selected prop from one parent-owned value.'
		],
		avoidWhen: [
			'Use ClickableCard when activation navigates or performs an action instead of changing selected state.',
			'Use Checkbox or Radio Group when the choices are primarily labels and do not need card content.',
			'Use Card for a static surface that has no selection model.',
			'Do not treat independent bound booleans as a radio group; the consumer must enforce single selection and any group semantics.'
		],
		anatomy: [
			{
				name: 'SelectableCard',
				description:
					'The single required root combines a Card with a stretched button using role="checkbox". It requires label, exposes bind:selected and onSelectedChange, and accepts Card parts as children; namespace consumers can use the Root alias.',
				required: true
			}
		],
		behavior: [
			'Click, Space, or Enter toggles the native button, updates the bindable selected value, calls onSelectedChange, and reflects the result through aria-checked.',
			'Disabled prevents toggling and removes the stretched button from interaction while preserving the current selected value.',
			'Nested links, buttons, inputs, labels, and focusable elements sit above the stretched checkbox so their activation does not toggle the card.',
			'The selected inset ring composes with the resting shadow. The required label supplies the checkbox accessible name and should name the choice, not the act of clicking.'
		],
		examplePlan: [
			{
				title: 'Multi-select sample cards',
				demonstrates:
					'Keep the current three-card example because separate bind:selected values and the live count correctly teach multi-selection; add a visible checkmark or selected text so selection does not rely on the ring alone.',
				priority: 'primary'
			},
			{
				title: 'Parent-controlled single selection',
				demonstrates:
					'Drive every card from one selected ID in onSelectedChange and explain that SelectableCard does not provide Radio Group semantics automatically.',
				priority: 'secondary'
			},
			{
				title: 'Disabled choice with nested action',
				demonstrates:
					'Show one disabled card and one enabled card with an independent Details button, verifying both the unavailable state and the nested-control boundary.',
				priority: 'edge-case'
			}
		]
	},
	separator: {
		purpose:
			'Separator marks a boundary between adjacent content regions with a horizontal or vertical rule. It can expose that boundary to assistive technology when the division is meaningful, or remain purely decorative when headings and layout already communicate the grouping.',
		useWhen: [
			'Separate neighboring sections whose relationship remains clear without adding another container.',
			'Divide groups in a toolbar or horizontal metadata row with a vertical rule.',
			'Add a thematic break that should be announced as a separator to assistive technology.'
		],
		avoidWhen: [
			'Use spacing alone when no visible or semantic boundary is needed.',
			'Use a heading, section, or fieldset when the content needs an explicit name or document structure.',
			'Use component-specific separators inside Menu, Select, Breadcrumb, Item, or Field compositions so their context and spacing contracts remain intact.',
			'Do not use Separator as a resize handle; use Resizable.Handle for an operable divider.'
		],
		anatomy: [
			{
				name: 'Separator',
				description:
					'The single required rule. It defaults to a horizontal, semantic separator; set orientation for layout and decorative when the line should be hidden from assistive technology. Namespace consumers can use the Root alias.',
				required: true
			}
		],
		behavior: [
			'orientation defaults to horizontal and controls both primitive semantics and the one-pixel rule direction.',
			'decorative defaults to false. Set decorative when the separator repeats a relationship already conveyed by headings, grouping, or surrounding component semantics.',
			'Vertical separators use the full height available from their parent, so the parent must establish a height rather than expecting the rule to size neighboring content.',
			'The component is non-interactive and does not manage spacing, labels, focus, or collapse behavior.'
		],
		examplePlan: [
			{
				title: 'Semantic section break',
				demonstrates:
					'Rework the current Collar copy into two clearly related sections and keep the default semantic horizontal separator, explaining what assistive technology gains from the boundary.',
				priority: 'primary'
			},
			{
				title: 'Decorative card division',
				demonstrates:
					'Set decorative inside an already named card where the rule only reinforces visible grouping, making the semantic choice explicit.',
				priority: 'secondary'
			},
			{
				title: 'Vertical toolbar divider',
				demonstrates:
					'Place a decorative vertical separator in a parent with an explicit height to show its sizing requirement and distinguish it from an interactive resize handle.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
