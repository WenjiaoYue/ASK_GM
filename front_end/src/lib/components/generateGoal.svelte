<script lang="ts">
	import Resource from "$lib/assets/Agent/resource.svelte";
	import { marked } from "marked";
	import { onMount, afterUpdate } from "svelte";

	let openIndex: number | null = null;

	export let selectedGoalIndex: number | null;
	export let chatMessages;
	export let summary;

	console.log('chatMessages', chatMessages);
	

	// 监视 selectedGoalIndex 的变化
	$: if (selectedGoalIndex !== null) {
		openIndex = selectedGoalIndex;
	}

	const toggleOpenIndex = (index: number) => {
		openIndex = openIndex === index ? null : index;
	};
	

	const renderMarkdown = (content: string) => marked(content);

	const scrollToSelectedGoal = () => {
		if (selectedGoalIndex !== null) {
			const goalElement = document.getElementById(`goal-${selectedGoalIndex}`);
			if (goalElement) {
				goalElement.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	};

	onMount(() => {
		scrollToSelectedGoal();
	});

	afterUpdate(() => {
		scrollToSelectedGoal();
	});
</script>

<div class="mx-auto w-full gap-4 overflow-auto p-4 pt-0">
	{#each chatMessages as goal, index}
		<div class="border-b py-2" id={`goal-${index}`}>
			<div class="flex">
				<div>
					<h2 class="flex items-center text-sm font-semibold leading-6">
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<span
							class="flex cursor-pointer items-center gap-1 rounded bg-gray-100 px-3 py-1 text-slate-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 {openIndex ===
							index
								? 'highlight'
								: ''}"
							on:click={() => toggleOpenIndex(index)}
						>
							<span>{goal.goal}</span>
							<span class="ml-2 text-xs">{openIndex === index ? "▲" : "▼"}</span
							>
						</span>

						<span class="ml-2 h-4 w-px bg-slate-300" />
						{#if goal.tool}
							<span
								class="me-2 ms-3 rounded bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
							>
								{goal.tool}
							</span>
						{/if}
					</h2>

					{#if openIndex === index}
						{#each goal.content.slice(0, -1) as msg}
							<div
								class="mt-2 max-h-[10rem] w-full overflow-auto rounded-lg border border-b bg-gray-100 p-4 text-sm dark:bg-gray-800"
							>
								<p>{@html renderMarkdown(msg)}</p>
							</div>
						{/each}
					{/if}

					<p class="my-2 mt-2 py-2 text-sm leading-5 text-slate-600">
						{@html renderMarkdown(goal.content[goal.content.length - 1])}
					</p>
				</div>
			</div>

			{#if goal.source}
				<div
					class="mb-3 mt-1 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
				>
					{#each goal.source as source, idx}
						<a
							href={source[1]}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-4 overflow-hidden overflow-ellipsis  rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
						>
							<Resource />
							{source[0]}
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.highlight {
		background-color: #e0f7fa;
		border-left: 4px solid #00796b;
	}
</style>
