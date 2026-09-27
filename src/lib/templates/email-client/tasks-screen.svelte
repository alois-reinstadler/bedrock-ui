<script lang="ts">
	import { useWorkspace } from './workspace.svelte.js';
	const workspace = useWorkspace();
	const active = true;

	import { tick } from 'svelte';
	import { parseDate, type CalendarDate } from '@internationalized/date';
	import Star from '@lucide/svelte/icons/star';
	import Plus from '@lucide/svelte/icons/plus';
	import CheckCheck from '@lucide/svelte/icons/check-check';
	import { Button } from '#lib/bedrock/ui/button';
	import { Badge } from '#lib/bedrock/ui/badge';
	import { Checkbox } from '#lib/bedrock/ui/checkbox';
	import { Input } from '#lib/bedrock/ui/input';
	import { Label } from '#lib/bedrock/ui/label';
	import { Textarea } from '#lib/bedrock/ui/textarea';
	import { DateInput } from '#lib/bedrock/ui/date-input';
	import * as Dialog from '#lib/bedrock/ui/dialog';
	import { demoToday, type WorkspaceTask } from './productivity-data.js';
	let quickTitle = $state('');
	const projects = $derived([...new Set(workspace.tasks.map((task) => task.project))].sort());
	let open = $state(false);
	let editing = $state<string | null>(null);
	let title = $state('');
	let due = $state<CalendarDate | undefined>(parseDate(demoToday));
	let project = $state('Launch');
	let note = $state('');
	let error = $state('');
	let announcement = $state('');
	const visible = $derived(
		workspace.tasks
			.filter(
				(task) =>
					(workspace.taskFilter === 'Completed'
						? task.completed
						: !task.completed &&
							(workspace.taskFilter === 'All'
								? true
								: workspace.taskFilter === 'Important'
									? task.important
									: workspace.taskFilter === 'Today'
										? task.due <= demoToday
										: task.due > demoToday)) &&
					(workspace.selectedProject === 'All projects' ||
						task.project === workspace.selectedProject) &&
					`${task.title} ${task.project} ${task.note}`
						.toLowerCase()
						.includes(workspace.query.toLowerCase())
			)
			.sort((a, b) => a.due.localeCompare(b.due))
	);
	const completed = $derived(workspace.tasks.filter((task) => task.completed).length);
	export async function revealTask(id: string) {
		workspace.taskFilter = 'Today';
		workspace.selectedProject = 'All projects';
		workspace.query = '';
		await tick();
		document.getElementById(`task-${id}`)?.focus();
	}
	function edit(task?: WorkspaceTask) {
		editing = task?.id ?? null;
		title = task?.title ?? '';
		due = parseDate(task?.due ?? demoToday);
		project =
			task?.project ??
			(workspace.selectedProject === 'All projects' ? 'Launch' : workspace.selectedProject);
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
			important: workspace.tasks.find((task) => task.id === editing)?.important ?? false,
			completed: workspace.tasks.find((task) => task.id === editing)?.completed ?? false
		};
		workspace.tasks = editing
			? workspace.tasks.map((item) => (item.id === editing ? task : item))
			: [...workspace.tasks, task];
		workspace.taskFilter = task.completed
			? 'Completed'
			: task.due > demoToday
				? 'Upcoming'
				: 'Today';
		workspace.query = '';
		workspace.selectedProject = 'All projects';
		announcement = `${task.title} ${editing ? 'updated' : 'added'}.`;
		open = false;
	}
	function quickAdd(event: SubmitEvent) {
		event.preventDefault();
		if (!quickTitle.trim()) return;
		const task: WorkspaceTask = {
			id: `task-${Date.now()}`,
			title: quickTitle.trim(),
			due: demoToday,
			project:
				workspace.selectedProject === 'All projects' ? 'Personal' : workspace.selectedProject,
			note: '',
			completed: false
		};
		workspace.tasks = [...workspace.tasks, task];
		workspace.taskFilter = 'Today';
		workspace.query = '';
		quickTitle = '';
		announcement = `${task.title} added for today.`;
	}
	function dueLabel(value: string) {
		if (value === demoToday) return 'Due today';
		return `Due ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(parseDate(value).toDate('UTC'))}`;
	}

	async function toggle(id: string) {
		const task = workspace.tasks.find((task) => task.id === id);
		if (task) {
			task.completed = !task.completed;
			announcement = `${task.title} marked ${task.completed ? 'complete' : 'incomplete'}.`;
			await tick();
			document.getElementById('tasks-list-heading')?.focus();
		}
	}
	function remove() {
		const task = workspace.tasks.find((task) => task.id === editing);
		workspace.tasks = workspace.tasks.filter((task) => task.id !== editing);
		announcement = `${task?.title ?? 'Task'} deleted.`;
		open = false;
	}
</script>

