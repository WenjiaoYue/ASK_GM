<script lang="ts">
	import PaperAirplane from "$lib/assets/icons/paper-airplane.svelte";
	import {
		ArrowPathIcon,
		CloudArrowUpIcon,
		FingerPrintIcon,
		LockClosedIcon,
	} from "@heroicons/vue/24/outline";
	import Star from "$lib/assets/Agent/star.svelte";
	import { getNotificationsContext } from "svelte-notifications";

	const { addNotification } = getNotificationsContext();


	export let query: string = "";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	const features = [
		{
			name: "成都旅游计划",
			description: "给我制定一个去成都旅行的计划",
			icon: CloudArrowUpIcon,
			goals: [
				"成都旅游最佳时间",
				"成都必游景点",
				// "成都交通指南",
				"成都住宿推荐",
			],
		},
		{
			name: "英特尔公司",
			description: "介绍一下英特尔公司",
			icon: LockClosedIcon,
			goals: [
				"英特尔公司简介",
				"英特尔公司历史",
				"英特尔公司主要产品",
				"英特尔公司最新技术发展",
				"英特尔公司全球市场地位",
			],
		},
		{
			name: "健身计划",
			description: "制定一个健身计划",
			icon: ArrowPathIcon,
			goals: [
				"健身计划初学者指南",
				"每周健身计划示例",
				"健身目标设定方法",
				"适合不同年龄段的健身计划",
			],
		},
		{
			name: "未来城市景象",
			description: "描绘一个未来城市的景象",
			icon: FingerPrintIcon,
			goals: [
				"未来城市设计理念",
				"未来城市交通系统",
				"未来城市建筑风格",
				"未来城市生态环境",
				"未来城市居民生活方式",
			],
		},
	];

	function handleCreate() {
		dispatch("submit", query);
	}

	function handleFeatureClick(feature) {
        dispatch("submitFeature", {
            name: feature.name,
            description: feature.description,
            goals: feature.goals
        });
    }


</script>

<div class="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
	<div class="mx-auto max-w-2xl lg:text-center">
		<h1
			class="bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-7xl font-bold uppercase text-transparent"
		>
			AI AGENT
		</h1>
	</div>

	<dl
		class="mx-auto mt-16 grid max-w-xl grid-cols-1 gap-6 gap-x-8 lg:max-w-4xl lg:grid-cols-2 ml-40"
	>
		{#each features as feature (feature.name)}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="relative rounded-xl bg-white p-2 py-8 pl-16"
				on:click={() => handleFeatureClick(feature)}
			>
				<dt class="text-base font-semibold text-gray-900">
					<div
						class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600"
					>
						<feature.icon />
					</div>
					{feature.name}
				</dt>
				<dd class="mt-2 text-base text-gray-600">{feature.description}</dd>
			</div>
		{/each}
	</dl>

	<div class="relative mt-10 flex items-start justify-center space-x-2">
		<button
			on:click={() => query && handleCreate()}
			class="flex gap-3 items-center cursor-pointer whitespace-nowrap rounded-lg bg-blue-700 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>
			<Star />
			开始创建</button
		>
		<textarea
			class="textarea-bordered h-28 w-full rounded-2xl border-b-2 border-gray-200 border-b-[#00469f]"
			maxlength="1200"
			bind:value={query}
			on:keydown={(event) => {
				if (event.key === "Enter" && !event.shiftKey && query) {
					event.preventDefault();
					handleCreate();
				}
			}}
		/>
		<button
			on:click={() => query && handleCreate()}
			type="submit"
			class="absolute right-0 py-2 pr-3"
		>
			<PaperAirplane />
		</button>
	</div>
</div>
