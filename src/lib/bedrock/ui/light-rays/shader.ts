// Ported from Spell UI (MIT). See SPELL-LICENSE and SPELL-NOTICE.
// Only GLSL 3 output syntax and resolution-relative ray origins differ.
// Match ShaderMount's vertex precision; it upgrades both stages together when needed.
export const lightRaysFragmentShader = `#version 300 es
precision mediump float;
out vec4 fragColor;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_colors[2];
uniform float u_intensity;
uniform float u_rays;
uniform float u_reach;
uniform float u_position;
#define u_rayPos1 vec2(u_position * u_resolution.x, -0.4 * u_resolution.y)
#define u_rayPos2 vec2((u_position + 0.02) * u_resolution.x, -0.5 * u_resolution.y)

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
    vec2 sourceToCoord = coord - raySource;
    float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
    float diagonal = length(u_resolution);

    return clamp(
        (.45 + 0.15 * sin(cosAngle * seedA + u_time * speed)) +
        (0.3 + 0.2 * cos(-cosAngle * seedB + u_time * speed)),
        u_reach, 1.0) *
        clamp((diagonal - length(sourceToCoord)) / diagonal, u_reach, 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0 - uv.y;
    vec2 coord = vec2(gl_FragCoord.x, u_resolution.y - gl_FragCoord.y);
    float speed = u_rays * 10.0;

    vec2 rayPos1 = u_rayPos1;
    vec2 rayRefDir1 = normalize(vec2(1.0, -0.116));
    float raySeedA1 = 36.2214 * speed;
    float raySeedB1 = 21.11349 * speed;
    float raySpeed1 = 1.5 * speed;

    vec2 rayPos2 = u_rayPos2;
    vec2 rayRefDir2 = normalize(vec2(1.0, 0.241));
    float raySeedA2 = 22.39910 * speed;
    float raySeedB2 = 18.0234 * speed;
    float raySpeed2 = 1.1 * speed;

    float strength1 = rayStrength(rayPos1, rayRefDir1, coord, raySeedA1, raySeedB1, raySpeed1);
    float strength2 = rayStrength(rayPos2, rayRefDir2, coord, raySeedA2, raySeedB2, raySpeed2);

    float brightness = 1.0 * u_reach - (coord.y / u_resolution.y);
    float attenuation = clamp(brightness + (0.5 + u_intensity), 0.0, 1.0);

    float alpha1 = strength1 * attenuation * u_colors[0].a;
    float alpha2 = strength2 * attenuation * u_colors[1].a;

    vec3 premultColor1 = u_colors[0].rgb * alpha1;
    vec3 premultColor2 = u_colors[1].rgb * alpha2;

    vec3 blendedColor = premultColor1 + premultColor2;
    float blendedAlpha = alpha1 + alpha2 * (1.0 - alpha1);

    vec3 finalRGB = blendedColor / max(blendedAlpha, 0.0001);

    fragColor = vec4(finalRGB * blendedAlpha, blendedAlpha);
}
`;

export function colorToRGB(hex: string): [number, number, number] {
	let r = 1,
		g = 1,
		b = 1;

	if (hex.startsWith('rgba(')) {
		const parts = hex.slice(5, -1).split(',');
		r = parseInt(parts[0]) / 255;
		g = parseInt(parts[1]) / 255;
		b = parseInt(parts[2]) / 255;
	} else if (hex.startsWith('rgb(')) {
		const parts = hex.slice(4, -1).split(',');
		r = parseInt(parts[0]) / 255;
		g = parseInt(parts[1]) / 255;
		b = parseInt(parts[2]) / 255;
	} else if (hex.startsWith('#')) {
		const c = hex.slice(1);
		if (c.length === 3) {
			r = parseInt(c[0] + c[0], 16) / 255;
			g = parseInt(c[1] + c[1], 16) / 255;
			b = parseInt(c[2] + c[2], 16) / 255;
		} else if (c.length >= 6) {
			r = parseInt(c.slice(0, 2), 16) / 255;
			g = parseInt(c.slice(2, 4), 16) / 255;
			b = parseInt(c.slice(4, 6), 16) / 255;
		}
	}

	return [r, g, b];
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	s /= 100;
	l /= 100;
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0,
		g = 0,
		b = 0;

	if (h >= 0 && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (h >= 300 && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	return [r + m, g + m, b + m];
}
