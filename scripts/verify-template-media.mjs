import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';

const files = execFileSync(
	'git',
	['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', 'static'],
	{
		encoding: 'utf8'
	}
)
	.split('\0')
	.filter(Boolean);
const media = /\.(?:mp3|mp4|mov|webm|wav|ogg|m4a)$/i;
// This existing, small fixture serves the reusable VideoPlayer docs and tests.
const fixtures = new Set(['static/demo/clip.mp4']);
for (const file of new Set(files)) {
	assert.ok(!media.test(file) || fixtures.has(file), `Audio/video must stay remote: ${file}`);
	const stat = statSync(file, { throwIfNoEntry: false });
	if (stat) assert.ok(stat.size <= 2 * 1024 * 1024, `Static asset exceeds 2 MiB: ${file}`);
}
console.log(
	'Static asset policy passed: no bundled template audio/video; assets stay below 2 MiB.'
);
