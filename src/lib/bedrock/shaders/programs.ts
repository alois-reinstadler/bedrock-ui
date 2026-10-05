import * as paper from '@paper-design/shaders';
import presets from './presets.json';
import type { ShaderId } from './catalog.js';
import type { ShaderOptions } from './types.js';

export const programs: Record<ShaderId, string> = {
	'mesh-gradient': paper.meshGradientFragmentShader,
	warp: paper.warpFragmentShader,
	'grain-gradient': paper.grainGradientFragmentShader,
	dithering: paper.ditheringFragmentShader,
	'neuro-noise': paper.neuroNoiseFragmentShader,
	'god-rays': paper.godRaysFragmentShader,
	'liquid-metal': paper.liquidMetalFragmentShader,
	heatmap: paper.heatmapFragmentShader,
	'fluted-glass': paper.flutedGlassFragmentShader,
	'image-dithering': paper.imageDitheringFragmentShader,
	'halftone-dots': paper.halftoneDotsFragmentShader,
	water: paper.waterFragmentShader
};
const enums: Partial<Record<ShaderId, Record<string, Record<string, number>>>> = {
	warp: { shape: paper.WarpPatterns },
	'grain-gradient': { shape: paper.GrainGradientShapes },
	dithering: { shape: paper.DitheringShapes, type: paper.DitheringTypes },
	'liquid-metal': { shape: paper.LiquidMetalShapes },
	'fluted-glass': { shape: paper.GlassGridShapes, distortionShape: paper.GlassDistortionShapes },
	'image-dithering': { type: paper.DitheringTypes },
	'halftone-dots': { type: paper.HalftoneDotsTypes, grid: paper.HalftoneDotsGrids }
};
export function shaderUniforms(
	effect: ShaderId,
	options: ShaderOptions[ShaderId],
	image?: HTMLImageElement,
	noise?: HTMLImageElement
): paper.ShaderMountUniforms {
	const overrides = Object.fromEntries(
		Object.entries(options).filter(([, value]) => value !== undefined)
	);
	const params = { ...presets[effect], ...overrides };
	if (effect === 'fluted-glass' && 'margin' in options && options.margin !== undefined) {
		for (const side of ['marginLeft', 'marginRight', 'marginTop', 'marginBottom']) {
			if (!(side in overrides)) Object.assign(params, { [side]: options.margin });
		}
	}
	const uniforms: paper.ShaderMountUniforms = {};
	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || key === 'speed' || key === 'frame' || key === 'margin') continue;
		const name =
			key === 'size' && (effect === 'dithering' || effect === 'image-dithering') ? 'pxSize' : key;
		if (key === 'colors' && Array.isArray(value)) {
			const limit = Number(
				programs[effect].match(/uniform\s+vec4\s+u_colors\[(\d+)\]/)?.[1] ?? value.length
			);
			const colors = (
				value.length ? value : (Reflect.get(presets[effect], 'colors') as string[])
			).slice(0, limit);
			uniforms.u_colors = colors.map(paper.getShaderColorFromString);
			uniforms.u_colorsCount = colors.length;
		} else if (key.startsWith('color') && typeof value === 'string') {
			uniforms[`u_${name}`] = paper.getShaderColorFromString(value);
		} else if (key === 'fit') {
			uniforms.u_fit = paper.ShaderFitOptions[value as paper.ShaderFit];
		} else if (typeof value === 'string' && enums[effect]?.[key]) {
			uniforms[`u_${name}`] = enums[effect]![key][value];
		} else if (typeof value === 'number' || typeof value === 'boolean') {
			uniforms[`u_${name}`] = value;
		}
	}
	if (image) uniforms.u_image = image;
	if (effect === 'liquid-metal') uniforms.u_isImage = Boolean(image);
	if (['warp', 'grain-gradient', 'god-rays'].includes(effect)) uniforms.u_noiseTexture = noise;
	return uniforms;
}
export const defaultSpeed = (effect: ShaderId) => presets[effect].speed;
export const defaultScale = (effect: ShaderId) => presets[effect].scale;
