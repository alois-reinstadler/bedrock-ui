import { components } from './registry';

// Browsing taxonomy agreed in the Categorize Component Inventory thread.
// Only registered documentation pages are shown; planned families stay hidden.
const definitions = [
	{
		title: 'Effects',
		groups: [
			{
				title: 'Effects',
				slugs: [
					'animated-gradient',
					'animated-signature',
					'progressive-blur',
					'marquee',
					'spotlight',
					'text-highlight',
					'text-shimmer',
					'tilt-card'
				]
			}
		]
	},
	{
		title: 'Components',
		groups: [
			{
				title: 'Text',
				slugs: [
					'text',
					'heading',
					'blockquote',
					'citation',
					'markdown',
					'code-block',
					'diff',
					'list',
					'kbd'
				]
			},
			{
				title: 'Navigation',
				slugs: [
					'link',
					'breadcrumb',
					'navigation-menu',
					'menubar',
					'sidebar',
					'tabs',
					'pagination',
					'stepper',
					'outline',
					'command'
				]
			},
			{
				title: 'Layout',
				slugs: [
					'accordion',
					'collapsible',
					'card',
					'clickable-card',
					'aspect-ratio',
					'resizable',
					'dock-layout',
					'scroll-area',
					'separator',
					'overflow-list',
					'item'
				]
			},
			{
				title: 'Overlays',
				slugs: [
					'dialog',
					'alert-dialog',
					'drawer',
					'sheet',
					'popover',
					'hover-card',
					'tooltip',
					'dropdown-menu',
					'context-menu'
				]
			},
			{
				title: 'Actions',
				parent: 'Forms & inputs',
				slugs: ['button', 'async-button', 'icon-button', 'button-group']
			},
			{
				title: 'Fields and structure',
				parent: 'Forms & inputs',
				slugs: [
					'form',
					'stepped-form',
					'field',
					'field-status',
					'label',
					'input',
					'input-group',
					'textarea',
					'number-input',
					'phone-input',
					'input-otp',
					'file-input'
				]
			},
			{
				title: 'Selection',
				parent: 'Forms & inputs',
				slugs: [
					'checkbox',
					'checkbox-list',
					'radio-group',
					'switch',
					'toggle',
					'toggle-group',
					'select',
					'native-select',
					'combobox',
					'selector',
					'multi-selector',
					'tokenizer',
					'token',
					'selectable-card',
					'indicator',
					'slider'
				]
			},
			{
				title: 'Dates and time',
				parent: 'Forms & inputs',
				slugs: [
					'calendar',
					'range-calendar',
					'date-input',
					'date-range-input',
					'date-time-input',
					'time-input'
				]
			},
			{
				title: 'Color',
				parent: 'Forms & inputs',
				slugs: [
					'color-picker',
					'color-area',
					'color-field',
					'color-slider',
					'color-swatch',
					'color-swatch-picker'
				]
			},
			{
				title: 'Status',
				slugs: [
					'alert',
					'banner',
					'badge',
					'status-dot',
					'progress',
					'spinner',
					'skeleton',
					'empty',
					'sonner'
				]
			},
			{
				title: 'Data',
				slugs: ['table', 'data-table', 'metadata-list', 'chart', 'map', 'timestamp', 'power-search']
			},
			{
				title: 'Media',
				slugs: [
					'icon',
					'emoji',
					'avatar',
					'image',
					'thumbnail',
					'attachment',
					'carousel',
					'lightbox',
					'pdf-viewer',
					'video-player',
					'video',
					'qr-code'
				]
			},
			{ title: 'Chat', slugs: ['chat', 'message', 'bubble', 'marker'] },
			{
				title: 'Backgrounds',
				slugs: ['dot-pattern', 'grid-pattern', 'light-rays', 'noise-overlay']
			},
			{ title: 'Shapes', slugs: ['shapes'] }
		]
	},
	{
		title: 'Accessibility & performance',
		groups: [{ title: 'Accessibility & performance', slugs: ['visually-hidden'] }]
	}
];

export const componentNavigation = definitions
	.map((section) => ({
		title: section.title,
		groups: section.groups
			.map((group) => ({
				title: group.title,
				parent: 'parent' in group ? group.parent : undefined,
				components: components.filter((component) => group.slugs.includes(component.slug))
			}))
			.filter((group) => group.components.length > 0)
	}))
	.filter((section) => section.groups.length > 0);

export const componentNavigationKeywords = new Map(
	componentNavigation.flatMap((section) =>
		section.groups.flatMap((group) =>
			group.components.map(
				(component) =>
					[component.slug, `${section.title} ${group.parent ?? ''} ${group.title}`] as const
			)
		)
	)
);
