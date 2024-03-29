<script lang="ts">
	import MessageAvatar from "$lib/assets/icons/message-avatar.svelte";
	import MessageTimer from "./message-timer.svelte";
	import LikeButtonIcon from "$lib/assets/icons/likeButtonIcon.svelte";
	import DislikeButtonIcon from "$lib/assets/icons/dislikeButtonIcon.svelte";
	import ActiveDislikeButtonIcon from "$lib/assets/icons/ActiveDislikeButtonIcon.svelte";
	import ActiveLikeButtonIcon from "$lib/assets/icons/ActiveLikeButtonIcon.svelte";
	import TextToImgButtonIcon from "$lib/assets/icons/text2imgButtonIcon.svelte";
	import TranslateIcon from "$lib/assets/icons/translateIcon.svelte";
	import { env } from "$env/dynamic/public";
	import { createEventDispatcher } from "svelte";
	import { scrollToBottom } from "$lib/components/shared/shared-utils";
	import chatResponse from "$lib/modules/chat/network";
	import { language_map } from "$lib/common/constant";
	import { Button, Checkbox, Input, Label, Modal } from "flowbite-svelte";
	import NoTranslate from "$lib/assets/icons/NoTranslate.svelte";
	import ActiveText2Img from "$lib/assets/icons/activeText2Img.svelte";

	let formModal = false;
	let clickLike = false;
	let clickDislike = false;
	let showImg = false;
	let clickTranslate = false;
	let textareaValue = "";
	let checkboxValues: boolean[] = [false, false, false];

	let dispatch = createEventDispatcher();
	let imgPromise: Promise<any>;
	let likePromise: Promise<any>;
	let scrollToDiv: HTMLDivElement;
	let comments = "";

	export let type: string;
	export let message: string;
	export let displayTimer: Boolean = true;
	export let previousMessage: { role: string; content: string };
	export let hiddenTool: Boolean = false;

	const msg = "Welcome to Neural Chat! 😊";
	const checkboxLabels = [
		"This is harmful / unsafe",
		"This isn't true",
		"This isn't helpful",
		"The link is invalid",
	];

	async function handleSubmit() {
		const selectedValues = checkboxValues
			.map((value, index) => (value ? checkboxLabels[index] : null))
			.filter((value) => value !== null);
		selectedValues.unshift(textareaValue);
		comments = selectedValues.join("#%#");
		[clickLike, clickDislike] = [false, true];
		const res = await handleLikeClick(1);
		if (res) {
			formModal = false;
		}
	}

	function typewriter(node: HTMLElement, { speed = 5 }) {
		const valid =
			node.childNodes.length === 1 &&
			node.childNodes[0].nodeType === Node.TEXT_NODE;

		if (!valid) {
			throw new Error(
				`This transition only works on elements with a single text node child`
			);
		}

		const text = node.textContent;
		const duration = text.length / (speed * 0.06);
		scrollToBottom(scrollToDiv);

		return {
			duration,
			tick: (t) => {
				const i = Math.trunc(text.length * t);
				node.textContent = text.slice(0, i);
				if (t === 1) {
					dispatch("push");
				}
			},
		};
	}

	async function handleTranslateClick() {
		const translateResult = await chatResponse.translateFunc(message);		
		message = translateResult.tranlated_content;
		clickTranslate = !clickTranslate;
	}

	function removeHtmlContent(input: string): string {
		const hrIndex = input.indexOf(
			"<hr style='border: 1px solid white; margin:0.5rem 0; '>"
		);

		if (hrIndex !== -1) {
			return input.substring(0, hrIndex);
		}

		return input;
	}
	async function handleLikeClick(feedback: number) {
		const url = env.LIKE_URL;
		let finalAnswer = removeHtmlContent(message);
		if (feedback === 0) {
			comments = "";
		}
		likePromise = (async () => {
			const init: RequestInit = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					question: previousMessage.content,
					answer: finalAnswer,
					feedback: feedback,
					comments: comments,
				}),
			};
			return await fetch(url, init);
		})();
		let response = await likePromise
			.then((result) => {
				return result.json();
			})
			.catch((err) => {
				return "Failed";
			});
		return response === "Succeed";
	}

	async function handleImgClick() {
		if (showImg == true) {
			showImg = false;
			return;
		}
		const url = env.TXT2IMG;

		imgPromise = (async () => {
			const init: RequestInit = {
				method: "POST",
				// mode: 'no-cors',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					prompt: message,
					steps: 25,
					guidance_scale: 7.5,
					seed: 42,
					token: "intel_sd_bf16_112233",
				}),
			};
			let response = await fetch(url, init);
			return (await response.json()).img_str;
		})();

		showImg = true;
	}
</script>

<div
	class="mt-4 flex w-full space-x-3 {type === 'Human' || type === 'user'
		? 'ml-auto justify-end'
		: ''}"
