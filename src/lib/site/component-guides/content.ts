import type { ComponentGuides } from './types';

export const contentGuides = {
	blockquote: {
		purpose:
			'Blockquote gives quoted material the correct blockquote semantics and a consistent editorial treatment. It can also associate a visible attribution and a machine-readable source URL with the quotation.',
		useWhen: [
			'Quoting a person, publication, customer, or other source as a distinct block of content.',
			'An attribution should remain visibly attached to a quotation.',
			'A source URL should be recorded in the native blockquote cite attribute.'
		],
		avoidWhen: [
			'Use Text for emphasis or a callout that is not someone else’s quoted material.',
			'Use Citation for a compact inline source reference instead of repeating the source below a block quote.',
			'Use ordinary quotation marks for a short quote that belongs inside a sentence.'
		],
		anatomy: [
			{
				name: 'Blockquote.Root',
				description:
					'The required component, also exported as Blockquote. It renders the quote as a blockquote; when cite is a string or snippet, it adds a surrounding figure and a figcaption containing a cite element.',
				required: true
			}
		],
		behavior: [
			'cite controls the visible attribution, while citeUrl supplies the blockquote element’s machine-readable cite attribute; citeUrl does not create a clickable link.',
			'Without an attribution, the component emits only the blockquote and does not add an empty figure or caption.',
			'The attribution accepts either a string or a snippet, so consumers own any richer attribution content and links.'
		],
		examplePlan: [
			{
				title: 'Attributed quotation',
				demonstrates:
					'A product-relevant quotation with visible authorship and a citeUrl, making the distinction between attribution and source metadata explicit.',
				priority: 'primary'
			},
			{
				title: 'Quotation without attribution',
				demonstrates:
					'The minimum invocation and the simpler blockquote-only structure when no source name is available.',
				priority: 'secondary'
			},
			{
				title: 'Rich attribution',
				demonstrates:
					'A cite snippet containing a publication name and Link without placing interactive content inside the quoted text.',
				priority: 'edge-case'
			}
		]
	},
	citation: {
		purpose:
			'Citation attaches a compact, numbered source reference to a claim. It renders a linked source when a URL is available and preserves a readable, non-interactive source label when it is not.',
		useWhen: [
			'A statement needs an inline pointer to a source supplied elsewhere in the application.',
			'AI, research, or reporting output needs sources numbered in document order.',
			'A source may be either navigable or informational while keeping the same citation treatment.'
		],
		avoidWhen: [
			'Use Link when the linked resource is part of the sentence rather than evidence attached to it.',
			'Use Blockquote when reproducing a substantial passage with an attribution.',
			'Do not use Citation as a footnote manager; the consumer must assign numbers and own the source collection.'
		],
		anatomy: [
			{
				name: 'Citation.Root',
				description:
					'The required component, also exported as Citation. It takes a required number and CitationSource object; CitationSource exposes title plus optional url and icon fields.',
				required: true
			}
		],
		behavior: [
			'The default label variant shows an optional source icon and a title truncated within a 16rem maximum width; the number variant shows only the reference number.',
			'Every variant receives an accessible label in the form “Source {number}: {title}”, including an unlinked citation.',
			'When source.url exists, Citation renders a native link that opens a new tab with noopener and noreferrer; otherwise it renders a span and has no keyboard interaction.',
			'The optional icon is decorative context in the label variant and is not shown in the number variant.'
		],
		examplePlan: [
			{
				title: 'Linked source label',
				demonstrates:
					'A citation attached to a concrete claim, including a recognizable source title, optional icon, URL, new-tab behavior, and accessible name.',
				priority: 'primary'
			},
			{
				title: 'Numbered academic style',
				demonstrates:
					'Several compact number citations in prose so their manually assigned order and full accessible labels are clear.',
				priority: 'secondary'
			},
			{
				title: 'Source without a URL',
				demonstrates:
					'The non-interactive span fallback for an internal interview or offline document that cannot be opened.',
				priority: 'edge-case'
			}
		]
	},
	'code-block': {
		purpose:
			'CodeBlock presents source code or preformatted text in a readable, copyable region. It progressively adds Shiki syntax highlighting in the browser while retaining a plain, server-renderable fallback.',
		useWhen: [
			'Documentation needs a multi-line code sample with an optional filename and language.',
			'Logs, configuration, or terminal output must preserve whitespace.',
			'Long code needs line numbers, wrapping, or a bounded scrolling region.'
		],
		avoidWhen: [
			'Use Text with type="code" or an inline code element for a command or identifier inside prose.',
			'Use a full editor when users must modify, validate, or execute the code.',
			'Do not depend on highlighting to communicate meaning; unknown languages and loading failures intentionally remain plain text.'
		],
		anatomy: [
			{
				name: 'CodeBlock.Root',
				description:
					'The required component, also exported as CodeBlock. It owns the optional header, copy action, scrollable preformatted content, and plain-to-highlighted rendering; CodeBlockLabels types overrides for the copy, copied, and language labels.',
				required: true
			}
		],
		behavior: [
			'code is required. language defaults to plaintext; supported non-plain languages load Shiki lazily, while an unknown language or load failure keeps the escaped plain-text fallback.',
			'The header appears when there is a title, a copy button, or a non-plaintext language. copyButton defaults to true and writes the complete code string to the Clipboard API.',
			'After copying, the localized button label and icon report success for about 1.4 seconds before returning to the copy state.',
			'wrap switches horizontal overflow to wrapped lines, maxHeight bounds the content region, and lineNumbers numbers visual lines. container="section" removes the card border treatment but not the content semantics.',
			'Shiki output uses paired light and dark themes. Consumer code is escaped by Shiki, and the fallback is rendered as text rather than injected HTML.'
		],
		examplePlan: [
			{
				title: 'Highlighted TypeScript file',
				demonstrates:
					'A realistic multi-line file with title, language label, line numbers, and the default copy interaction, including its copied state.',
				priority: 'primary'
			},
			{
				title: 'Long configuration output',
				demonstrates:
					'Wrapping and maxHeight in a constrained container so both vertical and horizontal overflow decisions are visible.',
				priority: 'secondary'
			},
			{
				title: 'Plain and unknown languages',
				demonstrates:
					'The SSR-safe plaintext rendering and graceful fallback when syntax highlighting is unavailable, with the copy action optionally removed.',
				priority: 'edge-case'
			}
		]
	},
	heading: {
		purpose:
			'Heading creates the semantic outline of a page while applying Bedrock typography. It separates document level from visual scale so hierarchy can remain correct even when a design calls for a larger or smaller treatment.',
		useWhen: [
			'Naming a page, section, subsection, panel, or other part of the document outline.',
			'A heading’s semantic level and visual prominence need to differ.',
			'A long heading needs single-line truncation or a fixed line clamp.'
		],
		avoidWhen: [
			'Use Text display styles for large decorative copy or numeric callouts that are not headings.',
			'Do not choose level from font size; preserve the document hierarchy and change visual instead.',
			'Use ordinary Text for labels and supporting copy that should not appear in the page outline.'
		],
		anatomy: [
			{
				name: 'Heading.Root',
				description:
					'The required semantic heading, also exported as Heading. level selects h1 through h6; headingVariants and the exported HeadingProps, HeadingLevel, HeadingVisual, HeadingColor, and HeadingAlign types support typed composition and styling.',
				required: true
			}
		],
		behavior: [
			'level is required and determines the rendered h1–h6 element. visual defaults to that level but can use another level or display-1 through display-3 without changing the element.',
			'accessibilityLevel adds aria-level only when it differs from level; use it deliberately because it does not change the underlying heading element.',
			'maxLines applies a multi-line clamp and takes precedence over truncate. A supplied style string is preserved before the clamp declarations.',
			'color supports default, muted, accent, destructive, and inherit; align uses logical start, center, or end values for bidirectional layouts.'
		],
		examplePlan: [
			{
				title: 'A correct page outline',
				demonstrates:
					'A page title, section, and subsection in context, showing that level describes hierarchy rather than a typography sampler.',
				priority: 'primary'
			},
			{
				title: 'Semantic and visual levels',
				demonstrates:
					'Two h2 headings with standard and display treatments plus a smaller-looking h3, while inspecting that their native elements remain correct.',
				priority: 'secondary'
			},
			{
				title: 'Long constrained heading',
				demonstrates:
					'A narrow card title using maxLines alongside an unclamped heading, clarifying clamp precedence and the cost of hiding content.',
				priority: 'edge-case'
			}
		]
	},
	link: {
		purpose:
			'Link navigates to another location while keeping text-link styling, focus treatment, and external-destination cues consistent. It can express a temporarily unavailable destination without changing the surrounding layout.',
		useWhen: [
			'Navigating to another route, document section, file, or web resource.',
			'An external destination should visibly and audibly announce that it opens in a new tab.',
			'A prose link needs the standard underline and focus-visible treatment.'
		],
		avoidWhen: [
			'Use Button for an action that changes state, submits data, opens a control, or does not have a destination.',
			'Use Citation when the destination is evidence attached to a claim rather than the linked subject of the sentence.',
			'Do not set external only to get the icon; it also forces a new tab and security rel values.'
		],
		anatomy: [
			{
				name: 'Link.Root',
				description:
					'The required anchor component, also exported as Link. It renders the child label and, in external mode, appends an icon plus the accessible opens-in-new-tab message typed by LinkLabels.',
				required: true
			}
		],
		behavior: [
			'Link preserves native anchor keyboard and focus behavior. external must be set explicitly; the component does not infer it from href.',
			'external forces target="_blank", merges noopener and noreferrer into any supplied rel value, and appends a localized screen-reader message.',
			'disabled removes href, sets aria-disabled, suppresses pointer interaction, and leaves the element as a non-navigating anchor.',
			'underline defaults to persistent; false changes it to hover-only. color controls text treatment without changing link semantics.'
		],
		examplePlan: [
			{
				title: 'Links in product copy',
				demonstrates:
					'An internal route and an external documentation link in sentences, including native focus, external icon, new-tab announcement, and rel behavior.',
				priority: 'primary'
			},
			{
				title: 'Visual treatments',
				demonstrates:
					'Default, muted, inherited-color, and hover-only underline treatments in contexts where each remains recognizably interactive.',
				priority: 'secondary'
			},
			{
				title: 'Unavailable destination',
				demonstrates:
					'A disabled link beside an enabled equivalent, showing its missing href and aria-disabled state and explaining when conditional copy is preferable.',
				priority: 'edge-case'
			}
		]
	},
	list: {
		purpose:
			'List gives related pieces of prose native ordered or unordered list semantics with Bedrock spacing and marker treatments. It supports bullets, sequence numbers, plain divided groups, and per-item semantic icons without becoming a record-row pattern.',
		useWhen: [
			'Presenting steps whose order matters or related points that belong to one group.',
			'A content list needs custom status icons instead of ordinary markers.',
			'A short prose list benefits from separators but still needs list semantics.'
		],
		avoidWhen: [
			'Use Item for structured record rows with metadata, actions, or selection behavior.',
			'Use Menu or navigation primitives for interactive command and destination collections.',
			'Use Table when readers need to compare values across aligned columns.'
		],
		anatomy: [
			{
				name: 'List.Root',
				description:
					'The required list container, also exported as List. It renders an ol for decimal lists and a ul for disc or plain lists, and owns markers, spacing, optional start numbering, and dividers.',
				required: true
			},
			{
				name: 'List.Item',
				description:
					'A required child for each entry, also exported as ListItem. It renders an li and can replace the native marker with an Icon before its content.',
				required: true
			}
		],
		behavior: [
			'variant="decimal" selects an ordered list and forwards start; start has no effect on disc or plain unordered lists.',
			'plain removes markers. Enabling dividers also removes markers and adds separators and balanced item padding.',
			'Providing an icon turns that item into a marker-free flex row. The consumer chooses the icon’s meaning and must not rely on color or shape alone.',
			'List and List.Item add no selection, keyboard navigation, or action behavior; nested interactive content retains its own native behavior.'
		],
		examplePlan: [
			{
				title: 'Bullets and ordered steps',
				demonstrates:
					'Two realistic content groups that clarify when sequence matters, including an ordered list that starts at a number other than one.',
				priority: 'primary'
			},
			{
				title: 'Status icon list',
				demonstrates:
					'Success and warning entries with visible text that carries the status meaning when icons are decorative or unavailable.',
				priority: 'secondary'
			},
			{
				title: 'Divided prose list',
				demonstrates:
					'A plain list with long, wrapping items and dividers, contrasted with the Item family boundary for structured records.',
				priority: 'edge-case'
			}
		]
	},
	markdown: {
		purpose:
			'Markdown turns a Markdown string into Bedrock content primitives without injecting raw HTML. It supports document structure, rich inline text, code, citations, tables, lists, and streaming updates while keeping the renderer’s output consistent with the rest of the system.',
		useWhen: [
			'Rendering trusted or untrusted Markdown-shaped content from an editor, CMS, API, or AI response.',
			'A generated document must share Bedrock heading, link, list, table, citation, and code treatments.',
			'Incrementally arriving Markdown needs an explicit busy state without entry animations.'
		],
		avoidWhen: [
			'Compose native Bedrock components directly when the content structure is known at author time and needs interactive Svelte snippets.',
			'Use an HTML sanitizer and a separately reviewed HTML renderer when authored raw HTML must actually render; Markdown deliberately escapes HTML tokens.',
			'Use a rich-text editor when users must manipulate the document visually rather than supply a Markdown string.'
		],
		anatomy: [
			{
				name: 'Markdown.Root',
				description:
					'The required renderer, also exported as Markdown and typed by MarkdownProps. It lexes content and recursively maps tokens through Bedrock Heading, Text, Link, Citation, CodeBlock, Blockquote, List, Table, and Separator components.',
				required: true
			},
			{
				name: 'Markdown.outlineFromMarkdown',
				description:
					'A public utility that returns the rendered headings’ ids, plain-text labels, and clamped levels, using the same lexer and heading rules as Root.'
			},
			{
				name: 'Markdown.slugify',
				description:
					'A public utility behind heading ids. It lowercases ASCII text, replaces non-alphanumeric runs with dashes, and trims outer dashes; Root deduplicates repeated results in document order.'
			},
			{
				name: 'Markdown public types',
				description:
					'MarkdownCitationStyle, MarkdownDensity, MarkdownHeadingLevel, and MarkdownOutlineItem describe citation appearance, spacing, mapped heading levels, and outline results.'
			}
		],
		behavior: [
			'headingLevelStart maps a Markdown # heading to h1–h6 and clamps deeper results at h6. Heading ids are stable for a render, use plain token text, and receive -2, -3, and later suffixes when duplicated.',
			'Only [id] and 【id】 markers matching a sources key become citations. Numbers follow first appearance across the document; citationStyle selects label or compact number rendering.',
			'Links render through Link. Absolute cross-origin HTTP(S) URLs are treated as external, and onLinkClick may cancel navigation by returning false.',
			'Raw HTML tokens render as literal escaped text. Fenced code uses CodeBlock, GFM task items are read-only with screen-reader state text, and tables preserve Markdown column alignment.',
			'When streaming is true, the root exposes aria-busy and re-lexes changed content; top-level blocks are keyed by index so completed blocks do not intentionally remount, and the renderer adds no entry animation.',
			'density changes only vertical block spacing. The renderer does not provide a component-override prop or executable Markdown extensions.'
		],
		examplePlan: [
			{
				title: 'Complete product document',
				demonstrates:
					'A concise release note or answer containing hierarchy, prose, links, code, a list, a table, a blockquote, and a source so each supported mapping is visible in context.',
				priority: 'primary'
			},
			{
				title: 'Streaming answer with outline',
				demonstrates:
					'A bound content string updated in chunks, aria-busy while streaming, and outlineFromMarkdown producing links that match deduplicated rendered heading ids.',
				priority: 'secondary'
			},
			{
				title: 'Safety and parsing boundaries',
				demonstrates:
					'Raw HTML and unmatched citation markers remaining literal, repeated and non-ASCII-only headings receiving fallback ids, a read-only task list, and a cancelled link click.',
				priority: 'edge-case'
			}
		]
	},
	text: {
		purpose:
			'Text applies Bedrock’s reading, label, supporting, code, and display typography to a deliberately chosen inline or block element. It keeps visual role separate from semantics so consumers can build readable copy without accidentally creating document headings.',
		useWhen: [
			'Styling body, lead, supporting, label, or inline code copy consistently.',
			'Presenting a large decorative title or data callout that must not enter the heading outline.',
			'Numeric content needs tabular figures or long copy needs truncation or line clamping.'
		],
		avoidWhen: [
			'Use Heading whenever the text names a page or section and belongs in the document outline.',
			'Use Link or Button instead of making Text look interactive.',
			'Use CodeBlock for multi-line source, logs, or content that must preserve whitespace.'
		],
		anatomy: [
			{
				name: 'Text.Root',
				description:
					'The required component, also exported as Text. It renders span, p, div, or label and applies textVariants; TextProps and the exported TextType, TextColor, TextWeight, TextAlign, and TextElement types define its typed public options.',
				required: true
			}
		],
		behavior: [
			'as defaults to span and is never inferred from type. Consumers must select p for a paragraph or label plus for for a form label.',
			'type defaults to body. Display types provide visual scale only, code provides monospace styling only, and neither adds heading nor code semantics by itself.',
			'Supporting text defaults to muted color unless color is explicitly set. color="inherit" allows the surrounding component to own color.',
			'maxLines applies a multi-line clamp and takes precedence over truncate; tabularNums aligns changing digits without changing number formatting.',
			'align uses logical start and end options, and the component forwards ordinary HTML attributes and a bindable element ref.'
		],
		examplePlan: [
			{
				title: 'Product copy hierarchy',
				demonstrates:
					'A lead paragraph, body copy, field label, supporting hint, and inline command in one realistic form or settings section, with intentional rendered elements.',
				priority: 'primary'
			},
			{
				title: 'Data and display treatments',
				demonstrates:
					'A decorative KPI using a display type and tabularNums beside a real Heading, making the semantic boundary visible.',
				priority: 'secondary'
			},
			{
				title: 'Overflow and inherited styling',
				demonstrates:
					'Long localized text in narrow containers using truncate and maxLines, plus inherited and explicit supporting colors.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
