export type DocsNavItem = {
	title: string;
	href: '/docs' | '/docs/installation' | '/docs/components';
};

export type ComponentDoc = {
	slug: string;
	title: string;
	description: string;
	category: 'form' | 'layout' | 'overlay' | 'display' | 'navigation' | 'content' | 'data';
};

export const gettingStarted: DocsNavItem[] = [
	{ title: 'Introduction', href: '/docs' },
	{ title: 'Installation', href: '/docs/installation' },
	{ title: 'Components', href: '/docs/components' }
];

export const components: ComponentDoc[] = [
	{
		slug: 'accordion',
		title: 'Accordion',
		description: 'A vertically stacked set of collapsible sections.',
		category: 'layout'
	},
	{
		slug: 'alert',
		title: 'Alert',
		description: 'Inline feedback for a page or section.',
		category: 'display'
	},
	{
		slug: 'alert-dialog',
		title: 'Alert Dialog',
		description: 'A modal that requires an explicit confirmation.',
		category: 'overlay'
	},
	{
		slug: 'aspect-ratio',
		title: 'Aspect Ratio',
		description: 'Locks media to a consistent ratio.',
		category: 'layout'
	},
	{
		slug: 'avatar',
		title: 'Avatar',
		description: 'A photo or initials for a person or team.',
		category: 'display'
	},
	{
		slug: 'badge',
		title: 'Badge',
		description: 'A compact label for status or category.',
		category: 'display'
	},
	{
		slug: 'breadcrumb',
		title: 'Breadcrumb',
		description: 'Shows the current location in a hierarchy.',
		category: 'navigation'
	},
	{
		slug: 'button',
		title: 'Button',
		description: 'Triggers an action or navigates to a route.',
		category: 'form'
	},
	{
		slug: 'button-group',
		title: 'Button Group',
		description: 'Joins related actions into a single control.',
		category: 'form'
	},
	{
		slug: 'calendar',
		title: 'Calendar',
		description: 'Pick a date from a monthly grid.',
		category: 'form'
	},
	{
		slug: 'card',
		title: 'Card',
		description: 'Groups related content on a raised surface.',
		category: 'layout'
	},
	{
		slug: 'carousel',
		title: 'Carousel',
		description: 'A sliding sequence of items.',
		category: 'display'
	},
	{
		slug: 'chart',
		title: 'Chart',
		description: 'Plots series data with LayerChart.',
		category: 'display'
	},
	{
		slug: 'checkbox',
		title: 'Checkbox',
		description: 'Toggles a single option on or off.',
		category: 'form'
	},
	{
		slug: 'collapsible',
		title: 'Collapsible',
		description: 'Shows or hides a block of content.',
		category: 'layout'
	},
	{
		slug: 'command',
		title: 'Command',
		description: 'A searchable command palette.',
		category: 'overlay'
	},
	{
		slug: 'context-menu',
		title: 'Context Menu',
		description: 'Actions anchored to a right-click.',
		category: 'overlay'
	},
	{
		slug: 'dialog',
		title: 'Dialog',
		description: 'A modal for a focused task.',
		category: 'overlay'
	},
	{
		slug: 'drawer',
		title: 'Drawer',
		description: 'A panel that slides up from the edge.',
		category: 'overlay'
	},
	{
		slug: 'dropdown-menu',
		title: 'Dropdown Menu',
		description: 'A list of actions triggered by a button.',
		category: 'overlay'
	},
	{
		slug: 'empty',
		title: 'Empty',
		description: 'A placeholder when a view has no data.',
		category: 'display'
	},
	{
		slug: 'field',
		title: 'Field',
		description: 'Label, control, and helper text as one unit.',
		category: 'form'
	},
	{
		slug: 'form',
		title: 'Form',
		description: 'Formsnap bindings for Superforms.',
		category: 'form'
	},
	{
		slug: 'hover-card',
		title: 'Hover Card',
		description: 'Preview content on hover.',
		category: 'overlay'
	},
	{
		slug: 'input',
		title: 'Input',
		description: 'A single-line text field.',
		category: 'form'
	},
	{
		slug: 'input-group',
		title: 'Input Group',
		description: 'An input with addons on either side.',
		category: 'form'
	},
	{
		slug: 'input-otp',
		title: 'Input OTP',
		description: 'Segmented entry for one-time codes.',
		category: 'form'
	},
	{
		slug: 'item',
		title: 'Item',
		description: 'A row for lists, menus, and pickers.',
		category: 'display'
	},
	{
		slug: 'kbd',
		title: 'Kbd',
		description: 'A keyboard shortcut glyph.',
		category: 'display'
	},
	{
		slug: 'label',
		title: 'Label',
		description: 'Names a form control.',
		category: 'form'
	},
	{
		slug: 'menubar',
		title: 'Menubar',
		description: 'A horizontal set of menus.',
		category: 'navigation'
	},
	{
		slug: 'native-select',
		title: 'Native Select',
		description: 'The platform select, styled to match.',
		category: 'form'
	},
	{
		slug: 'navigation-menu',
		title: 'Navigation Menu',
		description: 'A site menu with optional panels.',
		category: 'navigation'
	},
	{
		slug: 'pagination',
		title: 'Pagination',
		description: 'Move between pages of results.',
		category: 'navigation'
	},
	{
		slug: 'popover',
		title: 'Popover',
		description: 'Floating content anchored to a trigger.',
		category: 'overlay'
	},
	{
		slug: 'progress',
		title: 'Progress',
		description: 'Shows completion of a determinate task.',
		category: 'display'
	},
	{
		slug: 'radio-group',
		title: 'Radio Group',
		description: 'Pick exactly one option from a set.',
		category: 'form'
	},
	{
		slug: 'range-calendar',
		title: 'Range Calendar',
		description: 'Pick a start and end date.',
		category: 'form'
	},
	{
		slug: 'resizable',
		title: 'Resizable',
		description: 'Panels the user can drag to resize.',
		category: 'layout'
	},
	{
		slug: 'scroll-area',
		title: 'Scroll Area',
		description: 'A region with a styled scrollbar.',
		category: 'layout'
	},
	{
		slug: 'select',
		title: 'Select',
		description: 'A custom listbox for choosing a value.',
		category: 'form'
	},
	{
		slug: 'separator',
		title: 'Separator',
		description: 'A visual divider between sections.',
		category: 'layout'
	},
	{
		slug: 'sheet',
		title: 'Sheet',
		description: 'A panel that slides in from the side.',
		category: 'overlay'
	},
	{
		slug: 'sidebar',
		title: 'Sidebar',
		description: 'App navigation that can collapse or sheet.',
		category: 'navigation'
	},
	{
		slug: 'skeleton',
		title: 'Skeleton',
		description: 'A placeholder while content loads.',
		category: 'display'
	},
	{
		slug: 'slider',
		title: 'Slider',
		description: 'Pick a value from a numeric range.',
		category: 'form'
	},
	{
		slug: 'sonner',
		title: 'Sonner',
		description: 'A toast queue for brief messages.',
		category: 'overlay'
	},
	{
		slug: 'spinner',
		title: 'Spinner',
		description: 'An indeterminate loading indicator.',
		category: 'display'
	},
	{
		slug: 'switch',
		title: 'Switch',
		description: 'A binary toggle with an immediate effect.',
		category: 'form'
	},
	{
		slug: 'table',
		title: 'Table',
		description: 'Tabular data with header, body, and footer.',
		category: 'display'
	},
	{
		slug: 'tabs',
		title: 'Tabs',
		description: 'Switch between related views.',
		category: 'navigation'
	},
	{
		slug: 'textarea',
		title: 'Textarea',
		description: 'A multi-line text field.',
		category: 'form'
	},
	{
		slug: 'toggle',
		title: 'Toggle',
		description: 'A button that stays pressed.',
		category: 'form'
	},
	{
		slug: 'toggle-group',
		title: 'Toggle Group',
		description: 'A set of toggles with shared selection.',
		category: 'form'
	},
	{
		slug: 'tooltip',
		title: 'Tooltip',
		description: 'A short hint on hover or focus.',
		category: 'overlay'
	},
	{
		slug: 'banner',
		title: 'Banner',
		description: 'App- or page-level notice with an optional close action.',
		category: 'display'
	},
	{
		slug: 'chat',
		title: 'Chat',
		description: 'Message list, bubbles, metadata, and composer for conversations.',
		category: 'display'
	},
	{
		slug: 'combobox',
		title: 'Combobox',
		description: 'A searchable, data-driven single select.',
		category: 'form'
	},
	{
		slug: 'data-table',
		title: 'Data Table',
		description: 'Sortable, filterable records with selection, views, and grouping.',
		category: 'data'
	},
	{
		slug: 'lightbox',
		title: 'Lightbox',
		description: 'Full-screen viewer for images and documents.',
		category: 'overlay'
	},
	{
		slug: 'overflow-list',
		title: 'Overflow List',
		description: 'Shows what fits and collapses the rest behind a count.',
		category: 'layout'
	},
	{
		slug: 'pdf-viewer',
		title: 'PDF Viewer',
		description: 'Renders PDF documents in the page.',
		category: 'display'
	},
	{
		slug: 'status-dot',
		title: 'Status Dot',
		description: 'Record state at a glance.',
		category: 'display'
	},
	{
		slug: 'thumbnail',
		title: 'Thumbnail',
		description: 'A small preview for images and files.',
		category: 'display'
	},
	{
		slug: 'timestamp',
		title: 'Timestamp',
		description: 'Relative or absolute time via Intl, kept current.',
		category: 'display'
	},
	{
		slug: 'visually-hidden',
		title: 'Visually Hidden',
		description: 'Screen-reader-only content.',
		category: 'display'
	},
	{
		slug: 'icon',
		title: 'Icon',
		description: 'Semantic icon names resolved through the global registry.',
		category: 'display'
	},
	{
		slug: 'icon-button',
		title: 'Icon Button',
		description: 'An accessible icon-only button with a required label.',
		category: 'form'
	},
	{
		slug: 'field-status',
		title: 'Field Status',
		description: 'Info, success, warning, or error feedback for a field.',
		category: 'form'
	},
	{
		slug: 'token',
		title: 'Token',
		description: 'An interactive entity chip: removable, clickable, or linked.',
		category: 'display'
	},
	{
		slug: 'text',
		title: 'Text',
		description: 'Semantic body, label, supporting, code, and display text.',
		category: 'content'
	},
	{
		slug: 'heading',
		title: 'Heading',
		description: 'Document headings with separable visual scale.',
		category: 'content'
	},
	{
		slug: 'link',
		title: 'Link',
		description: 'Inline and standalone links, with external-link handling.',
		category: 'content'
	},
	{
		slug: 'list',
		title: 'List',
		description: 'Content lists with markers, numbering, or dividers.',
		category: 'content'
	},
	{
		slug: 'blockquote',
		title: 'Blockquote',
		description: 'A quotation with accessible attribution.',
		category: 'content'
	},
	{
		slug: 'citation',
		title: 'Citation',
		description: 'Inline source references for AI responses and articles.',
		category: 'content'
	},
	{
		slug: 'markdown',
		title: 'Markdown',
		description: 'Renders markdown through Bedrock components, safely.',
		category: 'content'
	},
	{
		slug: 'outline',
		title: 'Outline',
		description: 'In-page table of contents with scroll-spy.',
		category: 'navigation'
	},
	{
		slug: 'selector',
		title: 'Selector',
		description: 'Rich data-driven single select with groups and search.',
		category: 'form'
	},
	{
		slug: 'multi-selector',
		title: 'Multi Selector',
		description: 'Checkbox dropdown for multiple values, with badges.',
		category: 'form'
	},
	{
		slug: 'tokenizer',
		title: 'Tokenizer',
		description: 'Chips-in-input multi-select with search and creation.',
		category: 'form'
	},
	{
		slug: 'async-button',
		title: 'Async Button',
		description: 'A button that runs an async action with pending and result states.',
		category: 'form'
	},
	{
		slug: 'clickable-card',
		title: 'Clickable Card',
		description: 'A whole-card navigation or action target.',
		category: 'layout'
	},
	{
		slug: 'selectable-card',
		title: 'Selectable Card',
		description: 'A card that toggles a selected state.',
		category: 'layout'
	},
	{
		slug: 'indicator',
		title: 'Checkbox Indicator',
		description: 'Decorative checkbox, check, and radio selection visuals.',
		category: 'display'
	},
	{
		slug: 'metadata-list',
		title: 'Metadata List',
		description: 'Label and value pairs for record detail panels.',
		category: 'data'
	},
	{
		slug: 'stepper',
		title: 'Stepper',
		description: 'Multi-step progress with status and optional navigation.',
		category: 'navigation'
	},
	{
		slug: 'code-block',
		title: 'Code Block',
		description: 'Syntax-highlighted code with copy, titles, and line numbers.',
		category: 'content'
	},
	{
		slug: 'number-input',
		title: 'Number Input',
		description: 'Locale-aware numbers with steppers, units, and clamping.',
		category: 'form'
	},
	{
		slug: 'date-input',
		title: 'Date Input',
		description: 'Segmented date entry with a calendar popover.',
		category: 'form'
	},
	{
		slug: 'date-range-input',
		title: 'Date Range Input',
		description: 'Start and end dates with presets and a dual-month picker.',
		category: 'form'
	},
	{
		slug: 'date-time-input',
		title: 'Date Time Input',
		description: 'Date and time in one segmented field.',
		category: 'form'
	},
	{
		slug: 'time-input',
		title: 'Time Input',
		description: 'Segmented time entry via the platform field primitive.',
		category: 'form'
	},
	{
		slug: 'file-input',
		title: 'File Input',
		description: 'File selection with drag and drop, constraints, and summaries.',
		category: 'form'
	},
	{
		slug: 'checkbox-list',
		title: 'Checkbox List',
		description: 'A labelled group of checkboxes bound to one value array.',
		category: 'form'
	},
	{
		slug: 'power-search',
		title: 'Power Search',
		description: 'Typed filter tokens: field, operator, and value editors.',
		category: 'data'
	},
	{
		slug: 'color-picker',
		title: 'Color Picker',
		description: 'HSV color selection with hex, RGB, and HSL entry.',
		category: 'form'
	}
];

components.sort((a, b) => a.title.localeCompare(b.title));

const bySlug = new Map(components.map((component) => [component.slug, component]));

export function getComponent(slug: string) {
	return bySlug.get(slug);
}

export function importPath(slug: string) {
	return `#lib/bedrock/ui/${slug}`;
}
