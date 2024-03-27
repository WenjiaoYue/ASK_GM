<script lang="ts">
	import UploadDirectoryIcon from "$lib/assets/icons/upload-directory.svelte";
	import { getKnowledgeBaseId } from "$lib/modules/doc/network";
	import { storageFiles } from "../shared/shared.store";
	export let parentPath = "";


	function addKnowledgeDirectory() {
		document.getElementById("getDirectory")?.click();
	}

	function handleUploadDir(e: HTMLInputElement) {
		handleFolderUpload(e.target.files);
	}

	function fileListToObject(fileList: FileList) {
		let filesList = []
		// append
		let root = {
			name: fileList[0].webkitRelativePath.split("/")[0],
			id: fileList[0].webkitRelativePath.split("/")[0],
			type: "Directory",
			children: [],
		};

		for (let i = 0; i < fileList.length; i++) {
			let file = fileList[i];
			let pathParts = file.webkitRelativePath.split("/");
			let subObj = root.children;
			for (let j = 1; j < pathParts.length - 1; j++) {
				let part = pathParts[j];

				let existItem = subObj.find((el) => el.name === part);
				if (existItem) {
					subObj = existItem.children;
				} else {
					let newItem = {
						name: part,
						id: pathParts.slice(0, j + 1).join("/"),
						type: "Directory",
						children: [],
					};
					subObj.push(newItem);
					subObj = newItem.children;
				}
			}
			subObj.push({
				name: pathParts[pathParts.length - 1],
				id: file.webkitRelativePath,
				type: "File",
			});
			filesList.push(file.webkitRelativePath);
		}

		return {root, filesList};
	}

	async function handleFolderUpload(newDirectory) {
		// flatten - files - [{file,path}]
		if (newDirectory && newDirectory.length > 0) {
			const {root, filesList} = fileListToObject(newDirectory);
			const res = await getKnowledgeBaseId(newDirectory, filesList);
			if (res === "Succeed") {
				storageFiles.update((files) => [...files, root]);
			}
		}
	}
</script>

<input
	on:change={handleUploadDir}
	type="file"
	id="getDirectory"
	webkitdirectory
	directory
	multiple
	class="hidden"
/>

<button
	on:click={() => addKnowledgeDirectory()}
	id="getDirectory"
	class="flex items-center gap-2"
>
	<UploadDirectoryIcon />
	Upload Folder
</button>
