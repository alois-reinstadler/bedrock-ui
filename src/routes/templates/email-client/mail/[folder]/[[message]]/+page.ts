import { error } from '@sveltejs/kit';
import { mailboxes, messages } from '#lib/templates/email-client/data.js';
export function entries() {
	return mailboxes.flatMap(({ id }) => [
		{ folder: id, message: '' },
		...messages.map((message) => ({ folder: id, message: message.id }))
	]);
}
export function load({ params }: { params: { folder: string; message?: string } }) {
	if (!mailboxes.some((folder) => folder.id === params.folder)) error(404, 'Mailbox not found');
	if (params.message && !messages.some((message) => message.id === params.message))
		error(404, 'Message not found');
}
