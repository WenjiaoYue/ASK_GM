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
		class="h-full w-full rounded-3xl bg-white px-6 shadow sm:w-full xl:w-2/3 mx-28"
	>
		{#key currentChatID}
			<Chat bind:chatId={currentChatID} bind:selectedContent={selectedContent} />
		{/key}
	</div>
	
</div>


