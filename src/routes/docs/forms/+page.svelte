<script lang="ts">
	import CodeBlock from '#lib/site/CodeBlock.svelte';
	import SteppedExample from '#lib/site/examples/stepped-form.svelte';
	let opened = $state<Record<string, boolean>>({});
	const imports = `import { Input } from '#lib/bedrock/ui/input';
import { Label } from '#lib/bedrock/ui/label';
import { Button } from '#lib/bedrock/ui/button';
import * as SteppedForm from '#lib/bedrock/ui/stepped-form';`;
	const schema = `// profile-schema.ts — dependency-free Standard Schema
export const profileSchema = {
  '~standard': {
    version: 1 as const,
    vendor: 'bedrock-example',
    validate(input: unknown) {
      const name = typeof input === 'object' && input !== null &&
        'name' in input ? input.name : undefined;
      if (typeof name !== 'string' || name.trim().length < 2) {
        return { issues: [{ message: 'Enter at least two characters.', path: ['name'] }] };
      }
      return { value: { name: name.trim() } };
    }
  }
};`;
	const remote = `// profile.remote.ts — requires a server-capable adapter
import { form, command } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { profileSchema } from './profile-schema';

export const reviewProfile = form(profileSchema, async ({ name }, issue) => {
  if (name.toLowerCase() === 'admin') invalid(issue.name('Choose a personal name.'));
  // Authenticate and authorize here before any real database write.
  return { reviewed: true, name }; // Demonstration: no database persistence.
});

// A command suits a JavaScript-coordinated multi-step workflow.
export const reviewOnboarding = command(profileSchema, async ({ name }) => {
  return { reviewed: true, name }; // Add your authorized, idempotent write here.
});`;
	const client =
		`<script lang="ts">
  import { tick } from 'svelte';
  import { Input } from '#lib/bedrock/ui/input';
  import { Label } from '#lib/bedrock/ui/label';
  import { Button } from '#lib/bedrock/ui/button';
  import { reviewProfile } from './profile.remote';
  let status = $state('');
<` +
		`/script>

<form {...reviewProfile.enhance(async (form) => {
  status = 'Checking profile';
  try {
    if (await form.submit()) {
      status = 'Profile reviewed. Your values are retained.';
    } else {
      status = 'Review the highlighted fields.';
      await tick();
      form.element.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  } catch {
    status = 'Could not reach the server. Your values are retained; try again.';
  }
})}>
  <Label for="profile-name">Name</Label>
  <Input id="profile-name" {...reviewProfile.fields.name.as('text')}
    aria-describedby="name-errors" required />
  <div id="name-errors">
    {#each reviewProfile.fields.name.issues() ?? [] as issue}
      <p>{issue.message}</p>
    {/each}
  </div>
  <ul aria-label="Form errors">
    {#each reviewProfile.fields.allIssues() ?? [] as issue}
      <li>{issue.message}</li>
    {/each}
  </ul>
  <Button type="submit" disabled={!!reviewProfile.pending}>
    {reviewProfile.pending ? 'Checking…' : 'Review profile'}
  </Button>
  <p role="status">{status}</p>
  {#if reviewProfile.result?.reviewed}<p>Reviewed: {reviewProfile.result.name}</p>{/if}
</form>`;
	const stepped =
		`<script lang="ts">
  import * as SteppedForm from '#lib/bedrock/ui/stepped-form';
  import { Input } from '#lib/bedrock/ui/input';
  import { Label } from '#lib/bedrock/ui/label';
  import { reviewOnboarding } from './profile.remote';
  const steps = [{ id: 'profile', title: 'Profile' }, { id: 'review', title: 'Review' }];
<` +
		`/script>
<SteppedForm.Root {steps} onSubmit={async ({ formData }) => {
  await reviewOnboarding({ name: String(formData.get('name') ?? '') });
}}>
  <SteppedForm.Progress />
  <SteppedForm.Step id="profile">
    <SteppedForm.Title>Your profile</SteppedForm.Title>
    <SteppedForm.Content>
      <Label for="name">Name</Label>
      <Input id="name" name="name" required minlength={2} />
    </SteppedForm.Content>
    <SteppedForm.Actions><SteppedForm.Next /></SteppedForm.Actions>
  </SteppedForm.Step>
  <SteppedForm.Step id="review">
    <SteppedForm.Title>Ready to review</SteppedForm.Title>
    <SteppedForm.Description>Check your details before sending.</SteppedForm.Description>
    <SteppedForm.Actions>
      <SteppedForm.Previous /><SteppedForm.Submit>Review profile</SteppedForm.Submit>
    </SteppedForm.Actions>
  </SteppedForm.Step>
  <SteppedForm.Status />
</SteppedForm.Root>`;
</script>

