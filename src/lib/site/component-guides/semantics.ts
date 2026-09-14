/** Requirements describe the rendered role and the consumer's verification obligation. */
export const semantics: Record<string, string> = {
	accordion:
		'Each Trigger is a button with expanded state and a relationship to its Content; Item groups one disclosure.',
	alert:
		'Inline alert content stays in the document reading order; reserve assertive announcements for urgent, newly inserted errors.',
	'alert-dialog':
		'A modal alertdialog needs an accessible title, description, and an explicit cancel or confirm action.',
	'aspect-ratio':
		'The ratio wrapper has no interactive role; its media descendant supplies alternative text or captions.',
	'async-button':
		'The native action retains its accessible name while pending, and success or error must be announced once.',
	avatar:
		'A portrait is an image; when adjacent identity text repeats its meaning, use an empty alternative.',
	badge:
		'A badge is a text label, not a button; status must remain understandable without its tint.',
	banner:
		'The banner message belongs in reading order; its dismiss button needs a name specific to the message.',
	blockquote:
		'Quoted content uses blockquote semantics; attribution must remain associated in reading order.',
	breadcrumb:
		'Use a named navigation landmark and list; exactly one current destination has aria-current="page".',
	'button-group':
		'The visual group preserves individual button names; name the group if its shared purpose is not clear.',
	calendar:
		'The calendar grid exposes selected and unavailable dates; the current month and each date need unambiguous names.',
	card: 'A card groups related content; its title must use the correct heading level without making the whole surface interactive.',
	carousel:
		'Identify the carousel and slides, name previous/next controls, and provide a way to pause any automatic rotation.',
	chart:
		'Provide a textual summary and equivalent data table; a tooltip or colored path alone cannot convey the dataset.',
	chat: 'Message authors and order must be available as text; announce incoming messages without rereading the entire history.',
	checkbox:
		'The checkbox exposes checked, unchecked, or mixed state and has an associated visible label.',
	'checkbox-list':
		'Group related checkboxes under a common legend; each option retains an individual name and checked state.',
	citation:
		'A citation identifies its source with meaningful text; the destination must remain discoverable without hover.',
	'clickable-card':
		'The card action has one primary link or button role; do not nest competing interactive descendants inside it.',
	'code-block':
		'Code remains selectable text; the copy control names its action and confirms copy success without changing focus.',
	collapsible: 'The disclosure trigger exposes aria-expanded and identifies the region it opens.',
	'color-picker':
		'Expose the selected color as editable text; hue and saturation controls cannot rely on color perception alone.',
	combobox:
		'The input exposes combobox expanded state and identifies the option list; selected and active options are distinct.',
	command:
		'The search input names the command list; each selectable command has text and unavailable commands expose disabled state.',
	'context-menu':
		'Menu actions must also be reachable without a pointing device or a right-click gesture.',
	'data-table':
		'Preserve table headers and cell associations; sorting controls announce their direction and selection names the row.',
	'date-input':
		'Date segments form one labeled control; announce invalid values and associate format instructions.',
	'date-range-input':
		'Start and end dates have distinct names and a shared range label; report reversed ranges as errors.',
	'date-time-input':
		'Date and time portions have explicit labels; state the timezone whenever it changes the meaning.',
	dialog:
		'The modal dialog has an accessible title and description, with background content unavailable while open.',
	drawer:
		'The drawer retains dialog semantics, an accessible title, and a dismiss action independent of dragging.',
	'dropdown-menu':
		'The trigger exposes a menu relationship; menu items use action, checkbox, or radio roles as appropriate.',
	empty:
		'The empty state explains what is missing in text; its recovery action has a specific accessible name.',
	field:
		'Associate label, description, and errors with the actual input ID; use fieldset and legend for related controls.',
	'field-status':
		'The field status refers to its input through describedby; error text must identify a correction.',
	'file-input':
		'Name the native upload control and state accepted formats and limits before selection.',
	form: 'Use a real form and correctly associated labels; invalid fields expose aria-invalid and describedby errors.',
	heading:
		'Choose semantic heading level for document structure; visual size must not determine the level.',
	'hover-card':
		'Supplementary hover content must not contain the only copy of essential information or required actions.',
	icon: 'Decorative SVGs stay out of the accessibility tree; meaningful standalone icons require an equivalent text name.',
	'icon-button':
		'Every icon-only button has an action-specific accessible name; tooltip text alone is not sufficient.',
	indicator:
		'The indicator must have an adjacent text equivalent whenever its shape or color communicates state.',
	input: 'Associate a visible label with the native input; placeholders are examples, not labels.',
	'input-group':
		'The group preserves the input label and separately names any embedded action controls.',
	'input-otp':
		'Label the complete code input and describe the expected length; expose invalid codes in associated text.',
	item: 'Items remain a meaningful list or group; only actual destinations or actions become focusable.',
	kbd: 'Keyboard notation is instructional text; it does not itself register or override a shortcut.',
	label:
		'The label for attribute resolves to the intended control ID; clicking it focuses or toggles that control.',
	lightbox:
		'The image viewer is a named modal dialog; image alternatives, slide position, and close action remain available.',
	link: 'A link names its destination and uses href; identify downloads and unexpected context changes in visible text.',
	list: 'Use list semantics for ordered or unordered collections and preserve the intended reading order.',
	markdown:
		'Rendered headings, links, lists, tables and code preserve native semantics; authors remain responsible for image alternatives.',
	menubar:
		'The menubar exposes named menus and menuitems; pointer hover is not the only way to open them.',
	'metadata-list':
		'Each metadata term remains associated with its value using description-list semantics.',
	'multi-selector':
		'Selected options are programmatically available; removing a selection names the option being removed.',
	'native-select': 'The native select has a visible associated label and meaningful option text.',
	'navigation-menu':
		'Navigation destinations remain links inside a named navigation landmark; disclosure buttons expose expanded state.',
	'number-input':
		'The numeric control exposes its current value, minimum, maximum and step; increment actions have distinct names.',
	outline:
		'The outline is a named in-page navigation landmark; section links resolve to unique visible headings.',
	'overflow-list':
		'Collapsed items remain reachable through the overflow action; hidden duplicates do not enter the tab order.',
	pagination:
		'Pagination is named navigation; identify the current page and unavailable previous/next destinations.',
	'pdf-viewer':
		'Provide a download/open alternative; a canvas-rendered PDF alone is not an accessible document representation.',
	popover:
		'The trigger exposes expanded state; the non-modal surface has a name and a predictable dismissal path.',
	'power-search':
		'Name the search input, expose active results, and announce useful result counts and empty states.',
	progress:
		'Expose progressbar minimum, maximum and current value; indeterminate progress omits a false percentage.',
	'progressive-blur':
		'The blur is decorative and pointer-transparent; it must not conceal focused controls or carry essential information.',
	'radio-group':
		'Related radio options share a named radiogroup and expose exactly one checked option when a choice is required.',
	'range-calendar':
		'The grid distinguishes range start, end and included dates with text/state, not color alone.',
	resizable:
		'The separator exposes its orientation and current size; resizing has a keyboard equivalent.',
	'scroll-area':
		'Scroll content stays reachable by keyboard; edge blur is decorative and indicates only hidden overflow.',
	select:
		'The selection trigger has a name, expanded state and selected value; the list identifies available options.',
	'selectable-card':
		'The selectable card communicates checkbox or radio state; selection remains distinct from navigation.',
	selector:
		'Every choice has a name and selected state; a group label explains whether one or multiple choices are allowed.',
	separator:
		'A meaningful separator exposes its orientation; purely decorative dividers are hidden from assistive technology.',
	sheet: 'The side sheet retains named dialog semantics and an explicit close action.',
	sidebar:
		'The sidebar navigation has a name; active links expose current state and collapsed labels remain accessible.',
	skeleton:
		'Loading placeholders are decorative; announce loading with a separate status without reading every skeleton.',
	slider:
		'Each slider thumb exposes a name, current value, minimum and maximum; distinguish thumbs in a range.',
	sonner:
		'Toast messages announce outcomes with appropriate urgency; essential information cannot disappear without another way to retrieve it.',
	spinner:
		'The decorative spinner accompanies a named loading status; animation alone cannot communicate pending work.',
	'status-dot':
		'A status dot needs equivalent status text; color alone does not distinguish availability.',
	stepper:
		'The progress list identifies the current step; it does not validate fields or manage form submission.',
	switch:
		'The switch exposes checked state and a stable name describing the setting, independent of on/off state.',
	table: 'Use header cells with appropriate scope and a caption or accessible table name.',
	tabs: 'Each tab identifies its tabpanel; exactly one selected tab and its panel are exposed as active.',
	text: 'Choose the native text element for meaning; visual style must not introduce a false heading or interactive role.',
	textarea:
		'The multiline input has an associated label and linked instructions, limits, and errors.',
	thumbnail:
		'The thumbnail alternative describes meaningful image content; decorative duplicates use an empty alternative.',
	'time-input':
		'Hour and minute segments share a time label; clarify the 12/24-hour format and any timezone assumption.',
	timestamp:
		'Provide machine-readable datetime and an unambiguous full date when relative time alone is insufficient.',
	toggle: 'The toggle button exposes aria-pressed while keeping its action name stable.',
	'toggle-group':
		'Name the group and expose each pressed state; distinguish single-selection from multiple-selection behavior.',
	token:
		'A removable token names its remove action with the token value; decorative tokens remain ordinary text.',
	tokenizer:
		'The text input and selected tokens have a shared label; removing a token announces the removed value.',
	tooltip:
		'The tooltip supplements its trigger through a description; it does not replace an accessible name.',
	'video-player':
		'Playback controls have names and pressed/value states; meaningful speech needs captions and visual-only information needs an alternative.',
	'visually-hidden':
		'Hidden text remains in the accessibility tree; never place an independently focusable control in clipped content.'
};

