<script>
	import FolderIcon from "$lib/assets/DocManagement/folderIcon.svelte";
	import { Modal } from "flowbite-svelte";
	import SvelteTree from "$lib/components/doc_management/treeView/svelte-tree.svelte";
	import FileIcon from "$lib/assets/DocManagement/fileIcon.svelte";
	import DeleteIcon from "$lib/assets/DocManagement/deleteIcon.svelte";

	let showDirectory = false;
	let chooseDir = undefined;

	export let files = [];

	function handleDirClick(file) {
		chooseDir = file;
		showDirectory = true;
	}
</script>

<Modal
	bind:open={showDirectory}
	size="xs"
	autoclose={true}
	class="z-50 w-full"
	outsideclose
>
	<SvelteTree data={chooseDir.children} />
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
				<button on:click={() => handleDirClick(file)}>
					<div class="flex-shrink-0">
						<FolderIcon />
					</div>
					<p>
						{file.name}
					</p>
				</button>
			{/if}

			<div class="absolute right-0 top-0 hidden group-hover:block">
				<DeleteIcon />
			</div>
		</div>
	{/each}
</div>
