import { getContext, setContext } from 'svelte';
import { messages, type MailMessage } from './data.js';
import {
	calendarEvents,
	workspaceTasks,
	demoToday,
	type CalendarEvent
} from './productivity-data.js';

export function createWorkspace() {
	const state = $state({
		messages: structuredClone(messages),
		events: structuredClone(calendarEvents),
		tasks: structuredClone(workspaceTasks),
		query: '',
		status: '',
		mailDensity: 'comfortable' as 'comfortable' | 'compact',
		compose: {
			open: false,
			mode: 'new' as 'new' | 'reply' | 'reply-all' | 'forward',
			to: '',
			subject: '',
			body: '',
			draftId: null as string | null,
			replyId: null as string | null
		},
		eventDraft: null as { subject: string; note: string } | null,
		taskFilter: 'Today' as 'All' | 'Today' | 'Upcoming' | 'Important' | 'Completed',
		selectedProject: 'All projects',
		selectedDate: demoToday,
		calendarCategories: ['Team', 'Focus', 'Personal'] as CalendarEvent['category'][],
		localMessageId: null as string | null,
		undoArchive: [] as Array<{ id: string; mailbox: MailMessage['mailbox'] }>
	});
	return state;
}
export type Workspace = ReturnType<typeof createWorkspace>;
const key = Symbol('lumen-workspace');
export function provideWorkspace() {
	return setContext(key, createWorkspace());
}
export function useWorkspace(): Workspace {
	return getContext(key);
}
export const mailBase = '/templates/email-client';
export function messageHref(message: MailMessage, folder = message.mailbox) {
	return messages.some((item) => item.id === message.id)
		? `${mailBase}/mail/${folder}/${message.id}`
		: `${mailBase}/mail/${folder}`;
}
