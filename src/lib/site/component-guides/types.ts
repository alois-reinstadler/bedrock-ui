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

export type ComponentGuides = Record<string, ComponentGuide>;
