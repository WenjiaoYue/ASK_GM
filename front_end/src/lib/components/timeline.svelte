<script lang="ts">
	import Time from "$lib/assets/Agent/time.svelte";
	import { displayedGoals } from "./shared/store";
	import { createEventDispatcher } from "svelte";

	export let selectedGoals;
	export let summary;
	let selectedIndex: number | null = null;
	console.log("selectedGoals", selectedGoals);

	const dispatch = createEventDispatcher();

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	let isSummaryVisible = false; // 初始状态为false

	function handleGoalClick(index: number) {
		selectedIndex = index;
		dispatch("goalClick", index);
		scrollToTop(); // Scroll to the top of the page
	}

	function displaySummary() {
		isSummaryVisible = !isSummaryVisible; 
		dispatch("displaySummary", { isSummaryVisible }); 

		console.log('showSummary', isSummaryVisible);
	}
</script>

<div class="relative mt-4 h-full overflow-auto hiddenScroll">
	<div
		class="absolute left-[1rem] top-0 h-full border-l border-gray-200 dark:border-gray-700"
	/>
	<ol class="relative">
		{#each selectedGoals as goal, index}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				class="mb-10 flex cursor-pointer items-start rounded-lg p-4 transition-colors duration-200 {selectedIndex ===
				index
					? 'bg-white shadow-lg'
					: 'bg-transparent'}"
				on:click={() => handleGoalClick(index)}
			>
				<span
					class="flex h-8 w-8 flex-shrink-0 -translate-x-1/2 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900"
				>
					<Time />
				</span>
				<div class="ml-4">
					<h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
						任务 {index + 1}
					</h3>
					<p
						class="mb-0 text-base font-normal text-gray-500 dark:text-gray-400"
					>
						{goal}
					</p>
				</div>
			</li>
		{/each}

		{#if summary !== ""}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<li
				class="mb-10 flex cursor-pointer items-start rounded-lg bg-white p-4 shadow-lg transition-colors duration-200"
				on:click={() => displaySummary()}
				>
				<span
					class="flex h-8 w-8 flex-shrink-0 -translate-x-1/2 items-center justify-center rounded-full bg-blue-100 ring-8 ring-white dark:bg-blue-900 dark:ring-gray-900"
				>
					<Time />
				</span>
				<div class="ml-4">
					<h3 class="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
						Summary
					</h3>
				</div>
			</li>
		{/if}
	</ol>
</div>

<style>
	.hiddenScroll::-webkit-scrollbar {
    display: none;
  }

  .hiddenScroll {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