<section class="tasks-screen">
	<header class="workspace-page-heading">
		<div>
			<h1 id="tasks-screen-heading" tabindex="-1">Tasks</h1>
			<p>
				{workspace.tasks.filter((task) => !task.completed).length} open tasks · Monday, September 14
			</p>
		</div>
		<Button size="sm" onclick={() => edit()}><Plus class="size-4" />New task</Button>
	</header>
	<div class="tasks-body">
		<div class="tasks-filterbar">
			<div role="group" aria-label="Task filters">
				{#each ['All', 'Today', 'Upcoming', 'Important', 'Completed'] as item (item)}<button
						class:active={workspace.taskFilter === item}
						aria-pressed={workspace.taskFilter === item}
						onclick={() => (workspace.taskFilter = item as typeof workspace.taskFilter)}
						>{item}</button
					>{/each}
			</div>
			<span>{completed}/{workspace.tasks.length} completed</span>
		</div>
		<nav class="project-filter" aria-label="Task projects">
			{#each ['All projects', ...projects] as item (item)}<button
					class:active={workspace.selectedProject === item}
					aria-pressed={workspace.selectedProject === item}
					onclick={() => {
						workspace.selectedProject = item;
						workspace.taskFilter = 'All';
						workspace.query = '';
					}}>{item}</button
				>{/each}
		</nav>
		<div class="task-list">
			<form class="flex items-center gap-2 border-b px-4 py-3" onsubmit={quickAdd}>
				<Plus class="size-4 shrink-0 text-muted-foreground" />
				<Input
					aria-label="Quick task name"
					name="quick-task"
					placeholder={workspace.selectedProject === 'All projects'
						? 'Add a task for today…'
						: `Add a task to ${workspace.selectedProject}…`}
					value={quickTitle}
					oninput={(event) => (quickTitle = event.currentTarget.value)}
					maxlength={120}
					class="border-0 bg-transparent shadow-none"
					required
				/>
				<Button type="submit" variant="outline" size="sm" disabled={!quickTitle.trim()}
					>Add task</Button
				>
			</form>
			<div class="flex items-center justify-between gap-3 border-b bg-muted/20 px-5 py-3">
				<h2 id="tasks-list-heading" tabindex="-1" class="text-sm font-medium">
					{workspace.selectedProject !== 'All projects'
						? workspace.selectedProject
						: workspace.taskFilter === 'All'
							? 'All tasks'
							: workspace.taskFilter === 'Today'
								? 'Today'
								: workspace.taskFilter === 'Upcoming'
									? 'Upcoming'
									: workspace.taskFilter === 'Important'
										? 'Important'
										: 'Completed'}
				</h2>
				<Badge variant="outline">{visible.length} {visible.length === 1 ? 'task' : 'tasks'}</Badge>
			</div>
			<ul class="divide-y">
				{#each visible as task (task.id)}<li class="task-row flex items-start gap-3">
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
								class="mt-2 flex flex-wrap items-center gap-2 text-xs"
								><Badge variant="secondary">{task.project}</Badge><span
									class="text-muted-foreground"
									>{dueLabel(task.due)}{!task.completed && task.due < demoToday
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
							{workspace.query
								? 'No matching tasks'
								: workspace.taskFilter === 'Completed'
									? 'Your completed tasks will appear here'
									: workspace.taskFilter === 'Today'
										? 'You are clear for today'
										: 'No tasks to show'}
						</h3>
						<p class="mt-2 text-sm text-muted-foreground">
							{workspace.query
								? 'Try another title or project name.'
								: 'Add a next step when you are ready.'}
						</p>
						{#if workspace.query}<Button
								class="mt-4"
								variant="outline"
								onclick={() => (workspace.query = '')}>Clear task search</Button
							>{:else}<Button class="mt-4" variant="outline" onclick={() => edit()}
								>Add a task</Button
							>{/if}
					</li>{/each}
			</ul>
		</div>
	</div>
	<p role="status" class="sr-only">{announcement}</p>
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

<style>
	.tasks-body {
		padding: 0 28px 100px;
		max-width: 1120px;
		margin: auto;
	}
	.tasks-filterbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid var(--border);
		gap: 12px;
	}
	.tasks-filterbar > div {
		display: flex;
		gap: 22px;
		overflow: auto;
	}
	.tasks-filterbar button {
		padding: 20px 0 15px;
		font-size: 12px;
		color: var(--muted-foreground);
		border-bottom: 2px solid transparent;
		white-space: nowrap;
	}
	.tasks-filterbar button.active {
		border-color: #5967c7;
		color: var(--foreground);
		font-weight: 600;
	}
	.tasks-filterbar > span {
		font-size: 11px;
		color: var(--muted-foreground);
		white-space: nowrap;
	}
	.project-filter {
		display: flex;
		gap: 8px;
		flex-wrap: wrap;
		padding: 20px 0;
	}
	.project-filter button {
		font-size: 11px;
		padding: 5px 10px;
		border-radius: 5px;
		color: var(--muted-foreground);
		border: 1px solid transparent;
	}
	.project-filter button.active {
		background: var(--muted);
		border-color: var(--border);
		color: var(--foreground);
	}
	.task-list {
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}
	.task-row {
		padding: 18px 20px;
		font-size: 13px;
	}
	.task-row:hover {
		background: color-mix(in oklab, var(--muted) 35%, transparent);
	}
	@media (max-width: 767px) {
		.tasks-body {
			padding: 0 16px 100px;
		}
		.tasks-filterbar > div {
			gap: 15px;
		}
		.tasks-filterbar > span {
			display: none;
		}
		.task-row {
			padding: 16px;
		}
		.project-filter {
			gap: 3px;
		}
	}
</style>
