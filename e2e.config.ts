import type { E2EConfig } from 'e2e';
import { web } from '@e2e-dev/web';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

// Keys/model come from the environment (e2e-run loads ~/.local/state/e2e/env); nothing secret in git.
const env = (name: string, fallback?: string): string => {
	const value = process.env[name] ?? fallback;
	if (!value) throw new Error(`Missing ${name}`);
	return value;
};

export default {
	tests: 'tests/e2e/**/*.e2e.ts',
	workers: 1, // the shared Chrome is one process: keep runs serial
	agents: {
		default: {
			model: createOpenAICompatible({
				name: 'openrouter',
				baseURL: env('LLM_BASE_URL'),
				apiKey: env('LLM_API_KEY'),
				supportsStructuredOutputs: true
			}).chatModel(env('LLM_MODEL')),
			system: 'You are a thorough QA agent. Verify every outcome on screen.'
		}
	},
	targets: [
		{
			engine: web({ connect: { cdpEndpoint: () => env('CDP_URL') } }),
			app: { url: env('APP_URL', 'https://bedrock-ui.dev.alrein.casa') }
		}
	]
} satisfies E2EConfig;