>
	{#if type === "Assistant" || type === "assistant" || type === "system"}
		<div
			class="flex h-[2rem] w-[2rem] items-center justify-center rounded bg-[#0068B5]"
		>
			<MessageAvatar role="Assistant" />
		</div>
	{/if}
	<div class="group relative">
		<div
			class={type === "Human" || type === "user"
				? "wrap-style rounded-l-lg rounded-br-lg bg-blue-600 p-3 text-white"
				: "wrap-style rounded-r-lg rounded-bl-lg bg-gray-200 p-5"}
		>
			{#if message.indexOf("blob:") !== -1}
				<audio class="w-120 h-5" controls src={message} disabled={!message} />
			{:else}
				<p class="message text-[0.85rem] leading-[1.3rem]">{@html message}</p>
			{/if}
		</div>
		<!-- && message !== msg  -->
		{#if (type === "Assistant" || type === "assistant") && !hiddenTool}
			<div class="absolute -top-5 right-0 hidden h-5 group-hover:flex">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<figure
					class="h-5 w-5 cursor-pointer text-black hover:text-yellow-600 hover:opacity-100"
					on:click={() => {
						[clickLike, clickDislike] = [true, false];
						handleLikeClick(0);
					}}
				>
					{#if clickLike}
						<ActiveLikeButtonIcon />
					{:else}
						<LikeButtonIcon />
					{/if}
				</figure>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<figure
					class="h-5 w-3 -translate-y-1 rotate-180 cursor-pointer text-black hover:text-yellow-600 hover:opacity-100"
					on:click={() => {
						formModal = true;
					}}
				>
					{#if clickDislike}
						<ActiveDislikeButtonIcon />
					{:else}
						<DislikeButtonIcon />
					{/if}
				</figure>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- <figure
					class="ml-1 h-5 w-5 cursor-pointer text-black hover:text-yellow-600 hover:opacity-100"
					on:click={handleImgClick}
				>
					{#if showImg}
						<ActiveText2Img />
					{:else}
						<TextToImgButtonIcon />
					{/if}
				</figure> -->
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<figure
					class="h-3 w-3 ml-1 cursor-pointer text-black opacity-70 hover:text-yellow-600 hover:opacity-100"
					on:click={handleTranslateClick}
				>
					{#if clickTranslate}
						<NoTranslate />
					{:else}
						<TranslateIcon />
					{/if}
				</figure>
			</div>
		{/if}
		{#if showImg}
			{#await imgPromise}
				<progress class="progress" />
			{:then src}
				<img class="w-26 h-26 mt-2" src="data:image/png;base64,{src}" alt="" />
			{/await}
		{/if}

		{#if displayTimer}
			<MessageTimer />
		{/if}
		<div bind:this={scrollToDiv} />
	</div>
	{#if type === "Human" || type === "user"}
		<div
			class="flex h-[2rem] w-[2rem] items-center justify-center rounded bg-[#45b7f3]"
		>
			<MessageAvatar role="Human" />
		</div>
	{/if}
</div>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<div
		class="flex items-center justify-between border-b border-black/10 pb-5 dark:border-white/10"
	>
		<div class="flex items-center">
			<div
				class="mr-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:h-10 sm:w-10"
			>
				<svg
					stroke="currentColor"
					fill="none"
					stroke-width="2"
					viewBox="0 0 24 24"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="icon-lg text-red-600"
					aria-hidden="true"
					height="1em"
					width="1em"
					xmlns="http://www.w3.org/2000/svg"
					><path
						d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"
					/></svg
				>
			</div>
			<div class="flex flex-col gap-1 text-center sm:text-left">
				<h3 class="text-md font-medium leading-6 text-gray-900">
					Provide additional feedback
				</h3>
			</div>
		</div>
	</div>
	<form class="flex flex-col space-y-6" action="#">
		<textarea
			on:input={(event) => (textareaValue = event.target.value)}
			placeholder="What was the issue with the response? How could it be improved?"
			rows="3"
			class="mb-1 w-full resize-none rounded-md text-xs"
			style="height: 90.1333px; overflow-y: hidden;"
			data-listener-added_17bacc33="true"
		/>
		<div class="mb-8">
			<Checkbox bind:checked={checkboxValues[0]} value={checkboxLabels[0]}>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="flex items-center text-xs text-gray-700"
					>This is harmful / unsafe</label
				>
			</Checkbox>
			<Checkbox bind:checked={checkboxValues[1]} value={checkboxLabels[1]}>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="my-1 flex items-center text-xs text-gray-700"
					>This isn't true</label
				>
			</Checkbox>
			<Checkbox bind:checked={checkboxValues[2]} value={checkboxLabels[2]}>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="flex items-center text-xs text-gray-700">
					This isn't helpful
				</label>
			</Checkbox>
			<Checkbox bind:checked={checkboxValues[3]} value={checkboxLabels[3]}>
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="my-1 flex items-center text-xs text-gray-700">
					The link is invalid
				</label>
			</Checkbox>
		</div>
		<button class="btn btn-neutral relative" on:click={handleSubmit}
			><div class="flex w-full items-center justify-center gap-2">
				Submit feedback
			</div></button
		>
	</form>
</Modal>

<style>
	.wrap-style {
		width: 100%;
		height: auto;
		word-wrap: break-word;
		word-break: break-all;
	}

	audio::-webkit-media-controls-panel {
		background-color: rgb(37 99 235);
	}
</style>
