import { feedbackGuides } from './component-guides/feedback';
import type { ComponentGuide } from './component-guides/types';
import type { ComponentDoc } from './registry';

export type ToolDoc = {
	slug: string;
	title: string;
	description: string;
	keywords: string;
	/** Implementation family used by the shared examples and API reference. */
	component: ComponentDoc;
	guide: ComponentGuide;
};

export const tools: ToolDoc[] = [
	{
		slug: 'page-annotations',
		guide: feedbackGuides.feedback,
		title: 'Page annotations',
		description:
			'Inspect a live page, attach notes, review changes, and export actionable annotations.',
		keywords: 'feedback inspector customer developer review notes export',
		component: {
			slug: 'feedback',
			title: 'Page annotations',
			description:
				'Inspect a live page, attach notes, review changes, and export actionable annotations.',
			category: 'overlay',
			importName: 'PageAnnotations'
		}
	}
];

export function getTool(slug: string) {
	return tools.find((tool) => tool.slug === slug);
}

export function toolHref(tool: ToolDoc) {
	return `/docs/tools/${tool.slug}`;
}
