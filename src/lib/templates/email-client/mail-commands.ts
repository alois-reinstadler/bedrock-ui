import type { Workspace } from './workspace.svelte.js';
import type { MailMessage } from './data.js';

/** Local demo mutations; navigation and focus remain in the view. */
export function createMailCommands(
	workspace: Workspace,
	getCurrentMessage: () => MailMessage | undefined,
	announce: (message: string) => void
) {
	function toggleStar(id: string) {
		const message = workspace.messages.find((item) => item.id === id);
		if (!message) return;
		message.starred = !message.starred;
		announce(`${message.subject} ${message.starred ? 'starred' : 'unstarred'}`);
	}

	function updateMessages(selectedIds: string[], action: 'read' | 'archive' | 'delete') {
		if (action === 'delete') {
			workspace.messages = workspace.messages.filter(
				(message) => !selectedIds.includes(message.id)
			);
			announce(`${selectedIds.length} messages deleted locally`);
		} else if (action === 'archive') {
			workspace.undoArchive = workspace.messages
				.filter((message) => selectedIds.includes(message.id))
				.map((message) => ({ id: message.id, mailbox: message.mailbox }));
			for (const message of workspace.messages) {
				if (selectedIds.includes(message.id)) message.mailbox = 'archive';
			}
			announce(`${selectedIds.length} messages archived`);
		} else {
			for (const message of workspace.messages) {
				if (selectedIds.includes(message.id)) message.unread = false;
			}
			announce(`${selectedIds.length} messages marked as read`);
		}
		workspace.localMessageId = null;
	}

	function composedBody() {
		const currentMessage = getCurrentMessage();
		return workspace.compose.mode === 'forward' && currentMessage
			? `${workspace.compose.body}\n\nForwarded message from ${currentMessage.from.name} <${currentMessage.from.email}>:\n${currentMessage.body.join('\n')}`
			: workspace.compose.body;
	}
	function persistDraft() {
		const draft = {
			id: workspace.compose.draftId ?? `draft-${Date.now()}`,
			mailbox: 'drafts' as const,
			from: {
				name: 'You',
				email: 'alex@lumenmail.example',
				initials: 'AL',
				tone: 'bg-primary text-primary-foreground'
			},
			to: workspace.compose.to
				.split(',')
				.map((recipient) => recipient.trim())
				.filter(Boolean),
			subject: workspace.compose.subject || '(No subject)',
			preview: workspace.compose.body,
			body: composedBody().split('\n'),
			time: 'Draft',
			dateTime: new Date().toISOString(),
			unread: false,
			starred: false
		};
		workspace.messages = workspace.compose.draftId
			? workspace.messages.map((message) =>
					message.id === workspace.compose.draftId ? draft : message
				)
			: [draft, ...workspace.messages];
		workspace.compose.draftId = draft.id;
		announce('Draft saved locally. Find it in Drafts.');
	}
	function restoreArchive() {
		for (const item of workspace.undoArchive) {
			const message = workspace.messages.find((message) => message.id === item.id);
			if (message) message.mailbox = item.mailbox;
		}
		announce(`Restored ${workspace.undoArchive.length} messages.`);
		workspace.undoArchive = [];
	}

	function sendMessage() {
		if (workspace.compose.draftId)
			workspace.messages = workspace.messages.filter(
				(message) => message.id !== workspace.compose.draftId
			);
		if (workspace.compose.replyId) {
			const original = workspace.messages.find(
				(message) => message.id === workspace.compose.replyId
			);
			if (original)
				original.thread = [
					...(original.thread ?? []),
					{ author: 'You', time: 'Just now', body: workspace.compose.body }
				];
		}
		workspace.messages.unshift({
			id: `local-${Date.now()}`,
			mailbox: 'sent',
			from: {
				name: 'You',
				email: 'alex@lumenmail.example',
				initials: 'AL',
				tone: 'bg-primary text-primary-foreground'
			},
			to: workspace.compose.to
				.split(',')
				.map((recipient) => recipient.trim())
				.filter(Boolean),
			subject: workspace.compose.subject,
			preview: workspace.compose.body,
			body: composedBody().split('\n').filter(Boolean),
			time: 'Now',
			dateTime: new Date().toISOString(),
			unread: false,
			starred: false
		});
		announce(`Demo message to ${workspace.compose.to} saved in Sent. No email was sent.`);
	}
	return { toggleStar, updateMessages, persistDraft, restoreArchive, sendMessage };
}
