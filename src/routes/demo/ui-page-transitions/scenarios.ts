export type ScenarioId = 'magazine' | 'journey' | 'workspace' | 'checkout';
export type Scenario = {
	id: ScenarioId;
	index: string;
	title: string;
	pattern: string;
	description: string;
};
export const scenarios: Scenario[] = [
	{
		id: 'magazine',
		index: '01',
		title: 'Magazin',
		pattern: 'Geteiltes Objekt',
		description: 'Das gewählte Cover bleibt als visueller Anker erhalten und wird zur Artikelseite.'
	},
	{
		id: 'journey',
		index: '02',
		title: 'Reiseplan',
		pattern: 'Richtungswechsel',
		description: 'Vor und zurück bekommt eine räumliche Richtung – passend zur linearen Abfolge.'
	},
	{
		id: 'workspace',
		index: '03',
		title: 'Arbeitsbereich',
		pattern: 'Kontext bewahren',
		description: 'Die Navigation bleibt ruhig, während sich die gewählte Zeile in die Tiefe öffnet.'
	},
	{
		id: 'checkout',
		index: '04',
		title: 'Abschluss',
		pattern: 'Entscheidung markieren',
		description: 'Ein deutlicher Reveal trennt den reversiblen Warenkorb vom bestätigten Zustand.'
	}
];
