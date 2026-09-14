import type { ComponentGuides } from './types';

export const formGuides = {
	'async-button': {
		purpose:
			'Async Button owns the visible lifecycle of one promise-returning action: idle, pending, success, error, and reset. It keeps status changes available to assistive technology while the label and width animate between states.',
		useWhen: [
			'A button starts a save, sync, upload, or other action whose result should remain visible in place.',
			'The action can be expressed as one `() => Promise<void>` and does not require a separate progress view.',
			'Users need immediate pending and success or error feedback without a toast.'
		],
		avoidWhen: [
			'Use Button when the action is synchronous or feedback appears elsewhere.',
			'Use Progress for measurable multi-step or long-running work that needs a percentage.',
			'Do not use it for navigation; its API deliberately excludes `href`.'
		],
		anatomy: [
			{
				name: 'AsyncButton.Root (`AsyncButton.AsyncButton` alias)',
				description:
					'Required action control that renders the button, animated state label, state icon, and screen-reader status region.',
				required: true
			}
		],
		behavior: [
			'`action` runs on activation; rejections are converted to the error state and optionally passed to `onError`.',
			'Pending and result states ignore repeat activation by default. `interruptible` allows another run, and only the newest run controls the visible result.',
			'Pending uses `aria-busy`; locked non-disabled states use `aria-disabled` without removing keyboard focus. Success and error reset after `resetAfter`.',
			'English labels can be replaced together through `labels` or individually with the pending, success, and error shorthand props.'
		],
		examplePlan: [
			{
				title: 'Save with visible lifecycle',
				demonstrates:
					'A primary save action moving through pending and success, including the automatic return to its idle label.',
				priority: 'primary'
			},
			{
				title: 'Rejected action',
				demonstrates:
					'An outline action that rejects, shows a product-specific error label, and reports the reason through `onError`.',
				priority: 'secondary'
			},
			{
				title: 'Rapid activation policy',
				demonstrates:
					'The default locked behavior beside `interruptible`, making newest-run-wins semantics explicit.',
				priority: 'edge-case'
			}
		]
	},
	button: {
		purpose:
			'Button is the standard control for a user-initiated action and can render as a native button or a styled anchor. Its variants express action hierarchy while preserving one focus, disabled, icon, and sizing treatment.',
		useWhen: [
			'Submitting a form, opening an interface, or committing an immediate command.',
			'Navigation must look like a prominent action and still retain anchor semantics through `href`.',
			'An icon and short label need the standard control sizing and spacing.'
		],
		avoidWhen: [
			'Use Link for ordinary inline or standalone navigation.',
			'Use IconButton when the visible label is intentionally omitted.',
			'Use Toggle when the control represents a persistent pressed state.'
		],
		anatomy: [
			{
				name: 'Button.Root (`Button.Button` alias)',
				description:
					'Required action surface. It renders `<button type="button">` by default and switches to `<a>` when `href` is present.',
				required: true
			}
		],
		behavior: [
			'Native button behavior is preserved, including explicit submit behavior only when `type="submit"` is supplied.',
			'A disabled anchor drops its destination, receives `aria-disabled`, and leaves the tab order; a disabled button uses the native attribute.',
			'Variants communicate hierarchy, not state: default, outline, secondary, ghost, destructive, and link. Sizes include text and icon-only forms.'
		],
		examplePlan: [
			{
				title: 'Action hierarchy',
				demonstrates:
					'One realistic primary action with secondary and destructive neighbors, teaching hierarchy instead of presenting an undifferentiated variant wall.',
				priority: 'primary'
			},
			{
				title: 'Button as link',
				demonstrates:
					'An `href` button that remains a real anchor, alongside guidance that ordinary navigation should use Link.',
				priority: 'secondary'
			},
			{
				title: 'Sizes and unavailable state',
				demonstrates:
					'Small, default, large, and disabled controls with labels that expose sizing limits.',
				priority: 'edge-case'
			}
		]
	},
	'button-group': {
		purpose:
			'Button Group visually joins a small set of closely related controls and exposes them as one labelled group. It owns shared borders and corner treatment but does not create selection semantics between the controls.',
		useWhen: [
			'Two to four adjacent actions operate on the same object or view.',
			'A compact toolbar needs connected buttons, supporting text, or a visual separator.',
			'Related controls should stack vertically in a narrow composition.'
		],
		avoidWhen: [
			'Use Toggle Group when the controls choose one or more persistent values.',
			'Use separate Buttons when actions are unrelated or require independent emphasis.',
			'Do not rely on proximity alone: provide an accessible name when the group needs one.'
		],
		anatomy: [
			{
				name: 'ButtonGroup.Root (`ButtonGroup.ButtonGroup` alias)',
				description:
					'Required `role="group"` container that coordinates orientation, borders, and corners.',
				required: true
			},
			{
				name: 'ButtonGroup.Text (`ButtonGroup.ButtonGroupText` alias)',
				description:
					'Optional non-interactive text or custom child element styled as a peer within the connected group.'
			},
			{
				name: 'ButtonGroup.Separator (`ButtonGroup.ButtonGroupSeparator` alias)',
				description: 'Optional visual divider whose orientation can follow the composition.'
			}
		],
		behavior: [
			'Horizontal is the default; vertical changes the flex direction and which adjoining borders and corners collapse.',
			'Each child keeps its own keyboard and activation behavior. The root groups controls but does not implement roving focus.'
		],
		examplePlan: [
			{
				title: 'Connected record actions',
				demonstrates: 'A coherent set of three adjacent actions with an accessible group label.',
				priority: 'primary'
			},
			{
				title: 'Text and separator composition',
				demonstrates:
					'`Text` and `Separator` inside a compact control cluster rather than leaving both public parts undocumented.',
				priority: 'secondary'
			},
			{
				title: 'Vertical group',
				demonstrates: 'The vertical orientation and its connected edge treatment.',
				priority: 'edge-case'
			}
		]
	},
	calendar: {
		purpose:
			'Calendar provides a keyboard-accessible monthly grid for choosing one date or multiple dates. The convenience component assembles the full grid, navigation, captions, and optional month or year selectors while exposing the same parts for advanced composition.',
		useWhen: [
			'A date is easier to choose with surrounding days and weekday context.',
			'Unavailable dates, minimum and maximum bounds, or multiple visible months shape the choice.',
			'A product needs single or multiple date selection without time entry.'
		],
		avoidWhen: [
			'Use Date Input when compact segmented typing and a popover are the primary interaction.',
			'Use Range Calendar for a start-and-end interval.',
			'Use a Native Select or purpose-built picker for month-only or year-only values.'
		],
		anatomy: [
			{
				name: 'Calendar.Calendar',
				description:
					'Required convenience root that owns selection, locale, bounds, visible months, and the default compound structure.',
				required: true
			},
			{ name: 'Calendar.Months', description: 'Layout wrapper for all visible month panels.' },
			{
				name: 'Calendar.Nav',
				description: 'Navigation region containing previous and next controls.'
			},
			{ name: 'Calendar.PrevButton', description: 'Moves to the previous allowed calendar page.' },
			{ name: 'Calendar.NextButton', description: 'Moves to the next allowed calendar page.' },
			{ name: 'Calendar.Month', description: 'Layout wrapper for one month.' },
			{ name: 'Calendar.Header', description: 'Centers the visible month caption.' },
			{
				name: 'Calendar.Caption',
				description: 'Renders the month/year label or the configured dropdown caption.'
			},
			{
				name: 'Calendar.Heading',
				description: 'Bits calendar heading for a custom header composition.'
			},
			{
				name: 'Calendar.MonthSelect',
				description: 'Native month selector used by dropdown captions.'
			},
			{
				name: 'Calendar.YearSelect',
				description: 'Native year selector used by dropdown captions.'
			},
			{ name: 'Calendar.Grid', description: 'Semantic calendar grid for one month.' },
			{ name: 'Calendar.GridHead', description: 'Grid header containing weekday names.' },
			{ name: 'Calendar.GridBody', description: 'Grid body containing week rows.' },
			{ name: 'Calendar.GridRow', description: 'One weekday header row or calendar week.' },
			{ name: 'Calendar.HeadCell', description: 'One localized weekday heading cell.' },
			{
				name: 'Calendar.Cell',
				description: 'Semantic grid cell that relates a date to the displayed month.'
			},
			{
				name: 'Calendar.Day',
				description:
					'Interactive day control with selected, today, outside, disabled, and unavailable states.'
			}
		],
		behavior: [
			'`value` and the visible `placeholder` date are bindable; the underlying Bits primitive owns grid keyboard navigation and focus.',
			'Locale defaults to `en-US`; caption layout can remain a label or expose month, year, or both dropdowns.',
			'`day` replaces only the day rendering while selection semantics remain on the Calendar parts. Outside days can be disabled explicitly.'
		],
		examplePlan: [
			{
				title: 'Choose an available date',
				demonstrates:
					'A labelled single-date calendar with a bound value, min/max context, unavailable days, and the selected result formatted below.',
				priority: 'primary'
			},
			{
				title: 'Two months with dropdown caption',
				demonstrates:
					'Multiple visible months plus month/year navigation through the caption controls.',
				priority: 'secondary'
			},
			{
				title: 'Custom day content',
				demonstrates:
					'The `day` snippet adding secondary metadata without replacing the calendar cell or selection behavior.',
				priority: 'edge-case'
			}
		]
	},
	checkbox: {
		purpose:
			'Checkbox captures an independent yes/no choice and can also show an indeterminate summary state. It provides the interactive square and state indicator; a visible Label remains the consumer’s responsibility.',
		useWhen: [
			'Users may independently opt into one setting or select one row.',
			'A parent choice must summarize partially selected descendants with `indeterminate`.',
			'Multiple neighboring choices can be selected in any combination.'
		],
		avoidWhen: [
			'Use Radio Group when exactly one option must be chosen.',
			'Use Switch when changing the value has an immediate system effect rather than being submitted later.',
			'Use Checkbox List for a labelled, consistently spaced group bound to one array.'
		],
		anatomy: [
			{
				name: 'Checkbox.Root (`Checkbox.Checkbox` alias)',
				description:
					'Required checkbox control with built-in check and indeterminate indicators; pair it with an external Label.',
				required: true
			}
		],
		behavior: [
			'`checked`, `indeterminate`, and the element `ref` are bindable.',
			'The underlying Bits checkbox owns Space-key activation and ARIA checked semantics. Disabled and invalid styles are exposed through primitive state attributes.',
			'The icon is internal; consumers should describe the choice with a linked label, not icon text.'
		],
		examplePlan: [
			{
				title: 'Labelled optional setting',
				demonstrates: 'A bound checkbox with a real label and visible value-dependent outcome.',
				priority: 'primary'
			},
			{
				title: 'Indeterminate parent',
				demonstrates: 'A parent checkbox transitioning between none, some, and all child choices.',
				priority: 'secondary'
			},
			{
				title: 'Unavailable and invalid',
				demonstrates: 'Disabled and `aria-invalid` states while preserving an explicit label.',
				priority: 'edge-case'
			}
		]
	},
	'checkbox-list': {
		purpose:
			'Checkbox List presents a visible, labelled set of three to seven independent choices and binds them to one string array. Each row can carry a description and trailing metadata while the root owns group labelling, dividers, and shared disabled state.',
		useWhen: [
			'A short set of related choices should stay visible rather than hide in a dropdown.',
			'Rows need helper text or compact trailing metadata in addition to the option label.',
			'The consumer wants one controlled or bindable array for the group.'
		],
		avoidWhen: [
			'Use Checkbox for one independent choice.',
			'Use Multi Selector for a long or searchable list.',
			'Use Radio Group when only one row may be selected.'
		],
		anatomy: [
			{
				name: 'CheckboxList.Root (`CheckboxList.CheckboxList` alias)',
				description:
					'Required `role="group"` container that provides the accessible label, value context, optional dividers, and group disabled state.',
				required: true
			},
			{
				name: 'CheckboxList.Item (`CheckboxList.CheckboxListItem` alias)',
				description:
					'Required per-choice row containing the checkbox, linked label, optional description, and optional `endContent` snippet.',
				required: true
			}
		],
		behavior: [
			'`value` is bindable and `onValueChange` receives a new array after any allowed toggle.',
			'Clicking a row label toggles its checkbox. Item-level disabled state combines with the root disabled state.',
			'`hideLabel` visually hides the required group label but keeps it as the group’s accessible name.'
		],
		examplePlan: [
			{
				title: 'Handover contents',
				demonstrates:
					'Three visible choices with a group label, one description, a disabled row, dividers, and a bound value summary.',
				priority: 'primary'
			},
			{
				title: 'Trailing row metadata',
				demonstrates: 'The `endContent` snippet with a non-interactive count or status badge.',
				priority: 'secondary'
			}
		]
	},
	'color-picker': {
		purpose:
			'Color Picker edits one canonical hex color through a saturation/brightness area, hue rail, optional alpha rail, text entry, and swatches. It also offers a swatches-only variant when unrestricted color mixing would be inappropriate.',
		useWhen: [
			'Users must choose or fine-tune a color and need both visual and text input.',
			'An opacity value is part of the product’s color model.',
			'A curated palette should be offered as shortcuts or as the only allowed choices.'
		],
		avoidWhen: [
			'Use Select or Radio Group when colors are named product options rather than literal color values.',
			'Do not use it for semantic theme roles such as success or destructive; those belong to design tokens.',
			'Use a plain Input when users only paste a color string and do not need visual picking.'
		],
		anatomy: [
			{
				name: 'ColorPicker.Root (`ColorPicker.ColorPicker` alias)',
				description:
					'Required picker that owns all interactive rails, text validation, format cycling, swatches, and canonical value conversion.',
				required: true
			}
		],
		behavior: [
			'`value` is bindable and always emits lowercase canonical `#rrggbb`, or `#rrggbbaa` when alpha is enabled. Text entry accepts HEX, RGB(A), and HSL(A).',
			'Arrow keys adjust a focused rail by one unit, Shift adjusts by ten, Page Up/Down moves by ten, and Home/End select bounds. Alt+Arrow on the saturation area changes brightness.',
			'Invalid text keeps the previous bound color and exposes an alert until a parseable value is entered.',
			'The swatches variant renders only the palette; labels and formatter strings can be overridden for product language.'
		],
		examplePlan: [
			{
				title: 'Fine-tune a brand color',
				demonstrates:
					'The full panel with a bound canonical value, format cycling, keyboard-operable rails, and a curated swatch row.',
				priority: 'primary'
			},
			{
				title: 'Palette-only choice',
				demonstrates: 'The swatches variant for a constrained set of approved colors.',
				priority: 'secondary'
			},
			{
				title: 'Alpha and invalid text',
				demonstrates:
					'Eight-digit output, the alpha rail, and recovery from an invalid typed color without corrupting the bound value.',
				priority: 'edge-case'
			}
		]
	},
	combobox: {
		purpose:
			'Combobox is the compatibility-level single-select facade for a flat searchable list of value/label items. It delegates interaction and focus behavior to Selector while preserving the smaller Combobox API and data-slot names.',
		useWhen: [
			'A flat option list benefits from always-available text filtering.',
			'Existing code depends on the Combobox item shape or public props.',
			'Users choose exactly one known value from labels that may be easier to search than scan.'
		],
		avoidWhen: [
			'Use Selector for groups, separators, descriptions, icons, clearability, custom rows, or configurable search.',
			'Use Native Select for a small conventional list where platform UI is preferable.',
			'Use Tokenizer or Multi Selector when more than one value may be chosen.'
		],
		anatomy: [
			{
				name: 'Combobox.Root (`Combobox.Combobox` alias)',
				description:
					'Required facade that assembles a Selector trigger, searchable command list, items, empty state, and popover.',
				required: true
			}
		],
		behavior: [
			'`value` and `open` are bindable; `onValueChange` reports a committed item value.',
			'Typing filters labels, disabled items cannot be selected, and choosing an item closes the popover and returns focus to the trigger.',
			'`searchPlaceholder` and `emptyText` map to Selector labels. The facade does not expose Selector’s richer item model.'
		],
		examplePlan: [
			{
				title: 'Assign a reviewer',
				demonstrates:
					'Opening, filtering a realistic flat list, selecting one reviewer, and reflecting the bound value outside the control.',
				priority: 'primary'
			},
			{
				title: 'No match and disabled option',
				demonstrates:
					'The empty-search message and a result that remains visible but cannot be chosen.',
				priority: 'edge-case'
			}
		]
	},
	'date-input': {
		purpose:
			'Date Input combines locale-aware editable date segments with a calendar popover in one compact field. It owns the date value, bounds, clear action, and calendar open state while still allowing direct keyboard entry.',
		useWhen: [
			'Users may know the date and want to type it quickly, but also benefit from calendar context.',
			'A form needs minimum or maximum date validation in a compact control.',
			'One calendar date must be submitted without a time or timezone.'
		],
		avoidWhen: [
			'Use Calendar when the month grid should remain visible.',
			'Use Date Range Input for start and end dates.',
			'Use Date Time Input when the same value must include a time.'
		],
		anatomy: [
			{
				name: 'DateInput.Root (`DateInput.DateInput` alias)',
				description:
					'Required composite containing segmented date input, optional clear button, calendar trigger, and popover Calendar.',
				required: true
			}
		],
		behavior: [
			'`value` and `open` are bindable; `onValueChange` receives a `CalendarDate` or `undefined` after clearing.',
			'The Bits DatePicker owns segment navigation, editing, locale order, and validity against `min` and `max`.',
			'Selecting a day from the popover commits the value and closes it. `numberOfMonths` supports one or two visible months.',
			'`name` is passed to the segmented input; the control can be disabled or read-only.'
		],
		examplePlan: [
			{
				title: 'Type or pick a due date',
				demonstrates:
					'Editing segments, opening the calendar, choosing a day, clearing it, and observing the bound `CalendarDate`.',
				priority: 'primary'
			},
			{
				title: 'Bounded date',
				demonstrates:
					'Minimum and maximum constraints reflected in both segments and unavailable calendar days.',
				priority: 'edge-case'
			}
		]
	},
	'date-range-input': {
		purpose:
			'Date Range Input edits a start and end date through two segmented fields backed by a range-calendar popover. Optional preset actions make common intervals quick without hiding the exact dates that were chosen.',
		useWhen: [
			'A report, booking, or filter needs a bounded start-and-end interval.',
			'Users should be able to type either endpoint or select the range visually.',
			'The product has a few meaningful preset ranges such as this week.'
		],
		avoidWhen: [
			'Use Date Input for a single date.',
			'Use Range Calendar when the calendar should stay visible.',
			'Do not use presets for ambiguous rolling periods unless their generated dates are visible to the user.'
		],
		anatomy: [
			{
				name: 'DateRangeInput.Root (`DateRangeInput.DateRangeInput` alias)',
				description:
					'Required composite containing start and end segment inputs, optional clear action, trigger, preset rail, and Range Calendar popover.',
				required: true
			}
		],
		behavior: [
			'`value` and `open` are bindable; value changes report the Bits `DateRange` shape or `undefined` after clearing.',
			'The start input receives `name`; the underlying DateRangePicker coordinates segment editing, range validity, locale, and focus.',
			'The popover defaults to two months. A preset computes its range at activation time, commits it, and closes the popover.',
			'Calendar range selection stays open while endpoints are being chosen.'
		],
		examplePlan: [
			{
				title: 'Choose a reporting window',
				demonstrates:
					'Typed endpoints, two-month visual selection, one real preset, clearing, and a readable bound-range summary.',
				priority: 'primary'
			},
			{
				title: 'Constrained interval',
				demonstrates: 'Minimum and maximum bounds plus an incomplete start-only range.',
				priority: 'edge-case'
			}
		]
	},
	'date-time-input': {
		purpose:
			'Date Time Input edits a local calendar date and minute-level time in one segmented field, with a calendar popover for the date portion. It stores a `CalendarDateTime`, so no timezone or instant conversion is implied.',
		useWhen: [
			'A form needs one local appointment, deadline, or schedule date and time.',
			'Users benefit from direct segment editing with calendar assistance for the day.',
			'Minimum and maximum local date-time values must be enforced.'
		],
		avoidWhen: [
			'Use Date Input when time is not part of the value.',
			'Use Time Input when the date is already established elsewhere.',
			'Do not treat `CalendarDateTime` as a zoned instant; resolve timezone policy in the application.'
		],
		anatomy: [
			{
				name: 'DateTimeInput.Root (`DateTimeInput.DateTimeInput` alias)',
				description:
					'Required composite containing date/time segments, optional clear button, calendar trigger, and date-selection popover.',
				required: true
			}
		],
		behavior: [
			'`value` and `open` are bindable; updates report a `CalendarDateTime` or `undefined`.',
			'Locale and optional 12/24-hour cycle shape the segments; granularity is fixed to minutes.',
			'Choosing a calendar day preserves the existing time fields, updates year/month/day, and closes the popover.',
			'The segmented control owns keyboard navigation, read-only/disabled handling, and range validity through Bits.'
		],
		examplePlan: [
			{
				title: 'Schedule a local appointment',
				demonstrates:
					'Direct date/time segment editing, calendar date replacement that preserves the time, clearing, and the bound value.',
				priority: 'primary'
			},
			{
				title: 'Twelve-hour bounded schedule',
				demonstrates: 'Day-period segments and minimum/maximum date-time constraints.',
				priority: 'edge-case'
			}
		]
	},
	field: {
		purpose:
			'Field supplies semantic and visual structure for labels, controls, helper copy, errors, and related field groups. It does not manage validation state or form values; consumers wire ids, ARIA relationships, and invalid state to the actual control.',
		useWhen: [
			'A control needs a consistent label, description, and error layout.',
			'Checkboxes or radios need horizontal or responsive label/content composition.',
			'Several controls need a semantic fieldset, legend, grouping rhythm, or separator.'
		],
		avoidWhen: [
			'Use Form when Formsnap/Superforms should own field context and validation associations.',
			'Do not use Field as a generic card or arbitrary spacing wrapper.',
			'Do not assume visual adjacency labels a control; retain explicit `for`, ids, and described-by wiring.'
		],
		anatomy: [
			{
				name: 'Field.Field',
				description:
					'Required `role="group"` wrapper for one field composition and its orientation.',
				required: true
			},
			{
				name: 'Field.Set (`Field.FieldSet` alias)',
				description: 'Semantic `<fieldset>` for a related set of controls.'
			},
			{
				name: 'Field.Legend (`Field.FieldLegend` alias)',
				description: 'Semantic fieldset caption with legend or compact-label typography.'
			},
			{
				name: 'Field.Group (`Field.FieldGroup` alias)',
				description:
					'Container that establishes vertical rhythm and responsive container context for fields.'
			},
			{
				name: 'Field.Content (`Field.FieldContent` alias)',
				description:
					'Flexible text column for a title, description, or other content beside a control.'
			},
			{
				name: 'Field.Label (`Field.FieldLabel` alias)',
				description:
					'Semantic label linked to a control through `for`; can wrap a field for selectable rows.'
			},
			{
				name: 'Field.Title (`Field.FieldTitle` alias)',
				description:
					'Visual title for a field-like block when a semantic `<label>` would be incorrect.'
			},
			{
				name: 'Field.Description (`Field.FieldDescription` alias)',
				description:
					'Supporting paragraph; the consumer must associate its id with the control when needed.'
			},
			{
				name: 'Field.Separator (`Field.FieldSeparator` alias)',
				description: 'Divider between field sections, optionally carrying centered text.'
			},
			{
				name: 'Field.Error (`Field.FieldError` alias)',
				description:
					'Conditional `role="alert"` error region that renders custom content, one message, or a list of messages.'
			}
		],
		behavior: [
			'Field supports vertical, horizontal, and container-responsive layout; it does not move focus or alter control behavior.',
			'`data-invalid` and disabled descendants drive visual states, but consumers own the matching control attributes and accessible relationships.',
			'Field Error renders nothing when it has neither meaningful errors nor custom children.'
		],
		examplePlan: [
			{
				title: 'Complete text field',
				demonstrates:
					'A linked label, Input, associated description, invalid state, and Field Error rather than the current happy-path-only stack.',
				priority: 'primary'
			},
			{
				title: 'Choice fieldset',
				demonstrates:
					'Set, Legend, Group, horizontal Fields, Content, and descriptions with real checkbox choices.',
				priority: 'secondary'
			},
			{
				title: 'Sectioned responsive form',
				demonstrates: 'Responsive orientation plus a labelled Separator and a non-label Title.',
				priority: 'edge-case'
			}
		]
	},
	'field-status': {
		purpose:
			'Field Status presents concise informational, success, warning, or error feedback adjacent to a form control. It pairs text with an icon and chooses alert semantics only for errors, while non-error updates use status semantics.',
		useWhen: [
			'A field needs validation feedback or short state guidance below or attached to it.',
			'Async validation should report success, warning, or error without replacing the control.',
			'Product copy needs an icon-supported status that is still explicit in text.'
		],
		avoidWhen: [
			'Use Field Description for stable instructions that are not a changing status.',
			'Use Banner or Sonner for page-level or transient global feedback.',
			'Do not use color or the icon without a message; the component renders nothing without content.'
		],
		anatomy: [
			{
				name: 'FieldStatus.Root (`FieldStatus.FieldStatus` alias)',
				description:
					'Required conditional status region containing an optional status icon and either `message` or custom children.',
				required: true
			}
		],
		behavior: [
			'Error uses `role="alert"`; info, success, and warning use `role="status"`.',
			'`message` and the children snippet are alternatives, with children taking precedence. `hideIcon` removes the decorative icon.',
			'`detached` adds spacing for use below a control; `attached` assumes the parent already owns the gap.'
		],
		examplePlan: [
			{
				title: 'Validation lifecycle',
				demonstrates:
					'One field moving from guidance to checking, success, and an error tied to the control.',
				priority: 'primary'
			},
			{
				title: 'Status matrix',
				demonstrates:
					'All four statuses, attached versus detached spacing, and custom child content.',
				priority: 'secondary'
			},
			{
				title: 'No-content boundary',
				demonstrates:
					'That an empty status renders no region, preventing blank live announcements.',
				priority: 'edge-case'
			}
		]
	},
	'file-input': {
		purpose:
			'File Input is a higher-level file chooser with optional drag-and-drop, client-side type/size/count validation, selected-file summaries, and removal controls. It selects browser `File` objects but does not upload, persist, or scan them.',
		useWhen: [
			'Users need to review and remove selected files before form submission or upload.',
			'Drag-and-drop and visible validation feedback improve a multi-file workflow.',
			'Type, maximum size, or maximum count rules should reject files immediately.'
		],
		avoidWhen: [
			'Use Input with `type="file"` for a trivial native chooser without summaries or validation UI.',
			'Do not use it as an upload-progress component; the consumer owns transport and server validation.',
			'Do not rely on `accept` as a security boundary; validate files again on the server.'
		],
		anatomy: [
			{
				name: 'FileInput.Root (`FileInput.FileInput` alias)',
				description:
					'Required composite containing the hidden native input, visible trigger or dropzone, rejection status, and selected-file list.',
				required: true
			}
		],
		behavior: [
			'`files` is bindable; accepted changes call `onFilesChange`, while rejected files are reported separately to `onReject` with type, size, or count reasons.',
			'Single mode replaces the current file. Multiple mode appends accepted files and respects the existing selection when applying `maxFiles`.',
			'The visible button or dropzone is the accessible control; the native file input stays hidden and outside the accessibility tree.',
			'Removal is individually labelled. The component clears the native input after each pick so the same file can be chosen again.'
		],
		examplePlan: [
			{
				title: 'Attach reviewed files',
				demonstrates:
					'Multiple selection, file name and size summaries, labelled removal, type/size/count rejection, and the bound file count.',
				priority: 'primary'
			},
			{
				title: 'Dropzone mode',
				demonstrates:
					'Drag-enter feedback, dropping accepted files, and keyboard activation of the same chooser.',
				priority: 'secondary'
			},
			{
				title: 'Single-file replacement',
				demonstrates:
					'That a second accepted pick replaces rather than appends when `multiple` is false.',
				priority: 'edge-case'
			}
		]
	},
	form: {
		purpose:
			'Form is the Formsnap presentation layer for fields managed by SvelteKit Superforms. Its parts consume Formsnap context to connect controls, labels, descriptions, constraints, and errors; it does not create the Superform or validation schema itself.',
		useWhen: [
			'A SvelteKit form already uses Superforms and needs type-safe nested field paths.',
			'Validation constraints and errors should be passed into custom controls through snippets.',
			'Labels, descriptions, and errors must share Formsnap-generated accessibility relationships.'
		],
		avoidWhen: [
			'Use Field for local layout when the form is not backed by Formsnap and Superforms.',
			'Do not use these parts without a valid `form` object and field `name` context.',
			'Do not confuse the component set with a `<form>` element, submission action, or validation schema.'
		],
		anatomy: [
			{
				name: 'Form.Field (`Form.FormField` alias)',
				description:
					'Required context wrapper for a field path; its snippet receives constraints, errors, tainted state, and the typed value.',
				required: true
			},
			{
				name: 'Form.ElementField (`Form.FormElementField` alias)',
				description:
					'Alternative field wrapper for an element inside an array-like field path, with the same snippet state.'
			},
			{
				name: 'Form.Control (`Form.FormControl` alias)',
				description:
					'Required bridge around the actual input in a field, providing constraints and generated ARIA/id props to its child composition.',
				required: true
			},
			{
				name: 'Form.Label (`Form.FormLabel` alias)',
				description:
					'Context-aware label linked to the active control and styled for an errored field.'
			},
			{
				name: 'Form.Description (`Form.FormDescription` alias)',
				description: 'Context-aware helper copy associated with the active control.'
			},
			{
				name: 'Form.FieldErrors (`Form.FormFieldErrors` alias)',
				description:
					'Error output that renders each current message or delegates rendering through a snippet.'
			},
			{
				name: 'Form.Fieldset (`Form.FormFieldset` alias)',
				description: 'Formsnap fieldset context for a grouped field path.'
			},
			{
				name: 'Form.Legend (`Form.FormLegend` alias)',
				description: 'Context-aware fieldset legend with error styling.'
			},
			{
				name: 'Form.Button (`Form.FormButton` alias)',
				description:
					'Bedrock Button preset to `type="submit"`; all other Button behavior remains available.'
			}
		],
		behavior: [
			'Field and ElementField are generic over the Superforms record and path, so snippet values and names remain type-connected.',
			'Control, Label, Description, FieldErrors, and Legend require the surrounding Formsnap context to generate their relationships.',
			'The consumer owns the actual `<form>`, enhancement, submission state, schema, and control binding; spread the Control child props and returned constraints onto the real input.'
		],
		examplePlan: [
			{
				title: 'Validated profile form',
				demonstrates:
					'A complete Superforms-backed `<form>` using Field, Control, Label, Description, Input, FieldErrors, and Button; this replaces the current missing preview.',
				priority: 'primary'
			},
			{
				title: 'Grouped choices',
				demonstrates:
					'Fieldset and Legend around a validated choice group with field-level errors.',
				priority: 'secondary'
			},
			{
				title: 'Array element field',
				demonstrates: 'ElementField preserving typed value and errors for one repeated form item.',
				priority: 'edge-case'
			}
		]
	},
	'icon-button': {
		purpose:
			'Icon Button is a compact icon-only action with a required accessible label and a 44-pixel interaction target. It maps semantic icon names and optional tooltip text onto the standard Button behavior.',
		useWhen: [
			'A familiar action must fit in a dense toolbar or row.',
			'The visible icon is supported by surrounding context but the control still needs a programmatic name.',
			'A tooltip would help explain an unfamiliar icon without becoming the accessible label.'
		],
		avoidWhen: [
			'Use Button when a visible text label fits; recognition is usually better than icon recall.',
			'Use Toggle when the icon represents a persistent on/off pressed state.',
			'Do not put essential instructions only in `tooltip`; `label` remains required.'
		],
		anatomy: [
			{
				name: 'IconButton.Root (`IconButton.IconButton` alias)',
				description:
					'Required labelled Button containing one registry Icon and, when requested, its own Tooltip provider/root/trigger/content composition.',
				required: true
			}
		],
		behavior: [
			'`label` becomes `aria-label` regardless of tooltip use. `tooltip` adds hover/focus help but does not replace the name.',
			'Visual sizes xs through lg map to Button icon sizes while `tap-target` preserves a 44-pixel hit area.',
			'Other supported Button props, including variants, disabled state, events, and `href`, pass through.'
		],
		examplePlan: [
			{
				title: 'Dense row actions',
				demonstrates:
					'Three realistic icon actions with required labels, visible focus, and one helpful tooltip.',
				priority: 'primary'
			},
			{
				title: 'Sizes and variants',
				demonstrates:
					'The four visual sizes and hierarchy variants without sacrificing target size.',
				priority: 'secondary'
			},
			{
				title: 'Unavailable action',
				demonstrates: 'Disabled behavior and a long accessible label on an icon-only control.',
				priority: 'edge-case'
			}
		]
	},
	input: {
		purpose:
			'Input is the Bedrock-styled native single-line input and forwards the platform attribute surface. It supports bindable text-like values and a dedicated file branch while leaving labels, descriptions, and validation logic to the surrounding form composition.',
		useWhen: [
			'A form needs a standard one-line text, email, password, search, or similar native input.',
			'Browser autofill, input modes, native validation attributes, and form participation should remain intact.',
			'A trivial file chooser does not need File Input summaries or validation UI.'
		],
		avoidWhen: [
			'Use Textarea for multi-line content.',
			'Use Number Input for locale-aware numeric formatting, clamping, units, or steppers.',
			'Use File Input for drag-and-drop, file constraints, summaries, and removal.'
		],
		anatomy: [
			{
				name: 'Input.Root (`Input.Input` alias)',
				description:
					'Required native `<input>` wrapper; `value` is bindable for normal types and `files` is additionally bindable for `type="file"`.',
				required: true
			}
		],
		behavior: [
			'All native input attributes and events pass through, with `type="file"` handled as a typed branch.',
			'The component styles focus, disabled, and `aria-invalid` states but does not create a label or validation message.',
			'Placeholder text is not an accessible label; use Label, Field, or Form around the control.'
		],
		examplePlan: [
			{
				title: 'Complete text input',
				demonstrates:
					'A linked label, bound value, autocomplete/input attributes, description, and invalid message in a realistic field.',
				priority: 'primary'
			},
			{
				title: 'Native input types',
				demonstrates: 'Email, password, and search types retaining their platform behavior.',
				priority: 'secondary'
			},
			{
				title: 'Disabled and read-only',
				demonstrates:
					'The different interaction and submission semantics of unavailable versus read-only input.',
				priority: 'edge-case'
			}
		]
	},
	'input-group': {
		purpose:
			'Input Group composes one text input or textarea with inline or block addons inside a shared focus and validation shell. Addons may contain text, icons, shortcuts, or compact actions without making each piece look like a separate field.',
		useWhen: [
			'An input needs a prefix, suffix, unit, currency, search icon, or embedded action.',
			'A textarea needs contextual content above or below it within the same boundary.',
			'The whole composition should share focus, invalid, and disabled styling.'
		],
		avoidWhen: [
			'Use Input alone when no addon clarifies or operates on the value.',
			'Use Button Group when adjacent elements are peer actions rather than parts of one input.',
			'Do not put unrelated controls into the shell or rely on addon text as the input’s accessible label.'
		],
		anatomy: [
			{
				name: 'InputGroup.Root (`InputGroup.InputGroup` alias)',
				description:
					'Required `role="group"` shell that coordinates border, focus, invalid, disabled, and layout states.',
				required: true
			},
			{
				name: 'InputGroup.Input (`InputGroup.InputGroupInput` alias)',
				description: 'Borderless bindable Input control sized to fill the shared shell.'
			},
			{
				name: 'InputGroup.Textarea (`InputGroup.InputGroupTextarea` alias)',
				description: 'Borderless bindable Textarea control that makes the shell grow vertically.'
			},
			{
				name: 'InputGroup.Addon (`InputGroup.InputGroupAddon` alias)',
				description:
					'Inline-start, inline-end, block-start, or block-end region; clicking non-button addon space focuses the contained Input.'
			},
			{
				name: 'InputGroup.Text (`InputGroup.InputGroupText` alias)',
				description: 'Muted non-interactive text or icon content intended for an Addon.'
			},
			{
				name: 'InputGroup.Button (`InputGroup.InputGroupButton` alias)',
				description: 'Compact embedded Button with xs, sm, and icon-specific sizes.'
			}
		],
		behavior: [
			'Use one Input or Textarea as the actual form control. Root derives focus and invalid presentation from that descendant.',
			'Block addons switch the root to vertical layout; inline addons trim the control padding around their content.',
			'Addon surface clicks focus the first contained input unless the click originated inside a button. Embedded Buttons default to `type="button"`.'
		],
		examplePlan: [
			{
				title: 'Search and amount fields',
				demonstrates:
					'An icon prefix and a currency suffix using Root, Input, Addon, and Text with real accessible labels.',
				priority: 'primary'
			},
			{
				title: 'Input with action',
				demonstrates:
					'A labelled input with a compact clear or reveal Button in an inline-end Addon.',
				priority: 'secondary'
			},
			{
				title: 'Textarea with block addon',
				demonstrates:
					'Textarea composition and block-start/block-end layout rather than only one-line fields.',
				priority: 'edge-case'
			}
		]
	},
	'input-otp': {
		purpose:
			'Input OTP provides one keyboard input for a short verification code while rendering its characters as grouped visual cells. The root owns the real value and cell model; groups, slots, and separators define how that model is presented.',
		useWhen: [
			'Users enter a fixed-length one-time password, PIN, or short verification code.',
			'The code should remain one input for typing and pasting but appear in readable groups.',
			'A fake caret and active cell treatment should show the current position.'
		],
		avoidWhen: [
			'Use Input for arbitrary identifiers or codes without a fixed segmented format.',
			'Do not create a separate input per character; Root already owns one accessible value.',
			'Do not use it for long secrets or passwords that need password-manager conventions.'
		],
		anatomy: [
			{
				name: 'InputOTP.Root (`InputOTP.InputOTP` alias)',
				description:
					'Required PinInput root that owns the bindable string and provides `cells` to its children snippet.',
				required: true
			},
			{
				name: 'InputOTP.Group (`InputOTP.InputOTPGroup` alias)',
				description: 'Visual cluster for adjacent code cells.',
				required: true
			},
			{
				name: 'InputOTP.Slot (`InputOTP.InputOTPSlot` alias)',
				description: 'Required visual cell for one item from the Root-provided `cells` array.',
				required: true
			},
			{
				name: 'InputOTP.Separator (`InputOTP.InputOTPSeparator` alias)',
				description:
					'Optional visual and semantic separator, with a minus icon fallback or custom content.'
			}
		],
		behavior: [
			'`value` is bindable; typing and paste are handled by the underlying Bits PinInput rather than by individual Slots.',
			'Root disables spellcheck. Each Slot receives its exact cell object and renders its character, active state, and fake caret.',
			'Grouping is visual: `maxlength` on Root determines the accepted code length, while the consumer slices the cell array into the desired groups.'
		],
		examplePlan: [
			{
				title: 'Six-digit verification code',
				demonstrates:
					'A labelled six-character value split 3–3, including typing, pasting, active cell, and completion output.',
				priority: 'primary'
			},
			{
				title: 'Invalid and disabled code',
				demonstrates: 'ARIA invalid styling across a Group and the unavailable state.',
				priority: 'edge-case'
			}
		]
	},
	label: {
		purpose:
			'Label renders the semantic name for a form control with consistent typography and disabled treatment. It preserves native label activation when `for` matches the control id.',
		useWhen: [
			'A native or custom form control needs a visible programmatic name.',
			'Clicking the text should focus or toggle the associated control.',
			'A standalone field composition does not already provide Field Label or Form Label.'
		],
		avoidWhen: [
			'Use Field.Label when composing a full Field.',
			'Use Form.Label inside Formsnap field context.',
			'Do not use Label as general text or as the heading for a group; use Text/Heading or a fieldset Legend.'
		],
		anatomy: [
			{
				name: 'Label.Root (`Label.Label` alias)',
				description: 'Required styled semantic label; connect `for` to the control’s `id`.',
				required: true
			}
		],
		behavior: [
			'All native label attributes pass through and the linked control receives native focus/toggle behavior on activation.',
			'Disabled state styling is derived from a disabled peer but does not disable a control by itself.',
			'Every visible label should identify one control; groups need a Legend or another explicit group name.'
		],
		examplePlan: [
			{
				title: 'Linked form label',
				demonstrates: 'A label whose `for` and Input id prove native click-to-focus behavior.',
				priority: 'primary'
			},
			{
				title: 'Checkbox label',
				demonstrates:
					'A label toggling a neighbouring checkbox while retaining a generous click target.',
				priority: 'secondary'
			}
		]
	},
	'multi-selector': {
		purpose:
			'Multi Selector presents a popover checklist for choosing several values from rich options, groups, and separators. Its trigger can summarize the selection as a count, joined labels, or bounded badge tokens while the popover remains open across toggles.',
		useWhen: [
			'A medium or long list needs multiple selection without occupying permanent page space.',
			'Options need groups, descriptions, icons, disabled states, search, or select-all.',
			'The closed trigger needs a compact summary instead of removable inline chips.'
		],
		avoidWhen: [
			'Use Checkbox List for three to seven choices that should remain visible.',
			'Use Tokenizer when selected values must be directly removable as chips or users may create values.',
			'Use Selector or Combobox for exactly one selected value.'
		],
		anatomy: [
			{
				name: 'MultiSelector.Root (`MultiSelector.MultiSelector` alias)',
				description:
					'Required composite that owns the trigger, optional clear action, popover Command list, select-all row, and selection summary.',
				required: true
			}
		],
		behavior: [
			'`value` and `open` are bindable; each toggle emits a new value array through `onValueChange` without closing the popover.',
			'Typeahead filtering remains available through a visually hidden Command input even when `searchable` is false; searchable makes that input visible.',
			'Select-all affects enabled options only and exposes checked or partial visual state. Existing values outside the current option list are preserved.',
			'Badge display stops at `maxBadges` and renders a `+N` remainder; custom `option` replaces each row’s content.'
		],
		examplePlan: [
			{
				title: 'Choose deployment regions',
				demonstrates:
					'Grouped rich options, visible search, disabled entries, multiple toggles, clearability, and a count summary.',
				priority: 'primary'
			},
			{
				title: 'Badge summary',
				demonstrates: 'Badge tokens capped by `maxBadges` with a meaningful overflow count.',
				priority: 'secondary'
			},
			{
				title: 'Select all from partial',
				demonstrates:
					'Partial state, exclusion of disabled options, full selection, and clearing all enabled values.',
				priority: 'edge-case'
			}
		]
	},
	'native-select': {
		purpose:
			'Native Select styles the platform `<select>` while retaining native option rendering, keyboard behavior, form participation, and mobile pickers. Option and OptGroup are thin semantic wrappers for consistent imports and slots.',
		useWhen: [
			'A small or moderate fixed list works well with the operating system’s picker.',
			'Mobile ergonomics, native form behavior, and minimal JavaScript matter more than rich option rendering.',
			'Options need basic native grouping but no search, descriptions, or icons.'
		],
		avoidWhen: [
			'Use Select for styled floating content and custom option rows.',
			'Use Selector or Combobox when users need search or rich data-driven options.',
			'Use Radio Group when a short set should remain visible for comparison.'
		],
		anatomy: [
			{
				name: 'NativeSelect.Root (`NativeSelect.NativeSelect` alias)',
				description: 'Required styled native select and decorative chevron wrapper.',
				required: true
			},
			{
				name: 'NativeSelect.Option (`NativeSelect.NativeSelectOption` alias)',
				description: 'Required native `<option>` for each selectable value.',
				required: true
			},
			{
				name: 'NativeSelect.OptGroup (`NativeSelect.NativeSelectOptGroup` alias)',
				description: 'Optional native `<optgroup>` for labelled option sections.'
			}
		],
		behavior: [
			'`value` is bindable and all native select attributes, change events, validation, and submission semantics pass through.',
			'The operating system controls the open picker and option presentation; Bedrock styles only the closed select shell and option canvas colors where supported.',
			'`size` means visual control height (`sm` or default), not the native multi-row `size` attribute.'
		],
		examplePlan: [
			{
				title: 'Choose an order status',
				demonstrates:
					'A labelled bound select that submits a conventional fixed value using native interaction.',
				priority: 'primary'
			},
			{
				title: 'Grouped native options',
				demonstrates: 'OptGroup structure, a disabled option, and the small visual size.',
				priority: 'secondary'
			}
		]
	},
	'number-input': {
		purpose:
			'Number Input accepts locale-shaped numeric text, commits it to a number or null, and formats the settled value through `Intl.NumberFormat`. Optional units, clear action, and steppers share one Input Group without pretending the formatted string is the submitted value.',
		useWhen: [
			'Users enter quantities, amounts, percentages, or measurements that require locale-aware formatting.',
			'Values must clamp to bounds, round to integers, or step from buttons and arrow keys.',
			'A visible unit or currency format should accompany the editable number.'
		],
		avoidWhen: [
			'Use Input with a suitable input mode for identifiers such as account numbers or postal codes.',
			'Use Slider when approximate position within a bounded range matters more than exact typing.',
			'Do not use client-side clamping as the only server validation.'
		],
		anatomy: [
			{
				name: 'NumberInput.Root (`NumberInput.NumberInput` alias)',
				description:
					'Required composite containing a text input, optional unit/clear/stepper addons, and a hidden raw-value input when `name` is provided.',
				required: true
			}
		],
		behavior: [
			'`value` is bindable as `number | null`. Focus shows an unformatted editable number; blur or Enter parses, constrains, and restores localized formatting.',
			'Invalid text reverts to the previous value. Empty text commits null; `integer`, `min`, and `max` are applied at commit and stepping.',
			'Arrow Up/Down step once, Shift multiplies by ten, and visible steppers preserve focus. Disabled and read-only block stepping and clearing.',
			'When `name` is set, a hidden input submits the raw numeric value while the visible formatted field remains unnamed.'
		],
		examplePlan: [
			{
				title: 'Locale-aware invoice amount',
				demonstrates:
					'Typing localized text, committing on blur/Enter, currency formatting, a raw hidden form value, and the bound number.',
				priority: 'primary'
			},
			{
				title: 'Measured quantity',
				demonstrates:
					'A unit, bounds, step size, keyboard stepping, Shift multiplier, steppers, and clear-to-null.',
				priority: 'secondary'
			},
			{
				title: 'Invalid and clamped input',
				demonstrates: 'Reverting unparseable text and clamping values beyond min/max.',
				priority: 'edge-case'
			}
		]
	},
	'radio-group': {
		purpose:
			'Radio Group presents a set of mutually exclusive choices where selecting one replaces the previous value. The root owns group value and keyboard coordination; each Item is the radio control and requires an external visible label.',
		useWhen: [
			'Users must compare a short list and choose exactly one option.',
			'All choices should remain visible instead of hiding behind a select trigger.',
			'Arrow-key movement between related radio items is expected.'
		],
		avoidWhen: [
			'Use Checkbox or Checkbox List when choices are independent.',
			'Use Select or Native Select when the list is long or space is limited.',
			'Use Toggle Group for a compact view/tool mode selector whose button presentation is meaningful.'
		],
		anatomy: [
			{
				name: 'RadioGroup.Root (`RadioGroup.RadioGroup` alias)',
				description:
					'Required group that owns the bindable selected value and primitive keyboard behavior.',
				required: true
			},
			{
				name: 'RadioGroup.Item (`RadioGroup.RadioGroupItem` alias)',
				description: 'Required radio control for one value; pair its id with a Label.',
				required: true
			}
		],
		behavior: [
			'`value` is bindable; the underlying Bits group owns radio roles, checked state, roving focus, and arrow-key selection.',
			'Each Item can be disabled or invalid independently and renders its own checked indicator.',
			'Provide a group name with a fieldset/legend or ARIA relationship in addition to each item label.'
		],
		examplePlan: [
			{
				title: 'Choose a delivery speed',
				demonstrates:
					'A fieldset legend, three labelled values, bound selection, and arrow-key navigation.',
				priority: 'primary'
			},
			{
				title: 'Unavailable option',
				demonstrates: 'A disabled radio in context without removing the reason or group name.',
				priority: 'edge-case'
			}
		]
	},
	'range-calendar': {
		purpose:
			'Range Calendar provides a visible monthly grid for selecting a start and end date as one interval. Its convenience component assembles range-aware cells, navigation, captions, and optional dropdowns while exposing every part for advanced composition.',
		useWhen: [
			'A booking, report, or filter benefits from seeing the interval across surrounding dates.',
			'The calendar should remain visible rather than live in a field popover.',
			'Minimum, maximum, disabled, unavailable, or multiple visible months constrain the interval.'
		],
		avoidWhen: [
			'Use Date Range Input when users also need compact segmented typing and presets.',
			'Use Calendar for one date or a non-contiguous multiple selection.',
			'Do not use it for date-time intervals; the value contains calendar dates only.'
		],
		anatomy: [
			{
				name: 'RangeCalendar.RangeCalendar',
				description:
					'Required convenience root that owns the range value, locale, bounds, visible months, and default compound structure.',
				required: true
			},
			{ name: 'RangeCalendar.Months', description: 'Layout wrapper for all visible month panels.' },
			{
				name: 'RangeCalendar.Nav',
				description: 'Navigation region containing previous and next controls.'
			},
			{
				name: 'RangeCalendar.PrevButton',
				description: 'Moves to the previous allowed calendar page.'
			},
			{ name: 'RangeCalendar.NextButton', description: 'Moves to the next allowed calendar page.' },
			{ name: 'RangeCalendar.Month', description: 'Layout wrapper for one month.' },
			{ name: 'RangeCalendar.Header', description: 'Centers the visible month caption.' },
			{
				name: 'RangeCalendar.Caption',
				description: 'Renders a month/year label or the configured dropdown caption.'
			},
			{
				name: 'RangeCalendar.Heading',
				description: 'Bits range-calendar heading for a custom header composition.'
			},
			{
				name: 'RangeCalendar.MonthSelect',
				description: 'Native month selector used by dropdown captions.'
			},
			{
				name: 'RangeCalendar.YearSelect',
				description: 'Native year selector used by dropdown captions.'
			},
			{ name: 'RangeCalendar.Grid', description: 'Semantic calendar grid for one month.' },
			{ name: 'RangeCalendar.GridHead', description: 'Grid header containing weekday names.' },
			{ name: 'RangeCalendar.GridBody', description: 'Grid body containing week rows.' },
			{ name: 'RangeCalendar.GridRow', description: 'One weekday header row or calendar week.' },
			{ name: 'RangeCalendar.HeadCell', description: 'One localized weekday heading cell.' },
			{
				name: 'RangeCalendar.Cell',
				description:
					'Semantic date cell that visually connects range start, middle, and end states.'
			},
			{
				name: 'RangeCalendar.Day',
				description:
					'Interactive day control with start, middle, end, today, outside, disabled, and unavailable states.'
			}
		],
		behavior: [
			'`value` and visible `placeholder` are bindable; the Bits range primitive owns grid focus, keyboard navigation, and endpoint selection.',
			'Locale defaults to `en-US`; one or more months and label/month/year dropdown caption layouts are supported.',
			'`day` customizes day content without replacing cell or range semantics. Outside days can be disabled explicitly.'
		],
		examplePlan: [
			{
				title: 'Choose a booking interval',
				demonstrates:
					'Start, preview/middle, and end states across a two-month calendar with a readable bound range.',
				priority: 'primary'
			},
			{
				title: 'Bounded dropdown calendar',
				demonstrates: 'Min/max limits, unavailable days, and month/year caption dropdowns.',
				priority: 'secondary'
			},
			{
				title: 'Incomplete range',
				demonstrates: 'The start-only state and recovery when the user chooses a valid endpoint.',
				priority: 'edge-case'
			}
		]
	},
	select: {
		purpose:
			'Select is a custom single- or multi-value listbox with a styled trigger and portalled floating option surface. Its compound parts support rich rows, grouping, headings, separators, and scroll controls while Bits owns selection and keyboard behavior.',
		useWhen: [
			'A fixed list needs a fully styled popup and richer option presentation than the platform picker.',
			'Options need custom child content, groups, headings, or separators.',
			'The consumer needs controlled or bindable open and selection state.'
		],
		avoidWhen: [
			'Use Native Select when platform UI and mobile-native behavior are preferable.',
			'Use Selector or Combobox when users need text search.',
			'Use Radio Group when a short set should stay visible for direct comparison.'
		],
		anatomy: [
			{
				name: 'Select.Root (`Select.Select` alias)',
				description:
					'Required state/context owner for open state, selection type, and selected value.',
				required: true
			},
			{
				name: 'Select.Trigger (`Select.SelectTrigger` alias)',
				description:
					'Required button that opens the list and renders consumer-supplied selected text plus a chevron.',
				required: true
			},
			{
				name: 'Select.Content (`Select.SelectContent` alias)',
				description:
					'Required portalled floating surface containing a viewport and built-in up/down scroll controls.',
				required: true
			},
			{
				name: 'Select.Item (`Select.SelectItem` alias)',
				description:
					'Required selectable value row with an internal selected check and optional custom child snippet.',
				required: true
			},
			{
				name: 'Select.Group (`Select.SelectGroup` alias)',
				description: 'Optional semantic group for related Items.'
			},
			{
				name: 'Select.GroupHeading (`Select.SelectGroupHeading` alias)',
				description: 'Context-aware heading for a Group.'
			},
			{
				name: 'Select.Label (`Select.SelectLabel` alias)',
				description:
					'Optional styled visual label inside Content; unlike GroupHeading it is a plain container.'
			},
			{
				name: 'Select.Separator (`Select.SelectSeparator` alias)',
				description: 'Optional non-interactive divider between option sections.'
			},
			{
				name: 'Select.ScrollUpButton (`Select.SelectScrollUpButton` alias)',
				description:
					'Viewport edge control for scrolling toward earlier options; Content includes one automatically.'
			},
			{
				name: 'Select.ScrollDownButton (`Select.SelectScrollDownButton` alias)',
				description:
					'Viewport edge control for scrolling toward later options; Content includes one automatically.'
			},
			{
				name: 'Select.Portal (`Select.SelectPortal` alias)',
				description:
					'Optional explicit portal boundary for custom composition; standard Content already wraps itself in Portal.'
			}
		],
		behavior: [
			'`open` and `value` are bindable; Root’s discriminated `type` controls single versus multiple selection.',
			'The underlying Bits primitive owns trigger/listbox keyboard handling, typeahead, focus, disabled items, and selected state.',
			'Content portals by default, prevents document scroll by default, matches at least the trigger width, and exposes vertical overflow controls.',
			'Trigger content is consumer-owned; derive and render the selected label rather than exposing a raw id to users.'
		],
		examplePlan: [
			{
				title: 'Choose one layer',
				demonstrates:
					'A labelled single Select with a derived trigger label, disabled item, and bound value.',
				priority: 'primary'
			},
			{
				title: 'Grouped rich options',
				demonstrates:
					'Group, GroupHeading, Separator, and custom Item content in one coherent list.',
				priority: 'secondary'
			},
			{
				title: 'Overflow and multiple values',
				demonstrates:
					'A constrained long list revealing the automatic scroll controls and the Root multi-selection contract.',
				priority: 'edge-case'
			}
		]
	},
	selector: {
		purpose:
			'Selector is Bedrock’s rich data-driven single select, accepting flat options, labelled groups, and separators in one item array. Complex Selector reuses the same trigger and popover shell but delegates the body and commit moment to a typed snippet for non-list editors.',
		useWhen: [
			'A single choice needs search, option descriptions, semantic icons, groups, disabled rows, or clearability.',
			'Options are data rather than hand-authored Select.Item markup.',
			'A custom popover editor should commit one typed value through Complex Selector.'
		],
		avoidWhen: [
			'Use Combobox only for its smaller frozen flat-list compatibility API.',
			'Use Select when bespoke compound markup and no search are a better fit.',
			'Use Multi Selector or Tokenizer for multiple values.',
			'Do not use Complex Selector for arbitrary actions unrelated to committing one value; use Popover instead.'
		],
		anatomy: [
			{
				name: 'Selector.Root (`Selector.Selector` alias)',
				description:
					'Data-driven single-select composite containing trigger, optional clear control, popover, Command filter, grouped rows, and empty state.',
				required: true
			},
			{
				name: 'Selector.Complex (`Selector.ComplexSelector` alias)',
				description:
					'Typed trigger-and-popover composite whose required `content` snippet receives current value, `commit`, and focus-restoring `close` helpers.'
			}
		],
		behavior: [
			'Root’s `value` and `open` are bindable; choosing a row closes the popover and returns focus to the trigger. Clear also refocuses the trigger.',
			'Filtering is always mounted for typeahead; `searchable` makes the Command input visible. Option descriptions participate in matching as keywords.',
			'Root supports custom `option` row and `selected` trigger snippets while retaining selection semantics.',
			'Complex does not commit automatically: its content calls `commit(next)` and `close()` independently, allowing draft controls and an explicit Apply action.'
		],
		examplePlan: [
			{
				title: 'Choose an environment',
				demonstrates:
					'Groups, separator, icons, descriptions, disabled item, visible search, clear action, bound value, and focus restoration.',
				priority: 'primary'
			},
			{
				title: 'Custom option and selected content',
				demonstrates: 'Both public snippets without replacing the Command selection behavior.',
				priority: 'secondary'
			},
			{
				title: 'Complex threshold editor',
				demonstrates:
					'A draft Slider inside Complex Selector, explicit Apply via `commit`, cancel/close behavior, and typed trigger rendering.',
				priority: 'edge-case'
			}
		]
	},
	slider: {
		purpose:
			'Slider selects one number or a numeric range by moving one or more thumbs along a horizontal or vertical track. It is strongest for bounded, visually comparable values where approximate pointer adjustment complements keyboard precision.',
		useWhen: [
			'Users tune a bounded setting such as volume, threshold, opacity, or depth.',
			'A minimum/maximum range needs two thumbs on one scale.',
			'The current position within the allowed span is useful feedback.'
		],
		avoidWhen: [
			'Use Number Input when exact typed entry, localization, units, or form submission is primary.',
			'Use Progress for read-only completion; Slider is interactive.',
			'Use Select or Radio Group for discrete named choices that are not meaningfully numeric.'
		],
		anatomy: [
			{
				name: 'Slider.Root (`Slider.Slider` alias)',
				description:
					'Required Bits Slider root that internally renders its track, filled range, and one thumb per value.',
				required: true
			}
		],
		behavior: [
			'`value` and `ref` are bindable; Root’s `type` distinguishes a single number from multiple values.',
			'The Bits primitive owns pointer, touch, keyboard stepping, orientation, min/max, step, disabled state, and ARIA slider semantics.',
			'Horizontal is the default; vertical changes both layout and track geometry. Consumers must provide an accessible name for each thumb where the primitive API permits it.'
		],
		examplePlan: [
			{
				title: 'Tune an exact threshold',
				demonstrates:
					'A labelled single-value Slider with min, max, step, and live numeric output.',
				priority: 'primary'
			},
			{
				title: 'Select a range',
				demonstrates:
					'Two thumbs defining minimum and maximum values with a clear textual summary.',
				priority: 'secondary'
			},
			{
				title: 'Vertical and unavailable',
				demonstrates:
					'Vertical orientation and disabled state without relying on track position alone.',
				priority: 'edge-case'
			}
		]
	},
	switch: {
		purpose:
			'Switch changes one binary setting whose effect is immediate, using a familiar on/off track and thumb. It owns checked state and switch semantics but relies on a linked visible Label for the setting name.',
		useWhen: [
			'Changing a setting takes effect as soon as the control is activated.',
			'The product can clearly describe the value as on or off.',
			'A compact settings row needs a small or default switch.'
		],
		avoidWhen: [
			'Use Checkbox for choices collected and submitted together.',
			'Use Toggle for a persistent toolbar or formatting mode presented as a button.',
			'Use Radio Group when users must choose among more than two named states.'
		],
		anatomy: [
			{
				name: 'Switch.Root (`Switch.Switch` alias)',
				description:
					'Required switch control with an internal animated thumb; pair it with an external Label.',
				required: true
			}
		],
		behavior: [
			'`checked` and `ref` are bindable; the Bits primitive owns switch role, activation, and disabled behavior.',
			'The default and small sizes change the visible track/thumb, while the surrounding tap-target pseudo-element expands interaction space.',
			'Keep label wording stable; show value feedback separately if users need explicit on/off confirmation.'
		],
		examplePlan: [
			{
				title: 'Immediate notification setting',
				demonstrates:
					'A linked label, bound checked state, and visible effect or status after activation.',
				priority: 'primary'
			},
			{
				title: 'Sizes and unavailable state',
				demonstrates:
					'Small/default visual sizes and a disabled setting with an explanatory description.',
				priority: 'edge-case'
			}
		]
	},
	textarea: {
		purpose:
			'Textarea is the Bedrock-styled native multi-line text control with bindable value and content-driven height. It preserves platform editing, selection, form, and resize behavior while matching Input focus and validation treatment.',
		useWhen: [
			'Users enter notes, descriptions, messages, or other content that can span lines.',
			'Native textarea attributes such as maxlength, rows, name, and autocomplete are needed.',
			'The field should grow with content from a defined minimum height.'
		],
		avoidWhen: [
			'Use Input for a one-line value.',
			'Use a rich-text or Markdown editor when formatting tools and structured output are required.',
			'Do not use it as a generic scroll container or code editor.'
		],
		anatomy: [
			{
				name: 'Textarea.Root (`Textarea.Textarea` alias)',
				description:
					'Required native `<textarea>` wrapper with bindable `value` and forwarded attributes/events.',
				required: true
			}
		],
		behavior: [
			'The value is bindable and native form submission, keyboard editing, wrapping, selection, and browser spellcheck behavior pass through.',
			'Field sizing follows content with a minimum height; consumers can constrain layout through supported classes or native attributes.',
			'The component styles disabled and `aria-invalid` states but does not generate a label, description, character count, or error.'
		],
		examplePlan: [
			{
				title: 'Operational notes field',
				demonstrates:
					'A linked label, associated guidance, bound value, content growth, maxlength, and remaining-character feedback.',
				priority: 'primary'
			},
			{
				title: 'Invalid and read-only notes',
				demonstrates:
					'Validation association and the difference between read-only and disabled multi-line content.',
				priority: 'edge-case'
			}
		]
	},
	'time-input': {
		purpose:
			'Time Input edits a locale-aware `Time` value through focusable hour, minute, optional second, and day-period segments. It provides precise keyboard entry in a compact control without attaching a date or timezone.',
		useWhen: [
			'A schedule, duration boundary, or daily setting needs a wall-clock time.',
			'Users benefit from locale ordering and 12/24-hour segment behavior.',
			'Minimum/maximum times, second precision, or clearability are required.'
		],
		avoidWhen: [
			'Use Date Time Input when the value also includes a date.',
			'Use Select when users choose from a small fixed list of appointment slots.',
			'Do not treat `Time` as an instant or duration; timezone and date belong to the application model.'
		],
		anatomy: [
			{
				name: 'TimeInput.Root (`TimeInput.TimeInput` alias)',
				description:
					'Required composite containing a clock icon, Bits time segments, and an optional clear action.',
				required: true
			}
		],
		behavior: [
			'`value` is bindable; `onValueChange` receives a `Time` or `undefined` when cleared.',
			'The underlying TimeField owns segment focus, editing, locale, min/max validity, disabled/read-only state, and 12/24-hour presentation.',
			'Granularity can stop at hour, minute, or second and defaults to minute. `name` is assigned to the segmented input.'
		],
		examplePlan: [
			{
				title: 'Set a start time',
				demonstrates:
					'Keyboard segment editing, a bound Time value, clearability, locale, and explicit 24-hour cycle.',
				priority: 'primary'
			},
			{
				title: 'Twelve-hour time with seconds',
				demonstrates: 'Day-period and second segments plus min/max validity.',
				priority: 'secondary'
			},
			{
				title: 'Read-only versus disabled',
				demonstrates:
					'The two unavailable interaction modes without conflating their form semantics.',
				priority: 'edge-case'
			}
		]
	},
	toggle: {
		purpose:
			'Toggle is a button with a persistent pressed state for turning a mode or tool on and off. It communicates that state through the Bits toggle primitive and shares Bedrock’s button-like sizes, focus treatment, and default or outline appearance.',
		useWhen: [
			'A toolbar mode such as bold, filters, pinning, or visibility can be independently pressed.',
			'The control needs button presentation while exposing an on/off pressed state.',
			'Icon and label content should remain visible inside the control.'
		],
		avoidWhen: [
			'Use Button for a one-shot action with no persistent state.',
			'Use Switch for an immediate system setting presented as on/off.',
			'Use Toggle Group when several toggles share single- or multi-selection rules.'
		],
		anatomy: [
			{
				name: 'Toggle.Root (`Toggle.Toggle` alias)',
				description:
					'Required pressable control containing consumer-provided icon and/or label content.',
				required: true
			}
		],
		behavior: [
			'`pressed` and `ref` are bindable; the Bits primitive owns `aria-pressed`, activation, and disabled behavior.',
			'Default and outline variants change visual hierarchy; sm, default, and lg coordinate height, padding, and icon size.',
			'Icon-only content still requires an accessible name supplied by the consumer.'
		],
		examplePlan: [
			{
				title: 'Persistent filter mode',
				demonstrates:
					'A labelled icon-and-text Toggle with bound pressed state and visible downstream effect.',
				priority: 'primary'
			},
			{
				title: 'Formatting controls',
				demonstrates:
					'Default and outline variants, sizes, disabled state, and an accessible icon-only toggle.',
				priority: 'secondary'
			}
		]
	},
	'toggle-group': {
		purpose:
			'Toggle Group coordinates a set of Toggle-like items under single- or multiple-selection rules. The root shares orientation, size, variant, and spacing with its Items while Bits owns group state and keyboard behavior.',
		useWhen: [
			'Users choose one view mode from a compact toolbar.',
			'Several formatting or filter modes can be pressed independently in one group.',
			'Items need connected styling at zero spacing or separated toggle styling with a shared gap.'
		],
		avoidWhen: [
			'Use Radio Group when choices need full visible labels and form-option presentation.',
			'Use Button Group when each control triggers an independent action.',
			'Use Tabs when selection switches between document panels with tab semantics.'
		],
		anatomy: [
			{
				name: 'ToggleGroup.Root (`ToggleGroup.ToggleGroup` alias)',
				description:
					'Required state/context owner for selection type, value, orientation, spacing, size, and variant.',
				required: true
			},
			{
				name: 'ToggleGroup.Item (`ToggleGroup.ToggleGroupItem` alias)',
				description:
					'Required pressable value that inherits group styling unless its own size or variant is used as fallback.',
				required: true
			}
		],
		behavior: [
			'`value` is bindable and its type follows Root’s single or multiple selection mode.',
			'The Bits primitive owns pressed state, keyboard movement, orientation, looping, and disabled behavior.',
			'At spacing zero, adjoining outline borders and corners connect; positive spacing separates items. Each icon-only Item needs its own accessible name.'
		],
		examplePlan: [
			{
				title: 'Choose a view mode',
				demonstrates:
					'A labelled single-selection group with three values, bound state, and keyboard navigation.',
				priority: 'primary'
			},
			{
				title: 'Multiple formatting modes',
				demonstrates:
					'Multiple-selection value arrays with separated outline items and icon labels.',
				priority: 'secondary'
			},
			{
				title: 'Vertical connected group',
				demonstrates: 'Vertical orientation, zero-spacing edge treatment, and a disabled Item.',
				priority: 'edge-case'
			}
		]
	},
	tokenizer: {
		purpose:
			'Tokenizer combines selected values and a text combobox in one wrapping field, exposing each value as a removable token. It can filter known options, create free-text values, customize tokens and rows, and cap the selection count.',
		useWhen: [
			'Users repeatedly add and remove people, labels, recipients, or tags while keeping selections visible.',
			'Selection needs inline chips, search-as-you-type, and keyboard-efficient removal.',
			'Free-text creation is an intentional part of the data model.'
		],
		avoidWhen: [
			'Use Multi Selector when the closed control should summarize rather than expose every selected token.',
			'Use Checkbox List for a short fixed set that should remain fully visible.',
			'Use Selector or Combobox for one value.',
			'Do not enable `create` unless the backend accepts arbitrary strings.'
		],
		anatomy: [
			{
				name: 'Tokenizer.Root (`Tokenizer.Tokenizer` alias)',
				description:
					'Required composite containing selected Token controls, text combobox, live status region, and conditional listbox/create row.',
				required: true
			}
		],
		behavior: [
			'`value` is a bindable string array. `onValueChange` receives the array plus an add, remove, or create change record.',
			'Typing filters unselected options; Arrow Up/Down moves the active result, Enter adds it, and Escape closes the list.',
			'Backspace in an empty input removes the last token. Arrow Left enters token focus; Left/Right move between tokens; Backspace/Delete removes a focused token and restores useful focus.',
			'Added and removed values are announced politely. At `maxItems` the input disappears; `token` and `option` snippets customize presentation without changing values.'
		],
		examplePlan: [
			{
				title: 'Add reviewers',
				demonstrates:
					'Filtering known rich options, keyboard selection, inline removal, focus movement, bound values, and live announcements.',
				priority: 'primary'
			},
			{
				title: 'Create free-text tags',
				demonstrates:
					'The explicit create row, verbatim stored value, and custom token or option content.',
				priority: 'secondary'
			},
			{
				title: 'Selection limit',
				demonstrates: 'Input removal at `maxItems` and its return after deleting a token.',
				priority: 'edge-case'
			}
		]
	}
} satisfies ComponentGuides;
