import skill from '../../../../../skills/bedrock-ui/SKILL.md?raw';

export const prerender = true;

export function GET() {
	return new Response(skill, {
		headers: {
			'content-type': 'text/markdown; charset=utf-8',
			'content-disposition': 'attachment; filename="SKILL.md"'
		}
	});
}
