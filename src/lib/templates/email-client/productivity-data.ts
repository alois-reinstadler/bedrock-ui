export type CalendarEvent = {
	id: string;
	title: string;
	date: string;
	start: string;
	end: string;
	location: string;
	note: string;
	category: 'Team' | 'Focus' | 'Personal';
};
export type WorkspaceTask = {
	important?: boolean;
	id: string;
	title: string;
	due: string;
	project: string;
	completed: boolean;
	note: string;
};
export const demoToday = '2026-09-14';
export const calendarEvents: CalendarEvent[] = [
	{
		id: 'launch',
		title: 'Launch readiness',
		date: demoToday,
		start: '11:30',
		end: '12:00',
		location: 'Studio · Room 2',
		note: 'Review banner copy and support handoff with Marin and Ellis.',
		category: 'Team'
	},
	{
		id: 'prototype',
		title: 'Prototype review',
		date: demoToday,
		start: '14:00',
		end: '15:00',
		location: 'Design studio',
		note: 'A quiet hour for the next iteration. Bring the onboarding notes.',
		category: 'Focus'
	},
	{
		id: 'walk',
		title: 'Afternoon walk',
		date: demoToday,
		start: '16:30',
		end: '17:00',
		location: 'Riverside path',
		note: 'Leave room to reset before the end of the day.',
		category: 'Personal'
	},
	{
		id: 'research',
		title: 'Research synthesis',
		date: '2026-09-15',
		start: '10:00',
		end: '11:00',
		location: 'Research room',
		note: 'Compare interview themes with June and the product team.',
		category: 'Team'
	},
	{
		id: 'planning',
		title: 'Weekly planning',
		date: '2026-09-17',
		start: '09:30',
		end: '10:15',
		location: 'Studio · Room 1',
		note: 'Choose three outcomes for next week.',
		category: 'Team'
	},
	{
		id: 'deep-work',
		title: 'Writing time',
		date: '2026-09-18',
		start: '09:00',
		end: '11:00',
		location: 'Home office',
		note: 'Finish the field notes article.',
		category: 'Focus'
	},
	{
		id: 'handoff',
		title: 'Design handoff',
		date: '2026-09-22',
		start: '13:00',
		end: '14:00',
		location: 'Design studio',
		note: 'Walk through the final responsive screens.',
		category: 'Team'
	}
];
export const workspaceTasks: WorkspaceTask[] = [
	{
		id: 'banner',
		title: 'Review migration banner copy',
		due: demoToday,
		project: 'Launch',
		completed: false,
		note: 'Marin needs the final wording before 16:00.'
	},
	{
		id: 'support',
		title: 'Share the support handoff',
		due: demoToday,
		project: 'Launch',
		completed: false,
		note: 'Include the rollout checklist and contact details.'
	},
	{
		id: 'notes',
		title: 'Summarize interview notes',
		due: '2026-09-15',
		project: 'Research',
		completed: false,
		note: 'Group observations by customer goal.'
	},
	{
		id: 'travel',
		title: 'Reserve a room for the team retreat',
		due: '2026-09-18',
		project: 'Personal',
		completed: false,
		note: 'Check availability for six people.'
	},
	{
		id: 'invoice',
		title: 'Confirm the workshop invoice',
		due: '2026-09-13',
		project: 'Operations',
		completed: true,
		note: 'The updated billing address has been approved.'
	}
];
