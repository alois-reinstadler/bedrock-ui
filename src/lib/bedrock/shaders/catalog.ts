/** Curated Paper Shaders 0.0.81. Shader programs are supplied by the original package. */
export const shaders = [
	{
		slug: 'mesh-gradient',
		title: 'Mesh Gradient',
		category: 'Backgrounds',
		description: 'Slow-moving color fields for expressive hero sections.',
		fallback: 'linear-gradient(135deg, #241d9a, #f75092, #e0eaff)'
	},
	{
		slug: 'warp',
		title: 'Warp',
		category: 'Backgrounds',
		description: 'Fluid, marbled ribbons with deep violet swirls.',
		fallback: 'linear-gradient(35deg, #121212, #9470ff, #121212, #8838ff)'
	},
	{
		slug: 'grain-gradient',
		title: 'Grain Gradient',
		category: 'Backgrounds',
		description: 'Soft pools of color with a textured, cinematic finish.',
		fallback: 'radial-gradient(ellipse at top left, #eba8ff, #7300ff, #000)'
	},
	{
		slug: 'dithering',
		title: 'Dithering',
		category: 'Backgrounds',
		description: 'Animated pixel patterns with a retro digital feel.',
		fallback: 'radial-gradient(circle, #00b2ff, #000 70%)'
	},
	{
		slug: 'neuro-noise',
		title: 'Neuro Noise',
		category: 'Backgrounds',
		description: 'Electric blue networks that flow and reconnect.',
		fallback: 'radial-gradient(ellipse, #47a6ff, #000 75%)'
	},
	{
		slug: 'god-rays',
		title: 'God Rays',
		category: 'Backgrounds',
		description: 'Atmospheric shafts of light with a luminous bloom.',
		fallback: 'conic-gradient(from 150deg at 50% 0%, #000, #6200ff, #33fff5, #000)'
	},
	{
		slug: 'liquid-metal',
		title: 'Liquid Metal',
		category: 'Text',
		description: 'Reflective chrome flowing across your typography.',
		fallback: '#171719'
	},
	{
		slug: 'heatmap',
		title: 'Heatmap',
		category: 'Text',
		description: 'A molten spectrum tracing the contours of each letter.',
		fallback: '#080c1c'
	},
	{
		slug: 'fluted-glass',
		title: 'Fluted Glass',
		category: 'Images',
		description: 'Ribbed glass that refracts and obscures your photos.',
		fallback: '#17212b'
	},
	{
		slug: 'image-dithering',
		title: 'Image Dithering',
		category: 'Images',
		description: 'Turn photography into crisp, limited-palette pixel art.',
		fallback: '#000c38'
	},
	{
		slug: 'halftone-dots',
		title: 'Halftone Dots',
		category: 'Images',
		description: 'Editorial print texture made from a field of tiny dots.',
		fallback: '#f2f1e8'
	},
	{
		slug: 'water',
		title: 'Water',
		category: 'Images',
		description: 'Rippling refraction and caustic light over an image.',
		fallback: '#223c4b'
	}
] as const;
export type ShaderId = (typeof shaders)[number]['slug'];
export type ShaderCategory = (typeof shaders)[number]['category'];
export const getShader = (slug: string) => shaders.find((shader) => shader.slug === slug);
export const shaderSampleImage = '/templates/social-network/coast.jpg';
