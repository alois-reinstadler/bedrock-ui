<script lang="ts">
	import { FieldStatus } from '#lib/bedrock/ui/field-status';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	let name = $state('');
	const taken = $derived(name.trim().toLowerCase() === 'studio');
</script>

<section class="w-full max-w-2xl space-y-5 rounded-xl border bg-card p-5">
	<header>
		<h3 class="text-lg font-semibold">Choose a workspace address</h3>
		<p class="mt-1 text-sm text-muted-foreground">
			Connect feedback to the field and explain how to recover from a naming conflict.
		</p>
	</header>
	<div class="space-y-2">
		<Label for="workspace-handle">Workspace address</Label><Input
			id="workspace-handle"
			value={name}
			oninput={(e) => (name = e.currentTarget.value)}
			aria-describedby="handle-feedback"
			aria-invalid={taken}
			placeholder="your-team"
		/>
		<div id="handle-feedback">
			<FieldStatus
				status={taken ? 'error' : name.length > 2 ? 'success' : 'info'}
				message={taken
					? 'Studio is already taken. Try studio-north.'
					: name.length > 2
						? 'This address is available in the sample directory.'
						: 'Use at least three characters. Try studio to see a conflict.'}
			/>
		</div>
	</div>
</section>
