<script lang="ts">
	import { motionEasings, motionPresets, reveal } from '#lib/bedrock/motion/index.js';
	import Scene from './scene.svelte';

	let callsign = $state('');
	let callsignError = $state<string | null>(null);
	let callsignOk = $state(false);
	function checkCallsign(event: SubmitEvent) {
		event.preventDefault();
		const value = callsign.trim().toUpperCase();
		if (!value) {
			callsignError = 'Enter a callsign before filing.';
			callsignOk = false;
			return;
		}
		if (!/^[A-Z]{2,3}\d{1,4}[A-Z]?$/.test(value)) {
			callsignError = 'Two or three letters, then the flight number — like SAS4012.';
			callsignOk = false;
			return;
		}
		callsignError = null;
		callsignOk = true;
	}
</script>

<Scene
	index="14"
	title="Validation"
	hint="Errors reveal with height, so the button below rides the reflow. No layout() needed."
>
	<form class="flex max-w-sm flex-col gap-2" novalidate onsubmit={checkCallsign}>
		<label class="text-xs font-medium text-muted-foreground" for="callsign">Callsign</label>
		<input
			id="callsign"
			class={[
				'rounded-xl border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
				callsignError ? 'border-red-500/60' : 'border-border focus:border-foreground/40'
			]}
			placeholder="SAS4012"
			aria-invalid={Boolean(callsignError)}
			aria-describedby={callsignError
				? 'callsign-error'
				: callsignOk
					? 'callsign-success'
					: undefined}
			bind:value={callsign}
			oninput={() => {
				callsignError = null;
				callsignOk = false;
			}}
		/>
		{#if callsignError}
			<p
				id="callsign-error"
				in:reveal={{
					duration: motionPresets.reveal.duration,
					easing: motionEasings.enter
				}}
				out:reveal={{
					duration: motionPresets.exit.duration,
					easing: motionEasings.exit
				}}
				class="text-xs text-red-500"
				role="alert"
			>
				{callsignError}
			</p>
		{/if}
		{#if callsignOk}
			<p
				id="callsign-success"
				in:reveal={{
					duration: motionPresets.reveal.duration,
					easing: motionEasings.enter
				}}
				out:reveal={{
					duration: motionPresets.exit.duration,
					easing: motionEasings.exit
				}}
				class="text-xs text-emerald-600"
				role="status"
			>
				Callsign accepted. Squawk assigned on file.
			</p>
		{/if}
		<button
			type="submit"
			class="mt-1 w-fit rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background"
		>
			File plan
		</button>
	</form>
</Scene>

<style>
</style>
