<script lang="ts">
	import AppendIcon from "$lib/assets/DocManagement/AppendIcon.svelte";
	import { Dropdown, DropdownItem } from "flowbite-svelte";
	import UploadFile from "./uploadFile.svelte";
	import UploadFolder from "./uploadFolder.svelte";
	import { parentPath, parentIdx } from "../shared/shared.store";

	export let path;    
    export let currentIdx;
	console.log('path', path);
	
    parentPath.set(path.id + '/');
    parentIdx.set(currentIdx);
</script>

<button class="flex flex-row items-center gap-2 text-xs"
	><AppendIcon />New</button
>

<Dropdown class="py-1">
	<DropdownItem class="flex items-center gap-2 text-xs text-gray-500">
		<UploadFile/>
	</DropdownItem>
	<DropdownItem class="flex items-center gap-2 text-xs text-gray-500">
		<UploadFolder/>
	</DropdownItem>
</Dropdown>
