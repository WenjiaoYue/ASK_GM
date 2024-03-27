<script>
	import FolderIcon from "$lib/assets/DocManagement/folderIcon.svelte";
	import { Modal } from "flowbite-svelte";
	import SvelteTree from "$lib/components/doc_management/treeView/svelte-tree.svelte";
	import FileIcon from "$lib/assets/DocManagement/fileIcon.svelte";
	import DeleteIcon from "$lib/assets/DocManagement/deleteIcon.svelte";
	import AppendKb from "./AppendKb.svelte";
	import { deleteFiles } from "$lib/modules/doc/network";
	import { storageFiles } from "../shared/shared.store";
	import { createEventDispatcher } from "svelte";

	let dispatch = createEventDispatcher();
	let showDirectory = false;
	let chooseDir = undefined;
	let currentIdx = 0;

	export let files = [];

	function handleDirClick(file, index) {
		chooseDir = file;
		showDirectory = true;
		currentIdx = index;
	}

	async function deleteCurrentFolder(path, idx) {
		const res = await deleteFiles(path);
		// succeed
		if (res.status) {
			$storageFiles = $storageFiles.filter((_, index) => index !== idx);
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
	<AppendKb path={chooseDir} {currentIdx} />

	<SvelteTree
		data={chooseDir.children}
		{currentIdx}
		on:deleteToSvelteCard={(event) => {
			const { node, currentIdx } = event.detail;
			dispatch('deleteToMain', { node, currentIdx });
		}}
	/>
</Modal>

<div class="grid grid-cols-7 gap-5">
	{#each files as file, index}
		<div
			class="group relative flex flex-col items-center p-2 px-12 hover:bg-[#d9eeff] focus:bg-[#d9eeff]"
		>
			{#if file instanceof File}
				<div class="flex-shrink-0">
					<FileIcon />
				</div>
				<p>
					{file.name}
				</p>
			{:else}
				<button on:click={() => handleDirClick(file, index)}>
					<div class="flex-shrink-0">
						<FolderIcon />
					</div>
					<p>
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
