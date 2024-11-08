<script lang="ts">
	export let chatId = "";
	export let selectedContent = "";

	import { onMount } from "svelte";

	// tool
	import type { Message, Chat } from "$lib/components/shared/shared.type";
	import { chats$, netError } from "$lib/components/shared/shared.store";
	import {
		upsertChat,
		scrollToBottom,
	} from "$lib/components/shared/shared-utils";
	import HOME from "$lib/components/home.svelte"; // Adjust the import path as necessary
	import CreateGoal from "$lib/components/create.svelte"; // Adjust the import path as necessary
	import LoadingAnimation from "./loadingAnimation.svelte";
	import TimeLine from "$lib/components/timeline.svelte";
	import GenerateGoal from "$lib/components/generateGoal.svelte";
	import { getNotificationsContext } from "svelte-notifications";
	import {
		fectchAgentGoal,
		fetchAgentExecute,
		fetchAgentSummary,
	} from "$lib/modules/network";
	import LoadingStatic from "../agent/loadingStatic.svelte";
	const { addNotification } = getNotificationsContext();

	let query: string = "";
	let answer: string = "";
	let loading: boolean = false;
	let is_done: boolean = false;
	let enableRegenerate: boolean = false;
	let scrollToDiv: HTMLDivElement;
	let contentQuery: string = "";

	const chat = chatId && $chats$?.[chatId];
	let chatMessages: Message[] = (chat as Chat)?.messages?.filter(Boolean) || [];
	let blob: string;
	let filename: string;

	let tool: string;
	let content: any[] = [];
	let name: string;
	let summaryList: any[] = [];
	let selectedGoalIndex: number | null = null; // 存储选中的goal索引

	let selectedGoals: Message[] = (chat as Chat)?.selectedGoals || [];
	let summary = (chat as Chat)?.summary || "";
	let agentName = (chat as Chat)?.agentName || "";
	let agentDescripe = (chat as Chat)?.agentDescripe || "";
	let source: any[] = [];
	let goals: any[] = [];
	let showAgent: boolean = false;
	let currentGoalIdx = 0;
	import { sineIn } from "svelte/easing";

	let hidden8 = true;
	let transitionParamsBottom = {
		y: 320,
		duration: 200,
		easing: sineIn,
	};

	function handleGoalClick(event) {
		selectedGoalIndex = event.detail; // 获取传递的goal索引
		console.log("Goal", selectedGoalIndex);
	}

	onMount(async () => {
		scrollToDiv = document?.querySelector(".chat-scrollbar")!;
		console.log("scrollToDiv", scrollToDiv);
	});

	function insertChat() {
		console.log("summary", summary);

		let title =
			chatMessages.length > 0
				? agentName !== ""
					? agentName
					: "新 Agent"
				: "新 Agent";
		chatId = upsertChat(
			chatId,
			chatMessages,
			title,
			agentName,
			agentDescripe,
			selectedGoals,
			summary
		);
	}

	function handleError<T>(err: T) {
		console.log("coming");
		netError.set(true);

		loading = false;
		query = "";
		answer = "";
	}

	const fetchSummary = async (
		query: string,
		summaryList: any[]
	): Promise<void> => {
		scrollToBottom(scrollToDiv);

		const eventSource = await fetchAgentSummary(query, summaryList);
		eventSource.addEventListener("error", handleError);
		eventSource.addEventListener("message", (e) => {
			let content = e.data;
			console.log("content", content, summary);
			scrollToBottom(scrollToDiv);

			try {
				if (content) {
					if (content != "[DONE]") {
						summary = (summary ? summary + " " : "") + content;
						console.log("summary", summary);
					} else {
						scrollToBottom(scrollToDiv);
						insertChat();
						loading = false;
					}
				}
			} catch (err) {
				handleError(err);
			}
		});

		eventSource.stream();
	};

	async function fetchGoals(query: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			fetchAgentExecute(query)
				.then((eventSource) => {
					eventSource.addEventListener("error", (e: any) => {
						if (e.type === "error") {
							console.error("Stream error:", e);
							reject(e); // Reject if there's an error
						}
					});
					eventSource.addEventListener("message", (e: any) => {
						let msg = e.data;
						if (msg === "[DONE]") {
							console.log("Done", content[content.length - 1]);
							summaryList.push(content[content.length - 1]);

							chatMessages = [
								...chatMessages,
								{ tool: tool, content: content, goal: query, source: source },
							];
							console.log("chatMessages", chatMessages);
							// 	{ tool, content, agentName, agentDescripe, selectedGoals },

							resolve(); // Resolve the promise when "[DONE]" is received
						} else {
							console.log("msg", msg);
							if (JSON.parse(msg)) {
								const currentMsg = JSON.parse(msg);
								if (currentMsg.tool) {
									tool = currentMsg.tool;
								}

								if (currentMsg.source) {
									source = currentMsg.source;
								}

								if (currentMsg.content) {
									content = [...(content as any[]), ...currentMsg.content];
								}
								console.log("JSON.parse(msg).content", JSON.parse(msg).content);
							} else {
								console.log("后端返回异常");
								loading = false;
								return;
							}

							// tool, content, name, agentName, selectedGoals, summaryList
						}
					});

					eventSource.stream();
				})
				.catch((error) => {
					console.error("Error:", error);
					reject(error); // Reject if there's a fetch error
				});
		});
	}

	async function handleExecute(event) {
		let {
			goals: newGoals,
			agentName: newAgentName,
			agentDescripe: newAgentDescripe,
		} = event.detail;
		agentDescripe = newAgentDescripe;
		agentName = newAgentName;
		newGoals = newGoals;
		showAgent = true;

		for (const [index, goal] of newGoals.entries()) {
			selectedGoals = [...selectedGoals, goal];
			currentGoalIdx = index + 1;
			console.log("selectedGoals", selectedGoals); // 打印 selectedGoals

			try {
				loading = true;
				await fetchGoals(goal);
				console.log(`当前索引: ${index}`);
			} catch (error) {
				console.error(`Error fetching goal "${goal}":`, error);
				break;
			}
		}

		try {
			await fetchSummary(query, summaryList);
		} catch (error) {
			console.error(`Error fetching summary:`, error);
		}
		insertChat();

		console.log("All goals processed.");
	}

	function showNotification(text: string, type: string) {
		addNotification({
			text: text,
			position: "top-left",
			type: type,
			removeAfter: 3000,
		});
	}

	async function handleCreate(event: CustomEvent) {
		query = event.detail;
		const res = await fectchAgentGoal(query);
		// succeed
		if (res) {
			goals = res;
		} else {
			netError.set(true);
			setTimeout(() => {
				netError.set(false);
			}, 3000);

			showNotification("请先输入项目描述", "error");
		}
	}

	function handleFeatureClick(event) {
		const { name, description, goals: eventGoals } = event.detail;
		query = description;
		agentName = name;
		goals = eventGoals;
	}

	function cancelCreate() {
		query = "";
	}

	let isDrawerOpen = false; // 状态变量，用于控制抽屉的展开和收起

	// function handelDisplaySummary() {
	// 	hidden8 = false;
	// }
