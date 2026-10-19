import { describe, expect, it, vi } from 'vitest';
import { createWorkspace } from './workspace.svelte.js';
import { createMailCommands } from './mail-commands.js';

describe('local mail commands', () => {
	it('restores each archived message to its original mailbox', () => {
		const workspace = createWorkspace();
		const messages = workspace.messages.slice(0, 2);
		const original = messages.map(({ id, mailbox }) => ({ id, mailbox }));
		const commands = createMailCommands(workspace, () => messages[0], vi.fn());
		commands.updateMessages(
			messages.map(({ id }) => id),
			'archive'
		);
		expect(messages.every(({ mailbox }) => mailbox === 'archive')).toBe(true);
		commands.restoreArchive();
		expect(messages.map(({ id, mailbox }) => ({ id, mailbox }))).toEqual(original);
		expect(workspace.undoArchive).toEqual([]);
	});
	it('updates a saved draft in place and replaces it with a sent message', () => {
		const workspace = createWorkspace();
		const announce = vi.fn();
		const original = workspace.messages[0];
		const commands = createMailCommands(workspace, () => original, announce);
		workspace.compose.to = 'reader@example.com, second@example.com';
		workspace.compose.subject = 'A reply';
		workspace.compose.replyId = original.id;
		workspace.compose.body = 'First version';
		commands.persistDraft();
		const id = workspace.compose.draftId;
		workspace.compose.body = 'Final version';
		commands.persistDraft();
		expect(workspace.messages.filter((message) => message.id === id)).toHaveLength(1);
		expect(workspace.messages.find((message) => message.id === id)?.body).toEqual([
			'Final version'
		]);
		commands.sendMessage();
		expect(workspace.messages.some((message) => message.id === id)).toBe(false);
		expect(workspace.messages[0]).toMatchObject({
			mailbox: 'sent',
			to: ['reader@example.com', 'second@example.com'],
			body: ['Final version']
		});
		expect(original.thread?.at(-1)?.body).toBe('Final version');
		expect(announce).toHaveBeenLastCalledWith(expect.stringContaining('No email was sent.'));
	});
});
