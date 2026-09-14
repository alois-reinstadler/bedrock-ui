export type ComponentAnatomyPart = {
	name: string;
	description: string;
	required?: boolean;
};

export type ComponentExamplePlan = {
	title: string;
	demonstrates: string;
	priority: 'primary' | 'secondary' | 'edge-case';
};

export type ComponentGuide = {
	purpose: string;
	useWhen: string[];
	avoidWhen: string[];
	anatomy: ComponentAnatomyPart[];
	behavior?: string[];
	examplePlan: ComponentExamplePlan[];
};

export type ComponentApiKind = 'prop' | 'bindable' | 'event' | 'snippet' | 'ref' | 'data-attribute';

export type ComponentDocTab = 'overview' | 'properties' | 'accessibility';

export type ComponentApiEntry = {
	kind: ComponentApiKind;
	name: string;
	type: string;
	default?: string;
	required?: boolean;
	description: string;
	source?: string;
	sourceUrl?: string;
};

export type ComponentPublicPart = {
	name: string;
	aliases: string[];
	source: string;
	entries: ComponentApiEntry[];
	inherited: string;
};

export type ComponentAccessibilityRequirement = {
	requirement: string;
	criteria: string;
	appliesTo: string;
	guidance: string;
};

export type ComponentAccessibilityGuide = {
	semantics: string[];
	keyboard: string[];
	focus: string[];
	labels: string[];
	announcements: string[];
	reducedMotion: string[];
	requirements?: ComponentAccessibilityRequirement[];
	knownGaps?: string[];
};

export type ComponentReference = {
	api: ComponentApiEntry[];
	parts?: ComponentPublicPart[];
	accessibility: ComponentAccessibilityGuide;
};

export type ComponentGuides = Record<string, ComponentGuide>;
