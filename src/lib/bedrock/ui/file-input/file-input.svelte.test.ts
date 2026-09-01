import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import Fixture from './file-input.test.svelte';

afterEach(() => cleanup());

function choose(input: HTMLInputElement, files: File[]) {
	const transfer = new DataTransfer();
	for (const file of files) transfer.items.add(file);
	Object.defineProperty(input, 'files', { configurable: true, value: transfer.files });
	input.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('FileInput', () => {
	it('appends picked files and removes a labelled row', async () => {
		const view = await render(Fixture);
		const section = view.container.querySelector('[data-testid="multiple"]')!;
		const input = section.querySelector<HTMLInputElement>('input[type="file"]')!;
		choose(input, [new File(['png'], 'face.png', { type: 'image/png' })]);
		await Promise.resolve();

		expect(section.querySelector('[data-testid="multiple-value"]')?.textContent).toBe(
			'old.txt,face.png'
		);
		const remove = section.querySelector<HTMLButtonElement>('[aria-label="Remove face.png"]');
		expect(remove).not.toBeNull();
		remove?.click();
		await Promise.resolve();
		expect(section.querySelector('[data-testid="multiple-value"]')?.textContent).toBe('old.txt');
	});

	it('reports type and size rejections and shows FieldStatus', async () => {
		const view = await render(Fixture);
		const section = view.container.querySelector('[data-testid="multiple"]')!;
		const input = section.querySelector<HTMLInputElement>('input[type="file"]')!;
		choose(input, [
			new File(['text'], 'notes.txt', { type: 'text/plain' }),
			new File(['oversized'], 'large.png', { type: 'image/png' })
		]);
		await Promise.resolve();

		expect(section.querySelector('[data-testid="rejections"]')?.textContent).toBe('2');
		expect(section.querySelector('[data-slot="field-status"]')?.textContent).toContain(
			'unsupported type'
		);
		expect(section.querySelector('[data-slot="field-status"]')?.textContent).toContain('too large');
	});

	it('replaces the selection when multiple is false', async () => {
		const view = await render(Fixture);
		const section = view.container.querySelector('[data-testid="single"]')!;
		choose(section.querySelector<HTMLInputElement>('input[type="file"]')!, [
			new File(['second'], 'second.txt', { type: 'text/plain' })
		]);
		await Promise.resolve();

		expect(section.querySelector('[data-testid="single-value"]')?.textContent).toBe('second.txt');
	});

	it('renders the dropzone prompt', async () => {
		const view = await render(Fixture);
		expect(
			view.container.querySelector('[data-testid="dropzone"] [data-slot="file-input-dropzone"]')
				?.textContent
		).toContain('Drag and drop files here, or browse');
	});
});
