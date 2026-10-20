export type Region = 'west' | 'north' | 'island';
export type Station = { id: string; name: string; code: string; region: Region };
export const stations: Station[] = [
	{ id: 'kef', name: 'Keflavik', code: 'KEF', region: 'island' },
	{ id: 'tos', name: 'Tromso', code: 'TOS', region: 'north' },
	{ id: 'bgo', name: 'Bergen', code: 'BGO', region: 'west' },
	{ id: 'lyr', name: 'Longyearbyen', code: 'LYR', region: 'north' },
	{ id: 'aes', name: 'Alesund', code: 'AES', region: 'west' },
	{ id: 'rkv', name: 'Reykjavik', code: 'RKV', region: 'island' }
];
