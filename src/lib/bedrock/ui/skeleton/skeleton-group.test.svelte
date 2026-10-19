<script lang="ts">
	import { Skeleton, SkeletonGroup } from './index';
</script>

<SkeletonGroup duration={3200} direction="rtl">
	<Skeleton id="shared-first" class="h-4 w-32" />
	<Skeleton id="static-child" variant="static" class="h-4 w-24" />
	<Skeleton id="pulse-child" variant="pulse" class="h-4 w-16" />
	<SkeletonGroup variant="static">
		<Skeleton id="nested-static" class="h-4 w-32" />
		<SkeletonGroup>
			<Skeleton id="nested-shimmer" class="h-4 w-16" />
		</SkeletonGroup>
	</SkeletonGroup>
</SkeletonGroup>
