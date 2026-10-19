import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { programs, shaderUniforms } from './programs.js';
import { shaders } from './catalog.js';

const vertex = readFileSync('node_modules/@paper-design/shaders/dist/vertex-shader.js', 'utf8');
function uniformPrecision(source: string) {
	const defaultPrecision = source.match(/precision\s+(\w+)\s+float/)?.[1];
	return new Map(
		[...source.matchAll(/uniform\s+(?:(lowp|mediump|highp)\s+)?(?:float|vec[234])\s+(u_\w+)/g)].map(
			(match) => [match[2], match[1] ?? defaultPrecision]
		)
	);
}
const automatic = new Set(['u_time', 'u_resolution', 'u_pixelRatio', 'u_imageAspectRatio']);
const fakeImage = {} as HTMLImageElement;
describe('Paper shader integration', () => {
	it('bounds palettes to shader capacity and keeps defaults for undefined values', () => {
		const uniforms = shaderUniforms('god-rays', {
			colors: Array(20).fill('#fff'),
			density: undefined
		});
		expect(uniforms.u_colorsCount).toBe(5);
		expect(uniforms.u_density).toBe(0.3);
	});
	it('applies glass margin shorthand while preserving explicit edges', () => {
		const uniforms = shaderUniforms('fluted-glass', { margin: 0.2, marginLeft: 0.4 });
		expect(uniforms.u_marginLeft).toBe(0.4);
		expect(uniforms.u_marginRight).toBe(0.2);
	});
	for (const { slug } of shaders) {
		it(`${slug} supplies every declared uniform and preserves vertex precision`, () => {
			const source = programs[slug];
			const uniforms = shaderUniforms(slug, {}, fakeImage, fakeImage);
			const names = [
				...source.matchAll(/uniform\s+(?:(?:lowp|mediump|highp)\s+)?\w+\s+(u_\w+)/g)
			].map((match) => match[1]);
			expect(names.length).toBeGreaterThan(0);
			for (const name of names)
				if (!automatic.has(name)) expect(uniforms[name], name).toBeDefined();
			for (const [name, precision] of uniformPrecision(source)) {
				const vertexPrecision = uniformPrecision(vertex).get(name);
				if (vertexPrecision) expect(precision, name).toBe(vertexPrecision);
			}
			for (const value of Object.values(uniforms))
				if (typeof value === 'number') expect(Number.isFinite(value)).toBe(true);
		});
	}
	it('maps image dithering pixel size and palette controls independently', () => {
		const uniforms = shaderUniforms(
			'image-dithering',
			{ size: 4, colorSteps: 5, originalColors: true },
			fakeImage
		);
		expect(uniforms.u_pxSize).toBe(4);
		expect(uniforms.u_colorSteps).toBe(5);
		expect(uniforms.u_originalColors).toBe(true);
	});
	it('preserves color alpha and binds processed text masks to Liquid Metal', () => {
		const uniforms = shaderUniforms('liquid-metal', { colorBack: '#00000000' }, fakeImage);
		expect(uniforms.u_colorBack).toEqual([0, 0, 0, 0]);
		expect(uniforms.u_isImage).toBe(true);
		expect(uniforms.u_image).toBe(fakeImage);
	});
});
