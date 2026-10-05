/** Shared lifecycle for tool calls, tasks, and reasoning activity. */
export type ChatActivityStatus = 'pending' | 'running' | 'complete' | 'error';
export type ChatActivityStatusLabels = Partial<Record<ChatActivityStatus, string>>;
export const chatActivityStatusLabels: Record<ChatActivityStatus, string> = {
	pending: 'Pending',
	running: 'Running',
	complete: 'Completed',
	error: 'Failed'
};
