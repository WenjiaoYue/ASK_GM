<script lang="ts">
	import Chat from "$lib/components/chat/chat.svelte";
	import History from "$lib/components/chat/history.svelte";
	import QAJSON from "$lib/assets/AskGMJson/Ask_GM_QA.json";
	import OldHelp from "./sidenavigation/icons/oldHelp.svelte";

	const questionDict: object = QAJSON;
	let selectField: string = "Zizhu Site";
	let selectedContent = "";
	let currentChatID = ''


	let labelList = [
		{
			content: "Zizhu Site",
		},
		{
			content: "Health Care",
		},
		{
			content: "Employee Benefits",
		},
		{
			content: "Appliance",
		},
	];
</script>

<div class="flex h-full">
	<div
		class="carousel carousel-vertical w-0 overflow-auto sm:w-0 md:w-0 xl:mr-4 xl:w-1/5"
	>
		<div class="h-full rounded-2xl">
			<div class="flex items-center justify-between p-4">
				<p class="text-md font-bold text-black">History</p>
			</div>
			<div class="flex items-center justify-between px-4">
				<History bind:currentChatID />
			</div>
		</div>
	</div>
	<div
		class="h-full w-full rounded-lg bg-white px-6  sm:w-full xl:w-2/3"
	>
		{#key currentChatID}
			<Chat bind:chatId={currentChatID} bind:selectedContent={selectedContent} />
		{/key}
	</div>
	<div
		class="carousel carousel-vertical w-0 overflow-auto sm:w-0 md:w-1/3 xl:w-1/3"
	>
		<div class="mb-4 sm:ml-4 xl:mr-4">
			<div class="rounded-lg bg-white">
				<div class="p-4">
					<div class="mb-6 flex items-center justify-between">
						<div class="flex items-center">
							<OldHelp />
							<div class="flex flex-col">
								<span class="text-md ml-2 font-bold text-black"
									>Q&A</span
								>
								<span class="ml-2 text-sm text-gray-500 dark:text-white"
									>How can I help you?</span
								>
							</div>
						</div>
					</div>
					<div
						class="my-4 flex flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2"
					>
						{#each labelList as { content: field }, i}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<button
								class="rounded-md px-4 py-1 text-xs font-semibold bg-sky-100 text-sky-500"
								on:click={() => {
									selectField = field;
								}}
								class:ring={selectField === field}
							>
								{field}
							</button>
						{/each}
					</div>
					<div class="m-auto block h-full">
						<div class="flex items-center justify-between">
							<p class="text-md font-bold text-black">
								Related questions:
							</p>
						</div>
						<div
							class="carousel carousel-vertical overflow-x-hidden overflow-y-scroll"
						>
							{#each questionDict[selectField] as { question }}
								<button
									class="justify-left flex items-center border-b-2 border-gray-100 px-4 py-2 text-gray-600 hover:bg-sky-100 active:bg-sky-500 active:text-white"
									on:click={() => (selectedContent = question)}
								>
									<p
										class="flex items-center text-left text-xs"
									>
										{question}
									</p>
								</button>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


