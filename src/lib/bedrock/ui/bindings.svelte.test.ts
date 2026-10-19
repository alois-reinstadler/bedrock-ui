import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { page as browserPage } from 'vitest/browser';
import Fixture from './bindings.test.svelte';

afterEach(() => cleanup());

describe('Bedrock public bindings', () => {
	it('updates parent values and refs, and accepts subsequent parent writes', async () => {
		const view = await render(Fixture);
		await expect.element(view.getByTestId('ref')).toHaveTextContent('INPUT');
		await view.getByRole('textbox', { name: 'Name', exact: true }).fill('After');
		await view.getByRole('textbox', { name: 'Notes', exact: true }).fill('Edited notes');
		await expect.element(view.getByTestId('name')).toHaveTextContent('After');
		await expect.element(view.getByTestId('notes')).toHaveTextContent('Edited notes');
		await view.getByRole('button', { name: 'Reset', exact: true }).click();
		await expect
			.element(view.getByRole('textbox', { name: 'Name', exact: true }))
			.toHaveValue('Reset');
		await expect
			.element(view.getByRole('textbox', { name: 'Notes', exact: true }))
			.toHaveValue('Reset notes');
	});

	it('propagates dialog open and close state through the facade', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: 'Open editor' }).click();
		await expect.element(view.getByTestId('open')).toHaveTextContent('true');
		await browserPage.getByRole('button', { name: 'Close editor' }).click();
		await expect.element(view.getByTestId('open')).toHaveTextContent('false');
	});

	it('propagates pagination changes and preserves defaults', async () => {
		const view = await render(Fixture);
		await view.getByRole('button', { name: /next/i }).click();
		await expect.element(view.getByTestId('page')).toHaveTextContent('2');
		await view.getByRole('button', { name: 'Reset', exact: true }).click();
		await expect.element(view.getByTestId('page')).toHaveTextContent('1');
		await expect.element(view.getByRole('button', { name: /previous/i })).toBeDisabled();
	});
});
