import { conversationGuides } from './conversation';
import { expansionGuides } from './expansion';
import { contentGuides } from './content';
import { mapGuides } from './map';
import { dataGuides } from './data';
import { displayGuides } from './display';
import { formGuides } from './form';
import { layoutGuides } from './layout';
import { navigationGuides } from './navigation';
import { overlayGuides } from './overlay';
import type { ComponentGuide, ComponentGuides } from './types';

export type {
	ComponentAccessibilityGuide,
	ComponentAccessibilityRequirement,
	ComponentAnatomyPart,
	ComponentApiEntry,
	ComponentApiKind,
	ComponentDocTab,
	ComponentExamplePlan,
	ComponentGuide,
	ComponentReference
} from './types';

export const componentGuides: ComponentGuides = {
	...expansionGuides,
	...conversationGuides,
	...contentGuides,
	...dataGuides,
	...mapGuides,
	...displayGuides,
	...formGuides,
	...layoutGuides,
	...navigationGuides,
	...overlayGuides
};

export function getComponentGuide(slug: string): ComponentGuide | undefined {
	return componentGuides[slug];
}
