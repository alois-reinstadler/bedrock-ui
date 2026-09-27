import { error } from '@sveltejs/kit';
import { initialPosts } from '#lib/templates/social-network/data.js';
export const entries = () => initialPosts.map((post) => ({ id: post.id }));
export const load = ({ params }: { params: { id: string } }) => {
	if (!initialPosts.some((post) => post.id === params.id) && !/^local-[0-9]+$/.test(params.id))
		error(404, 'Post not found');
	return { id: params.id };
};
