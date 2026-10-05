import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lightRaysFragmentShader } from './shader.js';

describe('Light Rays shader integration', () => {
	it('matches the installed renderer vertex precision for the shared resolution uniform', () => {
		const require = createRequire(import.meta.url);
		const vertex = readFileSync(
			join(dirname(require.resolve('@paper-design/shaders')), 'vertex-shader.js'),
			'utf8'
		);
		const floatPrecision = /precision\s+(lowp|mediump|highp)\s+float\s*;/;
		// WebGL links the two stages together. Individually valid shaders still fail
		// to link if a shared uniform inherits different precision in each stage.
		expect(vertex).toMatch(/uniform vec2 u_resolution;/);
		expect(lightRaysFragmentShader).toMatch(/uniform vec2 u_resolution;/);
		expect(lightRaysFragmentShader.match(floatPrecision)?.[1]).toBe(
			vertex.match(floatPrecision)?.[1]
		);
	});
});
