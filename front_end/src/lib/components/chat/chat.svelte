<script lang="ts">
	export let chatId = "";
	export let selectedContent = "";

	import ChatMessage from "$lib/modules/chat/chat-message.svelte";
	import { onMount } from "svelte";
	// icon
	import PaperAirplane from "$lib/assets/icons/paper-airplane.svelte";
	import LoadingButtonSpinnerIcon from "$lib/assets/icons/loading-button-spinner-icon.svelte";
	import ArrowPathIcon from "$lib/assets/icons/arrow-path-icon.svelte";

	// tool
	import type { Message, Chat } from "$lib/components/shared/shared.type";
	import { chats$ } from "$lib/components/shared/shared.store";
	import {
		upsertChat,
		scrollToBottom,
	} from "$lib/components/shared/shared-utils";
	import chatResponse from "$lib/modules/chat/network";
	import WaitForKnowledge from "$lib/modules/chat/wait-for-knowledge.svelte";
	import LoadingAnimation from "./loadingAnimation.svelte";

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

	onMount(async () => {
		scrollToDiv = document
		?.querySelector(".chat-scrollbar")!;
		});

	$: enableRegenerateMessage = !loading && chatMessages.length > 2;

	$: {
		if (selectedContent !== "") {
			query = selectedContent;
			selectedContent = "";
			handleSubmit((enableRegenerate = false));
		}
	}

	function insertChat() {
		let title = chatMessages[0]?.content || "New Chat";
		chatId = upsertChat(chatId, chatMessages, title);
	}

	const handleSubmit = async (enableRegenerate: boolean): Promise<void> => {
		
		scrollToBottom(scrollToDiv);
		let queryContent = query;
		query = "";

		answer = "";
		let type: any = {};
		let content = "";
		loading = true;
		if (enableRegenerate) {
			let lastRole = chatMessages[chatMessages.length - 1];
			if (lastRole?.role === "Assistant") {
				chatMessages = chatMessages.filter(
					(_, i: number) => i !== chatMessages.length - 1
				);
				contentQuery = chatMessages[chatMessages.length - 1].content;
			}
		} else {
			contentQuery = queryContent;
			chatMessages = [
				...chatMessages,
				{ role: "Human", content: queryContent },
			];
			scrollToBottom(scrollToDiv);

		}

		type = {
			model: "knowledge",
			knowledge: "ASK_GM",
		};
		const knowledgeContent = chatMessages[chatMessages.length - 1].content;
		const translatedQuery = await chatResponse.translatedQuery(
			knowledgeContent
		);

		const eventSource = chatResponse.chatMessage(
			chatMessages,
			type,
			blob,
			filename,
			knowledgeContent,
			translatedQuery
		);
		eventSource.addEventListener("error", handleError);
		eventSource.addEventListener("message", (e) => {
			let content = e.data;
			if (/^<br\/><br\/>$/.test(content)) {
				content = '';
			}
			scrollToBottom(scrollToDiv);
			console.log('e', content);
			
			try {
				loading = false;
				if (content) {
					if (content != "[DONE]") {
						answer = (answer ? answer + " " : "") + content;
					} else {
						chatMessages = [
							...chatMessages,
							{ role: "Assistant", content: answer },
						];
						scrollToBottom(scrollToDiv);

						insertChat();
						answer = "";
					}
				}
			} catch (err) {
				handleError(err);
			}
		});

		eventSource.stream();
	};

	function handleError<T>(err: T) {
		loading = false;
		query = "";
		answer = "";
	}
</script>

<svelte:head>
	<title>Neural Chat</title>
	<meta name="description" content="Neural Chat" />
</svelte:head>

<div class="flex h-full w-full flex-col p-10 py-4">
	<div
		class="carousel carousel-vertical chat-scrollbar flex h-0 flex-grow flex-col overflow-auto p-4"
	>
		<ChatMessage
			type="Assistant"
			message={`Welcome to Intel ASK GM! 😊`}
			displayTimer={false}
			hiddenTool={true}
		/>
		{#each chatMessages as message, idx}
			<ChatMessage
				type={message.role}
				message={message.content}
				previousMessage={chatMessages[idx - 1]}
			/>
		{/each}
		{#if answer}
			<ChatMessage
				type="Assistant"
				message={answer}
				previousMessage={chatMessages[chatMessages.length - 1]}
			/>
		{/if}
		{#if loading}
			<WaitForKnowledge knowledge_question={contentQuery} />
		{/if}
	</div>

	<div class="mx-auto w-10/12 pb-5">
		<!-- Loading text -->
		{#if loading}
			<LoadingAnimation />
		{/if}

		<!-- regenerate -->
		{#if enableRegenerateMessage}
			<button
				on:click={() => {
					handleSubmit((enableRegenerate = true));
				}}
				type="button"
				class="mx-auto mb-1 flex w-48 items-center justify-center gap-2 self-center whitespace-nowrap rounded-md bg-white px-3 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			>
				<ArrowPathIcon />
				Regenerate response
			</button>
		{/if}

		<!-- Input -->
		<div class="flex items-center justify-center">
			<div class="relative flex w-full items-center justify-center">
				<!-- Textarea -->
				<textarea
					class="textarea textarea-bordered h-12 w-full"
					disabled={loading}
					maxlength="1200"
					bind:value={query}
					on:keydown={(event) => {
						if (event.key === "Enter" && !event.shiftKey && query) {
							event.preventDefault();
							handleSubmit((enableRegenerate = false));
						}
					}}
				/>

				<div class="flex">
					<!-- Send button -->
					<button
						on:click={() => {
							if (query) {
								handleSubmit((enableRegenerate = false));
							}
						}}
						type="submit"
						class="absolute inset-y-0 right-0 py-2 pr-3"
					>
						<PaperAirplane />
					</button>
				</div>
			</div>
		</div>
		<div class="flex justify-between">
			<span class="text-[0.65rem] text-slate-400">
				ASK GM can make mistakes. Consider checking important information.			
			</span>
			<span  class="text-[0.85rem]">{query.length}/1200</span></div>
	</div>
</div>
