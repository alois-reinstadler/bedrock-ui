<script lang="ts">
	import { Step, Stepper } from '#lib/bedrock/ui/stepper';
</script>

<div class="w-full max-w-md rounded-xl border bg-card p-6 corner-theme">
	<h3 class="mb-6 text-lg font-semibold">Deployment activity</h3>
	<Stepper activeStep={2} orientation="vertical" label="Deployment progress">
		<Step step={0} label="Source connected" description="main · 3 files changed" />
		<Step step={1} label="Build completed" description="All checks passed in 24 seconds" />
		<Step step={2} label="Deploying to production" description="Preparing your new release"
			><p class="mt-1 text-xs text-muted-foreground">
				Your previous release stays available during deployment.
			</p></Step
		>
		<Step step={3} label="Ready" description="Your changes are live" />
	</Stepper>
</div>
