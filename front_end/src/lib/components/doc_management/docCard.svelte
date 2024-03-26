<script lang="ts">
	import Delete from "$lib/assets/DocManagement/deleteIcon.svelte";
	import Folder from "$lib/components/doc_management/folder.svelte";
	import FileIcon from "$lib/assets/DocManagement/fileIcon.svelte";
	import DeleteIcon from "$lib/assets/DocManagement/deleteIcon.svelte";
	import Upload from "$lib/assets/DocManagement/uploadIcon.svelte";
	import AdminKnowledge from "$lib/assets/icons/adminKnowledge.svelte";
	import XMarkIcon from "$lib/assets/icons/x-mark-icon.svelte";
	import { Button, Dropdown, DropdownItem, Modal } from "flowbite-svelte";
	import { Icon } from "flowbite-svelte-icons";
	import File from "../../assets/DocManagement/fileIcon.svelte";

	let deleteModal = false;
	let isfolder = true;
</script>

<div class="grid grid-cols-7 gap-5">
	<div
		class="group relative flex flex-col items-center p-2 px-12 hover:bg-[#d9eeff] focus:bg-[#d9eeff]"
	>
		{#if isfolder}
			<Folder />
		{:else}
			<FileIcon />
		{/if}
		<p>name</p>
		<div class="absolute right-0 top-0 hidden group-hover:block">
			<DeleteIcon />
		</div>
	</div>
</div>

<!-- <div class="grid grid-cols-2 rounded-lg border border-gray-200 p-4 pb-0">
	<div class="align-center col-span-1 ml-2 flex items-center xl:ml-6">
		<img
			class="h-10 w-10"
			src="https://static.heygen.ai/heygen/home/home-aiscript-icon.png"
			alt=""
		/>
	</div>
	<div class="relative col-span-1 flex items-center">
		<span class="truncate text-lg font-extrabold text-gray-600">AI Script</span>
	</div>
	<div class="col-start-2 mt-2 flex">
		<button
			type="button"
			class="append-menu"
		>
			<Upload />
		</button>
		<Dropdown triggeredBy=".append-menu">
			<DropdownItem>Upload</DropdownItem>
			<DropdownItem>Paste Link</DropdownItem>
		</Dropdown>
		<button
			type="button"
			class="delete-menu"
		>
			<Delete />
		</button>
		<Dropdown triggeredBy=".delete-menu">
			<DropdownItem>Delete File</DropdownItem>
			<DropdownItem>Delete AlL</DropdownItem>
		</Dropdown>
	</div>
</div> -->

<!-- <AdminKnowledge />
<button
	class="absolute right-0 top-0 cursor-pointer"
	on:click={() => {
		deleteModal = true;
	}}
>
	<XMarkIcon />
</button> -->

<Modal bind:open={deleteModal} size="xs" autoclose>
	<div class="text-center">
		<Icon
			name="exclamation-circle-outline"
			class="mx-auto mb-4 h-12 w-12 text-gray-400"
		/>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Confirm Delete Knowledge Base?
		</h3>

		<!-- on:click={() => {
            deleteFile();
        }} -->
		<Button color="red" class="mr-2">Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
