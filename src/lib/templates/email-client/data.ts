export type MailboxId = 'inbox' | 'starred' | 'drafts' | 'sent' | 'archive';

export type MailMessage = {
	id: string;
	mailbox: MailboxId;
	from: {
		name: string;
		email: string;
		initials: string;
		tone: string;
	};
	to: string[];
	subject: string;
	preview: string;
	body: string[];
	time: string;
	dateTime: string;
	unread: boolean;
	starred: boolean;
	hasAttachment?: boolean;
	label?: string;
};

export const mailboxes: Array<{
	id: MailboxId;
	label: string;
	count?: number;
}> = [
	{ id: 'inbox', label: 'Inbox' },
	{ id: 'starred', label: 'Starred' },
	{ id: 'drafts', label: 'Drafts' },
	{ id: 'sent', label: 'Sent' },
	{ id: 'archive', label: 'Archive' }
];

export const messages: MailMessage[] = [
	{
		id: 'marin-launch-notes',
		mailbox: 'inbox',
		from: {
			name: 'Marin Ortiz',
			email: 'marin@northstar.example',
			initials: 'MO',
			tone: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-200'
		},
		to: ['You', 'Product team'],
		subject: 'Launch notes for tomorrow',
		preview: 'I folded the final review comments into the rollout plan. The only open item is…',
		body: [
			'Hi team,',
			'I folded the final review comments into the rollout plan. The only open item is the wording for the migration banner; everything else is ready for tomorrow morning.',
			'I also moved the support handoff thirty minutes earlier so we have a calm window before traffic picks up. The updated checklist is attached below.',
			'Could you give the banner copy one final read before 16:00?',
			'Marin'
		],
		time: '10:42',
		dateTime: '2026-09-14T10:42:00Z',
		unread: true,
		starred: true,
		hasAttachment: true,
		label: 'Launch'
	},
	{
		id: 'eli-field-recordings',
		mailbox: 'inbox',
		from: {
			name: 'Eli Navarro',
			email: 'eli@sonora.example',
			initials: 'EN',
			tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
		},
		to: ['You'],
		subject: 'Field recordings from Skye',
		preview: 'The morning tide session came out beautifully. I uploaded a clean stereo set…',
		body: [
			'Hello,',
			'The morning tide session came out beautifully. I uploaded a clean stereo set plus a smaller selection with the wind softened for the film mix.',
			'Track seven has the long gull pass we talked about. Start there if you only have a minute.',
			'All best, Eli'
		],
		time: '09:18',
		dateTime: '2026-09-14T09:18:00Z',
		unread: true,
		starred: false,
		hasAttachment: true
	},
	{
		id: 'june-research-window',
		mailbox: 'inbox',
		from: {
			name: 'June Park',
			email: 'june@wayfinder.example',
			initials: 'JP',
			tone: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-200'
		},
		to: ['You', 'Research circle'],
		subject: 'Research window next week',
		preview: 'Would Tuesday or Wednesday be better for the synthesis session? I have held…',
		body: [
			'Hi there,',
			'Would Tuesday or Wednesday be better for the synthesis session? I have held both afternoons for now.',
			'The interviews surfaced a useful tension between speed and confidence. I would like us to map that before we lock the next prototype.',
			'June'
		],
		time: 'Yesterday',
		dateTime: '2026-09-13T15:36:00Z',
		unread: true,
		starred: false,
		label: 'Research'
	},
	{
		id: 'theo-studio-key',
		mailbox: 'inbox',
		from: {
			name: 'Theo Bennett',
			email: 'theo@workshop.example',
			initials: 'TB',
			tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200'
		},
		to: ['You'],
		subject: 'Studio key for Sunday',
		preview: 'The front desk will be closed, so I left a guest key in the lockbox…',
		body: [
			'Hey,',
			'The front desk will be closed, so I left a guest key in the lockbox beside the loading entrance. Your code is in the calendar note.',
			'The west room is yours from noon. I put fresh paper on the large table.',
			'Enjoy the quiet, Theo'
		],
		time: 'Yesterday',
		dateTime: '2026-09-13T11:05:00Z',
		unread: false,
		starred: true
	},
	{
		id: 'mina-weekly-digest',
		mailbox: 'inbox',
		from: {
			name: 'Mina Shah',
			email: 'mina@commonthread.example',
			initials: 'MS',
			tone: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200'
		},
		to: ['You'],
		subject: 'A slower kind of weekly digest',
		preview: 'Three thoughtful things for the weekend: a tiny garden, a patient archive…',
		body: [
			'Good morning,',
			'Three thoughtful things for the weekend: a tiny garden built above a train depot, a patient archive of disappearing shop signs, and a conversation about designing software that knows when to be quiet.',
			'I hope one of them gives you a new thread to follow.',
			'Mina'
		],
		time: 'Fri',
		dateTime: '2026-09-11T07:30:00Z',
		unread: false,
		starred: false,
		label: 'Reading'
	},
	{
		id: 'arden-contract',
		mailbox: 'archive',
		from: {
			name: 'Arden Cole',
			email: 'arden@cedarandco.example',
			initials: 'AC',
			tone: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200'
		},
		to: ['You'],
		subject: 'Signed contract and next steps',
		preview: 'Everything is signed on our side. Let us begin with the workshop on the 22nd…',
		body: [
			'Hello,',
			'Everything is signed on our side. Let us begin with the workshop on the 22nd, then share the first working session with the wider group the following week.',
			'Looking forward to building this together.',
			'Arden'
		],
		time: 'Sep 8',
		dateTime: '2026-09-08T13:14:00Z',
		unread: false,
		starred: false
	},
	{
		id: 'nora-prototype',
		mailbox: 'sent',
		from: {
			name: 'You',
			email: 'alex@lumenmail.example',
			initials: 'AL',
			tone: 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200'
		},
		to: ['Nora Foster'],
		subject: 'Re: Prototype walkthrough',
		preview: 'Thursday at 14:30 works well. I will send a short agenda beforehand…',
		body: [
			'Hi Nora,',
			'Thursday at 14:30 works well. I will send a short agenda beforehand so we can spend most of the call in the prototype.',
			'See you then, Alex'
		],
		time: 'Sep 7',
		dateTime: '2026-09-07T16:03:00Z',
		unread: false,
		starred: false
	}
];

export const labels = [
	{ name: 'Launch', color: 'bg-violet-500' },
	{ name: 'Research', color: 'bg-sky-500' },
	{ name: 'Reading', color: 'bg-rose-500' }
];
