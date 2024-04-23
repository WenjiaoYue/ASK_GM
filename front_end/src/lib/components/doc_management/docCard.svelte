<script>
	import FolderIcon from "$lib/assets/DocManagement/folderIcon.svelte";
	import LinkfolderIcon from "$lib/assets/DocManagement/LinkfolderIcon.svelte";
	import { Modal } from "flowbite-svelte";
	import SvelteTree from "$lib/components/doc_management/treeView/svelte-tree.svelte";
	import FileIcon from "$lib/assets/DocManagement/fileIcon.svelte";
	import DeleteIcon from "$lib/assets/DocManagement/deleteIcon.svelte";
	import AppendKb from "./AppendKb.svelte";
	import { deleteFiles } from "$lib/modules/doc/network";
	import {
		hintEnd,
		hintStart,
		needRecreate,
		storageFiles,
	} from "../shared/shared.store";
	import { createEventDispatcher } from "svelte";
	import LinkIcon from "$lib/assets/DocManagement/LinkIcon.svelte";

	let dispatch = createEventDispatcher();
	let showDirectory = false;
	let chooseDir = undefined;
	let currentIdx = 0;

	export let files = [];

	console.log("files", files);

	function handleDirClick(file, index) {
		chooseDir = file;
		showDirectory = true;
		currentIdx = index;
		console.log("chooseDir", chooseDir);
	}

	async function deleteCurrentFolder(path, idx) {
		hintStart.set(true);
		needRecreate.set(true);

		const res = await deleteFiles(path);
		// succeed
		if (res.status) {
			$storageFiles = $storageFiles.filter((_, index) => index !== idx);
			hintStart.set(false);
			hintEnd.set({ status: true, hintContent: "Uploaded Successfully" });
		}
	}
</script>

<Modal
	bind:open={showDirectory}
	size="xs"
	autoclose={true}
	class="z-50 w-full"
	outsideclose
>
	{#if chooseDir.id !== "uploaded_links"}
		<AppendKb path={chooseDir} {currentIdx} />
	{:else}
		<LinkIcon />
	{/if}
	<hr class="my-8 h-px border-0 bg-gray-200 dark:bg-gray-700" />
	<SvelteTree data={chooseDir.children} {currentIdx} />
	<!-- on:deleteToSvelteCard={(event) => {
		const { node, currentIdx } = event.detail;
		dispatch('deleteToMain', { node, currentIdx });
	}} -->
</Modal>

<div class="grid grid-cols-7 gap-5">
	{#each files as file, index}
		<div
			class="group relative flex w-full flex-col items-center justify-center p-2 px-12 text-center hover:bg-[#d9eeff] focus:bg-[#d9eeff]"
		>
			{#if file.type === "File"}
				<div class="flex-shrink-0">
					<FileIcon />
				</div>
				<p class="w-[6rem] truncate">
					{file.name}
				</p>
			{:else if file.type === "Directory" && file.id === "uploaded_links"}
				<button
					class="flex flex-col items-center"
					on:click={() => handleDirClick(file, index)}
				>
					<div class="flex-shrink-0">
						<LinkfolderIcon />
					</div>
					<p class="truncate">
						{file.name}
					</p>
				</button>
			{:else}
				<button
					class="flex flex-col items-center"
					on:click={() => handleDirClick(file, index)}
				>
					<div class="flex-shrink-0">
						<FolderIcon />
					</div>
					<p class="truncate">
						{file.name}
					</p>
				</button>
			{/if}

			<div
				class="absolute right-0 top-0 hidden group-hover:block"
				on:click={() => deleteCurrentFolder(file.id, index)}
			>
				<DeleteIcon />
			</div>
		</div>
	{/each}
</div>
