<script lang="ts">
	import UploadFilesIcon from "$lib/assets/icons/upload-files.svelte";
	import { getKnowledgeBaseId } from "$lib/modules/doc/network";
	import { storageFiles } from "../shared/shared.store";
	export let parentPath = "";

	function addKnowledgeFiles() {
		document.getElementById("getFile")?.click();
	}

	async function handleFilesUpload(e: HTMLInputElement) {
		let file = e.target.files;
		let path = [parentPath + file[0].name];
		const res = await getKnowledgeBaseId(file, path);
		// succeed
		if (res === "Succeed") {
			const newFile = {
				name: file[0].name,
				id: file[0].name,
				type: "File",
				parent: "",
			};
			storageFiles.update((files) => [...files, newFile]);			
		}
	}
</script>

<input
	on:change={handleFilesUpload}
	type="file"
	style="display:none"
	id="getFile"
	multiple
/>
<button
	on:click={() => addKnowledgeFiles()}
	id="getFile"
	class="flex items-center gap-2"
>
	<UploadFilesIcon />
	Upload Files
</button>
