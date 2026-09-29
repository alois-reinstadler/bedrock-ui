import { describe, expect, it } from 'vitest';
import { chatSourceHref, chatPromptToken, chatChangeDiff } from './agent-types';

describe('chat sources', () => {
	it('rejects executable, protocol-relative, and obfuscated URLs', () => {
		for (const value of [
			'javascript:alert(1)',
			'data:text/html,test',
			'//evil.test',
			'/\\evil.test',
			'https:\n//example.com',
			'http://'
		])
			expect(chatSourceHref(value)).toBeUndefined();
	});
	it('allows safe web and local references', () => {
		expect(chatSourceHref('https://example.com/docs')).toBe('https://example.com/docs');
		expect(chatSourceHref('/docs/chat')).toBe('/docs/chat');
		expect(chatSourceHref('#source-1')).toBe('#source-1');
	});
});
describe('prompt tokens', () => {
	it('finds the active mention or command at the caret', () => {
		expect(chatPromptToken('Review @rel next', 11)).toEqual({
			trigger: '@',
			query: 'rel',
			start: 7,
			end: 11
		});
		expect(chatPromptToken('/sum', 4)?.trigger).toBe('/');
	});
	it('ignores emails, URLs, selections and completed tokens', () => {
		for (const value of ['user@example.com', 'https://example.com', '@source '])
			expect(chatPromptToken(value, value.length)).toBeNull();
		expect(chatPromptToken('@source', 0, 7)).toBeNull();
	});
});
it('formats additions, removals and missing final newlines for review', () => {
	expect(chatChangeDiff({ before: '', after: 'hello\n' })).toBe(
		'--- before\n+++ after\n@@ -0,0 +1,1 @@\n+hello'
	);
	expect(chatChangeDiff({ before: 'old', after: 'new' })).toContain(
		'-old\n\\ No newline at end of file\n+new\n\\ No newline at end of file'
	);
});
