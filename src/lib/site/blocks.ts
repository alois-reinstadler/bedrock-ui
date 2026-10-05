export type BlockSlug = 'authentication-panel' | 'settings-section';

export type BlockProperty = {
	name: string;
	type: string;
	kind?: 'prop' | 'snippet' | 'callback';
	required?: boolean;
	default: string;
	description: string;
};

export type BlockDoc = {
	slug: BlockSlug;
	title: string;
	description: string;
	category: 'forms' | 'settings';
	importName: string;
	components: string[];
	anatomy: Array<{ name: string; description: string }>;
	bestPractices: string[];
	properties: BlockProperty[];
};

export const blocks: BlockDoc[] = [
	{
		slug: 'authentication-panel',
		title: 'Authentication Panel',
		description: 'A focused sign-in surface with recovery, validation, and alternate actions.',
		category: 'forms',
		importName: 'AuthenticationPanel',
		components: ['Card', 'Field', 'Input', 'Button'],
		anatomy: [
			{ name: 'Header', description: 'Sets task context with a short title and supporting copy.' },
			{ name: 'Credentials', description: 'Groups labeled identity and secret fields.' },
			{ name: 'Primary action', description: 'Submits credentials and owns pending feedback.' },
			{ name: 'Recovery action', description: 'Provides a clear, lower-emphasis escape route.' }
		],
		bestPractices: [
			'Keep the panel focused on one authentication task. Native required/email validation focuses invalid fields before submission.',
			'Submission results use a polite status region. Service errors preserve credentials for retry; success clears the password.',
			'Preserve the entered identity when authentication fails.'
		],
		properties: [
			{ name: 'title', type: 'string', default: "'Sign in'", description: 'Task heading.' },
			{
				name: 'pending',
				type: 'boolean',
				default: 'false',
				description: 'Disables duplicate submission and updates the primary action.'
			},
			{
				name: 'onSubmit',
				kind: 'callback',
				type: '(values: { email: string; password: string }) => void | Promise<void>',
				default: '—',
				required: true,
				description: 'Receives validated credential values.'
			},
			{
				name: 'recoveryHref',
				type: 'string',
				default: 'undefined',
				description: 'Shows the recovery action when provided.'
			}
		]
	},
	{
		slug: 'settings-section',
		title: 'Settings Section',
		description: 'A named group of related preferences with explicit save feedback.',
		category: 'settings',
		importName: 'SettingsSection',
		components: ['Card', 'Button'],
		anatomy: [
			{ name: 'Section header', description: 'Names the preference domain and its consequences.' },
			{
				name: 'Preference rows',
				description: 'Pair each control with a durable label and explanation.'
			},
			{
				name: 'Save region',
				description: 'Communicates dirty, pending, success, and error states.'
			}
		],
		bestPractices: [
			'Group only preferences that users understand as one decision area. Label every child control; the block names its fieldset and announces save results.',
			'Say when a change takes effect and whether it affects other people.',
			'Avoid autosave when a change is destructive or difficult to reverse.'
		],
		properties: [
			{
				name: 'title',
				type: 'string',
				default: '—',
				required: true,
				description: 'Section heading.'
			},
			{
				name: 'description',
				type: 'string',
				default: 'undefined',
				description: 'Scope and consequence of the settings.'
			},
			{
				name: 'dirty',
				type: 'boolean',
				default: 'false',
				description: 'Controls unsaved-change feedback.'
			},
			{
				name: 'children',
				kind: 'snippet',
				type: 'Snippet',
				default: '—',
				required: true,
				description: 'Labeled preference controls. Values remain owned by the caller.'
			},
			{
				name: 'onSave',
				kind: 'callback',
				type: '() => void | Promise<void>',
				default: '—',
				required: true,
				description: 'Persists all values in the section.'
			}
		]
	}
];

export function getBlock(slug: string) {
	return blocks.find((block) => block.slug === slug);
}