export const keyboard: Record<string, string> = {
	accordion:
		'Tab reaches triggers; Enter or Space toggles. Check Arrow keys and Home/End against the configured orientation and loop setting.',
	calendar:
		'Arrow keys move dates; Home/End move within the week and Page Up/Down change months. Enter or Space selects an available date.',
	'range-calendar':
		'Arrow keys move dates; choose start and end with Enter or Space. Verify unavailable dates cannot complete the range.',
	slider:
		'Arrow keys change by step; Home/End reach bounds. Test each thumb independently with distinct names.',
	tabs: 'Arrow keys follow orientation; Home/End reach the first/last tab. With manual activation, Enter or Space activates the focused tab.',
	'radio-group':
		'Arrow keys move and select within the group; Tab enters or leaves the group without stopping on every option.',
	resizable:
		'Arrow keys resize the focused separator in its orientation; a pointer-only drag implementation is insufficient.',
	combobox:
		'Arrow keys move active options; Enter selects and Escape closes. Printable text continues editing the query.',
	select:
		'Enter or Space opens; Arrow keys move options, Enter selects, and Escape closes without an unintended selection.',
	'context-menu':
		'Verify Shift+F10 or the context-menu key opens from a focused target. Arrow keys navigate and Escape dismisses.',
	menubar:
		'Left/Right move between menus, Up/Down move items, Enter activates, and Escape returns to the owning trigger.',
	tooltip: 'Focus reveals the same help as hover; Escape dismisses without moving focus.',
	'scroll-area':
		'Tab reaches interactive content; when the viewport is focusable, arrow and page keys scroll without a trap.'
};
