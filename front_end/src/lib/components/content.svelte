<script lang="ts">
	import Chat from "$lib/components/chat/chat.svelte";
	import History from "$lib/components/chat/history.svelte";

	let selectedContent = "";
	let currentChatID = ''

</script>

<div class="flex h-full w-full">
	<div
		class="carousel carousel-vertical w-0 overflow-auto sm:w-0 md:w-1/5 xl:mr-4 xl:w-1/5 border-r border-gray-500"
	>
		<div class="h-full rounded-2xl my-4">
			<div class="flex items-center justify-between px-4">
				<History bind:currentChatID />
			</div>
		</div>
	</div>

	<div
		class="mx-auto h-full w-full rounded-lg  xl:px-6 sm:w-2/3 sm:px-0"
	>
		{#key currentChatID}
			<Chat bind:chatId={currentChatID} bind:selectedContent={selectedContent} />
		{/key}
	</div>
</div>


