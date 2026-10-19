import type { ComponentGuides } from './types';

export const dataGuides = {
	'data-table': {
		purpose:
			'Data Table turns a typed record array and column definitions into a dense, client-side workspace for inspecting and acting on business records. It owns presentation state such as sorting, filtering, grouping, pagination, visibility, and selection while the consumer owns the records, stable row identity, domain actions, and any custom cell markup.',
		useWhen: [
			'Operators need to sort, search, page through, select, or group a client-side record set.',
			'Columns need consistent identifier, badge, number, currency, date, or date-time formatting.',
			'A dataset needs named views with visible counts or user-configurable column visibility and order.',
			'Bulk actions need the currently selected records and export actions need the currently filtered records.'
		],
		avoidWhen: [
			'Use the Table primitives for static or server-rendered rows that do not need Data Table state management.',
			'Do not use it as a spreadsheet: editable cells, column resizing, pinning, virtualization, and tree data are not part of this API.',
			'Do not treat its internal state as server-controlled; sorting, filtering, grouping, pagination, visibility, and selection are managed inside the component.',
			'Use Metadata List for the labelled fields of one record rather than turning a detail panel into a one-row table.'
		],
		anatomy: [
			{
				name: 'DataTable.Root (alias: DataTable)',
				description:
					'Required table workspace. It receives the record data and column schema and conditionally composes views, controls, the semantic table, selection actions, and pagination.',
				required: true
			},
			{
				name: 'DataTableColumn<TData>',
				description:
					'Required column definition type for keys or accessors, headings, formatting, alignment, sorting, hiding, badge variants, classes, and custom cell snippets.',
				required: true
			},
			{
				name: 'DataTableView<TData>',
				description:
					'Optional named predicate that appears as a view tab with a count calculated from the unfiltered input data.'
			},
			{
				name: 'DataTableLabels',
				description:
					'Partial override type for visible controls, accessible names, status text, pagination text, and column-reordering instructions.'
			},
			{
				name: 'DataTableColumnType',
				description:
					'Public union of the built-in text, number, currency, date, datetime, identifier, and badge formatting modes.'
			},
			{
				name: 'formatCellValue',
				description:
					'Public helper that applies the same locale-aware scalar formatting and en-dash fallback used by built-in cells.'
			},
			{
				name: 'formatCurrencyParts',
				description:
					'Public helper that splits a formatted numeric amount from its ISO currency code so custom cells can match the default currency treatment.'
			},
			{
				name: 'CurrencyParts',
				description:
					'Return type for formatCurrencyParts, containing the formatted amount string and currency code.'
			}
		],
		behavior: [
			'Provide getRowId for records without a stable id property; the index fallback can make selection follow positions when data is reordered.',
			'Views filter the source data before global search. View tabs use roving tabindex; Left and Right wrap, while Home and End move to the first and last view.',
			'Sortable headings expose aria-sort and toggle on click. When reorderable is enabled, columns move by drag and drop or Alt+Left/Right, and bind:columnOrder lets the parent persist or replace the order.',
			'Grouping expands groups initially, supports group selection, resets to the first page, and temporarily disables pagination so entry counts remain meaningful.',
			'The table scrolls horizontally in narrow containers. Built-in number and currency columns align to the end, identifiers use code styling, and empty values render an en dash.',
			'The actions snippet receives selected records in a sticky status bar; exportActions receives every record left after the current view and search filters, not only the visible page.',
			'Formatting and internal copy default to en-US and English. Override locale and labels independently when the product requires another locale.'
		],
		examplePlan: [
			{
				title: 'Operational order table',
				demonstrates:
					'Replace the current four-row formatting-only preview with a realistic order workspace using stable row ids, search, pagination, named views, selection actions, an export action, and row activation.',
				priority: 'primary'
			},
			{
				title: 'Column formatting and custom cells',
				demonstrates:
					'Show identifier, badge, number, currency, date, and datetime columns alongside an accessor and a typed cell snippet, including alignment, visibility, locale, and label overrides.',
				priority: 'secondary'
			},
			{
				title: 'Grouping and persistent column order',
				demonstrates:
					'Enable one groupable column and reorderable headings, bind columnOrder to parent state, and make the grouped no-pagination behavior visible.',
				priority: 'secondary'
			},
			{
				title: 'Empty filtered view',
				demonstrates:
					'Open a zero-count named view to show the empty snippet, accurate counts, and the built-in route back to All without disabling the tab.',
				priority: 'edge-case'
			}
		]
	},
	'metadata-list': {
		purpose:
			'Metadata List presents the attributes of one record as semantic term-and-description pairs. It keeps labels and values aligned across responsive layouts, supplies a consistent missing-value fallback, and can collapse lower-priority fields without removing them from the document structure.',
		useWhen: [
			'A detail panel, summary, or audit view needs labelled values for one entity.',
			'Values mix text with composed content such as badges, links, or timestamps.',
			'Secondary metadata should remain available behind a show-more control.',
			'The same field set needs a one-column, two-column, or breakpoint-responsive layout.'
		],
		avoidWhen: [
			'Use Data Table or Table for many records with repeated columns.',
			'Use a form layout for editable values; Metadata List communicates read-only facts and does not provide labels for inputs.',
			'Use prose, List, or Item when the content is not genuinely a label-to-value relationship.',
			'Do not use labelPosition merely to imitate arbitrary two-column layout; every child is rendered as a semantic dt/dd pair.'
		],
		anatomy: [
			{
				name: 'MetadataList.Root (alias: MetadataList)',
				description:
					'Required semantic dl and context provider. It owns column layout, label placement and width, item counting, and the optional show-more toggle.',
				required: true
			},
			{
				name: 'MetadataList.Item (alias: MetadataListItem)',
				description:
					'Required dt/dd pair inside Root. Its label is the term, its children snippet is the value, and an omitted or empty value falls back to an en dash.',
				required: true
			},
			{
				name: 'MetadataListLabels',
				description: 'Partial override type for the show-more count function and show-less label.'
			}
		],
		behavior: [
			'Item consumes Root context and must be nested beneath Root; items register in source order during initialization so collapse counts are stable during server rendering.',
			'columns="auto" changes from one to two columns at the sm breakpoint. labelPosition="start" aligns a term beside its value, while "top" stacks the term above it; labelWidth applies only to the start layout.',
			'When maxItems is set, later items animate between zero and auto height. Collapsed items are inert, so their value content is removed from the tab order and accessibility tree until expanded.',
			'Item icons are decorative and hidden from assistive technology; the visible label carries the meaning.',
			'Root and Item forward element attributes, classes, and bindable refs to their dl and wrapping div respectively.'
		],
		examplePlan: [
			{
				title: 'Record metadata',
				demonstrates:
					'Keep the current document-style scenario, but identify it as the primary pattern: a constrained label column, text values, a status badge, absolute and relative timestamps, a missing value, and lower-priority fields behind maxItems.',
				priority: 'primary'
			},
			{
				title: 'Responsive columns and stacked labels',
				demonstrates:
					'Compare columns="auto" with labelPosition="top" using long values so readers can see when responsive columns and stacked labels improve scanning.',
				priority: 'secondary'
			},
			{
				title: 'Missing and empty values',
				demonstrates:
					'Show both an omitted value snippet and a snippet that renders no element, confirming that each preserves the dt/dd pair and displays the en-dash fallback.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
