export type MotionRole =
	| 'Press / unmittelbares Feedback'
	| 'Zustandswechsel'
	| 'Eintritt'
	| 'Austritt'
	| 'Offenlegung'
	| 'Bewegung / Kontinuität'
	| 'Overlay / große Fläche'
	| 'Direkte Manipulation'
	| 'Kontinuierliche Bewegung'
	| 'Gruppe / Staffelung'
	| 'Layout-Bewegung'
	| 'Reduzierte Bewegung';

export type MotionMetadata = {
	role: MotionRole;
	duration: string;
	easing: string;
	delay?: string;
	distance?: string;
	origin?: string;
	properties: string;
	layout: 'Nein' | 'Einmalige Messung' | 'Pro Frame';
	loop: 'Nein' | 'Ja';
	reduced: string;
};

export type BenchmarkVerdict = 'bestanden' | 'beobachten' | 'problem' | 'kein-motion';

export type StressMode = 'normal' | 'rapid' | 'many';
export type InputMode = 'pointer' | 'keyboard' | 'touch';
export type MotionPreference = 'normal' | 'reduced';
export type TimeScale = 1 | 2 | 4 | 8;

export type LabPage = {
	title: string;
	shortTitle: string;
	href:
		| '/demo/motion'
		| '/demo/motion/foundations'
		| '/demo/motion/components'
		| '/demo/motion/continuity'
		| '/demo/motion/concurrency'
		| '/demo/motion/accessibility';
	description: string;
};

export const labPages: LabPage[] = [
	{
		title: 'Motion Lab: Überblick',
		shortTitle: 'Überblick',
		href: '/demo/motion',
		description: 'Architektur, Diagnose und Bewertungsraster.'
	},
	{
		title: 'Grundlagen',
		shortTitle: 'Grundlagen',
		href: '/demo/motion/foundations',
		description: 'Dauer, Kurven, Distanzen, Ursprung und Gruppen.'
	},
	{
		title: 'Komponenten',
		shortTitle: 'Komponenten',
		href: '/demo/motion/components',
		description: 'Controls, anchored layers und große Flächen.'
	},
	{
		title: 'Kontinuität & Layout',
		shortTitle: 'Kontinuität',
		href: '/demo/motion/continuity',
		description: 'Navigation, Disclosure und direkte Manipulation.'
	},
	{
		title: 'Gleichzeitigkeit',
		shortTitle: 'Gleichzeitigkeit',
		href: '/demo/motion/concurrency',
		description: 'Dynamische Inhalte, Unterbrechung und Frequenz.'
	},
	{
		title: 'Zugänglichkeit & Last',
		shortTitle: 'A11y & Last',
		href: '/demo/motion/accessibility',
		description: 'Reduced Motion, kontinuierliche Bewegung, Skalierung und Interop.'
	}
];

export const rubricDimensions = [
	['Zweck', 'Verbessert Bewegung Orientierung, Kontinuität, Feedback oder Aufmerksamkeit?'],
	['Frequenz', 'Passt die Bewegungsmenge zur Häufigkeit der Aktion?'],
	['Timing', 'Entspricht die Dauer Größe und visuellem Gewicht?'],
	['Easing', 'Passt die Geschwindigkeit zum semantischen Auftrag?'],
	['Räumlichkeit', 'Erklärt Bewegung Herkunft oder Ziel?'],
	['Richtung', 'Sind Vorwärts und Rückwärts räumlich sinnvoll?'],
	['Ursprung', 'Bleibt kontextuelle UI mit ihrem Trigger verbunden?'],
	['Kontinuität', 'Kann das Auge beständige Objekte verfolgen?'],
	['Unterbrechbarkeit', 'Kann der Zustand ohne Sprung neu anvisiert werden?'],
	['Manipulation', 'Bleibt direkte Manipulation 1:1 am Input?'],
	['Performance', 'Bleibt die Animation flüssig und compositor-freundlich?'],
	['Barrierefreiheit', 'Bleibt Reduced Motion brauchbar und kohärent?'],
	['Kohäsion', 'Fühlen sich die Komponenten wie ein System an?'],
	['Zurückhaltung', 'Weiß das System, wann es nicht animieren soll?']
] as const;
