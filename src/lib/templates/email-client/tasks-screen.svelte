<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	let {
		active = true,
		tasks = $bindable<WorkspaceTask[]>([])
	}: { active?: boolean; tasks?: WorkspaceTask[] } = $props();
	import { tick } from 'svelte';
	import { parseDate, type CalendarDate } from '@internationalized/date';
	import Star from '@lucide/svelte/icons/star';
	import Plus from '@lucide/svelte/icons/plus';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import { Button } from '#lib/bedrock/ui/button';
	import { Progress } from '#lib/bedrock/ui/progress';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { demoToday, type WorkspaceTask } from './productivity-data.js';
	let filter = $state<'Today' | 'Upcoming' | 'Important' | 'Completed'>('Today');
	let query = $state('');
	let open = $state(false);
	afterNavigate(() => {
		if (!active) open = false;
	});
	let editing = $state<string | null>(null);
	let title = $state('');
	let due = $state<CalendarDate | undefined>(parseDate(demoToday));
	let project = $state('Launch');
	let note = $state('');
	let error = $state('');
	let announcement = $state('');
	const visible = $derived(
		tasks
			.filter(
				(task) =>
					(filter === 'Completed'
						? task.completed
						: !task.completed &&
							(filter === 'Important'
								? task.important
								: filter === 'Today'
									? task.due <= demoToday
									: task.due > demoToday)) &&
					`${task.title} ${task.project}`.toLowerCase().includes(query.toLowerCase())
			)
			.sort((a, b) => a.due.localeCompare(b.due))
	);
	const completed = $derived(tasks.filter((task) => task.completed).length);
	export async function revealTask(id: string) {
		filter = 'Today';
		query = '';
		await tick();
		document.getElementById(`task-${id}`)?.focus();
	}
	function edit(task?: WorkspaceTask) {
		editing = task?.id ?? null;
		title = task?.title ?? '';
		due = parseDate(task?.due ?? demoToday);
		project = task?.project ?? 'Launch';
		note = task?.note ?? '';
		error = '';
		open = true;
	}
	function save(event: SubmitEvent) {
		event.preventDefault();
		if (!title.trim() || !due) {
			error = 'Add a task name and due date.';
			return;
		}
		const task: WorkspaceTask = {
			id: editing ?? `task-${Date.now()}`,
			title: title.trim(),
			due: due.toString(),
			project: project.trim() || 'Personal',
			note: note.trim(),
			important: tasks.find((task) => task.id === editing)?.important ?? false,
			completed: tasks.find((task) => task.id === editing)?.completed ?? false
		};
		tasks = editing ? tasks.map((item) => (item.id === editing ? task : item)) : [...tasks, task];
		filter = task.completed ? 'Completed' : task.due > demoToday ? 'Upcoming' : 'Today';
		query = '';
		announcement = `${task.title} ${editing ? 'updated' : 'added'}.`;
		open = false;
	}
	async function toggle(id: string) {
		const task = tasks.find((task) => task.id === id);
		if (task) {
			task.completed = !task.completed;
			announcement = `${task.title} marked ${task.completed ? 'complete' : 'incomplete'}.`;
			await tick();
			document.getElementById('tasks-list-heading')?.focus();
		}
	}
	function remove() {
		const task = tasks.find((task) => task.id === editing);
		tasks = tasks.filter((task) => task.id !== editing);
		announcement = `${task?.title ?? 'Task'} deleted.`;
		open = false;
	}
</script>

