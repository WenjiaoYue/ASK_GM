<script lang="ts">
	import Chat from "$lib/components/chat/chat.svelte";
	import History from "$lib/components/chat/history.svelte";
	import QA from "$lib/components/sidenavigation/icons/QA.svelte";
	import Question from "$lib/components/sidenavigation/icons/Question.svelte";
	import QAJSON from "$lib/assets/AskGMJson/Ask_GM_QA.json";

	const questionDict: object = QAJSON;
	let selectField: string = "Zizhu Site";
	let selectedContent = "";
	let currentChatID = ''


	let labelList = [
		{
			style: "bg-green-50 text-green-500",
			content: "Zizhu Site",
		},
		{
			style: "bg-blue-100 text-blue-500",
			content: "Health Care",
		},
		{
			style: "bg-yellow-50 text-yellow-500",
			content: "Employee Benefits",
		},
		// {
		// 	style: "bg-sky-50 text-sky-500",
		// 	content: "Time Off",
		// },
		{
			style: "bg-indigo-50 text-indigo-500",
			content: "Appliance",
		},
	];
</script>

<div class="flex h-full">
	<div
		class="carousel carousel-vertical w-0 overflow-auto sm:w-0 md:w-0 xl:mr-4 xl:w-1/5"
	>
		<!-- <div class="mb-4 sm:ml-4 xl:mr-4 sm:w-0 xl:w-1/5 h-full" > -->
		<div class="h-full rounded-2xl bg-white">
			<div class="flex items-center justify-between p-4">
				<p class="text-md font-bold text-black">History</p>
			</div>
			<div class="flex items-center justify-between px-4">
				<History bind:currentChatID />
			</div>
		</div>
	</div>
	<div
		class="h-full w-full rounded-3xl bg-white px-6 shadow sm:w-full xl:w-2/3"
	>
		{#key currentChatID}
			<Chat bind:chatId={currentChatID} bind:selectedContent={selectedContent} />
		{/key}
	</div>
	<div
		class="carousel carousel-vertical w-0 overflow-auto sm:w-0 md:w-1/3 xl:w-1/3"
	>
		<div class="mb-4 sm:ml-4 xl:mr-4">
			<div class="rounded-2xl bg-white shadow-lg">
				<div class="p-4">
					<div class="mb-6 flex items-center justify-between">
						<div class="flex items-center">
							<QA />
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
						class="my-4 flex flex-row flex-wrap items-center justify-start gap-x-2 space-y-1"
					>
						{#each labelList as { style, content: field }}
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<button
								class="items-center rounded-md px-4 py-1 text-xs font-semibold {style}"
								on:click={() => {
									selectField = field;
								}}
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
							<Question />
						</div>
						<div
							class="carousel carousel-vertical overflow-x-hidden overflow-y-scroll"
						>
							{#each questionDict[selectField] as { question }}
								<button
									class="justify-left flex items-center border-b-2 border-gray-100 px-4 py-2 text-gray-600 hover:bg-blue-100 active:bg-blue-500 active:text-white"
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


