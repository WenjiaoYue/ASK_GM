<script lang="ts">
	import TimeLine from "./timeline.svelte";
	import GenerateGoal from "./generateGoal.svelte";
	import LoadingAnimation from "./chat/loadingAnimation.svelte";
	export let agentName: string;
	export let agentDescripe: string;
	export let currentMsgs: string[] = []; 
	let loading = true;
	let selectedGoalIndex: number | null = null; // 存储选中的goal索引

	$: loading = currentMsgs.length === 0;

	function handleGoalClick(event) {
		selectedGoalIndex = event.detail; // 获取传递的goal索引
		console.log('Goal', selectedGoalIndex);
		
	}
</script>

<div class="bg-white">
	<div>
		<main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="border-b border-gray-200 pb-6 pt-10">
				<h1 class="text-4xl font-bold tracking-tight text-gray-900">
					{agentName}
				</h1>
				<p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
					{agentDescripe}
				</p>
			</div>

			<div class="flex h-screen w-full h-full">
				<div class="w-1/3 bg-gray-100 p-4 h-full">
					<TimeLine on:goalClick={handleGoalClick} />
				</div>

				<div class="w-2/3 border bg-white h-full">
					{#if loading}
						<LoadingAnimation />
					{/if}
					<GenerateGoal {selectedGoalIndex} />
				</div>
			</div>
		</main>
	</div>
</div>