</script>

<svelte:head>
	<title>AI Agent</title>
	<meta name="description" content="AI Agent" />
</svelte:head>

<div class="flex h-full w-full flex-col p-4">
	{#if chatMessages.length === 0 && query === ""}
		<HOME on:submit={handleCreate} on:submitFeature={handleFeatureClick} />
	{:else if query && !showAgent}
		<CreateGoal
			{goals}
			agentDescripe={query}
			on:execute={handleExecute}
			{agentName}
		/>
	{:else if showAgent || chatMessages.length > 0}
		<div class="h-full rounded-2xl bg-white">
			<main class="mx-auto flex h-full max-w-7xl flex-col">
				<div
					class="h-1/8 flex-shrink-0 border-b border-gray-200 px-4 pb-6 pt-10"
				>
					<h1 class="text-4xl font-bold tracking-tight text-gray-900">
						{agentName}
					</h1>
					<p class="mt-1 max-w-2xl text-sm/6 text-gray-500">
						{agentDescripe}
					</p>
				</div>

				<div
					class={`flex w-full flex-grow overflow-hidden transition-all duration-300 ${
						isDrawerOpen ? "h-auto" : "h-0"
					}`}
				>
					<div class="flex h-full w-1/3 justify-center bg-gray-100">
						<TimeLine
							on:goalClick={handleGoalClick}
							{selectedGoals}
							{summary}
						/>
					</div>
					<!-- on:displaySummary={handelDisplaySummary} -->
					<div
						class="chat-scrollbar hiddenScroll relative w-2/3 overflow-auto bg-white p-0"
					>
						<!-- <div class="sticky top-0 left-4 z-10 bg-white p-2"> 
							{#if loading}
								<div class="flex gap-5">
									<LoadingAnimation />
									<span
										class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
									>
										({currentGoalIdx} / {goals.length} runs) Thinking ...
									</span>
								</div>
							{:else}
								<LoadingStatic />
							{/if}
						</div> -->
						<div class="p-2">
							{#if loading}
								<div class="flex gap-5">
									<LoadingAnimation />
									<span
										class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
									>
										({currentGoalIdx} / {goals.length} runs) Thinking ...
									</span>
								</div>
							{:else}
								<LoadingStatic />
							{/if}
						</div>

						<GenerateGoal {selectedGoalIndex} {chatMessages} {summary} />
					</div>
				</div>
			</main>
		</div>
	{/if}
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
