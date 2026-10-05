import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import { tick } from 'svelte';
import Fixture from './feedback.test.svelte';
import { canInspect, captureTarget, elementSelector, resolveTarget } from './target.js';

const storageKey = 'bedrock:feedback-test:v1';
beforeEach(() => localStorage.removeItem(storageKey));
afterEach(async () => {
	await cleanup();
	localStorage.removeItem(storageKey);
});

const button = (name: string) => page.getByRole('button', { name, exact: true });
async function pageNote(comment: string) {
	await button('Page note').click();
	await page.getByRole('textbox', { name: 'What would you like to change?' }).fill(comment);
	await button('Add note').click();
	await button('Preview notes').click();
}

describe('Native Bedrock feedback', () => {
	it('selects a real button without activating it, persists a note and restores it on remount', async () => {
		const view = await render(Fixture, { storageKey });
		await button('Feedback').click();
		await button('Select element').click();
		await button('Target action').click();
		await expect.element(view.getByTestId('activations')).toHaveTextContent('0');
		await page
			.getByRole('textbox', { name: 'What would you like to change?' })
			.fill('Make this clearer');
		await button('Add note').click();
		await button('Preview notes').click();
		await expect.element(view.getByTestId('annotations')).toHaveTextContent('Make this clearer');
		await button('Feedback settings').click();
		await expect.element(page.getByRole('button', { name: /^Export JSON/ })).toBeVisible();
		expect(JSON.parse(localStorage.getItem(storageKey)!).annotations[0].target.selector).toBe(
			'[data-feedback-id="fixture-button"]'
		);
		await cleanup();
		await render(Fixture, { storageKey });
		await page.getByRole('button', { name: /^Feedback$/ }).click();
		await button('Preview notes').click();
		await expect.element(page.getByText('Make this clearer', { exact: true })).toBeVisible();
	});
	it('edits, resolves, reopens and deletes without losing the original target', async () => {
		await render(Fixture);
		await button('Feedback').click();
		await pageNote('Original note');
		await button('Edit').click();
		await page
			.getByRole('textbox', { name: 'What would you like to change?' })
			.fill('Updated note');
		await button('Save note').click();
		await button('Preview notes').click();
		await button('Resolve').click();
		await button('Resolved').click();
		await expect.element(page.getByText('Updated note', { exact: true })).toBeVisible();
		await button('Reopen').click();
		await button('Open').click();
		await button('Delete').click();
		await expect
			.element(page.getByText('No notes on this page yet.', { exact: true }))
			.toBeVisible();
	});
	it('isolates routes, cancels an unsaved selection on navigation and keeps saved notes', async () => {
		const view = await render(Fixture);
		await button('Feedback').click();
		await pageNote('First page feedback');
		await button('Page note').click();
		await page.getByRole('textbox', { name: 'What would you like to change?' }).fill('Unsaved');
		await view.getByRole('button', { name: 'Change route' }).click();
		await expect.element(button('Page note')).toBeVisible();
		await expect
			.element(page.getByText('First page feedback', { exact: true }))
			.not.toBeInTheDocument();
		await pageNote('Second page feedback');
		await view.getByRole('button', { name: 'Change route' }).click();
		await button('Preview notes').click();
		await expect.element(page.getByText('First page feedback', { exact: true })).toBeVisible();
		await expect.element(view.getByTestId('annotations')).toHaveTextContent('Second page feedback');
	});
	it('keeps customer notes on submission failure and supports retry with a detached payload', async () => {
		const view = await render(Fixture, { mode: 'review', delivery: true });
		await button('Leave feedback').click();
		await pageNote('Please change the photo');
		await button('Feedback settings').click();
		await button('Send feedback').click();
		await expect.element(page.getByText(/Feedback could not be sent/)).toBeVisible();
		await expect
			.element(view.getByTestId('annotations'))
			.toHaveTextContent('Please change the photo');
		await button('Send feedback').click();
		await expect.element(page.getByText(/Feedback sent\./)).toBeVisible();
		await expect.element(view.getByTestId('received')).toHaveTextContent('Please change the photo');
	});
	it('removes capture listeners and its portal when disabled or unmounted', async () => {
		const view = await render(Fixture);
		await button('Feedback').click();
		await button('Select element').click();
		await view.getByRole('button', { name: 'Toggle feedback' }).click();
		await button('Target action').click();
		await expect.element(view.getByTestId('activations')).toHaveTextContent('1');
		expect(document.querySelector('[data-feedback-ui]')).toBeNull();
		await cleanup();
		expect(document.querySelector('[data-feedback-ui]')).toBeNull();
	});
	it('supports keyboard selection and focuses the composer', async () => {
		const view = await render(Fixture);
		await button('Feedback').click();
		await button('Select element').click();
		const target = document.querySelector<HTMLElement>('[data-feedback-id="fixture-button"]')!;
		target.focus();
		target.dispatchEvent(
			new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
		);
		await tick();
		await expect
			.element(page.getByRole('textbox', { name: 'What would you like to change?' }))
			.toHaveFocus();
		await expect.element(view.getByTestId('activations')).toHaveTextContent('0');
		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		await expect.element(button('Page note')).toBeVisible();
	});
	it('excludes private descendants and form content even when capturing their ancestor', async () => {
		await render(Fixture);
		const parent = document.querySelector('#private-parent')!;
		const target = captureTarget(parent, 'review');
		expect(target.text).toBe('Public text');
		expect(target.styles).toBeUndefined();
		expect(canInspect(parent.querySelector('textarea')!)).toBe(false);
		expect(canInspect(parent.querySelector('span')!)).toBe(false);
		expect(canInspect(parent, '[')).toBe(false);
		const host = document.createElement('div');
		parent.appendChild(host);
		const shadow = host.attachShadow({ mode: 'open' });
		shadow.innerHTML = '<button>Shadow target</button>';
		expect(canInspect(shadow.querySelector('button')!)).toBe(false);
	});
	it('escapes stable identifiers and refuses to reattach a changed structural target', async () => {
		await render(Fixture);
		const element = document.querySelector('#private-parent')!;
		element.setAttribute('data-feedback-id', 'odd"id:1');
		expect(document.querySelector(elementSelector(element))).toBe(element);
		const stable = captureTarget(element, 'developer');
		element.textContent = 'Changed copy';
		expect(resolveTarget(stable)).toBe(element);
		element.removeAttribute('id');
		element.removeAttribute('data-feedback-id');
		const structural = captureTarget(element, 'review');
		element.textContent = 'Different element';
		expect(resolveTarget(structural)).toBeNull();
	});
	it('reports corrupt drafts while allowing a fresh session', async () => {
		localStorage.setItem(storageKey, '{bad json');
		await render(Fixture, { storageKey });
		await button('Feedback').click();
		await expect
			.element(page.getByRole('alert'))
			.toHaveTextContent('Saved drafts could not be loaded');
		await pageNote('Recovered note');
		expect(JSON.parse(localStorage.getItem(storageKey)!).annotations).toHaveLength(1);
	});
});
