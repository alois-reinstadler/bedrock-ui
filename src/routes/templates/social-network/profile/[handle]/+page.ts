import { error } from '@sveltejs/kit';
import { people } from '#lib/templates/social-network/data.js';
export const entries = () => people.map((person) => ({ handle: person.handle }));
export const load = ({ params }: { params: { handle: string } }) => {
	const profile = people.find((person) => person.handle === params.handle);
	if (!profile) error(404, 'Profile not found');
	return { profile };
};
