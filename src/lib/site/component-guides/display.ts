import type { ComponentGuides } from './types';

export const displayGuides = {
	alert: {
		purpose:
			'Alert presents important feedback inside the page section where it matters and exposes it as an assertive alert. It pairs a short heading with supporting detail and can reserve space for a related action.',
		useWhen: [
			'A submitted operation fails and the explanation must remain beside the affected content.',
			'A section needs a persistent warning or destructive notice that users may revisit.',
			'A compact inline action can resolve or inspect the reported condition.'
		],
		avoidWhen: [
			'Use Banner for an app-wide or page-wide operational notice.',
			'Use FieldStatus for validation or feedback owned by one form field.',
			'Use a toast for brief confirmation that does not need to remain in the page.'
		],
		anatomy: [
			{
				name: 'Alert.Root',
				description:
					'Required alert region and visual surface; also exported as Alert. alertVariants and AlertVariant describe its default and destructive styles.',
				required: true
			},
			{
				name: 'Alert.Title',
				description: 'Concise heading for the condition; also exported as AlertTitle.'
			},
			{
				name: 'Alert.Description',
				description:
					'Supporting consequences, context, or recovery guidance; also exported as AlertDescription.'
			},
			{
				name: 'Alert.Action',
				description:
					'Optional top-right container for a compact action; also exported as AlertAction. The consumer supplies the button or link and handler.'
			}
		],
		behavior: [
			'Root always has role="alert", so mount it for information that warrants assertive announcement rather than routine status copy.',
			'Action is absolutely positioned and changes Root padding; keep its label short and keep the alert’s explanation in Title and Description.',
			'Icons are not automatically named; keep them decorative when the text carries the meaning.'
		],
		examplePlan: [
			{
				title: 'Actionable inline alert',
				demonstrates:
					'A section-level failure with icon, title, recovery text, and Alert.Action containing a labelled retry button.',
				priority: 'primary'
			},
			{
				title: 'Destructive boundary',
				demonstrates:
					'The destructive variant for a condition that blocks progress, contrasted with copy that does not warrant an assertive alert.',
				priority: 'secondary'
			}
		]
	},
	avatar: {
		purpose:
			'Avatar represents a person, team, or other identity with an image and resilient text fallback. Its grouping and data-driven Stack exports cover overlapping membership displays without rebuilding overflow and hover details.',
		useWhen: [
			'Identify a person beside a message, assignment, or account control.',
			'Show a small team or participant set with a collapsed remainder count.',
			'Attach a compact presence or status mark to an identity.'
		],
		avoidWhen: [
			'Use Thumbnail for files, products, or scene previews that are not identities.',
			'Do not use an avatar as the only accessible name for an interactive control.',
			'Use a plain image when fallback loading, identity sizing, and grouping are unnecessary.'
		],
		anatomy: [
			{
				name: 'Avatar.Root',
				description:
					'Required identity frame and bindable loading-status provider with sm, default, and lg sizes; also exported as Avatar.',
				required: true
			},
			{
				name: 'Avatar.Image',
				description: 'Image coordinated through the Root provider; also exported as AvatarImage.'
			},
			{
				name: 'Avatar.Fallback',
				description:
					'Initials or another short substitute shown when the image is unavailable; also exported as AvatarFallback.'
			},
			{
				name: 'Avatar.Badge',
				description:
					'Optional status overlay positioned against Root and scaled with it; also exported as AvatarBadge.'
			},
			{
				name: 'Avatar.Group',
				description:
					'Overlapping layout for manually composed Avatar.Root children; also exported as AvatarGroup.'
			},
			{
				name: 'Avatar.GroupCount',
				description:
					'Visual +n member for Group; also exported as AvatarGroupCount. Its owner supplies control semantics when actionable.'
			},
			{
				name: 'Avatar.Stack',
				description:
					'Data-driven animated group with max overflow and focus/hover previews; also exported as AvatarStack. AvatarStackItem types each identity.'
			}
		],
		behavior: [
			'Image and Fallback coordinate through Root’s bindable loadingStatus.',
			'Stack shows at most max identities, packs membership changes with layout motion, and makes each visible avatar and +n count a keyboard-focusable preview trigger.',
			'Stack names triggers from name, then alt, then fallback; moreLabel owns the accessible +n label.',
			'Group and GroupCount are presentation helpers and do not implement Stack overflow or disclosure behavior.'
		],
		examplePlan: [
			{
				title: 'Identity with resilient fallback',
				demonstrates:
					'One Root composed with Image, Fallback, meaningful alt text, size, and an optional Badge status mark.',
				priority: 'primary'
			},
			{
				title: 'Manual group anatomy',
				demonstrates:
					'Group with several roots and an explicitly labelled GroupCount, explaining that it does not manage overflow.',
				priority: 'secondary'
			},
			{
				title: 'Animated participant stack',
				demonstrates:
					'Stack with image failures, max overflow, focus/hover previews, and an add/remove that reveals membership packing.',
				priority: 'secondary'
			}
		]
	},
	badge: {
		purpose:
			'Badge is a compact, usually passive label for status, category, or a small piece of metadata. It becomes a link when href is supplied while preserving the same visual vocabulary.',
		useWhen: [
			'Label a record with a short status or category.',
			'Add compact metadata beside a title or value.',
			'Link a short category label to its filtered view.'
		],
		avoidWhen: [
			'Use Token for a removable, selectable, or button-like entity chip.',
			'Use StatusDot only when a tiny state marker is paired with explanatory text.',
			'Use Button for an action; do not make a span-shaped badge appear clickable.'
		],
		anatomy: [
			{
				name: 'Badge',
				description:
					'Single component that renders a span by default or anchor with href. badgeVariants and BadgeVariant expose its typed visual variants.'
			}
		],
		behavior: [
			'Badge does not infer meaning from color; visible text must communicate the status or category.',
			'Default, secondary, destructive, outline, ghost, and link are emphasis choices, not interaction modes.',
			'Content stays on one line and clips overflow, so keep labels brief.'
		],
		examplePlan: [
			{
				title: 'Record labels in context',
				demonstrates:
					'Passive status and category badges beside real record data, with text naming every state.',
				priority: 'primary'
			},
			{
				title: 'Variants and linked badge',
				demonstrates:
					'All supported variants plus href-driven anchor rendering and the boundary with Token.',
				priority: 'secondary'
			},
			{
				title: 'Long-label boundary',
				demonstrates:
					'An intentionally long label clipping to show why Badge is unsuitable for sentence-length copy.',
				priority: 'edge-case'
			}
		]
	},
	banner: {
		purpose:
			'Banner carries an operational notice across an application or page rather than attaching feedback to one control. It provides status-aware styling, flexible content, and an optional close control while leaving visibility state with the consumer.',
		useWhen: [
			'Announce maintenance, degraded service, or a policy change across a page.',
			'Keep a persistent success, warning, or destructive notice above a workspace.',
			'Offer a dismissible notice whose visibility the page owns.'
		],
		avoidWhen: [
			'Use Alert for feedback local to one section or operation.',
			'Use a toast for transient acknowledgement that should not occupy layout space.',
			'Do not use Banner.Close without wiring state; it does not dismiss Root itself.'
		],
		anatomy: [
			{
				name: 'Banner.Root',
				description:
					'Required full-width notice surface; also exported as Banner. bannerVariants and BannerVariant define info, success, warning, and destructive styles.',
				required: true
			},
			{
				name: 'Banner.Content',
				description:
					'Flexible wrapping area for the message and inline links or actions; also exported as BannerContent.'
			},
			{
				name: 'Banner.Close',
				description:
					'Optional labelled close button; also exported as BannerClose. Its default label is “Close,” and its handler is consumer-owned.'
			}
		],
		behavior: [
			'Warning and destructive variants use role="alert"; info and success use role="status".',
			'Root enters from above with Bedrock motion tokens, but conditional unmounting and exit choreography belong to the caller.',
			'Content wraps while Close remains at the trailing edge.'
		],
		examplePlan: [
			{
				title: 'Dismissible operational notice',
				demonstrates:
					'A maintenance message with Content, useful link, Close, and caller-owned state to show it again.',
				priority: 'primary'
			},
			{
				title: 'Semantic severity',
				demonstrates:
					'All four variants with copy that justifies their role="status" or role="alert" announcement behavior.',
				priority: 'secondary'
			}
		]
	},
	carousel: {
		purpose:
			'Carousel presents a finite sequence in one constrained viewport and lets users move between slides. It wraps Embla behavior with semantic region, slide, orientation, plugin, and navigation-control contracts.',
		useWhen: [
			'Browse a small related set of images, testimonials, or product cards in limited space.',
			'Expose one primary slide at a time while preserving a clear sequence.',
			'Integrate an Embla plugin or API callback behind Bedrock styling.'
		],
		avoidWhen: [
			'Use a list or grid when users should compare all items at once.',
			'Use Tabs when each peer view has a persistent label.',
			'Avoid Carousel for critical content that becomes undiscoverable off-screen.'
		],
		anatomy: [
			{
				name: 'Carousel.Root',
				description:
					'Required region, Embla provider, and orientation/API owner; also exported as Carousel.',
				required: true
			},
			{
				name: 'Carousel.Content',
				description:
					'Required clipped viewport and flex slide container; also exported as CarouselContent.',
				required: true
			},
			{
				name: 'Carousel.Item',
				description:
					'Repeatable semantic slide group that reads Root orientation; also exported as CarouselItem.',
				required: true
			},
			{
				name: 'Carousel.Previous',
				description:
					'Optional labelled previous button with disabled boundary state; also exported as CarouselPrevious.'
			},
			{
				name: 'Carousel.Next',
				description:
					'Optional labelled next button with disabled boundary state; also exported as CarouselNext.'
			}
		],
		behavior: [
			'Content and Item require Root context and throw when used outside it.',
			'Root accepts horizontal or vertical orientation, Embla options/plugins, and setApi for imperative navigation.',
			'ArrowLeft and ArrowRight on navigation controls move the carousel; unavailable directions are disabled.',
			'Items are role="group" with aria-roledescription="slide"; give Root or its section a useful accessible name.'
		],
		examplePlan: [
			{
				title: 'Finite content carousel',
				demonstrates:
					'A labelled horizontal sequence with realistic cards, required anatomy, and boundary-aware Previous/Next controls.',
				priority: 'primary'
			},
			{
				title: 'Vertical orientation',
				demonstrates:
					'The same anatomy in vertical mode with reachable controls and deliberate height.',
				priority: 'secondary'
			},
			{
				title: 'Imperative API and looping',
				demonstrates:
					'setApi and Embla opts for pagination or looping without presenting those as built-in parts.',
				priority: 'edge-case'
			}
		]
	},
	chart: {
		purpose:
			'Chart supplies Bedrock theming and tooltip presentation around charts authored with LayerChart. It is visualization infrastructure, not a data-to-chart facade or a substitute for choosing an appropriate encoding.',
		useWhen: [
			'Apply Bedrock colors, type, axes, grid, legend, and hover styling to LayerChart.',
			'Resolve series labels, icons, and light/dark colors from one typed config.',
			'Present LayerChart tooltip payloads with consistent indicators and values.'
		],
		avoidWhen: [
			'Use Table when exact values and comparison matter more than trend.',
			'Do not expect Container to choose marks, scales, axes, or accessors.',
			'Do not use Tooltip outside both Chart.Container and matching LayerChart context.'
		],
		anatomy: [
			{
				name: 'Chart.ChartContainer',
				description:
					'Required themed wrapper and ChartConfig provider; also exported as Chart.Container. It injects scoped light/dark series variables.',
				required: true
			},
			{
				name: 'Chart.ChartTooltip',
				description:
					'Optional LayerChart tooltip; also exported as Chart.Tooltip. It supports dot, line, or dashed indicators and formatter snippets.'
			},
			{
				name: 'Chart.getPayloadConfigFromPayload',
				description:
					'Public helper mapping a tooltip series or datum key back to its ChartConfig entry.'
			},
			{
				name: 'Chart.ChartConfig',
				description:
					'Public type for each series label, optional icon, and either one color or light/dark theme colors.'
			}
		],
		behavior: [
			'Container generates a stable chart id and scopes configuration colors through CSS custom properties.',
			'Tooltip filters undefined series, derives labels from x data/config, and accepts a Snippet formatter for custom rows.',
			'Chart does not add chart-level accessibility; consumers own title, description, data alternative, and non-color encoding.'
		],
		examplePlan: [
			{
				title: 'Configured trend chart',
				demonstrates:
					'A real LayerChart line or area chart with typed config, axes, legend, Tooltip, and an adjacent text summary.',
				priority: 'primary'
			},
			{
				title: 'Tooltip formatting',
				demonstrates: 'Indicator treatments plus a custom formatter snippet for units and labels.',
				priority: 'secondary'
			},
			{
				title: 'Theme and missing values',
				demonstrates:
					'Light/dark series colors and an undefined series value proving the tooltip filtering contract.',
				priority: 'edge-case'
			}
		]
	},
	chat: {
		purpose:
			'Chat is a composable conversation surface covering message flow, author alignment, metadata, attachments, prompt entry, and optional AI activity. Consumers retain message data and transport ownership while Bedrock handles presentation, scrolling, keyboard entry, and accessible status surfaces.',
		useWhen: [
			'Build a human or assistant conversation with a growing message history and composer.',
			'Present attachments, tool activity, reasoning disclosure, or response actions beside messages.',
			'Offer an empty conversation greeting with suggested prompts.'
		],
		avoidWhen: [
			'Use a feed or Item list for records that are not a turn-based conversation.',
			'Do not treat Chat as a networking client; it does not send, persist, retry, or authenticate messages.',
			'Use FieldStatus, Alert, or Banner for feedback outside the conversation.'
		],
		anatomy: [
			{
				name: 'Chat.Root',
				description:
					'Required flex shell and empty-state owner; also exported as Chat. The consumer sets isEmpty and supplies the empty snippet.',
				required: true
			},
			{
				name: 'Chat.MessageList',
				description:
					'Scroll viewport and polite role="log" region with stick-to-bottom behavior; also exported as ChatMessageList.'
			},
			{
				name: 'Chat.Message',
				description:
					'User or assistant turn setting alignment context; also exported as ChatMessage. ChatMessageRole types its role.',
				required: true
			},
			{
				name: 'Chat.MessageBubble',
				description:
					'Filled or ghost body with optional first/middle/last grouping; also exported as ChatMessageBubble. ChatMessageBubbleVariant and ChatMessageBubbleGroup type those choices.',
				required: true
			},
			{
				name: 'Chat.MessageMetadata',
				description:
					'Optional row for time, delivery, model, or other secondary facts; also exported as ChatMessageMetadata.'
			},
			{
				name: 'Chat.MessageActions',
				description:
					'Optional copy, retry, and positive/negative feedback controls; also exported as ChatMessageActions. ChatMessageActionsLabels customizes names.'
			},
			{
				name: 'Chat.SystemMessage',
				description:
					'Centered role="status" event such as a date boundary; also exported as ChatSystemMessage.'
			},
			{
				name: 'Chat.Composer',
				description:
					'Message form with bindable value, growing textarea, send/stop state, file intake, and actions, headerActions, and drawer snippets; also exported as ChatComposer.'
			},
			{
				name: 'Chat.Attachments',
				description: 'Wrapping layout for attachment chips; also exported as ChatAttachments.'
			},
			{
				name: 'Chat.Attachment',
				description:
					'Image, PDF, or file chip with optional size, preview, and removal; also exported as ChatAttachment. ChatAttachmentType types its kind.'
			},
			{
				name: 'Chat.ToolCalls',
				description:
					'Inline single-call or collapsible multi-call activity with bindable expanded state; also exported as ChatToolCalls. ChatToolCall, ChatToolCallStatus, and ChatToolCallsLabels define its data.'
			},
			{
				name: 'Chat.Reasoning',
				description:
					'Collapsible disclosure with bindable open state and working indicator; also exported as ChatReasoning.'
			},
			{
				name: 'Chat.Suggestions',
				description:
					'Prompt pill list returning the chosen string through onSelect; also exported as ChatSuggestions.'
			},
			{
				name: 'Chat.streamText',
				description:
					'Reactive requestAnimationFrame revealer for growing strings. StreamTextOptions, StreamTextSpeed, and TextStream describe natural, fast, and instant modes.'
			}
		],
		behavior: [
			'MessageList pins growth only within 32px of the bottom; after the reader scrolls up it preserves position and offers a scroll-down/new-messages button.',
			'Composer submits trimmed text with Enter, inserts a newline with Shift+Enter, ignores composing Enter events, clears after send, and swaps Send for Stop while busy.',
			'Composer accepts pasted or dropped files only with onFiles; the consumer validates, uploads, and owns attachment state.',
			'Image and PDF attachments with src open Lightbox; ordinary files remain non-interactive, and removal appears only with onRemove.',
			'MessageActions renders nothing without handlers and gives copy temporary Copied feedback. Tool and reasoning disclosures are keyboard-operable Collapsibles.',
			'streamText reveals the full target during SSR, reduced motion, or instant mode and reports done after catching a growing target.'
		],
		examplePlan: [
			{
				title: 'Complete conversation loop',
				demonstrates:
					'Root, log, system event, user/assistant bubbles, timestamp metadata, actions, and a controlled Composer that appends messages.',
				priority: 'primary'
			},
			{
				title: 'Empty chat and attachments',
				demonstrates:
					'The empty snippet with Suggestions, then a drawer containing removable image, PDF, and file attachments plus paste/drop.',
				priority: 'secondary'
			},
			{
				title: 'Assistant activity',
				demonstrates:
					'Reasoning states, inline and grouped ToolCalls with detail/error, and streamed text in natural and reduced-motion-safe modes.',
				priority: 'secondary'
			},
			{
				title: 'Reader controls new content',
				demonstrates:
					'A constrained growing log that makes bottom pinning and scrolled-up new-message behavior observable.',
				priority: 'edge-case'
			}
		]
	},
	indicator: {
		purpose:
			'Indicator provides visual marks for checkbox, radio, and menu-check states when a higher-level control owns interaction. Every indicator is decorative so consumers cannot split role, focus, name, and state across elements.',
		useWhen: [
			'Build a custom owner that already exposes checkbox or radio semantics.',
			'Add a checkmark to a selected menu-style row without duplicating accessible state.',
			'Swap a checkbox mark for busy content while its owner is pending.'
		],
		avoidWhen: [
			'Use Checkbox or RadioGroup for a complete interactive control.',
			'Do not add a label, role, tabindex, or click handler to the indicator.',
			'Use StatusDot for operational state rather than selection.'
		],
		anatomy: [
			{
				name: 'Indicator.Checkbox',
				description:
					'Decorative unchecked, checked, or indeterminate box with sm/default sizing, disabled styling, and replacement snippet; also CheckboxIndicator. CheckboxIndicatorState types state.'
			},
			{
				name: 'Indicator.Check',
				description:
					'Decorative empty-or-checkmark slot for menu selection; also CheckIndicator. CheckIndicatorState types state.'
			},
			{
				name: 'Indicator.Radio',
				description:
					'Decorative unchecked or checked radio circle; also RadioIndicator. RadioIndicatorState types state.'
			}
		],
		behavior: [
			'Every root is aria-hidden="true" and exposes data-state only for owner styling.',
			'Checkbox children replace the normal check or indeterminate mark, supporting a Spinner without changing owner semantics.',
			'Unchecked Check and Radio roots stay present but empty to preserve alignment.'
		],
		examplePlan: [
			{
				title: 'Indicator inside its owner',
				demonstrates:
					'A custom checkbox-style button whose role, name, focus, and aria-checked live on the owner while Checkbox is hidden.',
				priority: 'primary'
			},
			{
				title: 'State and shape matrix',
				demonstrates:
					'Checkbox unchecked/checked/indeterminate, Check, and Radio states with owner text beside each visual.',
				priority: 'secondary'
			},
			{
				title: 'Pending custom mark',
				demonstrates:
					'A Checkbox child Spinner replacing the mark while its owner remains disabled and accurately named.',
				priority: 'edge-case'
			}
		]
	},
	empty: {
		purpose:
			'Empty gives a data view a deliberate explanation when it has no records or results. Its parts separate identity, guidance, and recovery actions so an empty screen is not an unlabeled decorative panel.',
		useWhen: [
			'A collection has no records and the user can create the first one.',
			'Filters or search produce no results and a reset action is available.',
			'A feature has no configured source and needs setup guidance.'
		],
		avoidWhen: [
			'Use Skeleton or Spinner while data is still loading.',
			'Use Alert or FieldStatus for a failed request rather than presenting it as empty data.',
			'Do not add an action when the user has no useful recovery path.'
		],
		anatomy: [
			{
				name: 'Empty.Root',
				description: 'Required centered empty-state layout; also exported as Empty.',
				required: true
			},
			{
				name: 'Empty.Header',
				description:
					'Grouping for Media, Title, and Description with readable width; also EmptyHeader.'
			},
			{
				name: 'Empty.Media',
				description:
					'Optional illustration or icon container with default and icon variants; also EmptyMedia.'
			},
			{ name: 'Empty.Title', description: 'Short statement of what is missing; also EmptyTitle.' },
			{
				name: 'Empty.Description',
				description: 'Explanation or next-step guidance; also EmptyDescription.'
			},
			{
				name: 'Empty.Content',
				description: 'Optional vertical action area below the explanation; also EmptyContent.'
			}
		],
		behavior: [
			'Empty supplies layout only; consumers own live-region announcements when filtering produces no results.',
			'Root can fill available space while Header and Content cap width and center children.',
			'Media does not assign accessible meaning; decorative media should remain hidden from assistive technology.'
		],
		examplePlan: [
			{
				title: 'First-record empty state',
				demonstrates:
					'All six parts with decorative icon, direct explanation, and one action that creates the missing record.',
				priority: 'primary'
			},
			{
				title: 'No filtered results',
				demonstrates:
					'An empty search result with reset-filters action and copy distinct from a never-populated collection.',
				priority: 'secondary'
			},
			{
				title: 'Read-only empty state',
				demonstrates: 'A valid no-action state explaining why Content is optional.',
				priority: 'edge-case'
			}
		]
	},
	icon: {
		purpose:
			'Icon resolves stable semantic names to the application’s configured SVG components and accepts direct components for one-offs. Its registry decouples product meaning from one icon library while enforcing decorative versus standalone accessible treatment.',
		useWhen: [
			'Render a Bedrock semantic icon consistently across components.',
			'Swap the application icon set globally without changing product code.',
			'Pass a direct Svelte SVG component for a true one-off.'
		],
		avoidWhen: [
			'Use IconButton when the icon triggers an action.',
			'Do not add label when a parent control already provides the accessible name.',
			'Do not misuse a similar registry name for a different concept; extend it or pass a direct component.'
		],
		anatomy: [
			{
				name: 'Icon.Root',
				description:
					'Single renderer; also exported as Icon. It accepts IconType and forwards typed IconProps to the resolved SVG.'
			},
			{
				name: 'Icon.setIcons',
				description: 'Globally and reactively overrides selected IconName entries.'
			},
			{
				name: 'Icon.resetIcons',
				description:
					'Restores built-in Lucide mappings, primarily for tests and application reset flows.'
			},
			{
				name: 'Icon.resolveIcon',
				description:
					'Returns the registered component for IconName or passes an IconComponent through.'
			},
			{
				name: 'Icon.IconName / IconType / IconComponent / IconProps',
				description:
					'Public types for semantic names, accepted inputs, compatible Svelte SVG components, and forwarded SVG attributes.'
			}
		],
		behavior: [
			'Without label, Icon is aria-hidden; with label, it becomes role="img" with that accessible name.',
			'Registry changes are reactive, so mounted Icons update after setIcons.',
			'Icons default to a 1rem square and inherit currentColor unless overridden.'
		],
		examplePlan: [
			{
				title: 'Decorative and meaningful icons',
				demonstrates:
					'Semantic names inside labelled UI plus one standalone Icon with label, explaining why others are hidden.',
				priority: 'primary'
			},
			{
				title: 'Application registry override',
				demonstrates:
					'setIcons replacing one name reactively, followed by resetIcons so the example leaves no global state.',
				priority: 'secondary'
			},
			{
				title: 'Direct one-off component',
				demonstrates:
					'A direct Lucide component for a concept without a durable semantic registry name.',
				priority: 'edge-case'
			}
		]
	},
	item: {
		purpose:
			'Item composes a dense record row from media, primary copy, metadata, and actions. It can remain a visual div or delegate root props through a child snippet when the row needs a semantic link or other host.',
		useWhen: [
			'Lay out files, people, settings, or search results as compact rows.',
			'Group related rows with consistent spacing and separators.',
			'Create a whole-row link through the child snippet.'
		],
		avoidWhen: [
			'Use Table or DataTable when meaning depends on aligned columns and headers.',
			'Use Menu primitives for keyboard-managed action menus.',
			'Use Card for a larger standalone surface rather than row anatomy.'
		],
		anatomy: [
			{
				name: 'Item.Root',
				description:
					'Required row with default/outline/muted variants, default/sm/xs density, and a child snippet receiving merged props; also Item.',
				required: true
			},
			{
				name: 'Item.Group',
				description: 'Optional role="list" stack for related roots; also ItemGroup.'
			},
			{
				name: 'Item.Separator',
				description: 'Horizontal divider between sibling rows; also ItemSeparator.'
			},
			{
				name: 'Item.Header',
				description: 'Full-width leading row for heading content and actions; also ItemHeader.'
			},
			{
				name: 'Item.Footer',
				description: 'Full-width trailing row for secondary actions or metadata; also ItemFooter.'
			},
			{ name: 'Item.Content', description: 'Flexible primary text column; also ItemContent.' },
			{
				name: 'Item.Title',
				description: 'Single-line primary label, optionally containing a link; also ItemTitle.'
			},
			{
				name: 'Item.Description',
				description: 'Muted two-line supporting copy; also ItemDescription.'
			},
			{
				name: 'Item.Actions',
				description: 'Trailing cluster for controls or compact metadata; also ItemActions.'
			},
			{
				name: 'Item.Media',
				description:
					'Leading default, icon, or image container responsive to Root density; also ItemMedia.'
			}
		],
		behavior: [
			'Root is a div unless child renders another element; consumers own link, button, list-item, and keyboard semantics.',
			'Title clamps to one line and Description to two while Actions and Media resist shrinking.',
			'Group has role="list" but Root does not add role="listitem" automatically; compose appropriate item semantics.',
			'Do not nest controls inside a whole-row button or link unless the HTML and interaction remain valid.'
		],
		examplePlan: [
			{
				title: 'Record list anatomy',
				demonstrates:
					'A role-correct Group of file rows using Media, Content, Title, Description, Actions, and Separator.',
				priority: 'primary'
			},
			{
				title: 'Linked row with child',
				demonstrates:
					'The Root child snippet forwarding merged props to an anchor without a competing nested action.',
				priority: 'secondary'
			},
			{
				title: 'Expanded and constrained row',
				demonstrates: 'Header, Footer, image Media, density variants, and long-text clamping.',
				priority: 'edge-case'
			}
		]
	},
	kbd: {
		purpose:
			'Kbd renders conventional notation for a keyboard key, while Group joins keys into one shortcut. It documents an available command but does not listen for or execute it.',
		useWhen: [
			'Teach a discoverable shortcut beside an action or hint.',
			'Represent a multi-key chord such as Command+B.',
			'Include key notation in help text or a tooltip.'
		],
		avoidWhen: [
			'Do not use Kbd as a clickable button or keybinding handler.',
			'Use code-styled Text for commands, paths, or arbitrary technical strings.',
			'Do not show a shortcut the product has not implemented.'
		],
		anatomy: [
			{
				name: 'Kbd.Root',
				description: 'One visual key cap rendered as semantic kbd; also exported as Kbd.'
			},
			{
				name: 'Kbd.Group',
				description: 'Inline semantic kbd wrapper spacing multiple Root key caps; also KbdGroup.'
			}
		],
		behavior: [
			'Both exports use the Bedrock code font; Root is pointer-events-none and cannot become a target.',
			'Key labels are literal content, so use platform notation the audience recognizes.'
		],
		examplePlan: [
			{
				title: 'Shortcut in context',
				demonstrates:
					'A real implemented action labelled with Group containing separate modifier and letter roots.',
				priority: 'primary'
			},
			{
				title: 'Single keys and sequences',
				demonstrates:
					'Escape, a chord, and a written sequence without implying Group handles events.',
				priority: 'secondary'
			}
		]
	},
	'pdf-viewer': {
		purpose:
			'PDFViewer lazily loads pdf.js in the browser and renders every page into a vertically scrollable canvas stack. It is an embedded visual preview with loading and failure states, not a complete document-reading application.',
		useWhen: [
			'Preview a known PDF attachment without leaving the current task.',
			'Embed a bounded read-only document surface in a detail view or lightbox.',
			'Defer the heavy pdf.js dependency until a viewer mounts.'
		],
		avoidWhen: [
			'Use a link or download when users need full browser PDF controls.',
			'Do not use it when selectable text, search, annotations, zoom, or strong document accessibility are required.',
			'Use Thumbnail for a compact file preview.'
		],
		anatomy: [
			{
				name: 'PdfViewer.Root',
				description:
					'Single scroll container requiring src and accepting localized errorText; also PdfViewer and PDFViewer.'
			}
		],
		behavior: [
			'pdf.js and its worker load only in the browser after the page host and src exist.',
			'Pages render in source order at container width and no more than 2× device pixel ratio.',
			'The skeleton disappears after the first page; any load/render failure displays errorText.',
			'Changing src cancels prior work, but no pagination, zoom, search, or download controls are exposed.'
		],
		examplePlan: [
			{
				title: 'Bounded document preview',
				demonstrates:
					'A multi-page PDF with title, metadata, deliberate viewer height, and separate download/open-original action.',
				priority: 'primary'
			},
			{
				title: 'Load and failure states',
				demonstrates:
					'A switch between valid and invalid sources showing the skeleton and localized errorText.',
				priority: 'edge-case'
			}
		]
	},
	progress: {
		purpose:
			'Progress reports how much of a bounded task is complete through a semantic progressbar and proportional fill. It is for determinate work where current value and maximum are known.',
		useWhen: [
			'Show upload, import, or setup completion with a known percentage.',
			'Visualize progress toward a numeric maximum other than 100.',
			'Pair an operation with a visible label and current value.'
		],
		avoidWhen: [
			'Use Spinner when completion cannot be estimated.',
			'Use Stepper for named stages and navigation.',
			'Do not use Progress as an unlabeled decorative score meter.'
		],
		anatomy: [
			{
				name: 'Progress.Root',
				description:
					'Single semantic progress primitive with value, max, and internal proportional indicator; also Progress.'
			}
		],
		behavior: [
			'The underlying primitive owns progressbar values; the consumer provides an accessible label through context or ARIA.',
			'An omitted or null value paints an empty indicator, so use Spinner for genuinely indeterminate work.',
			'The fill translates according to value/max and uses its current transition styling for changes.'
		],
		examplePlan: [
			{
				title: 'Labelled task progress',
				demonstrates:
					'An upload with visible label, percentage, matching accessible name, and updating value.',
				priority: 'primary'
			},
			{
				title: 'Custom maximum',
				demonstrates: 'A completed-items measure such as 7 of 12 using explicit value and max.',
				priority: 'secondary'
			},
			{
				title: 'Boundary values',
				demonstrates: 'Zero, partial, and complete states with surrounding text kept in sync.',
				priority: 'edge-case'
			}
		]
	},
	skeleton: {
		purpose:
			'Skeleton reserves the shape of expected content that has not loaded. It reduces layout shift and communicates approximate structure without pretending to be real data.',
		useWhen: [
			'Hold space for a card, avatar, or text during an initial fetch.',
			'Keep a stable layout while a known content shape is replaced.',
			'Compose placeholders mirroring the final information hierarchy.'
		],
		avoidWhen: [
			'Use Spinner for a compact action whose final shape is not useful to preview.',
			'Use Empty only after loading completes with no content.',
			'Do not replace existing content with Skeleton during background refreshes.'
		],
		anatomy: [
			{
				name: 'Skeleton.Root',
				description:
					'Single non-content block sized and shaped through class/native div attributes; also Skeleton.'
			}
		],
		behavior: [
			'Skeleton has no status or label; mark its owning region busy and supply concise status text when needed.',
			'It renders no children and pulses continuously using the current animation utility.',
			'Match final dimensions closely enough to avoid a second reflow.'
		],
		examplePlan: [
			{
				title: 'Loading record row',
				demonstrates:
					'A busy labelled region whose avatar and text skeletons match the Item row replacing them.',
				priority: 'primary'
			},
			{
				title: 'Common content shapes',
				demonstrates: 'Avatar, title, paragraph, and media aspect-ratio placeholders.',
				priority: 'secondary'
			},
			{
				title: 'Loading-to-content swap',
				demonstrates: 'A toggle proving placeholder and final content occupy stable space.',
				priority: 'edge-case'
			}
		]
	},
	spinner: {
		purpose:
			'Spinner is a compact indeterminate status for work whose remaining duration cannot be measured. It supplies status semantics and an accessible label while fitting inline with controls or short messages.',
		useWhen: [
			'Indicate a button or compact panel is waiting on unknown-duration work.',
			'Pair a brief loading message with a small visual spinner.',
			'Replace a decorative mark while a control is pending.'
		],
		avoidWhen: [
			'Use Progress when value and maximum are known.',
			'Use Skeleton when preserving incoming content shape matters.',
			'Do not scatter spinners when one owning region can communicate loading.'
		],
		anatomy: [
			{
				name: 'Spinner',
				description:
					'Single rotating SVG with role="status", default aria-label “Loading,” and forwarded SVG attributes.'
			}
		],
		behavior: [
			'Override aria-label when “Loading” does not identify the operation clearly enough.',
			'The consumer owns disabled, aria-busy, cancellation, and result behavior of the surrounding control.'
		],
		examplePlan: [
			{
				title: 'Pending action',
				demonstrates:
					'A busy action with Spinner, stable button width, and an accessible label naming the operation.',
				priority: 'primary'
			},
			{
				title: 'Inline loading status',
				demonstrates: 'A spinner beside visible text without duplicate or vague announcements.',
				priority: 'secondary'
			}
		]
	},
	'status-dot': {
		purpose:
			'StatusDot adds a tiny visual state cue beside a record or service label. It supports neutral, success, warning, destructive, and info colors but relies on text or a label so color never carries state alone.',
		useWhen: [
			'Precede a service name with its operational state.',
			'Add a compact presence cue where nearby text explains its meaning.',
			'Emphasize a changing outage with restrained pulse motion.'
		],
		avoidWhen: [
			'Use Badge when the state needs visible text inside the marker.',
			'Use FieldStatus or Alert when users need explanation or recovery.',
			'Do not invent inconsistent color mappings between screens.'
		],
		anatomy: [
			{
				name: 'StatusDot.Root',
				description:
					'Single state dot; also StatusDot. statusDotVariants, StatusDotStatus, and StatusDotSize expose status, sm/default/lg size, and pulse styling.'
			}
		],
		behavior: [
			'Without label the dot is aria-hidden because nearby copy must carry meaning; with label it is role="img" with that name.',
			'Pulse uses a reduced-motion-safe animation utility.',
			'data-status exposes the selected state for inspection and styling.'
		],
		examplePlan: [
			{
				title: 'Service status list',
				demonstrates:
					'Every status paired with visible service/state text, with decorative dots where text already names meaning.',
				priority: 'primary'
			},
			{
				title: 'Standalone labelled cue',
				demonstrates:
					'A rare labelled use plus all sizes, with pulse reserved for a live destructive state.',
				priority: 'secondary'
			}
		]
	},
	table: {
		purpose:
			'Table provides native HTML table anatomy with Bedrock spacing, borders, hover states, and horizontal overflow protection. It is for authored tabular content, not a sorting, filtering, selection, or virtualization system.',
		useWhen: [
			'Present values whose meaning depends on row and column headers.',
			'Author a comparison, summary, or static report with native table markup.',
			'Compose custom behavior whose data state the application owns.'
		],
		avoidWhen: [
			'Use DataTable when records need sorting, filtering, selection, grouping, or views.',
			'Use Item for heterogeneous rows not dependent on columns.',
			'Do not use Table for page layout.'
		],
		anatomy: [
			{
				name: 'Table.Root',
				description: 'Required native table inside a horizontal overflow wrapper; also Table.',
				required: true
			},
			{
				name: 'Table.Caption',
				description: 'Native caption naming or summarizing the table; also TableCaption.'
			},
			{ name: 'Table.Header', description: 'Native thead grouping header rows; also TableHeader.' },
			{
				name: 'Table.Body',
				description: 'Native tbody grouping main data rows; also TableBody.',
				required: true
			},
			{
				name: 'Table.Footer',
				description: 'Optional native tfoot for totals or summaries; also TableFooter.'
			},
			{
				name: 'Table.Row',
				description: 'Native tr inside Header, Body, or Footer; also TableRow.',
				required: true
			},
			{
				name: 'Table.Head',
				description:
					'Native th for a row/column header; also TableHead. Consumers add scope or relationships when required.'
			},
			{
				name: 'Table.Cell',
				description: 'Native td for one data value; also TableCell.',
				required: true
			}
		],
		behavior: [
			'Root wraps the table in overflow-x-auto while Head and Cell default to no wrapping, so wide tables scroll.',
			'Parts preserve native elements and attributes, leaving caption, scope, colspan, rowspan, and ARIA behavior available.',
			'Rows react visually to hover and data-state="selected" but Table owns no selection or keyboard interaction.',
			'Numeric alignment, responsive hiding, and empty states are explicit consumer composition.'
		],
		examplePlan: [
			{
				title: 'Semantic inventory table',
				demonstrates:
					'Caption, Header, scoped Head cells, Body, right-aligned tabular values, and Footer total in a report.',
				priority: 'primary'
			},
			{
				title: 'Horizontal overflow',
				demonstrates:
					'A deliberately wide table in a narrow container proving Root scrolls without discarding semantics.',
				priority: 'edge-case'
			}
		]
	},
	thumbnail: {
		purpose:
			'Thumbnail presents a small bounded image or file preview with predictable size and fallback behavior. It preserves the image’s accessible name on failure but remains a visual span rather than a control.',
		useWhen: [
			'Precede a file or attachment row with a compact preview.',
			'Show small image choices whose surrounding control owns selection.',
			'Provide a file-type fallback when a source is absent or broken.'
		],
		avoidWhen: [
			'Use Avatar for people and identity fallbacks.',
			'Use a larger image or AspectRatio surface for editorial media.',
			'Do not attach interaction directly; wrap Thumbnail in a labelled link, button, or Lightbox trigger.'
		],
		anatomy: [
			{
				name: 'Thumbnail.Root',
				description:
					'Single sm/default/lg and rounded/square frame; also Thumbnail. thumbnailVariants, ThumbnailSize, and ThumbnailShape expose those styles.'
			}
		],
		behavior: [
			'With valid src it renders img using alt; without a source or after error it renders children or a file icon.',
			'A fallback with non-empty alt becomes role="img" with that aria-label.',
			'Changing src resets failure and gives the new source a fresh attempt.',
			'Media clips with object-cover; no loading, selection, or click state is exposed.'
		],
		examplePlan: [
			{
				title: 'Attachment preview row',
				demonstrates:
					'A labelled row with image Thumbnail, meaningful alt, sizes in context, and a surrounding action owning focus.',
				priority: 'primary'
			},
			{
				title: 'Shapes and custom fallback',
				demonstrates: 'Rounded/square shapes plus children supplying a file-type fallback.',
				priority: 'secondary'
			},
			{
				title: 'Broken and replaced sources',
				demonstrates:
					'A failed URL retaining alt, then a source change successfully rendering a new image.',
				priority: 'edge-case'
			}
		]
	},
	timestamp: {
		purpose:
			'Timestamp turns a Date, string, or number into localized relative or absolute time while preserving a machine-readable time element. Auto mode keeps recent events conversational and switches older events to a stable date and time.',
		useWhen: [
			'Show when a message, record, or event occurred.',
			'Keep recent activity current without every consumer owning a timer.',
			'Format a known locale through platform Intl.'
		],
		avoidWhen: [
			'Use plain text for durations or values that must not update.',
			'Do not pass ambiguous date strings with runtime-dependent parsing.',
			'Use a date/time input when users must edit the value.'
		],
		anatomy: [
			{
				name: 'Timestamp.Root',
				description:
					'Single time element requiring date, with auto/relative/absolute modes and en-US default; also Timestamp.'
			}
		],
		behavior: [
			'Auto uses relative wording within seven days and absolute formatting at or beyond the threshold.',
			'Relative and auto refresh once per minute; absolute mode creates no interval.',
			'Valid values expose ISO datetime and a full localized title; invalid values render an en dash and omit both.',
			'Relative units step from current minute through minutes, hours, and days using Intl.RelativeTimeFormat.'
		],
		examplePlan: [
			{
				title: 'Recent and historical activity',
				demonstrates:
					'A current record using auto beside an older one, with visible output and semantic datetime/title.',
				priority: 'primary'
			},
			{
				title: 'Modes and locale',
				demonstrates:
					'One value as relative/absolute plus a de-AT override distinguishing mode from locale.',
				priority: 'secondary'
			},
			{
				title: 'Threshold and invalid input',
				demonstrates: 'Values just inside/outside seven days and the en-dash invalid fallback.',
				priority: 'edge-case'
			}
		]
	},
	token: {
		purpose:
			'Token represents a compact entity such as a filter, tag, selection, or linked record and can expose body and removal interactions independently. Unlike Badge, it renders a span, button, or anchor according to supplied interaction.',
		useWhen: [
			'Represent a selected filter or category that can be removed.',
			'Open an entity or filtered view from a linked chip.',
			'Run a chip-level action while preserving separate removal.'
		],
		avoidWhen: [
			'Use Badge for passive status or category text.',
			'Use Button for a primary action not representing an entity.',
			'Do not communicate status with color alone.'
		],
		anatomy: [
			{
				name: 'Token.Root',
				description:
					'Entity chip requiring label; also Token. TokenProps covers icon, color, size, href, onclick, onRemove, disabled, endContent, and labels.'
			},
			{
				name: 'Token.tokenVariants',
				description:
					'Style helper for TokenColor neutral/red/orange/yellow/green/teal/blue/purple/pink/gray and TokenSize sm/md/lg; TokenLabels types overrides.'
			}
		],
		behavior: [
			'The body is span when passive, button with onclick, and anchor with href; href takes precedence when both exist.',
			'onRemove creates a separately labelled sibling button, avoiding nested controls.',
			'Disabled buttons use native state; disabled links lose href/tab focus and expose aria-disabled.',
			'Icon is decorative because label names the body; label truncates and endContent appends a snippet.'
		],
		examplePlan: [
			{
				title: 'Entity token behaviors',
				demonstrates:
					'Passive, clickable, linked, and removable entities with observable handlers and separate remove target.',
				priority: 'primary'
			},
			{
				title: 'Color, size, and end content',
				demonstrates: 'Supported palette and sizes plus endContent for concise metadata.',
				priority: 'secondary'
			},
			{
				title: 'Disabled and long labels',
				demonstrates: 'Disabled body/removal behavior, truncation, and customized remove copy.',
				priority: 'edge-case'
			}
		]
	},
	'video-player': {
		purpose:
			'VideoPlayer provides a labelled product-media surface with Bedrock controls over native progressive video playback. It covers captions, seeking, rate, mute, fullscreen, picture-in-picture, buffering, and retry while leaving adaptive streaming to consumers.',
		useWhen: [
			'Play product walkthroughs, support recordings, or video attachments.',
			'Need localizable keyboard-operable controls matching Bedrock.',
			'Attach application-owned HLS or another setup to the native video element.'
		],
		avoidWhen: [
			'Use native video controls when platform UI is sufficient.',
			'Do not treat it as a streaming platform: no DRM, ads, playlists, quality selection, analytics, or bundled HLS/DASH.',
			'Use Thumbnail or a poster link when inline playback is excessive.'
		],
		anatomy: [
			{
				name: 'VideoPlayer.Root',
				description:
					'Required monolithic player facade and labelled role="group"; also VideoPlayer. It owns video, custom/native controls, media states, overlays, and announcements.',
				required: true
			},
			{
				name: 'VideoPlayer.VideoSource / VideoCaptionTrack / VideoPlayerLabels',
				description:
					'Types for URL or typed sources, WebVTT caption tracks, and partial localization of control/status strings.'
			},
			{
				name: 'VideoPlayer.formatTime',
				description: 'Helper formatting nonnegative seconds as m:ss or h:mm:ss.'
			},
			{
				name: 'VideoPlayer.clampTime',
				description: 'Helper bounding a seek target to finite playable duration.'
			}
		],
		behavior: [
			'label names the group; captionsTrack and muted are bindable; mediaSetup receives video and may return cleanup.',
			'Space/K toggles; Left/Right seeks 5s or 30 with Shift; J/L seeks 10; Up/Down changes volume; M, C, F, and supported P control mute, captions, fullscreen, and PiP. Text-entry targets keep keys.',
			'The ARIA scrubber supports pointer capture, Left/Right ±5s, PageUp/PageDown ±30s, and Home/End.',
			'Custom controls hide after three idle seconds only during fullscreen playback and wake on pointer/focus; nativeControls replaces them.',
			'Buffering waits 150ms, failures show alert/retry, and status changes use a hidden role="status".',
			'Native sources support progressive media; adaptive streaming and autoplay recovery remain consumer/platform responsibilities.'
		],
		examplePlan: [
			{
				title: 'Accessible product walkthrough',
				demonstrates:
					'A poster MP4 with required label, English captions, custom controls, shortcut help, and current playback state.',
				priority: 'primary'
			},
			{
				title: 'Sources and controlled settings',
				demonstrates:
					'Typed MP4/WebM sources, bindable muted/captionsTrack, custom rates/labels, and nativeControls.',
				priority: 'secondary'
			},
			{
				title: 'Failure and streaming boundary',
				demonstrates:
					'Invalid source retry plus a small mediaSetup integration without implying bundled HLS.',
				priority: 'edge-case'
			}
		]
	},
	'visually-hidden': {
		purpose:
			'VisuallyHidden keeps explanatory text in the accessibility tree while removing it from visual layout. It lets iconography or abbreviated copy retain a complete accessible name or description.',
		useWhen: [
			'Add missing context to a visible link or label without visual repetition.',
			'Name a visual-only element when composition is clearer than aria-label.',
			'Expand an abbreviation for assistive technology.'
		],
		avoidWhen: [
			'Do not hide instructions sighted keyboard or cognitive users also need.',
			'Do not use it for skip links or content that must reveal on focus; no focusable/reveal mode exists.',
			'Prefer native visible labels and descriptions first.'
		],
		anatomy: [
			{
				name: 'VisuallyHidden.Root',
				description:
					'Single sr-only span rendering children and forwarding attributes/ref; also VisuallyHidden.'
			}
		],
		behavior: [
			'Content remains in the accessibility tree and contributes to surrounding link/control names.',
			'The root is always a span with sr-only styling and has no built-in focus reveal.',
			'Avoid duplicating nearby visible wording because assistive technology reads both.'
		],
		examplePlan: [
			{
				title: 'Complete link context',
				demonstrates:
					'A visible download link whose hidden format/size complete the accessible name without duplication.',
				priority: 'primary'
			},
			{
				title: 'Icon-only control name',
				demonstrates:
					'A button with decorative Icon and VisuallyHidden label, contrasted with IconButton.',
				priority: 'secondary'
			},
			{
				title: 'Focus-reveal boundary',
				demonstrates: 'Why a skip link needs a separately styled focus-revealed anchor.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
