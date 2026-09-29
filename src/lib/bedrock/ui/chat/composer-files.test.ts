import { describe, expect, it } from 'vitest';
import { selectComposerFiles } from './composer-files';
const file = (name: string, type = 'text/plain', bytes = 4) =>
	new File(['x'.repeat(bytes)], name, { type, lastModified: 1 });

describe('composer file intake', () => {
	it('accepts MIME wildcards and case-insensitive extensions, rejecting types and sizes', () => {
		const image = file('photo.png', 'image/png');
		const pdf = file('BRIEF.PDF', '');
		const result = selectComposerFiles(
			[image, pdf, file('bad.exe'), file('big.png', 'image/png', 9)],
			[],
			{ accept: ' image/*, .pdf ', maxFileSize: 8 }
		);
		expect(result.files).toEqual([image, pdf]);
		expect(result.rejected.map((item) => item.reason)).toEqual(['type', 'size']);
	});
	it('counts existing files, skips duplicates, and limits the combined queue', () => {
		const existing = file('first.txt');
		const next = file('second.txt');
		const result = selectComposerFiles([existing, next, file('third.txt')], [existing], {
			maxFiles: 2
		});
		expect(result.files).toEqual([existing, next]);
		expect(result.rejected.map((item) => item.file.name)).toEqual(['third.txt']);
		expect(selectComposerFiles([existing], [existing], { maxFiles: 1 }).rejected).toEqual([]);
	});
	it('single-file mode replaces the selection with the first valid file', () => {
		const next = file('next.txt');
		const result = selectComposerFiles(
			[file('bad.png', 'image/png'), next, file('extra.txt')],
			[file('old.txt')],
			{ multiple: false, accept: '.txt' }
		);
		expect(result.files).toEqual([next]);
		expect(result.rejected.map((item) => item.reason)).toEqual(['type', 'count']);
	});
	it('keeps existing selections when every incoming file is rejected', () => {
		const existing = [file('old.txt')];
		expect(selectComposerFiles([file('new.txt')], existing, { maxFiles: 0 }).files).toBe(existing);
		expect(selectComposerFiles([], existing).files).toBe(existing);
	});
});
