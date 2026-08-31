export type DocsNavItem = {
	title: string;
	href: '/docs' | '/docs/installation' | '/docs/components';
};

export type ComponentDoc = {
	slug: string;
	title: string;
	description: string;
	category: 'form' | 'layout' | 'overlay' | 'display' | 'navigation';
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
	}
];

const bySlug = new Map(components.map((component) => [component.slug, component]));

export function getComponent(slug: string) {
	return bySlug.get(slug);
}

export function importPath(slug: string) {
	return `#lib/bedrock/ui/${slug}`;
}
