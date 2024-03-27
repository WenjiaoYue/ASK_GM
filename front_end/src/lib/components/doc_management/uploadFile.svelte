<script lang="ts">
	import UploadFilesIcon from "$lib/assets/icons/upload-files.svelte";
	import { getKnowledgeBaseId } from "$lib/modules/doc/network";
	import { parentIdx, parentPath, storageFiles } from "../shared/shared.store";

	async function handleFilesUpload(e: HTMLInputElement) {
		let file = e.target.files;
		console.log("parentPath", $parentPath, $parentIdx);

		let path = [$parentPath + file[0].name];

		const res = await getKnowledgeBaseId(file, path);
		if (res === "Succeed") {
		const newFile = {
			name: file[0].name,
			id: file[0].name,
			type: "File",
			parent: "",
		};

		console.log("storageFiles", typeof $storageFiles, $storageFiles);

		if ($parentIdx === -1) {
			storageFiles.update((files) => [...files, newFile]);
		} else {
			let files = $storageFiles;
			files[$parentIdx].children.push(newFile);
			$storageFiles = files;
		}
		}
	}

	function addKnowledgeFiles() {
		document.getElementById("getFile")?.click();
	}
</script>

<input
	on:change={(e) => handleFilesUpload(e)}
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
