import { contentGuides } from './content';
import { dataGuides } from './data';
import { displayGuides } from './display';
import { formGuides } from './form';
import { layoutGuides } from './layout';
import { navigationGuides } from './navigation';
import { overlayGuides } from './overlay';
import type { ComponentGuide, ComponentGuides } from './types';

export type { ComponentAnatomyPart, ComponentExamplePlan, ComponentGuide } from './types';

export const componentGuides: ComponentGuides = {
	...contentGuides,
	...dataGuides,
	...displayGuides,
	...formGuides,
	...layoutGuides,
	...navigationGuides,
	...overlayGuides
};

export function getComponentGuide(slug: string): ComponentGuide | undefined {
	return componentGuides[slug];
}