<svelte:head
	><title>Forms — Bedrock</title><meta
		name="description"
		content="Practical Bedrock forms: validation, remote functions, pending states, errors, recovery and stepped onboarding."
	/></svelte:head
>
<div class="mx-auto max-w-4xl space-y-10 px-4 py-10 md:px-8">
	<header class="space-y-4">
		<h1 class="text-4xl font-semibold tracking-tight">Forms that explain what is happening.</h1>
		<p class="text-lg text-muted-foreground">
			Bedrock owns the controls and feedback surfaces. Your application owns validation rules,
			authorization, persistence, and recovery.
		</p>
	</header>
	<details
		class="rounded-lg border p-4"
		ontoggle={(event) => (opened.imports = event.currentTarget.open)}
	>
		<summary class="cursor-pointer font-medium">Import conventions</summary>{#if opened.imports}<div
				class="mt-4"
			>
				<CodeBlock code={imports} language="typescript" label="Imports" />
			</div>{/if}
	</details>
	<section class="space-y-4" aria-labelledby="boundaries">
		<h2 id="boundaries" class="text-2xl font-semibold">Choose the right boundary</h2>
		<p>
			Use a native form with Bedrock Input, Label, Button, Checkbox and Field for short tasks.
			Stepper communicates progress. Stepped Form coordinates meaningful sections, validation,
			navigation and submission; it keeps a single native form and preserves mounted controls when
			moving back.
		</p>
		<p>
			This documentation site is statically generated. The interactive example below simulates
			submission locally and does not create an account or store data. Remote-function examples are
			source for a server-backed SvelteKit application, not endpoints running on this site.
		</p>
	</section>
	<section class="space-y-4" aria-labelledby="remote">
		<h2 id="remote" class="text-2xl font-semibold">Remote forms</h2>
		<p>
			Remote functions remain experimental: enable kit.experimental.remoteFunctions and
			compilerOptions.experimental.async. Choose a server-capable adapter and avoid prerendering
			pages that require live server data. A remote form supplies method, action and enhancement; it
			supports submission without JavaScript. Do not apply the traditional $app/forms enhance action
			to it.
		</p>
		<p>
			The following schema implements Standard Schema without another dependency. Production
			applications can use their existing schema library. Always validate and authorize on the
			server; client checks improve feedback but do not establish trust.
		</p>
		<details
			class="rounded-lg border p-4"
			ontoggle={(event) => (opened.schema = event.currentTarget.open)}
		>
			<summary class="cursor-pointer font-medium">View shared validation source</summary
			>{#if opened.schema}<div class="mt-4">
					<CodeBlock code={schema} language="typescript" label="Shared validation" />
				</div>{/if}
		</details>
		<details
			class="rounded-lg border p-4"
			ontoggle={(event) => (opened.remote = event.currentTarget.open)}
		>
			<summary class="cursor-pointer font-medium">View remote function source</summary
			>{#if opened.remote}<div class="mt-4">
					<CodeBlock code={remote} language="typescript" label="Remote functions" />
				</div>{/if}
		</details>
		<details
			class="rounded-lg border p-4"
			ontoggle={(event) => (opened.client = event.currentTarget.open)}
		>
			<summary class="cursor-pointer font-medium">View remote form source</summary
			>{#if opened.client}<div class="mt-4">
					<CodeBlock code={client} language="svelte" label="Bedrock controls with a remote form" />
				</div>{/if}
		</details>
		<p>
			issues() and allIssues() may return undefined. pending is a count; coerce it to a boolean for
			disabled. validate() checks interacted fields by default.
		</p>
		<p>
			To validate every field before a custom review action, call <code
				>reviewProfile.validate(&#123; includeUntouched: true &#125;)</code
			>. Use <code>preflight(schema)</code> for client validation, while keeping the server schema
			authoritative. Field issues belong next to the control; form-level issues from
			<code>invalid('message')</code> appear in allIssues().
		</p>
		<p>
			The enhance callback receives a form instance. Its submit() resolves to a boolean. Reset only
			after confirmed success and only if clearing values helps the task. result is ephemeral and
			vanishes on resubmission, navigation, or reload.
		</p>
		<a class="underline underline-offset-4" href="https://svelte.dev/docs/kit/remote-functions"
			>Official SvelteKit remote functions reference</a
		>
	</section>
	<section class="space-y-4" aria-labelledby="stepped">
		<h2 id="stepped" class="text-2xl font-semibold">A long mobile form</h2>
		<SteppedExample />
		<p>
			Stepped Form validates the current section before advancing and all enabled sections before
			submission. Inactive panels remain mounted, hidden and inert. Root uses novalidate so the
			browser cannot trap focus on a hidden invalid field; Bedrock reveals the failing section
			first. Preserve ordinary control names so FormData includes previous sections.
		</p>
		<details
			class="rounded-lg border p-4"
			ontoggle={(event) => (opened.stepped = event.currentTarget.open)}
		>
			<summary class="cursor-pointer font-medium">View stepped form source</summary
			>{#if opened.stepped}<div class="mt-4">
					<CodeBlock code={stepped} language="svelte" label="Stepped Form with a remote command" />
				</div>{/if}
		</details>
		<p>
			A command is appropriate here because Stepped Form requires JavaScript and coordinates
			submission itself. Do not spread a remote form enhancer onto Root: two submit controllers
			would compete. Supply a native single-page form alternative if no-JavaScript completion is a
			requirement. Network failures reject onSubmit and appear in Status with Retry; real writes
			should use server-side idempotency keys to avoid duplicates after uncertain responses.
		</p>
		<a
			class="underline underline-offset-4"
			href="/docs/components/stepped-form"
			data-sveltekit-reload>Stepped Form anatomy and reference</a
		>
	</section>
	<section class="space-y-4" aria-labelledby="states">
		<h2 id="states" class="text-2xl font-semibold">Feedback and recovery</h2>
		<ul class="list-disc space-y-3 pl-5">
			<li>
				Validation: validate on a useful boundary, name the problem and its correction, set
				aria-invalid, and connect error text through aria-describedby. A summary complements field
				errors.
			</li>
			<li>
				Pending: keep inputs visible, disable duplicate actions, announce the operation, and
				preserve the current layout. Do not mark a request successful until the server confirms.
			</li>
			<li>
				Success: explain what changed and the next action. Keep focus stable for inline
				confirmation; focus the new heading when changing views.
			</li>
			<li>
				Error and retry: preserve values, distinguish field errors from network or form-level
				failures, and provide an explicit retry. Do not automatically repeat irreversible writes.
			</li>
			<li>
				Optimistic behavior: reserve it for reversible, low-risk operations such as a draft
				preference. Roll back on failure and announce recovery. Never optimistically claim a
				payment, account creation, or upload is complete.
			</li>
			<li>
				Persistence: bind:value controls the active step. Optional persistence.read/write hooks can
				store only a step ID in a query parameter. They do not store field values; use an
				application-owned draft store and never put personal data in URLs.
			</li>
		</ul>
	</section>
	<section class="space-y-4" aria-labelledby="accessibility">
		<h2 id="accessibility" class="text-2xl font-semibold">Accessible completion</h2>
		<p>
			Give every control a visible label. Keep Status mounted so its polite live region announces
			step changes and errors. Test Tab, Shift+Tab, Enter, Back and Retry. On failure focus the
			first invalid control; on navigation focus the new step title. Keep logical DOM order on
			mobile and desktop. Reduced-motion users receive the same change without directional
			animation.
		</p>
		<p>
			Test empty, slow, rejected, successful and repeated submissions. Test dynamic steps and two
			forms on one page. Hidden sections must be absent from the accessibility tree, preserved
			fields must reach submission, and removal of the active section must reveal a valid remaining
			section. Persisting a step is not evidence that its values passed server validation.
		</p>
	</section>
</div>