<section class="mx-auto min-h-[calc(100svh-11rem)] max-w-6xl p-4 sm:p-6 lg:p-8">
	<header class="mb-7 flex flex-wrap items-end justify-between gap-4">
		<div>
			<p class="text-xs font-medium tracking-widest text-muted-foreground uppercase">
				One thing at a time
			</p>
			<h1
				id="tasks-screen-heading"
				tabindex="-1"
				class="mt-1 text-3xl font-semibold tracking-tight"
			>
				Tasks
			</h1>
			<p class="mt-2 text-sm text-muted-foreground">
				Turn the conversation into a clear next step.
			</p>
		</div>
		<Button onclick={() => edit()}><Plus class="size-4" />New task</Button>
	</header>
	<div class="grid gap-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
		<aside class="order-2 space-y-5 lg:order-1">
			<div class="rounded-2xl border bg-card p-5">
				<div class="mb-3 flex items-center gap-2 text-sm font-semibold">
					<CheckCheck class="size-4" />Your progress
				</div>
				<p class="text-3xl font-semibold tabular-nums">
					{completed}<span class="text-base font-normal text-muted-foreground">
						/ {tasks.length} complete</span
					>
				</p>
				<Progress
					class="mt-4 h-2 [&_[data-slot=progress-indicator]]:transition-none"
					value={completed}
					max={tasks.length || 1}
					aria-label="Task completion"
				/>
				<p class="mt-3 text-xs text-muted-foreground">
					Small steps move the whole project forward.
				</p>
			</div>
			<div class="rounded-2xl bg-muted/40 p-5">
				<p class="text-sm font-medium">Monday, 14 September</p>
				<p class="mt-2 text-sm text-muted-foreground">
					A little space between tasks makes room for better work.
				</p>
				<p class="mt-3 text-xs text-muted-foreground">Demo date · Local changes reset on reload.</p>
			</div>
		</aside>
		<div class="order-1 min-w-0 overflow-hidden rounded-2xl border bg-card shadow-sm lg:order-2">
			<div class="flex flex-wrap items-center justify-between gap-3 border-b p-4">
				<div class="flex flex-wrap gap-1" role="group" aria-label="Task filters">
					{#each ['Today', 'Upcoming', 'Important', 'Completed'] as item (item)}<Button
							size="sm"
							variant={filter === item ? 'secondary' : 'ghost'}
							aria-pressed={filter === item}
							onclick={() => (filter = item as typeof filter)}>{item}</Button
						>{/each}
				</div>
				<Input
					class="max-w-52"
					id="tasks-search"
					name="tasks-search"
					aria-label="Search tasks"
					placeholder="Find a task…"
					value={query}
					oninput={(event) => (query = event.currentTarget.value)}
				/>
			</div>
			<div class="flex items-center justify-between border-b bg-muted/20 px-5 py-3">
				<h2 id="tasks-list-heading" tabindex="-1" class="text-sm font-medium">
					{filter === 'Today'
						? 'Your priorities'
						: filter === 'Upcoming'
							? 'On the horizon'
							: filter === 'Important'
								? 'Keep in sight'
								: 'A job well done'}
				</h2>
				<Badge variant="outline">{visible.length} {visible.length === 1 ? 'task' : 'tasks'}</Badge>
			</div>
			<ul class="divide-y">
				{#each visible as task (task.id)}<li class="flex items-start gap-3 p-5">
						<Checkbox
							class="mt-1"
							checked={task.completed}
							onCheckedChange={() => toggle(task.id)}
							aria-label={`${task.completed ? 'Reopen' : 'Complete'} ${task.title}`}
						/><button
							class="min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
							onclick={() => edit(task)}
							aria-label={`Edit ${task.title}`}
							id={`task-${task.id}`}
							><span
								class="block font-medium"
								class:line-through={task.completed}
								class:text-muted-foreground={task.completed}>{task.title}</span
							><span class="mt-1 block text-sm text-muted-foreground">{task.note}</span><span
								class="mt-3 flex flex-wrap items-center gap-2 text-xs"
								><Badge variant="secondary">{task.project}</Badge><span
									class="text-muted-foreground"
									>{task.due === demoToday ? 'Due today' : `Due ${task.due}`}{!task.completed &&
									task.due < demoToday
										? ' · Overdue'
										: ''}</span
								></span
							></button
						>
						<Button
							variant="ghost"
							size="icon"
							aria-label={`${task.important ? 'Unmark' : 'Mark'} ${task.title} important`}
							aria-pressed={!!task.important}
							onclick={() => {
								task.important = !task.important;
								announcement = `${task.title} ${task.important ? 'marked important' : 'removed from important'}.`;
							}}><Star class={task.important ? 'size-4 fill-current' : 'size-4'} /></Button
						>
					</li>{:else}<li class="px-6 py-16 text-center">
						<CheckCheck class="mx-auto mb-3 size-8 text-muted-foreground" />
						<h3 class="font-medium">
							{query
								? 'No matching tasks'
								: filter === 'Completed'
									? 'Your completed tasks will appear here'
									: filter === 'Today'
										? 'You are clear for today'
										: 'Nothing on the horizon'}
						</h3>
						<p class="mt-2 text-sm text-muted-foreground">
							{query ? 'Try another title or project name.' : 'Add a next step when you are ready.'}
						</p>
						{#if query}<Button class="mt-4" variant="outline" onclick={() => (query = '')}
								>Clear task search</Button
							>{:else}<Button class="mt-4" variant="outline" onclick={() => edit()}
								>Add a task</Button
							>{/if}
					</li>{/each}
			</ul>
		</div>
	</div>
	<p role="status" class="mt-4 min-h-5 text-sm text-muted-foreground">{announcement}</p>
</section>
<Dialog.Root open={active && open} onOpenChange={(value) => (open = value)}
	><Dialog.Content
		onCloseAutoFocus={(event) => {
			event.preventDefault();
			document.getElementById('tasks-screen-heading')?.focus();
		}}
		class="max-h-[90svh] overflow-y-auto sm:max-w-lg"
		><Dialog.Header
			><Dialog.Title>{editing ? 'Edit task' : 'New task'}</Dialog.Title><Dialog.Description
				>Give your next step a name and a realistic due date.</Dialog.Description
			></Dialog.Header
		>
		<form class="space-y-4" onsubmit={save}>
			<div class="space-y-1.5">
				<Label for="task-title">Task name</Label><Input
					id="task-title"
					required
					maxlength={120}
					value={title}
					oninput={(event) => (title = event.currentTarget.value)}
					placeholder="Review the welcome email"
				/>
			</div>
			<div class="space-y-1.5">
				<p class="text-sm font-medium" id="task-due-label">Due date</p>
				<DateInput aria-labelledby="task-due-label" bind:value={due} locale="en-GB" />
			</div>
			<div class="space-y-1.5">
				<Label for="task-project">Project</Label><Input
					id="task-project"
					value={project}
					oninput={(event) => (project = event.currentTarget.value)}
				/>
			</div>
			<div class="space-y-1.5">
				<Label for="task-note">Notes</Label><Textarea
					id="task-note"
					value={note}
					oninput={(event) => (note = event.currentTarget.value)}
				/>
			</div>
			{#if error}<p role="alert" class="rounded-lg border border-destructive p-3 text-sm">
					{error}
				</p>{/if}<Dialog.Footer
				>{#if editing}<Button type="button" variant="outline" onclick={remove}>Delete task</Button
					>{/if}<Button type="submit">Save task</Button></Dialog.Footer
			>
		</form></Dialog.Content
	></Dialog.Root
>
