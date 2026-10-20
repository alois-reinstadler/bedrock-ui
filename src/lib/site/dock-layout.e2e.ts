import { test, expect } from '../../../scripts/shared-browser-test';

test('docking workspace supports keyboard resize, tab switching, snapshots, and maximize', async ({
	page
}) => {
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/docs/components/dock-layout');
	const workspace = page.getByRole('region', { name: 'Project workspace', exact: true });
	await expect(workspace.getByText('A calmer place to work.')).toBeVisible();
	const divider = workspace.getByRole('slider');
	await divider.focus();
	await divider.press('ArrowRight');
	await expect(divider).toHaveAttribute('aria-valuenow', '63');
	await page.getByRole('button', { name: 'Save layout', exact: true }).click();
	await divider.focus();
	await divider.press('Shift+ArrowLeft');
	await expect(divider).toHaveAttribute('aria-valuenow', '53');
	await page.getByRole('button', { name: 'Load saved', exact: true }).click();
	await expect(divider).toHaveAttribute('aria-valuenow', '63');
	await workspace.getByRole('tablist').first().focus();
	await workspace.getByRole('tablist').first().press('ArrowRight');
	await expect(workspace.getByText('Working notes', { exact: true })).toBeVisible();
	await workspace.getByRole('button', { name: 'Maximize Notes', exact: true }).click();
	await expect(workspace.getByText('Working notes', { exact: true })).toBeVisible();
	await expect(workspace.getByRole('slider')).toHaveCount(0);
	await page.getByRole('button', { name: 'Restore panels', exact: true }).click();
	await expect(divider).toHaveAttribute('aria-valuenow', '63');
	await page.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(divider).toHaveAttribute('aria-valuenow', '62');
	await expect(workspace.getByText('A calmer place to work.')).toBeVisible();
	expect(errors).toEqual([]);
});

test('tabs can dock into a neighboring group and split with the keyboard', async ({ page }) => {
	await page.goto('/docs/components/dock-layout');
	const workspace = page.getByRole('region', { name: 'Project workspace', exact: true });
	await expect(workspace.getByRole('tab')).toHaveCount(3);
	const destination = workspace
		.getByRole('tablist')
		.filter({ has: page.getByRole('tab', { name: 'Checklist', exact: true }) });
	const strip = await destination.boundingBox();
	expect(strip).not.toBeNull();
	await workspace.getByRole('tab', { name: 'Notes', exact: true }).dragTo(destination, {
		targetPosition: { x: strip!.width - 4, y: strip!.height / 2 }
	});
	await expect(destination.getByRole('tab', { name: 'Notes', exact: true })).toBeVisible();
	await destination.focus();
	await destination.press('Alt+ArrowDown');
	await expect(workspace.getByRole('slider')).toHaveCount(2);
	await page.getByRole('button', { name: 'Reset', exact: true }).click();
	await expect(workspace.getByRole('slider')).toHaveCount(1);
});

test('workspace follows both themes and fits a narrow viewport with reduced motion', async ({
	page
}, testInfo) => {
	await page.goto('/docs/components/dock-layout');
	const workspace = page.getByRole('region', { name: 'Project workspace', exact: true });
	await expect(workspace.getByRole('tab')).toHaveCount(3);
	const colors: string[] = [];
	for (const dark of [false, true]) {
		await page.evaluate((value) => document.documentElement.classList.toggle('dark', value), dark);
		colors.push(await workspace.evaluate((node) => getComputedStyle(node).backgroundColor));
		await workspace.screenshot({
			path: testInfo.outputPath(dark ? 'dock-dark.png' : 'dock-light.png')
		});
	}
	expect(colors[0]).not.toBe(colors[1]);
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.setViewportSize({ width: 390, height: 844 });
	await page.reload();
	await expect(workspace.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical');
	await expect(workspace.getByRole('tab', { name: 'Notes', exact: true })).toBeVisible();
	await workspace.getByRole('tab', { name: 'Notes', exact: true }).click();
	await expect(workspace.getByText('Working notes', { exact: true })).toBeVisible();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
		true
	);
	await workspace.screenshot({ path: testInfo.outputPath('dock-mobile.png') });
});
